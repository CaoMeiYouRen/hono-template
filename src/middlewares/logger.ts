import path from 'path'
import { logger as honoLogger } from 'hono/logger'
import type * as Winston from 'winston'
import { IS_CLOUD_FUNCTION, LOG_LEVEL, LOGFILES } from '@/env'

async function createLogger() {
    if (IS_CLOUD_FUNCTION) {
        return console
    }
    const logDir = path.resolve('logs')
    const winstonModule = await import('winston')
    const DailyRotateFile = (await import('winston-daily-rotate-file')).default

    const format = winstonModule.format.combine(
        winstonModule.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZ' }),
        winstonModule.format.splat(),
        winstonModule.format.printf((info: any) => `[${info.timestamp}] ${info.level}: ${info.message}`),
    )

    const dailyRotateFileOption = {
        dirname: logDir,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: false,
        maxSize: '20m',
        maxFiles: '31d',
        format,
        auditFile: path.join(logDir, '.audit.json'),
    }
    const transports: Winston.transport[] = [
        new winstonModule.transports.Console({
            format: winstonModule.format.combine(
                winstonModule.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
                winstonModule.format.ms(),
                winstonModule.format.splat(),
                winstonModule.format.printf((info) => {
                    const infoLevel = winstonModule.format.colorize().colorize(info.level, `[${info.timestamp}] ${info.level}`)
                    return `${infoLevel}: ${info.message}`
                }),
            ),
        }),
    ]
    const exceptionHandlers: Winston.transport[] = []
    const rejectionHandlers: Winston.transport[] = []

    if (LOGFILES) {
        transports.push(new DailyRotateFile({
            ...dailyRotateFileOption,
            filename: '%DATE%.log',
        }))
        transports.push(new DailyRotateFile({
            ...dailyRotateFileOption,
            level: 'error',
            filename: '%DATE%.errors.log',
        }))
        exceptionHandlers.push(new DailyRotateFile({
            ...dailyRotateFileOption,
            level: 'error',
            filename: '%DATE%.errors.log',
        }))
        rejectionHandlers.push(new DailyRotateFile({
            ...dailyRotateFileOption,
            level: 'error',
            filename: '%DATE%.errors.log',
        }))
    }

    const winstonLogger = winstonModule.createLogger({
        level: LOG_LEVEL,
        exitOnError: false,
        transports,
        exceptionHandlers,
        rejectionHandlers,
    })
    return winstonLogger
}

const logger = await createLogger()
const loggerMiddleware = honoLogger(logger.info)
export { loggerMiddleware }
export default logger
