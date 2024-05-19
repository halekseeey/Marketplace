import {createContext} from 'react';
import {Theme} from '../../utils/Theme';

export const ThemeContext = createContext<Theme>(new Theme())