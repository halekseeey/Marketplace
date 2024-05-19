function getConfig() {
    const env = process.env.NODE_ENV

    const config: AppConfig = require(`./${env}`).default

    return config
}

export default getConfig