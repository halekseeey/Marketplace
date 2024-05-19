import { FC } from 'react'
import styles from './Discount.module.css'
import {Button} from '@groups/uilib'
import Grey_bear from '../../../public/grey_bear.svg'
import Green_bear from '../../../public/green_bear.svg'
import Link from 'next/link';

export interface DiscountProps {
    title: string
    description: string
    type: 'grey' | 'green'
    link?: string
}

/**
 * Карточка специальных предложений
 * @param title - названия
 * @param description - описание предложения
 * @param type - тип стилизации карточки
 * @param link - ссылка на предложение
 */

const Discount: FC<DiscountProps> = ({ title, description, type, link }) => {
    const img = type === 'grey' ? <Grey_bear /> : <Green_bear />

    return (
        <div className={[styles.container, styles[type]].join(' ')}>
            <h2 className={styles[`${type}_title`]}>{title}</h2>
            <p className={styles[`${type}_description`]}>{description}</p>
            <Button
                variant="outline"
                size="medium"
                className={styles[`${type}_button`]}
                as={Link}
                href={link}
            >
                Подробнее
            </Button>
            <div className={styles.image_wrapper}>{img}</div>
        </div>
    )
}

export default Discount
