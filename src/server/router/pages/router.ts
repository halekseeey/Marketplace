import {app} from 'src/server';
import {Router} from 'express';

export const pagesRouter = Router()

pagesRouter.get('*', (req, res) => {
    return app.getRequestHandler()(req, res)
})

pagesRouter.post('*', (req, res) => {
    return app.getRequestHandler()(req, res)
})