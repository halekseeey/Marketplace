import {GetServerSideProps} from 'next'
import styles from './Asset.module.css'
import Carousel from '../../components/Carousel/Carousel'
import InfoCard from '../../components/Card/InfoCard'
import PreviewCard from '../../components/Card/PreviewCard'
import Button from '../../components/UI/Button/Button'
import ReviewList from '../../components/Card/ReviewList'
import Tabs from '../../components/Tabs/Tabs'
import {getContextProps} from 'src/utils/getContextProps'
import {Asset} from '../../server/api/assets';
import axios from 'axios';
import {appConfig} from '../../server';
import useSWR from 'swr';
import {Loader} from '../../components/Loader/Loader';
import {Skeleton} from '../../components/Skeleton/Skeleton';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const id = context.params?.id
    const {isAuth, cookies} = getContextProps(context)

    try {
        const res = await axios.get<Asset>(`http://localhost:5000/api/assets/${id}`)

        return {
            props: {
                cookies,
                id: res.data.id,
                name: res.data.name,
                image: res.data.images_link,
                description: res.data.description,
                gallery: res.data.gallery,
                tags: res.data.tags,
                cost: res.data.cost,
                techDetails: res.data.tech_details,
                platform: res.data.platform,
                engine: res.data.engine,
                category: res.data.category,
            },
        }
    } catch (e) {
        return {
            cookies,
            isAuth,
            props: {}
        }
    }
}

export type CategoryProps = {
    id: number
    name: string
    description: string
    status: string
    image: string
    gallery: string[]
    tags: string
    cost: string
    techDetails: string
    platform: string
    engine: string
    category: string
}

const fetcher = (url: string, init?: RequestInit) => {
    return fetch(url, init).then((res) => {
        if (res.ok) {
            return res.json()
        }
        throw {status: res.status}
    })
}

export default function Id({
                                  id,
                                  image,
                                  name,
                                  description,
                                  gallery,
                                  cost,
                                  category,
                                  techDetails,
                                  tags,
                                  engine,
                                  platform,
                                  status,
                              }: CategoryProps) {

    const {data, isLoading, error} = useSWR<{result: Asset[]}>(`/api/same/${id}`, fetcher)

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h1>{name}</h1>
                <div className={styles.categories}>
                    {tags.split(',').slice(0, 3).map(tag => {
                        return <div key={tag} className={styles.category}>{tag}</div>
                    })}
                </div>
            </div>
            <div className={styles.info}>
                <div className={styles.gallery}>
                    <Carousel images={gallery}/>
                </div>
                <div className={styles.card}>
                    <InfoCard id={id} price={Number(cost)} engine={engine} platforms={[platform]}/>
                </div>
            </div>
            <div className={styles.description}>
                <div className={styles.details}>
                    <Tabs
                        options={[
                            {
                                label: 'Описание',
                                component: <p>{description}</p>,
                            },
                            {
                                label: 'Отзывы',
                                component: <ReviewList/>,
                            },
                            {
                                label: 'Технические детали',
                                component: (
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipisicing elit. Alias aut cupiditate
                                        distinctio doloremque esse hic inventore
                                        ipsam maiores molestiae molestias!
                                    </p>
                                ),
                            },
                        ]}
                        wrapped={true}
                    />
                </div>
                <div className={styles.similar_wrapper}>
                    {isLoading && <Skeleton width={'100%'} height={50}/>}
                    {data && (

                        <>
                            <div className={styles.actions}>
                                <h3>Похожие</h3>
                            </div>
                            <div className={styles.similar}>
                                {data.result.map(item => {
                                    return (<PreviewCard
                                        key={item.id}
                                        id={item.id}
                                        name={item.name}
                                        category={item.category}
                                        price={Number(item.cost)}
                                        images_link={
                                            item.images_link
                                        }
                                        minify={true}
                                    />)
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
