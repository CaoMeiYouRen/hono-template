import dotenv from 'dotenv'
import { getRuntimeKey } from 'hono/adapter'
const result = dotenv.config({
    path: [
        '.env.local',
        '.env',
    ],
})
const envObj = result.parsed

if (process.env.NODE_ENV === 'development') {
    console.log('envObj', envObj)
}

export const __PROD__ = process.env.NODE_ENV === 'production'
export const __DEV__ = process.env.NODE_ENV === 'development'

export const PORT = Number.parseInt(process.env.PORT ?? '3000', 10)

// 是否写入日志到文件
export const LOGFILES = process.env.LOGFILES === 'true'

export const LOG_LEVEL = process.env.LOG_LEVEL || (__DEV__ ? 'silly' : 'http')

const runtimeKey = getRuntimeKey()

// 判断当前运行时是否是 Cloudflare Workers
export const IS_CLOUDFLARE_WORKERS = process.env.RUNTIME_KEY === 'cloudflare-workers' || runtimeKey === 'workerd'

export const IS_VERCEL = process.env.VERCEL === '1' || process.env.RUNTIME_KEY === 'vercel'

// 判断当前是否是云函数环境（Vercel / Cloudflare Workers 等）
export const IS_CLOUD_FUNCTION = IS_CLOUDFLARE_WORKERS || IS_VERCEL
