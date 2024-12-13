/* eslint-disable no-console, @typescript-eslint/no-var-requires */
const path = require('path')
const fs = require('fs-extra')
const { nodeFileTrace } = require('@vercel/nft');
// !!! if any new dependencies are added, update the Dockerfile !!!

(async () => {
    const projectRoot = path.resolve(process.env.PROJECT_ROOT || path.join(__dirname, '../'))
    const resultFolder = path.join(projectRoot, 'app-minimal') // no need to resolve, ProjectRoot is always absolute
    // 读取 dist文件夹中的全部 .mjs 文件
    const distFiles = await fs.readdir(path.join(projectRoot, 'dist'))
        .then((files) => files.filter((file) => file.endsWith('.mjs')))
        .then((files) => files.map((file) => path.join('dist', file)))
    console.log('Start analyzing, project root:', projectRoot)
    const { fileList: fileSet, esmFileList: esmFileSet } = await nodeFileTrace(distFiles, {
        base: projectRoot,
        paths: {
            '@/': 'dist/',
        },
    })
    let fileList = [...fileSet, ...esmFileSet]
    console.log('Total touchable files:', fileList.length)
    fileList = fileList.filter((file) => file?.startsWith('node_modules')) // only need node_modules
    console.log('Total files need to be copied (touchable files in node_modules):', fileList.length)
    console.log('Start copying files, destination:', resultFolder)
    return Promise.all(fileList.map((e) => fs.copy(path.join(projectRoot, e), path.join(resultFolder, e)).catch(console.error),
    ))
})().catch((err) => {
    // fix unhandled promise rejections
    console.error(err, err.stack)
    process.exit(1)
})
