import { name } from '../package.json'
import app from './app'
import logger from './middlewares/logger'

logger.info(`${name} 云函数启动成功`)

export default app
