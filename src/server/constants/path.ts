import path from 'node:path'
import { dirname } from '@/utils/dirname'

export const CLIENT_PATH = path.resolve(dirname, 'client')

export const ASSETS_PATH = path.resolve(CLIENT_PATH, 'assets')

export const HTML_PATH = path.resolve(CLIENT_PATH, 'index.html')
