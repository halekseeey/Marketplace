export function getAppCookies(cookies?: Cookies): IAppCookies {
    return {
        app_theme: cookies?.app_theme || null
    }
}