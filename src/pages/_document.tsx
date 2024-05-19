import NextDocument from 'next/document';
import {Html, Main, Head, NextScript} from 'next/document';
import {getTheme} from 'src/utils/getTheme';


class MyDocument extends NextDocument {

    render() {
        const {pageProps} = this.props.__NEXT_DATA__.props
        const {cookies} = pageProps
        return (
            <Html lang="ru" className={getTheme(cookies.app_theme)}>
                <Head/>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        )
    }
}

export default MyDocument