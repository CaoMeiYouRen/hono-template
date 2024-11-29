import { expect, test } from 'vitest'
import app from '../src/app'

test('GET /', async () => {
    const res = await app.request('/')
    expect(await res.json()).toEqual({ message: 'Hello Hono!' })
})

