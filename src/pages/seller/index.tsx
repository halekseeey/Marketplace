import useSWR from 'swr'
import {SellerResponse} from '../../server/api/seller'
import styles from './Seller.module.css'
import {Skeleton} from '../../components/Skeleton/Skeleton'
import Image from 'next/image'
import {Tabs, Input, Select, Button} from '@groups/uilib'
import {GetServerSideProps} from 'next'
import {getContextProps} from '../../utils/getContextProps'
import {FormEvent, useState} from 'react'
import {useRouter} from 'next/router'
import Textarea from '../../components/UI/Input/Textarea'

const fetcher = (url: string, init?: RequestInit) => {
    return fetch(url, init).then((res) => {
        if (res.ok) {
            return res.json()
        }
        throw {status: res.status}
    })
}

function SellerInfo() {
    const router = useRouter()
    const {data, error, isLoading} = useSWR<SellerResponse, {status: number}>(
        '/api/seller',
        fetcher,
    )

    if (error?.status === 400) {
        router.push('/login')
    }

    return (
        <div className={styles.seller}>
            {isLoading && <Skeleton width={'100%'} height={100} />}
            {error && <h1>Ой, ошибочка...</h1>}
            {data && (
                <div className={styles.seller_data}>
                    <Image
                        className={styles.logo}
                        src={
                            'https://cs14.pikabu.ru/post_img/2023/10/28/2/1698456436190180116.jpg'
                        }
                        alt={''}
                        width={180}
                        height={180}
                    />
                    <div className={styles.info}>
                        <div className={styles.info_cell}>
                            <p>Никнейм</p>
                            <h4>{data.nickname}</h4>
                        </div>
                        <div className={styles.info_cell}>
                            <p>Номер телефона</p>
                            <h4>{data.phone}</h4>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function Create() {
    const [platform, setPlatform] = useState('Windows')
    const [engine, setEngine] = useState('Unreal 5')
    const [loading, setLoading] = useState(false)

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget)

        const body = {
            name: data.get('name'),
            version: data.get('version'),
            tags: data.get('tags'),
            images_link: data.get('images_link'),
            asset_link: data.get('asset_link'),
            cost: Number(data.get('cost')),
            engine,
            platform,
            description: data.get('description'),
            tech_details: data.get('tech_details'),
        }

        setLoading(true)
        fetch('/api/assets', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .catch((e) => {
                console.log(e)
            })
            .finally(() => setLoading(false))
    }

    return (
        <form className={styles.form} onSubmit={onSubmit}>
            <div className={styles.form_row}>
                <Input name={'name'} placeholder={'Название'} />
                <Input placeholder={'Версия'} name={'version'} />
            </div>
            <div className={styles.form_row}>
                <Input name={'tags'} placeholder={'Тэги'} />
                <Input placeholder={'ссылка на превью'} name={'images_link'} />
            </div>
            <div className={styles.form_row}>
                <Input name={'cost'} placeholder={'цена'} type={'number'} />
                <Input placeholder={'Ссылка'} name={'asset_link'} />
            </div>
            <div className={styles.select_row}>
                <Select
                    placeholder={'Платформа'}
                    options={[
                        {id: 1, title: 'Windows', value: 'Windows'},
                        {id: 2, title: 'IOS', value: 'IOS'},
                        {id: 3, title: 'PS', value: 'PS'},
                    ]}
                    value={platform}
                    onChange={(value: string | number) =>
                        setPlatform(String(value))
                    }
                />
                <Select
                    placeholder={'Движок'}
                    options={[
                        {id: 1, title: 'Unreal 5', value: 'Unreal 5'},
                        {id: 2, title: 'Godot', value: 'Godot'},
                        {id: 3, title: 'Defold', value: 'Defold'},
                    ]}
                    value={engine}
                    onChange={(value: string | number) =>
                        setEngine(String(value))
                    }
                />
            </div>
            <div className={styles.textareas}>
                <Textarea placeholder={'Описание'} name={'description'} />
                <Textarea
                    placeholder={'Технические детали'}
                    name={'tech_details'}
                />
            </div>
            <Button variant={'primary'}>Создать</Button>
        </form>
    )
}

function getCurrentTab(tab: string) {
    switch (tab) {
        case 'Профиль':
            return <SellerInfo />
        default:
            return <Create />
    }
}

export default function Seller() {
    const [currentTab, setCurrentTab] = useState('Профиль')
    return (
        <div className={styles.container}>
            <div style={{alignSelf: 'flex-start'}}>
                <Tabs
                    options={[{label: 'Профиль'}, {label: 'Создать'}]}
                    onChange={(tab) => setCurrentTab(tab)}
                    currentTab={currentTab}
                />
            </div>
            {getCurrentTab(currentTab)}
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {isAuth, cookies} = getContextProps(context)

    if (!isAuth) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }

    return {
        props: {
            cookies,
            isAuth,
        },
    }
}
