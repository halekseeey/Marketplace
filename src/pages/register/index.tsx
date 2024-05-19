import {useRef} from 'react'
import {Input, Button} from '@groups/uilib'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'
import styles from './Register.module.css'
import Link from 'next/link'
import {getContextProps} from 'src/utils/getContextProps'

export default function Login() {
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

    const router = useRouter()

    const submit = () => {
        const body: Record<string, string> = {}

        Object.entries(inputRefs.current).forEach(([key, input]) => {
            body[key] = input?.value || ''
        })

        fetch('/api/register', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(() => {
                router.replace('/login')
            })
            .catch((e) => {
                console.log(e)
            })
    }
    return (
        <div className={styles.register}>
            <h2>Регистрация</h2>
            <Input
                placeholder={'Имя пользователя'}
                ref={ref => inputRefs.current['username'] = ref}
            />
            <Input
                placeholder={'Email'}
                ref={ref => inputRefs.current['email'] = ref}
            />
            <Input
                placeholder={'Пароль'}
                type={'password'}
                ref={ref => inputRefs.current['password'] = ref}
            />
            <Input
                placeholder={'Имя'}
                ref={ref => inputRefs.current['name'] = ref}
            />
            <Input
                placeholder={'Фамилия'}
                ref={ref => inputRefs.current['surname'] = ref}
            />
            <Button
                onClick={submit}
                variant={'primary'}
                size={'medium'}
            >
                Зарегистрироваться
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
