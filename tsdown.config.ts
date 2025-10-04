import { defineConfig, type Options } from 'tsdown'

const tsupOptions: Options = {
    platform: 'node', // 目标平台
    entry: [],
    format: ['esm'],
    fixedExtension: true, // 保持输出文件的扩展名一致
    hash: false, // 不添加哈希到输出文件名
    nodeProtocol: true, // 为内置模块添加 node: 前缀（例如，fs → node:fs）
    sourcemap: true,
    clean: false,
    dts: false,
    minify: false, // 缩小输出
    shims: true, // 注入 cjs 和 esm 填充代码，解决 import.meta.url 和 __dirname 的兼容问题
    unbundle: false, // 打包代码
    // external: [], // 排除的依赖项
    // noExternal: [/(.*)/], // 将依赖打包到一个文件中
    // bundle: true,
}

const cloudflareOptions: Options = {
    ...tsupOptions,
    entry: ['src/cloudflare-workers.ts'],
    format: ['esm'],
    minify: false,
    treeshake: true,
    env: {
        RUNTIME_KEY: 'cloudflare-workers',
        NODE_ENV: 'production',
    },
}

export default defineConfig([...['src/index.ts', 'src/vercel.ts', 'src/bun.ts'].map((e) => ({ ...tsupOptions, entry: [e] })), cloudflareOptions])
