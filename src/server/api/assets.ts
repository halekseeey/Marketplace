import axios from 'axios';
import {appConfig} from '../index';
import * as https from 'https';
import {Request} from 'express';
import {jwtDecode} from 'jwt-decode';

const gallery = [
    'https://sun9-55.userapi.com/impg/rxLKq0A-1mYV_GsVeY9iHu9rdw4Im6WxAhu9xQ/fXExDYO8kiE.jpg?size=1388x807&quality=95&sign=788356e909ae7b6836fd3270cf45a92c&type=album',
    'https://sun9-72.userapi.com/impg/w4ilgkKSJs0Obwexp_PrTGi-YK1vXRMYGvnesg/-samWtgvs-M.jpg?size=1920x1080&quality=95&sign=4e5dc9b192f68ec88068edaeb018f7b3&type=album',
    'https://sun9-35.userapi.com/impg/pai_L83lwVNTOyTQ9tJhp9pZGTYYrxTjdbHMMw/XbX08d206kM.jpg?size=1318x771&quality=95&sign=d77c6e01607e4c8a26d064ada5d97ed1&type=album',
    'https://sun9-45.userapi.com/impg/sSvbhubxQjCOnctH5xve8QDSkW9i0HtalV2R6w/YGibAyJSWGc.jpg?size=1267x774&quality=95&sign=54953773471e44f698b53ec235519523&type=album'
]

export interface Asset {
    id: number;
    name: string;
    description: string;
    version: string;
    archived: string;
    asser_link: string;
    images_link: string;
    tags: string;
    tech_details: string;
    author: number;
    cost: string;
    category: string;
    engine: string;
    platform: string;
    gallery?: string[];
}

export type ExtendedAsset = Asset & {
    gallery: string[],
    cart_id?: number
}

interface AssetsResponse {
    results: Asset[];
    count: number;
}

export async function getAssets(req: Request) {
    try {
        let url = `${appConfig.backendUrl}/assets/api/v1/assets?page=${req.query.page}&page_size=${req.query.page_size}`

        if (req.query.platform) {
            url += `&platform=${req.query.platform}`
        }

        if (req.query.engine) {
            url += `&engine=${req.query.engine}`
        }
        const res = await axios.get<AssetsResponse>(url, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })

        res.data.results = res.data.results.filter(item => item.name)

        res.data.results.forEach(item => item.category = '3D')

        return {
            data: {result: res.data.results, count: res.data.count},
            status: 200
        }
    } catch (e) {
        throw new Error('error')
    }
}

export async function getSame(req: Request, id: number) {
    try {
        const res = await axios.get<{recommendations: Asset[]}>(`${appConfig.backendUrl}/assets/api/v1/recommendation/${id}`, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })

        res.data.recommendations.forEach(item => item.category = '3D')

        return {
            data: {result: res.data.recommendations},
            status: res.status
        }
    } catch (e) {
        throw new Error('error')
    }
}

export async function getAsset(req: Request, id: number) {
    try {
        const res = await axios.get<Asset>(`${appConfig.backendUrl}/assets/api/v1/assets/${id}`, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        })

        const asset: ExtendedAsset = {...res.data, gallery: [res.data.images_link, ...gallery]}

        return {
            data: asset,
            status: 200
        }
    } catch (e) {
        throw new Error('error')
    }
}

export async function createAsset(req: Request) {
    if (req.accessToken) {
        console.log(req.body)

        const res = await axios.post<Asset>(`${appConfig.backendUrl}/assets/api/v1/assets/`, req.body, {
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            }), headers: {
                Authorization: `Bearer ${req.accessToken}`
            }
        })

        console.log(res)

        return {
            status: 200,
            data: []
        }

    } else {
        return {
            status: 401,
            data: []
        }
    }
}

export async function addToCart(req: Request, id: number) {
    if (req.accessToken) {
        try {
            const data: { user_id: number } = jwtDecode(req.accessToken)

            const response = await axios.post(`${appConfig.backendUrl}/assets/api/v1/cart/`, {
                user: data.user_id,
                products: [id]
            }, {
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
                }
            }

            return {
                status: 400
            }
        } catch (e) {
            console.log(e)
            throw new Error('error')
        }
    } else {
        return {
            status: 401
        }
    }
}

export interface CartResponse {
    products: number[],
    id: number;
}

export async function getCart(req: Request) {
    if (req.accessToken) {
        try {
            const response = await axios.get<CartResponse[]>(`${appConfig.backendUrl}/assets/api/v1/cart/`, {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                }),
                headers: {
                    Authorization: `Bearer ${req.accessToken}`
                }
            })

            const cartProductMap: Record<number, number> = {}

            response.data.forEach((item) => {
                cartProductMap[item.products[0]] = item.id
            })

            const promises: Promise<{ data: ExtendedAsset, status: number }>[] = []

            response.data.forEach(({products}) => {
                promises.push(getAsset(req, products[0]))
            })

            const data: { data: ExtendedAsset, status: number }[] = await Promise.all(promises)

            const filteredData: Record<number, ExtendedAsset> = {}

            data.forEach(({data}) => {
                if (!filteredData[data.id]) {
                    filteredData[data.id] = {...data, cart_id: cartProductMap[data.id]}
                }
            })

            if (response.status >= 200 && response.status < 300) {
                return {
                    status: 200,
                    data: Object.values(filteredData)
                }
            }

            return {
                status: 400,
                data: []
            }
        } catch (e) {
            console.log(e)
            throw new Error('error')
        }
    } else {
        return {
            status: 401,
            data: []
        }
    }
}

export async function pay(req: Request) {
    if (req.accessToken) {
        try {
            const data: { user_id: number } = jwtDecode(req.accessToken)

            const promises: Promise<any>[] = []

            req.body.carts.forEach((item: number[]) => {
                promises.push(axios.post(`${appConfig.backendUrl}/assets/api/v1/cart/${item[0]}/pay/`, {
                    user: data.user_id,
                    products: [item[1]]
                }, {
                    httpsAgent: new https.Agent({
                        rejectUnauthorized: false
                    }),
                    headers: {
                        Authorization: `Bearer ${req.accessToken}`
                    }
                }))
            })

            await Promise.all(promises)

            return {
                status: 200
            }
        } catch (e) {
            console.log(e)
            throw new Error('error')
        }
    } else {
        return {
            status: 401
        }
    }
}

export async function purchases(req: Request) {
    if (req.accessToken) {
        try {
            const response = await axios.get(`${appConfig.backendUrl}/assets/api/v1/purchases/`, {
                httpsAgent: new https.Agent({
                    rejectUnauthorized: false
                }),
                headers: {
                    Authorization: `Bearer ${req.accessToken}`
                }
            })

            const ids: number[] = response.data.map((item: { assets: Asset[] }) => item.assets[0])

            const promises: Promise<{ data: ExtendedAsset; status: number; }>[] = []

            ids.forEach(id => promises.push(getAsset(req, id)))

            const assets: { data: ExtendedAsset; status: number; }[] = await Promise.all(promises)

            return {
                data: assets.map(item => item.data),
                status: 200
            }
        } catch (e) {
            console.log(e)
            throw new Error('error')
        }
    } else {
        return {
            data: [],
            status: 401
        }
    }
}