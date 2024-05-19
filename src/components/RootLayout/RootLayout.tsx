import {FC, ReactNode} from 'react'
import Navbar from '../Navbar/Navbar';
import styles from './RootLayout.module.css'

interface IRootLayoutProps {
    children: ReactNode
}

export const RootLayout: FC<IRootLayoutProps> = ({children}) => {
    return (
        <>
            <Navbar/>
            <div className={styles['page-container']}>
                {children}
            </div>
        </>
    )
}