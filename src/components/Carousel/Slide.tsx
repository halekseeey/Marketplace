import {FC} from 'react'
import styles from './Carousel.module.css'
import Arrow from '../../../public/arrow.svg'
import Button from '../UI/Button/Button'

export interface SlideProps {
    src: string
    direction: number
    clickHandle: (direction: number) => void
}

const Slide: FC<SlideProps> = ({src, direction, clickHandle}) => {
    return (
        <div className={styles.slider}>
            <Button onClick={() => clickHandle(-1)}>
                <div style={{rotate: '90deg'}}>
                    <Arrow/>
                </div>
            </Button>
            <div
                className={styles.slide}
                key={src}
            >
                <img src={src} alt={''}/>
            </div>
            <Button onClick={() => clickHandle(1)}>
                <div style={{rotate: '-90deg'}}>
                    <Arrow/>
                </div>
            </Button>
        </div>
    )
}

export default Slide
