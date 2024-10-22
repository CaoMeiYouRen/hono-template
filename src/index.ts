import { serve } from '@hono/node-server'
import { name } from '../package.json'
import { PORT } from './env'
import app from './app'
import logger from './middlewares/logger'

serve({
    fetch: app.fetch,
    port: PORT,
})

logger.info(`${name} 启动成功，访问地址：http://localhost:${PORT}`)
