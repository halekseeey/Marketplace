import {Request} from 'express';
import axios from 'axios';
import {appConfig} from '../index';
import https from 'https';
import {jwtDecode} from 'jwt-decode';

export async function updateIsSeller(req: Request) {
    try {
        if (req.accessToken) {
            const data: JWT = jwtDecode(req.accessToken)

            const response = await axios.patch<UserResponse>(`${appConfig.backendUrl}/user/api/v1/users/${data.user_id}/`, {is_seller: true}, {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                }),
                headers: {
                    Authorization: `Bearer ${req.accessToken}`
                }
            })

            return {
                data: {},
                status: 200
            }
        }

        return {
            data: {},
            status: 401
        }
    } catch (e) {
        console.log(e)
        throw new Error('error')
    }
}

export async function updateProfile(req: Request) {
    try {
        if (req.accessToken) {
            const data: JWT = jwtDecode(req.accessToken)

            const response = await axios.patch<UserResponse>(`${appConfig.backendUrl}/user/api/v1/users/${data.user_id}/`, req.body, {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                }),
                headers: {
                    Authorization: `Bearer ${req.accessToken}`
                }
            })

            return {
                data: {
                    id: response.data.id,
                    username: response.data.username,
                    email: response.data.email,
                    nickname: response.data.nickname,
                    birthday: response.data.birthday,
                    sex: response.data.sex,
                    about: response.data.about,
                    name: response.data.name,
                    is_confirmed: response.data.is_confirmed,
                    is_seller: response.data.is_seller,
                    surname: response.data.surname
                },
                status: 200
            }
        }

        return {
            data: null,
            status: 401
        }
    } catch (e) {
        console.log(e)
        throw new Error('error')
    }
}

interface JWT {
    user_id: number
}

export interface UserResponse {
    id: number,
    username: string,
    email: string | null,
    nickname: null | string,
    birthday: null | string,
    sex: null | string,
    about: null | string,
    is_seller: boolean,
    surname: string,
    name: string,
    is_confirmed: boolean,
}

export async function getProfile(req: Request) {
    try {
        if (req.accessToken) {
            const data: JWT = jwtDecode(req.accessToken)

            const response = await axios.get<UserResponse>(`${appConfig.backendUrl}/user/api/v1/users/${data.user_id}/`, {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                }),
                headers: {
                    Authorization: `Bearer ${req.accessToken}`
                }
            })

            return  {
                data: {
                    id: response.data.id,
                    username: response.data.username,
                    email: response.data.email,
                    nickname: response.data.nickname,
                    birthday: response.data.birthday,
                    sex: response.data.sex,
                    about: response.data.about,
                    name: response.data.name,
                    is_confirmed: response.data.is_confirmed,
                    is_seller: response.data.is_seller,
                    surname: response.data.surname
                },
                status: 200
            }
        }

        return {
            data: null,
            status: 401
        }
    } catch (e) {
        console.log(e)
        throw new Error('error')
    }
}

interface LoginResponse {
    access: string;
    refresh: string;
}

export async function login(req: Request) {
    try {
        const response = await axios.post<LoginResponse>(`${appConfig.backendUrl}/user/api/v1/token/`, req.body, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })

        if (response.status >= 200 && response.status < 300) {
            return {
                status: 200,
                access_token: response.data.access,
                refresh_token: response.data.refresh
            }
        }

        return {
            data: {
                accessToken: '',
                refreshToken: '',
            },
            status: 400
        }
    } catch (e) {
        console.log(e)
        throw new Error('error')
    }
}