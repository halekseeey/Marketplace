import {pagesRouter} from './pages';
import cookieParser from 'cookie-parser'
import {Router} from 'express';
import {errorHandler, logger} from 'src/server/middlewares';
import bodyParser from 'body-parser'
import {apiRouter} from './api';
import {auth} from '../middlewares/auth';

export const rootRouter = Router()

const middlewares = [
    bodyParser.json(),
    cookieParser(),
    logger,
    auth
]

rootRouter
    .use(middlewares)
    .use('/api', apiRouter)
    .use(pagesRouter)
    .use(errorHandler)
