import { FC } from 'react'
import styles from './Category.module.css'
import TwoD from '../../../public/categories/2D.svg'
import ThreeD from '../../../public/categories/3D.svg'
import Vfx from '../../../public/categories/VFX.svg'
import Audio from '../../../public/categories/Audio.svg'
import Button, { ButtonProps } from '../UI/Button/Button'

export interface CategoryProps extends ButtonProps {
    name: '2D' | '3D' | 'VFX' | 'Audio' | 'Characters' | 'Areas',
    onClick?: () => void
}

function getImage(name: string) {
    switch (name) {
        case '2D':
            return <TwoD />
        case 'Characters':
            return <TwoD />
        case '3D':
            return <ThreeD />
        case 'VFX':
            return <Vfx />
        case 'Audio':
            return <Audio />
        default:
            return <TwoD />
    }
}

/**
 * Компонент ссылки на категорию
 * param name - название категории
 * param href - ссылка на категорию
 */

const Category: FC<CategoryProps> = ({ name }) => {
    const image = getImage(name)

    return (
        <Button className={styles.btn}>
            {image}
            {name}
        </Button>
    )
}

export default Category
