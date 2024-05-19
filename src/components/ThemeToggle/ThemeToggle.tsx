import {useContext, useEffect, useState} from 'react';
import {ThemeContext} from '../../contexts/theme/ThemeContext';
import {Switch} from '@groups/uilib'

export function ThemeToggle() {
    const theme = useContext(ThemeContext);
    const [checked, setChecked] = useState(theme.value !== 'light')

    useEffect(() => {
        const observer = (newTheme: string) => {
            setChecked(newTheme !== 'light')
            const html = document.querySelector('html')
            if (html) {
                html.className = newTheme
            }
        }

        theme.addObserver(observer)

        return () => {
            theme.removeObserver(observer)
        }
    }, [theme])

    const changeTheme = () => {
        if (theme.value === 'light') {
            theme.setTheme('dark')
            return
        }
        theme.setTheme('light')
    }

    return (
        <Switch size={'small'} onChange={changeTheme} theme={theme.value as 'dark' | 'light'}/>
    )
}