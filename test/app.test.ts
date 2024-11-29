import { expect, test } from 'vitest'
import { testClient } from 'hono/testing'
import app from '../src/app'

test('GET /', async () => {
    const res = await (testClient(app) as any).$get()
    expect(await res.json()).toEqual({ message: 'Hello Hono!' })
})

