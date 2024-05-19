import styles from './InfoCard.module.css'
import {Button} from '@groups/uilib'
import Basket from '../../../public/basket.svg'
import Heart from '../../../public/heart.svg'
import {FC, MouseEvent, useState} from 'react'
import {useSWRConfig} from 'swr';
import {Loader} from '../Loader/Loader';

export interface InfoCardProps {
    id?: number
    name?: string
    author?: string
    categories?: Array<string>
    platforms?: Array<string>
    price: number
    date?: string
    size?: number
    engine: string;
}

const InfoCard: FC<InfoCardProps> = ({engine, name, author, date, size, id, price, platforms, categories}) => {
    const [isAdded, setIsAdded] = useState(false)
    const [loading, setLoading] = useState(false)
    const {mutate} = useSWRConfig()
    console.log(id)

    const buyHandle = () => {
        setLoading(true)
        fetch(`/api/cart/${id}`).then(res => {
            if (res.status === 200) {
                setIsAdded(true)
            }
            mutate('/api/cart')
        }).catch(e => {
            console.log(e)
        }).finally(() => setLoading(false))
    }

    return (
        <div className={styles.container}>
            <Button className={styles.like} size={'small'}>
                <Heart/>
            </Button>
            <table>
                <tbody>
                <tr>
                    <td>Автор:</td>
                    <td>DEKOGON STUDIOS</td>
                </tr>
                <tr>
                    <td>Дата публикации:</td>
                    <td>21.12.2022</td>
                </tr>
                <tr>
                    <td>Размер файла:</td>
                    <td>100 МБ</td>
                </tr>
                <tr>
                    <td>Версии движка:</td>
                    <td>{engine}</td>
                </tr>
                <tr>
                    <td>Платформы:</td>
                    <td>{platforms}</td>
                </tr>
                </tbody>
            </table>
            <div className={styles.buy}>
                <h3 className={styles.price}>{price} рублей</h3>
                {isAdded ? <h3>Добавлено!</h3> : (loading ? <Loader size={25}/> :
                    <Button onClick={buyHandle} animation='scale' variant={'primary'}>
                        <Basket/>
                        <p className={styles.text}>В корзину</p>
                    </Button>)}
            </div>
        </div>
    )
}

export default InfoCard
