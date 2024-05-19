import {Request, Response} from 'express';
import axios from 'axios';
import {appConfig} from '../index';

export async function login(req: Request, res: Response) {
    try {
        const response = await axios.post(`${appConfig.backendUrl}/token`, {
            ...req.body
        })

        if (response.status >= 200 && response.status < 300) {
            return res.status(200).send(response.data)
        }

        res.status(response.status).send(response.statusText)
    } catch (e) {
        req.logger.error('error')
    }
}