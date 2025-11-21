import path from 'node:path'
import fs from 'node:fs/promises'
import type { BaseHandlerFunc, HandlerFunc } from './types'
import { ok } from '@/server/lib/response'
import { ASSETS_PATH } from '../constants/path'

export const httpStaticHandler: BaseHandlerFunc =
  (next?: HandlerFunc) => async (req, res) => {
    if (!req.url?.startsWith('/assets/')) {
      return next?.(req, res)
    }

    const relativePath = req.url.slice('/assets/'.length)
    const filePath = path.resolve(ASSETS_PATH, relativePath)

    try {
      const stats = await fs.stat(filePath)
      if (!stats.isFile() || !filePath.startsWith(ASSETS_PATH)) {
        return next?.(req, res)
      }
    } catch {
      return next?.(req, res)
    }

    try {
      const content = await fs.readFile(filePath)
      const ext = path.extname(filePath).toLowerCase()
      const contentTypeMap: {
        [key: string]: string
      } = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
      }
      const contentType = contentTypeMap[ext] || 'application/octet-stream'
      return ok(res, content, { 'content-type': contentType })
    } catch (err) {
      console.error('Static Server Error:', err)
      return next?.(req, res)
    }
  }
