import { expect, test } from 'vitest'
import app from '../src/app'

test('GET /', async () => {
    const res = await app.request('/')
    expect(await res.json()).toEqual({ message: 'Hello Hono!' })
})

test('GET /runtime', async () => {
    const res = await app.request('/runtime')
    expect(await res.json()).toEqual({
        runtime: expect.any(String),
        nodeVersion: expect.any(String),
        requestId: expect.any(String),
    })
})
