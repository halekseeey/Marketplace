/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: 'build/src/client',
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        })
        return config
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cs14.pikabu.ru'
            },
            {
                protocol: 'https',
                hostname: '**.userapi.com',
            },{
                protocol: 'https',
                hostname: 'cdn1.epicgames.com',
            },
        ]
    }
};

export default nextConfig;
