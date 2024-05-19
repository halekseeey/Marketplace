import {useState} from 'react'
import {Input, Button} from '@groups/uilib'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import styles from './Login.module.css'
import Link from 'next/link'
import {getContextProps} from 'src/utils/getContextProps'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const router = useRouter()

    const submit = () => {
        fetch('/api/login', {
            method: 'post',
            body: JSON.stringify({
                username,
                password,
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
        <div className={styles.login}>
            <h2>Вход</h2>
            <Input
                className={styles.input}
                placeholder={'Имя пользователя'}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
            />
            <Input
                className={styles.input}
                placeholder={'Пароль'}
                type={'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
            />
            <Link href={'/register'}>Нет аккаунта?</Link>
            <Button
                className={styles.button}
                onClick={submit}
                variant={'primary'}
                size={'medium'}
            >
                Войти
            </Button>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const {isAuth, cookies} = getContextProps(context)

    if (isAuth) {
        return {
            redirect: {
                destination: '/profile',
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
