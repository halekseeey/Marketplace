import styles from './Skeleton.module.css'
import React, {FC} from 'react';

interface ISkeletonProps {
    width: React.CSSProperties['width']
    height: React.CSSProperties['height']
}

export const Skeleton:FC<ISkeletonProps> = ({height, width}) => {
    return (
        <div className={styles.skeleton} style={{height, width}}>
            <div className={styles['skeleton-loader']}/>
        </div>
    )
}