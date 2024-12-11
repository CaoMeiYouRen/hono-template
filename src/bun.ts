import { serveStatic } from 'hono/bun'
import { name } from '../package.json'
import app from './app'
import { PORT } from './env'
import logger from './middlewares/logger'

// bun 运行时添加静态文件服务。
app.get('/*', serveStatic({ root: './public' }))

logger.info(`${name} 启动成功，访问地址：http://localhost:${PORT}`)

export default {
    fetch: app.fetch,
    port: PORT,
}
