import { Hono } from 'hono'
import routes, { config, runtime } from './dist/vercel.mjs'

const app = new Hono()

app.route('/', routes)

export { config, runtime }
export default app
