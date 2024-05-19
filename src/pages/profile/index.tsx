import React, {FormEvent, Ref, SyntheticEvent, useEffect, useRef, useState} from 'react'
import {GetServerSideProps} from 'next'
import useSWRImmutable from 'swr/immutable'
import {Button, Input, Checkbox, Radio, Tabs, Tag} from '@groups/uilib'
import Link from 'next/link'
import {Skeleton} from '../../components/Skeleton/Skeleton'
import Image from 'next/image'
import styles from './Profile.module.css'
import {mutate, useSWRConfig} from 'swr'
import {Loader} from '../../components/Loader/Loader'
import {getContextProps} from 'src/utils/getContextProps'
import {UserResponse} from '../../server/api/profile';
import Edit from '../../../public/edit.svg'
import {Asset, ExtendedAsset} from '../../server/api/assets';
import {useRouter} from 'next/router';
import Cookies from 'js-cookie';

interface IUserResponse {
    name: string
    email: string
    avatar: string
    phone: string
}

interface Error {
    status: number
}

const fetcher = (url: string, init?: RequestInit) => {
    return fetch(url, init).then((res) => {
        if (res.ok) {
            return res.json()
        }
        throw {status: res.status}
    })
}

function ProfileInfo() {
    const {data, error, isLoading} = useSWRImmutable<UserResponse, Error>(
        '/api/profile',
        fetcher,
        {
            onErrorRetry: () => {
            },
        },
    )

    const [editRight, setEditRight] = useState(false)
    const [editLeft, setEditLeft] = useState(false)

    const {mutate} = useSWRConfig()

    const router = useRouter()

    if (error) {
        if (error.status === 401) {
            return (
                <div>
                    <p>Требуется авторизация</p>
                    <Link href={'/login'}>Войти</Link>
                </div>
            )
        } else if (error.status === 400) {
            console.log('error')
        }
    }

    const onSubmitFormRight = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget)

        fetch('/api/profile', {
            method: 'POST',
            body: JSON.stringify({
                email: data.get('email')
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then((res) => {
            mutate('/api/profile', {...data, ...res}, false)
        }).catch(e => console.log(e)).finally(() => {
            setEditRight(false)
        })
    }

    const onSubmitFormLeft = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const data = new FormData(event.currentTarget)
        const fio = data.get('fio')?.toString().split(' ')

        fetch('/api/profile', {
            method: 'POST',
            body: JSON.stringify({
                name: fio?.[0],
                surname: fio?.[1],
                about: data.get('about') || undefined,
                birthday: data.get('birthday') || undefined
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then((res) => {
            mutate('/api/profile', {...data, ...res}, false)
        }).catch(e => console.log(e)).finally(() => {
            setEditLeft(false)
        })
    }

    const logout = () => {
        fetch('/api/logout').then(() => router.push('/login'))
    }

    return (
        <div className={styles.container}>
            <div className={styles.profile}>
                <div className={styles.profile_header}>
                    <h2>Личные данные</h2>
                    <Button variant={'secondary'} onClick={() => setEditLeft(prevState => !prevState)}>
                        <Edit/>
                        Изменить
                    </Button>
                </div>
                <div className={styles.line}></div>
                <div className={styles.profile_info}>
                    <div className={styles.avatar}>
                        {data && !isLoading ? (
                            <Image
                                width={180}
                                height={180}
                                className={styles.avatar}
                                src={'https://cs14.pikabu.ru/post_img/2023/10/28/2/169845643817422827.jpg'}
                                alt={''}
                            />
                        ) : (
                            <Skeleton width={180} height={180}/>
                        )}
                    </div>
                    {!editLeft ? (<div className={styles.info}>
                        <div className={styles.info_column1}>
                            {data && !isLoading ? (
                                    <div className={styles.info_field}><p>Никнейм</p><h4>{data.username}</h4></div>) :
                                <Skeleton width={'100%'} height={40}/>}
                            <div className={styles.line}></div>
                            {data && !isLoading ? (
                                    <div className={styles.info_field}><p>Дата рождения</p><h4>{data.birthday}</h4></div>) :
                                <Skeleton width={'100%'} height={40}/>}
                        </div>
                        <div className={styles.info_column2}>
                            {data && !isLoading ? (<div className={styles.info_field}><p>Имя и Фамилия</p>
                                <h4>{data.name} {data.surname}</h4></div>) : <Skeleton width={'100%'} height={40}/>}
                            <div className={styles.line}></div>
                            {data && !isLoading ? (
                                    <div className={styles.info_field}><p>О себе</p><h4>{data.about || '-'}</h4></div>) :
                                <Skeleton width={'100%'} height={40}/>}
                        </div>
                    </div>) : (
                        data && (
                            <form className={styles.left_form} onSubmit={onSubmitFormLeft}>
                                <div className={styles.info_form}>
                                    <div className={styles.info_column1_form}>
                                        <Input name={'username'} defaultValue={data.username} placeholder={'Никнейм'}/>
                                        <Input name={'birthday'} defaultValue={data.birthday || ''}
                                               placeholder={'Дата рождения'}/>
                                    </div>
                                    <div className={styles.info_column2_form}>
                                        <Input name={'fio'} placeholder={'Имя и Фамилия'}
                                               defaultValue={`${data.name} ${data.surname}`}/>
                                        <Input name={'about'} placeholder={'О себе'} defaultValue={data.about || ''}/>
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    <Button type={'submit'} variant={'primary'}>Сохраниеть</Button>
                                    <Button type={'button'} variant={'outline'}
                                            onClick={() => setEditLeft(false)}>Отменить</Button>
                                </div>
                            </form>
                        )
                    )}
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.profile_header}>
                    <h2>Профиль</h2>
                    {data && (
                        data.is_seller ? <Link className={styles.link} href={'/seller'}>Кабинет продавца</Link> :
                            <Link className={styles.link} href={'/seller/register'}>Стать продавцом</Link>
                    )}
                </div>
                <div className={styles.line}></div>
                <div className={styles.email}>
                    {!editRight ? (data && !isLoading ? (
                            <>
                                <div className={styles.info_field}>
                                    <p>Почта</p>
                                    <h4>{data.email}</h4>
                                </div>
                                <Button variant={'secondary'} onClick={() => setEditRight(true)}><Edit/></Button>
                            </>
                        ) : <Skeleton width={'100%'} height={40}/>) :
                        <form onSubmit={onSubmitFormRight} className={styles.right_from}>
                            <Input name={'email'} placeholder={'Email'}/>
                            <div className={styles.actions}>
                                <Button type={'submit'} variant={'primary'}>Сохраниеть</Button>
                                <Button type={'button'} variant={'outline'}
                                        onClick={() => setEditRight(false)}>Отменить</Button>
                            </div>
                        </form>}
                </div>
                <Button className={styles.logout} onClick={logout} variant={'outline'}>Выйти</Button>
            </div>
        </div>
    )
}

function Cart() {
    const {data, error, isLoading, mutate} = useSWRImmutable<ExtendedAsset[], Error>(
        '/api/cart',
        fetcher,
        {
            onErrorRetry: () => {
            },
        },
    )

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const onBuyButton = () => {
        if (data) {
            setLoading(true)
            fetch('api/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    carts: data.map((item) => {
                        return [item.cart_id, item.id]
                    })
                })
            }).then((res) => {
                setSuccess(true)
                mutate()
            }).catch(e => console.log(e)).finally(() => setLoading(false))
        }
    }

    if (data?.length === 0) {
        return <div className={styles.container}><h2>Корзина пуста</h2></div>
    }

    return (
        <div className={styles.container}>
            {isLoading && <Skeleton width={'100%'} height={100}/>}
            {error && <h2>Упс... произошла ошибка</h2>}
            {data && (
                <div className={styles.cart_main}>
                    <div className={styles.cart}>
                        {data.map((item) => {
                            return (
                                <div key={item.id} className={styles.cart_item}>
                                    <Image className={styles.asset_image} src={item.images_link} alt={''} width={100}
                                           height={100}/>
                                    <div className={styles.cart_info}>
                                        <h2>{item.name}</h2>
                                        <p>DECOGON STUDIO</p>
                                        <Tag label={`${Number(item.cost)} рубль`} type={'outlined'}/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className={styles.buy_container}>
                        <div className={styles.buy}>
                            <h2>К оплате:</h2>
                            <Tag type={'outlined'} label={`${data.reduce((acc, curr) => {
                                return acc + Number(curr.cost)
                            }, 0)} рубль`}/>
                            {loading ? <Loader size={20}/> : (success ? <h4>Успешно</h4> :
                                <Button onClick={onBuyButton} variant={'primary'}>Оплатить</Button>)}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function MyAssets() {
    const {data, error, isLoading, mutate} = useSWRImmutable<ExtendedAsset[], Error>(
        '/api/purchases',
        fetcher,
        {
            onErrorRetry: () => {
            },
        },
    )

    return (
        <div className={styles.container}>
            <div className={styles.cart_main}>
                <div className={styles.cart}>
                    {data?.map((item) => {
                        return (
                            <div key={item.id} className={styles.cart_item}>
                                <Image className={styles.asset_image} src={item.images_link} alt={''} width={100}
                                       height={100}/>
                                <div className={styles.cart_info}>
                                    <h2>{item.name}</h2>
                                    <p>DECOGON STUDIO</p>
                                    <Tag label={`${Number(item.cost)} рубль`} type={'outlined'}/>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

const selectTab = (tab: string) => {
    switch (tab) {
        case 'Профиль':
            return <ProfileInfo/>
        case 'Корзина':
            return <Cart/>
        default:
            return <MyAssets/>
    }
}

const translate: Record<string, string> = {
    'Корзина': 'cart',
    'Купленные': 'bought',
    'Профиль': 'profile'
}

const reverseTranslate: Record<string, string> = {
    'cart': 'Корзина',
    'bought': 'Купленные',
    'profile': 'Профиль'
}

interface IProfile {
    defaultTab?: string;
}

export default function Profile({defaultTab}: IProfile) {
    const [currentTab, setCurrentTab] = useState<string>(defaultTab || '')
    const router = useRouter()
    
    const onTabChange = (tab: string) => {
        router.push(`/profile?tab=${translate[tab]}`, undefined, {shallow: true})
    }
    
    useEffect(() => {
        if (router.query['tab'] && typeof router.query['tab'] === 'string') {
            setCurrentTab(router.query['tab'])
        }
    }, [router.query])
    
    return (
        <div className={styles.main}>
                <Tabs options={[
                    {label: 'Профиль'},
                    {label: 'Корзина'},
                    {label: 'Купленные'}
                ]} onChange={onTabChange} currentTab={reverseTranslate[currentTab]}/>
            {selectTab(reverseTranslate[currentTab])}
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

    if (!context.query['tab']) {
        return {
            redirect: {
                destination: '/profile?tab=profile',
                permanent: false
            }
        }
    }

    return {
        props: {
            cookies,
            isAuth,
            defaultTab: context.query['tab']
        },
    }
}
