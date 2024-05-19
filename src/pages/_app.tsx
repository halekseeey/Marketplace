import type {AppProps} from 'next/app'

import './index.css'
import {RootLayout} from 'src/components/RootLayout/RootLayout';
import {ThemeProvider} from '../contexts/theme/ThemeProvider';
import {useMemo} from 'react';
import {Theme} from '../utils/Theme';
import {getTheme} from '../utils/getTheme';

export default function MyApp({Component, pageProps}: AppProps) {

    const {app_theme} = pageProps.cookies

    const theme = useMemo(() => new Theme(getTheme(app_theme)), [app_theme])

    return (
        <ThemeProvider value={theme}>
            <RootLayout>
                <Component {...pageProps} />
            </RootLayout>
        </ThemeProvider>
    )
}
