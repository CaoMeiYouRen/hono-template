import { Hono } from 'hono'
import { timeout } from 'hono/timeout'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { showRoutes } from 'hono/dev'
import { env, getRuntimeKey } from 'hono/adapter'
import { bodyLimit } from 'hono/body-limit'
import { requestId } from 'hono/request-id'
import { __DEV__ } from './env'
import { loggerMiddleware } from './middlewares/logger'
import { errorhandler, notFoundHandler } from './middlewares/error'
import { Bindings } from './types'
import routes from './routes'

const app = new Hono<{ Bindings: Bindings }>()

app.use(requestId())
app.use((c, next) => {
    const BENCHMARKS_TEST = env(c).BENCHMARKS_TEST
    if (BENCHMARKS_TEST === 'true') {
        return next()
    }
    return loggerMiddleware(c, next)
})
app.use((c, next) => {
    const TIMEOUT = parseInt(env(c).TIMEOUT) || 60000
    return timeout(TIMEOUT)(c, next)
})
app.use((c, next) => {
    const MAX_BODY_SIZE = parseInt(env(c).MAX_BODY_SIZE) || 100 * 1024 * 1024 // 默认 100MB
    return bodyLimit({ maxSize: MAX_BODY_SIZE })(c, next)
})

app.use(cors())
app.use(secureHeaders())

app.onError(errorhandler)
app.notFound(notFoundHandler)

app.all('/', (c) => c.json({
    message: 'Hello Hono!',
}))

app.all('/runtime', (c) => c.json({
    runtime: getRuntimeKey(),
    nodeVersion: process?.version,
    requestId: c.get('requestId'),
    versions: __DEV__ ? process?.versions : undefined,
}))

app.route('/', routes)

__DEV__ && showRoutes(app, {
    verbose: true,
})

if (process.env.BENCHMARKS_TEST === 'true') { // 如果是性能测试，等待 30 秒后退出
  setTimeout(() => {
    process.exit(0)
  }, 30000)
}

export default app
