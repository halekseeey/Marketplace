import styles from './Carousel.module.css'
import Slide from './Slide'
import Bar from './Bar'
import {useState} from 'react'

/**
 * Компонент отображения фото/видео
 */

interface CarouselProps {
    images: string[]
}

const Carousel = ({images}: CarouselProps) => {
    const [[position, direction, offset], setPosition] = useState([0, 0, 0])
    const clickHandle = (direction: number) => {
        if (
            (position > 0 && position < images.length - 1) ||
            (position === 0 && direction > 0) ||
            (position === images.length - 1 && direction < 0)
        ) {
            const newOffset =
                direction > 0
                    ? offset + 3 === position
                        ? offset + 1
                        : offset
                    : offset === position
                        ? offset - 1
                        : offset
            setPosition((prevState) => [
                prevState[0] + direction,
                direction,
                newOffset,
            ])
        }
    }
    const changeHandle = (pos: number) => {
        const newDirection = pos > position ? 1 : -1
        setPosition((prevState) => [pos, newDirection, prevState[2]])
    }
    return (
        <div className={styles.container}>
            <Slide
                src={images[position]}
                direction={direction}
                clickHandle={clickHandle}
            />
            <Bar
                position={position}
                changeHandle={changeHandle}
                clickHandle={clickHandle}
                images={images}
                offset={offset}
            />
        </div>
    )
}

export default Carousel
