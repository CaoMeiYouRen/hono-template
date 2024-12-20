import os from 'os'
import path from 'path'
import autocannon, { Client, Options } from 'autocannon'
import dotenv from 'dotenv'
import { Octokit } from 'octokit'
import * as betterBytes from 'better-bytes'

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

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY || ''
const GITHUB_PR_NUMBER = process.env.GITHUB_PR_NUMBER || ''

const runtime = typeof Bun === 'undefined' ? 'Node.js' : 'Bun'
const version = typeof Bun === 'undefined' ? process.versions.node : Bun.version
const osInfo = `System: ${os.type()} ${os.release()} (${os.arch()})<br>${runtime}: ${version}<br>CPU: ${os.cpus().length} cores<br>Memory: ${betterBytes.format(os.totalmem())}`

async function runAutocannon(param: Options) {
    console.log(`正在测试 url: ${param.url}`)
    const result = await autocannon({
        connections: cpuCount * 2, // 并发连接数
        workers: cpuCount,
        duration: 10, // 测试持续时间（秒）
        timeout: 3, // 超时时间 (秒)
        // overallRate: 100, // 设置限流器的速率，单位为每秒请求数
        // bailout: 1000,
        ...param,
    })
    const resultOutput = `url: ${param.url}\n${autocannon.printResult(result)}`

    const body = `## System Info \n\n${osInfo}\n\n## Benchmarks Results\n\n\`\`\`\n${resultOutput}\n\`\`\``
    console.log(`${osInfo.replaceAll('<br>', '\n')}\n${resultOutput}`)
    if (GITHUB_TOKEN && GITHUB_REPOSITORY && GITHUB_PR_NUMBER) { // 如果有 GITHUB_PR_NUMBER，则创建评论
        const octokit = new Octokit({
            auth: GITHUB_TOKEN,
        })
        await octokit.rest.issues.createComment({
            owner: GITHUB_REPOSITORY.split('/')[0],
            repo: GITHUB_REPOSITORY.split('/')[1],
            issue_number: parseInt(GITHUB_PR_NUMBER),
            body,
        })
    }
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
