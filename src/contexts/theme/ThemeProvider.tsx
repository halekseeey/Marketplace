import {FC, PropsWithChildren} from 'react';
import {ThemeContext} from './ThemeContext';
import {Theme} from '../../utils/Theme';

export const ThemeProvider: FC<PropsWithChildren<{ value: Theme }>> = ({children, value}) => {
    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}