import React from 'react';
import styles from './Navbar.module.css'
import Link from 'next/link';
import {ThemeToggle} from '../ThemeToggle/ThemeToggle';
import {useRouter} from 'next/router';
import cn from 'classnames';
import {Button, Input} from '@groups/uilib'
import Logo from '../../../public/logo.svg'
import MobileLogo from '../../../public/mobileLogo.svg'
import Basket from '../../../public/basket.svg'

const availableRoutes = [{href: '/catalog', name: 'Каталог'}]

const Navbar = () => {
    const router = useRouter()

    const onProfileButton = () => {
        router.push('/profile')
    }

    return (
        <div className={styles.navbar}>
            <div className={styles.container}>
                <Link href={'/'} className={styles.mobile}>
                    <MobileLogo/>
                </Link>
                <div className={styles.links}>
                    <Link href={'/'}>
                        <Logo/>
                    </Link>
                    {availableRoutes.map(link => {
                        const classNames = cn(styles.link, {
                            [styles.link__active]: link.href === router.pathname
                        })

                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={classNames}
                            >
                                {link.name}
                            </Link>
                        )
                    })}
                    <Input
                        className={styles.search}
                        placeholder="Поиск"
                        icon
                    />
                </div>
                <div className={styles.user}>
                    <ThemeToggle/>
                    <Button as={Link} href={'/profile?tab=cart'} className={styles.basket} variant={'outline'}><Basket/></Button>
                    <Button onClick={onProfileButton} variant={'outline'}>Профиль</Button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;