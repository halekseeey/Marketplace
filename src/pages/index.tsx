import React from 'react'
import {GetServerSideProps} from 'next'
import styles from './Home.module.css'
import Category from '../components/Category/Category'
import Discount from '../components/Discount/Discount'
import {useRouter} from 'next/router'
import {getContextProps} from 'src/utils/getContextProps'
import {Button} from '@groups/uilib'
import Link from 'next/link'

const Home = () => {
    const router = useRouter()
    const toCatalog = (params: string) => {
        router.push('/catalog')
    }

    return (
        <>
            <div className={styles.landing}>
                <h1>Маркетплейс</h1>
                <p>
                    Будьте трудолюбивы, как пчелка в своем улье, найдите самые
                    ценные продукты на нашей площадке!
                </p>

                <Button
                    size="medium"
                    animation="scale"
                    className={styles.button}
                    variant={'outline'}
                    as={Link}
                    href={'/catalog'}
                >
                    В каталог
                </Button>
            </div>
            <div className={styles.discounts}>
                <div className={styles.grey_container}>
                    <Discount
                        title="Assault Rifle Animations"
                        type="grey"
                        description="Pack includes 25 mocap assault rifle animations, like a reload, shots, crouch, prone, walk, shooting rack etc..."
                        link={'/asset/11'}
                    />
                    <Discount
                        title="Claw Engine"
                        type="grey"
                        description='Готовые решения для игровго движка "Claw Engine" - собственной разработки от Bear Head Studio'
                        link={'/catalog?engine=Claw Engine'}
                    />

                    <Discount
                        title="3D"
                        type="green"
                        description="Готовое решение для вашего проекта от инди-студия по разработке игр Bear Head Studio."
                        link={'/catalog?engine=Claw Engine'}
                    />
                </div>
            </div>
            <div className={styles.categories_wrapper}>
                <h1>Категории</h1>
                <div className={styles.categories}>
                    <Category name="2D" onClick={() => toCatalog('2D')} />
                    <Category name="3D" />
                    <Category name="VFX" />
                    <Category name="Audio" />
                    <Category name="Characters" />
                </div>
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {isAuth, cookies} = getContextProps(context)

    return {
        props: {
            cookies,
            isAuth,
        },
    }
}

export default Home
