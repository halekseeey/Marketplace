import {createContext} from 'react';
import {Auth} from '../../utils/Auth';

export const AuthContext = createContext<Auth>(new Auth())