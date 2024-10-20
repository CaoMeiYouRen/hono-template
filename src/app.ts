import { Hono } from 'hono'
import { timeout } from 'hono/timeout'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { showRoutes } from 'hono/dev'
import { getRuntimeKey } from 'hono/adapter'
import { __DEV__, TIMEOUT } from './env'
import { loggerMiddleware } from './middlewares/logger'
import { errorhandler, notFoundHandler } from './middlewares/error'

const app = new Hono()

app.use(loggerMiddleware)
app.use(timeout(TIMEOUT))
app.use(cors())
app.use(secureHeaders())

app.onError(errorhandler)
app.notFound(notFoundHandler)

app.all('/', (c) => c.json({
    message: 'Hello Hono!',
}))

app.all('/runtime', (c) => c.json({
    runtime: getRuntimeKey(),
}))

__DEV__ && showRoutes(app, {
    verbose: true,
})

export default app
