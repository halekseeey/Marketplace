declare interface AppConfig {
    backendUrl: string;
    frontendUrl: string;
}

declare interface IAppCookies {
    app_theme: string | null;
}

declare type Cookies = Partial<{[key: string]: string}>

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'production' | 'development',
        }
    }
}