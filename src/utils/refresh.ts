import axios from 'axios';
import {appConfig} from '../server';
import https from 'https';

interface RefreshResponse {
    access: string;
    refresh: string;
}

export async function refresh(refreshToken?: string) {
    try {
        const response = await axios.post<RefreshResponse>(`${appConfig.backendUrl}/user/api/v1/token/refresh/`, {
            refresh: refreshToken
        }, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })

        console.log(response)

        if (response.status >= 200 && response.status < 300) {
            return {
                status: 200,
                access_token: response.data.access,
                refresh_token: response.data.refresh
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