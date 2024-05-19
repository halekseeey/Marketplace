import {Input, Button} from '@groups/uilib'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import styles from './Seller.module.css'
import {getContextProps} from 'src/utils/getContextProps'
import {FormEvent} from 'react';

export default function Register() {
    const router = useRouter()

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const data = new FormData(event.currentTarget)

        fetch('/api/seller/register', {
            method: 'post',
            body: JSON.stringify({
                nickname: data.get('nickname'),
                phone: data.get('phone')
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                router.replace('/profile')
            })
            .catch((e) => {
                console.log(e)
            })
    }
    return (
        <form className={styles.register} onSubmit={submit}>
            <h2>Регистрация продавца</h2>
            <Input
                placeholder={'Никнейм'}
                name={'nickname'}
            />
            <Input
                placeholder={'Телефон'}
                name={'phone'}
            />
            <Button
                type={'submit'}
                variant={'primary'}
                size={'medium'}
            >
                Зарегистрироваться
            </Button>
        </form>
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
