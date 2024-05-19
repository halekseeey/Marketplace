import {FC} from 'react'
import styles from './Loader.module.css'

interface IProps {
    size: number
}

export const Loader:FC<IProps> = ({size}) => {
    return <div style={{width: size, height: size}} className={styles.loader}/>
}