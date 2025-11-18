import { sendCommand } from '@/client/utils/invoke'
import z from 'zod'

const STREAMDataSchema = z.object({
  id: z.string().optional(),
  value: z
    .string()
    .min(1)
    .refine((input) => {
      try {
        JSON.parse(input)
        return true
      } catch {
        return false
      }
    }),
})

interface STREAMData {
  key: string
  value: string
}

export const getSTREAMData = async (id: string, key: string) => {
  const [[_, data]] = await sendCommand<[[string, [string, string[]][]]]>({
    id,
    command: 'XREAD',
    args: ['COUNT', 100, 'STREAMS', key, 0],
  })

  return data.reduce(
    (pre, cur) => {
      const [id, value] = cur
      let encodedValue = {}
      for (let i = 0; i < value.length; i += 2) {
        encodedValue = { ...encodedValue, [value[i]]: value[i + 1] }
      }
      return [...pre, { id, value: JSON.stringify(encodedValue) }]
    },
    [] as { id: string; value: string }[]
  )
}

export const getSTREAMLen = (id: string, key: string) => {
  return sendCommand<number>({
    id,
    command: 'XLEN',
    args: [key],
  })
}

export const setSTREAMData = (
  id: string,
  key: string,
  value: {
    id?: string
    value: string
  }
) => {
  return sendCommand({
    id,
    command: 'XADD',
    args: [
      key,
      value.id || '*',
      ...Object.entries(JSON.parse(value.value)).flat(),
    ],
  })
}

export const delSTREAMData = (
  id: string,
  key: string,
  value: {
    id?: string
    value: string
  }
) => {
  return sendCommand({
    id,
    command: 'XDEL',
    args: [key, value.id],
  })
}
