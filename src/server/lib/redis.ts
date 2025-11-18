import Redis from 'ioredis'

interface RedisConfig {
  host: string
  port: number
  password: string
  username: string
}

export class RedisMap {
  instances: Map<string, Redis>
  instancesStatus: Map<string, number>

  static getKey(config: RedisConfig) {
    return `${config.host}_${config.port}_${config.username}_${config.password}`
  }

  static parseRedisInfo(infoString: string) {
    const result = {}
    let currentSection = null

    const lines = infoString.split('\n').filter((line) => line.trim() !== '')

    for (const line of lines) {
      if (line.startsWith('#')) {
        currentSection = line.replace('# ', '').trim().toLowerCase()
        result[currentSection] = {}
      } else if (currentSection) {
        const colonIndex = line.indexOf(':')
        if (colonIndex !== -1) {
          const key = line.substring(0, colonIndex).trim()
          const value = line.substring(colonIndex + 1).trim()
          result[currentSection][key] = isNaN(Number(value))
            ? value
            : Number(value)
        }
      }
    }

    return result
  }

  constructor() {
    this.instances = new Map()
    this.instancesStatus = new Map()
  }

  getInstance(config: RedisConfig) {
    const key = RedisMap.getKey(config)
    if (this.instances.has(key)) {
      return this.instances.get(key)!
    }

    const redis = new Redis({
      ...config,
    })

    redis.on('error', () => {
      this.instancesStatus.set(key, -1)
    })

    redis.on('connect', () => {
      this.instancesStatus.set(key, 1)
    })

    redis.on('close', () => {
      this.instancesStatus.delete(key)
      this.instances.delete(key)
    })

    redis.on('end', () => {
      this.instancesStatus.delete(key)
      this.instances.delete(key)
    })

    this.instances.set(key, redis)

    return redis
  }

  getInstanceStatus(config: RedisConfig) {
    const key = RedisMap.getKey(config)
    return this.instancesStatus.get(key) || 0
  }

  async closeInstance(config: RedisConfig) {
    const key = RedisMap.getKey(config)
    const redisInstance = this.instances.get(key)

    if (redisInstance) {
      try {
        await redisInstance.quit()
      } catch {
        redisInstance.disconnect()
      }
    }
  }
}

export const redisMap = new RedisMap()
