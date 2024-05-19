import express from 'express'
import next from 'next'
import {rootRouter} from 'src/server/router';
import getConfig from 'src/configs';

const IS_DEV = process.env.NODE_ENV === 'development'

export const app = next({dev: IS_DEV})

export const appConfig = getConfig()

async function bootstrap() {
    await app.prepare()

    const server = express()

    server
        .disable('x-powered-by')
        .enable('trust-proxy')
        .use(rootRouter)

    server.listen(5000, () => {
        console.info('Server is running')
    })
}

bootstrap()