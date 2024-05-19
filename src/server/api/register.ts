import {Request, Response} from 'express';
import axios from 'axios';
import {appConfig} from '../index';
import https from 'https';

export async function register(req: Request) {
    try {

        const response = await axios.post(`${appConfig.backendUrl}/user/api/v1/register/`, {
            ...req.body,
            patronymic: 'ушел за хлебом'
        }, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })

        if (response.status >= 200 && response.status < 300) {
            return {
                status: 200
            }
        }

        return {
            status: 400
        }
    } catch (e) {
        console.log(e)
        throw new Error('error')
    }
}