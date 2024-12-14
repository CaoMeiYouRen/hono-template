import os from 'os'
import path from 'path'
import autocannon, { Client, Options } from 'autocannon'
import dotenv from 'dotenv'

dotenv.config({
    path: [
        '.env.local',
        '.env',
    ],
})

const CI = process.env.CI === 'true'

const cpuCount = os.cpus().length

const PORT = Number(process.env.PORT || 3000)

const BASE_URL = `http://localhost:${PORT}`

async function runAutocannon(param: Options) {
    const result = await autocannon({
        connections: cpuCount * 2, // 并发连接数
        // workers: cpuCount,
        duration: 10, // 测试持续时间（秒）
        timeout: 3, // 超时时间 (秒)
        // overallRate: 100, // 设置限流器的速率，单位为每秒请求数
        // bailout: 1000,
        ...param,
    })
    console.log(`url: ${param.url}\n${autocannon.printResult(result)}`)
    return result
}

async function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time))
}

async function start() {
    const params: Options[] = ([
        {
            url: '/',
            method: 'GET',
        },
    ] as Options[]).map((param) => ({
        ...param,
        url: new URL(param.url, BASE_URL).toString(),
    } as Options))

    if (CI) {
        await sleep(5 * 1000)
    }
    await Promise.all(params.map((param) => runAutocannon(param)))
}

start()
