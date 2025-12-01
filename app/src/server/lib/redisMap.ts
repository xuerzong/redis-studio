import { type RedisOptions } from 'ioredis'
import { safeReadFile } from '@server/utils/fs'
import { __DEV__ } from '@server/utils/env'
import type { ConnectionData } from './db/connections'
import { RedisWithStatus } from './redisWithStatus'

declare global {
  var redisMap: RedisMap
}

type RedisConfig = ConnectionData

export class RedisMap {
  instances: Map<string, RedisWithStatus>

  static getKey(config: RedisConfig) {
    return `${config.host}_${config.port}_${config.username}_${config.password}`
  }

  constructor() {
    this.instances = new Map()
  }

  async getInstance(config: RedisConfig) {
    const key = RedisMap.getKey(config)
    if (this.instances.has(key)) {
      return this.instances.get(key)!
    }

    const tlsParams: RedisOptions['tls'] = {}

    const tlsCa = await safeReadFile(config.ca)
    const tlsKey = await safeReadFile(config.key)
    const tlsCert = await safeReadFile(config.cert)

    if (tlsCa) {
      tlsParams.ca = tlsCa
    }
    if (tlsKey) {
      tlsParams.key = tlsKey
    }
    if (tlsCert) {
      tlsParams.cert = tlsCert
    }

    const enableTls = Object.keys(tlsParams).length > 0

    const redis = new RedisWithStatus(
      {
        ...config,
        port: Number(config.port),
        ...(enableTls ? { tls: tlsParams } : {}),
      },
      {
        onClose: () => {
          this.instances.delete(key)
        },
        onEnd: () => {
          this.instances.delete(key)
        },
      }
    )

    this.instances.set(key, redis)

    return redis
  }

  async closeInstance(config: RedisConfig) {
    const key = RedisMap.getKey(config)
    const redisInstance = this.instances.get(key)

    if (redisInstance) {
      try {
        await redisInstance.redis.quit()
      } catch {
        redisInstance.redis.disconnect()
      }
    }
  }
}

const createRedisMap = () => {
  return new RedisMap()
}

const redisMap = global.redisMap || createRedisMap()

if (__DEV__) {
  global.redisMap = redisMap
}

export default redisMap
