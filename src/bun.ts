import { name } from '../package.json'
import app from './app'
import { PORT } from './env'
import logger from './middlewares/logger'

logger.info(`${name} 启动成功，访问地址：http://localhost:${PORT}`)

export default {
    fetch: app.fetch,
    port: PORT,
}
