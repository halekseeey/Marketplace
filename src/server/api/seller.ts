import {Request} from 'express';
import axios from 'axios';
import {appConfig} from '../index';
import https from 'https';
import {jwtDecode} from 'jwt-decode';
import {updateIsSeller, updateProfile} from './profile';

interface JWT {
    user_id: number
}

export async function registerSeller(req: Request) {
    try {
        if (req.accessToken) {
            const data: JWT = jwtDecode(req.accessToken)
            const response = await axios.post(`${appConfig.backendUrl}/user/api/v1/sellers/`, {
                user: data.user_id,
                ...req.body,
            }, {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                }),
                headers: {
                    Authorization: `Bearer ${req.accessToken}`
                }
            })

            if (response.status >= 200 && response.status < 300) {
                await updateIsSeller(req)
                
                return {
                    status: 200
                }
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

export interface SellerResponse {
    id: number;
    user: number;
    phone: string;
    nickname: string;
    logo: string;
}

export async function getSeller(req: Request) {
    if (req.accessToken) {
        try {
            const data: JWT = jwtDecode(req.accessToken)

            const response = await axios.get<SellerResponse>(`${appConfig.backendUrl}/user/api/v1/sellers/${data.user_id}/`, {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                }),
                headers: {
                    Authorization: `Bearer ${req.accessToken}`
                }
            })

            console.log(response)

            if (response.status >= 200 && response.status < 300) {
                return {
                    status: 200,
                    data: {
                        phone: response.data.phone,
                        logo: response.data.logo,
                        nickname: response.data.nickname
                    }
                }
            }

            return {
                status: 400,
                data: {
                    status: 400
                }
            }
        } catch (e) {
            console.log(e)
            throw new Error('error')
        }
    } else {
        return {
            status: 401,
            data: {
                status: 401
            }
        }
    }
}