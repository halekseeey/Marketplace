import {GetServerSideProps} from 'next'
import React, {ChangeEvent, ReactNode, useEffect} from 'react'
import styles from './Catalog.module.css'
import {useState} from 'react'
import {Checkbox, Input, Select, RangeInput, Paginator} from '@groups/uilib'
import PreviewCard from '../../components/Card/PreviewCard'
import {Asset} from '../../server/api/assets'
import {getContextProps} from 'src/utils/getContextProps'
import useSWR, {useSWRConfig} from 'swr';
import {Loader} from '../../components/Loader/Loader';
import {useRouter} from 'next/router';

interface IFilter {
    key: string
    value: string
    title: string
    checked: boolean
}

interface IFiltersGroups {
    [key: string]: IFilter[]
}

interface ICatalog {
    defaultFilters: IFiltersGroups
    filters: IFiltersGroups
    defaultRoute: string;
    page: number;
    pageSize: number
}

const translate: Record<string, string> = {
    engine: 'Движок',
    platform: 'Платформа',
}

const renderFilters = (
    filters: IFiltersGroups,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
) => {
    const html: Record<string, ReactNode[]> = {}

    Object.entries(filters).forEach(([key, item]) => {
        const group: ReactNode[] = []
        item.forEach((value) => {
            group.push(
                <Checkbox
                    label={value.title}
                    key={value.key}
                    name={key}
                    onChange={onChange}
                    value={value.value}
                    defaultChecked={value.checked}
                    size={'medium'}
                />,
            )
        })

        html[key] = group
    })

    return Object.entries(html).map(([key, value]) => {
        return (
            <div key={key} className={styles['filter-block']}>
                <div className={styles.line}/>
                <p>{translate[key]}</p>
                {value}
            </div>
        )
    })
}

const fetcher = (url: string, init?: RequestInit) => {
    return fetch(url, init).then((res) => {
        if (res.ok) {
            return res.json()
        }
        throw {status: res.status}
    })
}

export default function Catalog({filters, defaultRoute}: ICatalog) {
    const [stateFilters, setStateFilters] = useState(filters)
    const [page, setPage] = useState(1)
    const [count, setCount] = useState<number>(12)
    const [queryFilters, setQueryFilters] = useState(defaultRoute)

    console.log(queryFilters)

    const {
        data,
        error,
        isLoading
    } = useSWR<{ result: Asset[], count: number }, { status: number }>(`/api/assets?page=${page}&page_size=${count}&${queryFilters}`, fetcher)

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const copyState = {...stateFilters}

        const filter = copyState[e.target.name]?.find(
            (f) => f.value === e.target.value,
        )
        if (filter) {
            filter.checked = e.target.checked
        }

        const engines = filters.engine.filter(item => item.checked).map(item => item.value).join('|')
        const platforms = filters.platform.filter(item => item.checked).map(item => item.value).join('|')

        setStateFilters(copyState)
        setQueryFilters(`engine=${engines}&platform=${platforms}`)
    }

    const renderedFilters = renderFilters(stateFilters, onChange)

    return (
        <div className={styles.container}>
            <div className={styles.filters}>
                <div className={styles.search}>
                    <Input
                        placeholder={'Поиск по названию'}
                    />
                </div>
                <div className={styles.checkboxes}>
                    {renderedFilters}
                </div>
                <div className={styles.line}/>
                <RangeInput
                    min={100}
                    max={10000}
                    value={{min: 100, max: 10000}}
                />
            </div>
            <div className={styles.main}>
                <div className={styles.sorts}>
                    <Select placeholder={'Сортировать по'} options={[
                        {id: 1, title: 'Сначала новые', value: 'new'},
                        {id: 2, title: 'Сначала старые', value: 'old'},
                        {id: 3, title: 'Сначала дешевые', value: 'cheap'},
                        {id: 4, title: 'Сначала дорогие', value: 'expensive'},
                    ]}/>
                    <Select options={[
                        {id: 1, title: '12', value: 12},
                        {id: 2, title: '24', value: 24},
                        {id: 3, title: '48', value: 48}
                    ]}
                            value={count}
                            onChange={(value: number | string) => setCount(Number(value))}
                    />
                </div>
                {isLoading && <div className={styles.loader}>
                    <Loader size={40}/>
                </div>}
                {data && <div className={styles.assets}>
                    {data.result?.map((item) => {
                        return (
                            <PreviewCard
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                category={item.category}
                                price={Number(item.cost)}
                                images_link={item?.images_link}
                            />
                        )
                    })}
                </div>}
                <div style={{alignSelf: 'center'}}>
                    {data && data?.count > 1 &&
                        <Paginator onChange={page => setPage(page)} totalCount={Math.ceil(data.count / count)}
                                   currentPage={page} siblingCount={1}/>}
                </div>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {isAuth, cookies} = getContextProps(context)

    const filters: IFiltersGroups = {
        engine: [
            {title: 'Unreal 5', value: 'unreal5', checked: false, key: '1'},
            {title: 'Unity', value: 'Unity', checked: false, key: '2'},
            {title: 'Godot', value: 'godot', checked: false, key: '3'},
            {title: 'Claw Engine', value: 'Claw Engine', checked: false, key: '4'}
        ],
        platform: [
            {title: 'Windows', value: 'windows', checked: false, key: '5'},
            {title: 'IOS', value: 'ios', checked: false, key: '6'},
            {title: 'Linux', value: 'linux', checked: false, key: '7'},
        ],
    }

    Object.entries(context.query).forEach(([key, value]) => {
        const filter = filters[key]
        if (filter) {
            if (Array.isArray(value)) {
                value.forEach((v) => {
                    const f = filter.find((f) => f.value === v)
                    if (f) {
                        f.checked = true
                    }
                })
            } else {
                const f = filter.find((f) => f.value === value)
                if (f) {
                    f.checked = true
                }
            }
        }
    })

    const engines = filters.engine.filter(item => item.checked).map(item => item.value).join('|')
    const platforms = filters.platform.filter(item => item.checked).map(item => item.value).join('|')

    console.log(engines)

    return {
        props: {
            cookies,
            isAuth,
            filters,
            defaultRoute: `engine=${engines}&platform=${platforms}`
        },
    }
}