import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { timeout } from 'hono/timeout'
import { HTTPException } from 'hono/http-exception'
import { StatusCode } from 'hono/utils/http-status'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { TIMEOUT } from './env'
import { winstonLogger } from './utils/logger'

const app = new Hono()

app.use(logger((str: string, ...rest: string[]) => {
    winstonLogger.info(str, ...rest)
}))
app.use(timeout(TIMEOUT))
app.use(cors())
app.use(secureHeaders())

app.onError((error, c) => {
    const message = process.env.NODE_ENV === 'production' ? `${error.name}: ${error.message}` : error.stack
    let status = 500
    let statusText = 'INTERNAL_SERVER_ERROR'
    if (error instanceof HTTPException) {
        const response = error.getResponse()
        status = response.status
        statusText = response.statusText
    }
    c.status(status as StatusCode)
    const method = c.req.method
    const requestPath = c.req.path
    winstonLogger.error(`Error in ${method} ${requestPath}: \n${message}`)
    return c.json({
        status,
        statusText,
        message,
    })
})

app.all('/', (c) => c.json({
    message: 'Hello Hono!',
}))

export default app
