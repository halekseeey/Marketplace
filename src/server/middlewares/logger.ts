import {NextFunction, Request, Response} from 'express';
import {Logger} from 'src/server/utils';


export function logger(req: Request, res: Response, next: NextFunction) {

    req.logger = new Logger()

    req.logger.info(req.path)

    next()
}