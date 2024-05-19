import styles from './Carousel.module.css'
import Button from '../UI/Button/Button'
import {FC} from 'react'
import Arrow from '../../../public/arrow.svg'

export interface BarProps {
    position: number
    changeHandle: (direction: number) => void
    clickHandle: (position: number) => void
    images: Array<string>
    offset: number
}

const Bar: FC<BarProps> = ({
                               position,
                               changeHandle,
                               clickHandle,
                               images,
                               offset,
                           }) => {
    return (
        <div className={styles.bar}>
            <div className={styles.carousel_wrapper}>
                <Button onClick={() => clickHandle(-1)}>
                    <div style={{rotate: '90deg'}}>
                        <Arrow/>
                    </div>
                </Button>
                <div className={styles.carousel}>
                    {images.map((value, index) => {
                        return (
                            <div
                                key={index}
                                className={styles.image}
                            >
                                <img
                                    onClick={() => changeHandle(index)}
                                    src={value}
                                    alt={''}
                                    style={
                                        index === position ? {border: 'white 2px solid'} : {}
                                    }
                                />
                            </div>
                        )
                    })}
                </div>
                <Button onClick={() => clickHandle(1)}>
                    <div style={{rotate: '-90deg'}}>
                        <Arrow/>
                    </div>
                </Button>
            </div>
            <div className={styles.dots}>
                {images.map((value, index) => (
                    <div
                        key={value}
                        className={styles.dot}
                        data-selected={index === position}
                    />
                ))}
            </div>
        </div>
    )
}

export default Bar
