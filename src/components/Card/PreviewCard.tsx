import styles from './PreviewCard.module.css'
import {Button, Tag} from '@groups/uilib';
import Basket from '../../../public/basket.svg'
import {FC, useState} from 'react'
import Image from 'next/image'
import {useRouter} from 'next/router'
import {MouseEvent} from 'react'
import {Loader} from '../Loader/Loader';
import {useSWRConfig} from 'swr';
import {Skeleton} from '../Skeleton/Skeleton';

export interface PreviewCardProps {
    id: number
    name: string
    author?: string
    category: string
    price: number
    minify?: boolean
    images_link: string
}

const PreviewCard: FC<PreviewCardProps> = ({
                                               name,
                                               author,
                                               category,
                                               price,
                                               id,
                                               images_link,
                                               minify = false,
                                           }) => {
    const router = useRouter()
    const [isAdded, setIsAdded] = useState(false)
    const [loading, setLoading] = useState(false)
    const {mutate} = useSWRConfig()

    const clickHandle = () => {
        router.push(`/asset/${id}`)
    }

    const buyHandle = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        setLoading(true)
        fetch(`api/cart/${id}`).then(res => {
            if (res.status === 200) {
                setIsAdded(true)
            }
            mutate('/api/cart')
        }).catch(e => {
            console.log(e)
        }).finally(() => setLoading(false))
    }

    return (
        <div className={styles.container} onClick={clickHandle}>
            <div className={styles.top_buttons}>
                <Tag label={category} type={'filled'}/>
            </div>
            <div className={styles.preview_image}>
                {images_link ? <Image src={images_link} fill alt=""/> : <Skeleton width={'100%'} height={'100%'}/>}
            </div>
            <div className={styles.description}>
                <p className={styles.name}>{name}</p>
            </div>
            {!minify && (
                <div className={styles.bord}>
                    <p className={styles.price}>{price} руб</p>
                    {loading ? <Loader size={20}/> : (isAdded ? <p>Добавлено</p> : (<Button
                        animation="scale"
                        variant="primary"
                        onClick={buyHandle}
                        icon={<Basket/>}
                    >
                        <p className={styles.text}>Купить</p>
                    </Button>))}
                </div>
            )}
        </div>
    )
}

export default PreviewCard
