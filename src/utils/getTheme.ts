
enum Theme {
    dark = 'dark',
    light = 'light'
}

export function getTheme(theme?: string): string {
    if (theme === Theme.light) {
        return Theme.light
    }

    return Theme.dark
}