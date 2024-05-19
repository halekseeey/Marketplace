import {NextFunction, Request, Response} from 'express';
import {refresh} from '../../utils/refresh';
import {jwtDecode} from 'jwt-decode';

export async function auth(req: Request, res: Response, next: NextFunction) {
    const userAuthToken = req.cookies?.['access_token']
    const userRefreshToken = req.cookies?.['refresh_token']
    let expDate = 0

    if (userAuthToken) {
        expDate = jwtDecode(userAuthToken).exp || 0
    }
    if (expDate > Math.trunc(Date.now() / 1000)) {
        req.isAuthenticated = true
        req.accessToken = userAuthToken
        req.refreshToken = userRefreshToken
    } else {
        if (userRefreshToken && userRefreshToken !== 'undefined') {
            try {
                const response = await refresh(userRefreshToken)

                if (response.status === 200) {
                    const {access_token, refresh_token} = response
                    req.accessToken = access_token
                    req.refreshToken = refresh_token
                    req.isAuthenticated = true
                    res.cookie('access_token', access_token, {httpOnly: true, path: '/', sameSite: 'strict'})
                } else {
                    req.isAuthenticated = false
                }
            } catch (e) {
                req.isAuthenticated = false
            }
        } else {
            req.isAuthenticated = false
        }
    }

    next()
}