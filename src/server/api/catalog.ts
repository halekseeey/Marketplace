import {Request, Response} from 'express';
import axios from 'axios';
import {appConfig} from '../index';

export async function catalog(req: Request, res: Response) {
    try {
        const {page_size, page} = req.query
        const response = await axios.get(`${appConfig.backendUrl}/assets/api/v1/assets?page=${page}&page_size=${page_size}`)

        if (response.status >= 200 && response.status < 300) {
            return res.status(200).send(response.data)
        }

        console.log(response)

        res.status(response.status).send(response.statusText)
    } catch (e) {
        req.logger.error('error')
    }
}