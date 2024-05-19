import {NextFunction, Request, Response} from 'express';


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    req.logger.error(`${err.name}: ${err.message}`)

    next(err)
}