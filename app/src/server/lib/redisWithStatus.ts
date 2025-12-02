import Redis, { type RedisOptions } from 'ioredis'

type RedisHooks = {
  onError: (error: Error) => void
  onConnect: () => void
  onClose: () => void
  onEnd: () => void
}

const RedisStatus = {
  Error: -1,
  Pending: 0,
  Success: 1,
}

export class RedisWithStatus {
  redis: Redis
  status: number

  constructor(options: RedisOptions, hooks?: Partial<RedisHooks>) {
    this.redis = this.createRedis(options, hooks)
    this.status = RedisStatus.Pending
  }

  private createRedis(options: RedisOptions, hooks?: Partial<RedisHooks>) {
    const redis = new Redis(options)

    redis.on('connect', () => {
      this.status = RedisStatus.Success
      hooks?.onConnect?.()
    })

    redis.on('error', (error) => {
      this.status = RedisStatus.Error
      hooks?.onError?.(error)
    })

    redis.on('close', () => {
      hooks?.onClose?.()
    })

    redis.on('end', () => {
      hooks?.onEnd?.()
    })

    return redis
  }
}
