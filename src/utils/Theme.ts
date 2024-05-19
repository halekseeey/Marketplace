import Cookies from 'js-cookie';
import {ObservableValue} from './ObservableValue';

export class Theme extends ObservableValue<string> {
    constructor(theme = 'light') {
        super(theme);
    }

    setTheme(theme: string) {
        if (typeof window !== 'undefined') {
            Cookies.set('app_theme', theme)
        }
        super.setValue(theme)
    }
}