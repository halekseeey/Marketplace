import {GetServerSidePropsContext} from 'next'
import {getAppCookies} from './getAppCookies'

type getContextPropsType = {
    isAuth: boolean
    id?: string | string[]
    cookies: IAppCookies
}

export function getContextProps(
    context: GetServerSidePropsContext,
): getContextPropsType {
    const isAuth = context.req.isAuthenticated
    const cookies = getAppCookies(context.req.cookies)
    const {id} = context.query

    return {isAuth, id, cookies}
}
