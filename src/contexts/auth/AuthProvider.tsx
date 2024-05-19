import {FC, PropsWithChildren} from 'react';
import {AuthContext} from './AuthContext';
import {Auth} from '../../utils/Auth';

export const AuthProvider: FC<PropsWithChildren<{ value: Auth }>> = ({children, value}) => {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}