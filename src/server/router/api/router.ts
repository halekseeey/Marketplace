import {Router} from 'express';
import {addToCart, createAsset, getAsset, getAssets, getCart, getSame, pay, purchases} from '../../api/assets';
import {register} from '../../api/register';
import {getProfile, login, updateProfile} from '../../api/profile';
import {getSeller, registerSeller} from '../../api/seller';

export const apiRouter: Router = Router()

apiRouter.get('/healthcheck', (req, res) => {
    res.status(200).send('I`m okay')
})

apiRouter.post('/register', async (req, res) => {
    const {status} = await register(req)

    res.sendStatus(status)
})

apiRouter.post('/login', async (req, res) => {
    try {
        const {refresh_token, access_token, status} = await login(req)
        if (status === 200) {
            res.cookie('access_token', access_token, {httpOnly: true, path: '/', sameSite: 'strict'})
            res.cookie('refresh_token', refresh_token, {httpOnly: true, path: '/', sameSite: 'strict'})
        }
        res.sendStatus(status)
    } catch (e) {
        console.log(e)
        res.status(500).send('internal server error')
    }
})

apiRouter.get('/profile', async (req, res) => {
    try {
        const profile = await getProfile(req)

        if (profile.status === 200) {
            res.status(200).send(profile.data)

            return
        }

        res.status(401).send('bad request')
    } catch (e) {
        res.status(500).send('internal server error')
    }
})

apiRouter.post('/seller/register', async (req, res) => {
    try {
        const seller = await registerSeller(req)

        res.status(seller.status).send(seller)
    } catch (e) {
        res.status(500).send('internal server error')
    }
})

apiRouter.get('/seller', async (req, res) => {
    try {
        const seller = await getSeller(req)

        res.status(seller.status).send(seller.data)
    } catch (e) {
        res.status(500).send('internal server error')
    }
})

apiRouter.post('/profile', async (req, res) => {
    try {
        const profile = await updateProfile(req)

        res.status(profile.status).send(profile.data)
    } catch (e) {
        res.status(500).send('internal server error')
    }
})

apiRouter.get('/assets', async (req, res) => {
    try {
        const assets = await getAssets(req)

        if (assets.status >= 200 && assets.status < 300) {
            return res.status(200).send(assets.data)
        }

        res.status(400).send('bad request')
    } catch (e) {
        res.status(500).send('internal server error')
    }
})

apiRouter.get('/same/:id', async (req, res) => {
    try {
        const assets = await getSame(req, Number(req.params.id))

        if (assets.status >= 200 && assets.status < 300) {
            return res.status(200).send(assets.data)
        }

        res.status(400).send('bad request')
    } catch (e) {
        res.status(500).send('internal server error')
    }
})

apiRouter.post('/assets', async (req, res) => {
    try {
        const asset = await createAsset(req)

        res.status(asset.status).send(asset.data)
    } catch (e) {
        res.status(500).send('internal server error')
    }
})

apiRouter.get('/assets/:id', async (req, res) => {
    try {
        const assets = await getAsset(req, Number(req.params.id))

        if (assets.status >= 200 && assets.status < 300) {
            return res.status(200).send(assets.data)
        }

        res.status(400).send('bad request')
    } catch (e) {
        res.status(500).send('internal server error')
    }
})

apiRouter.get('/logout', async (req, res) => {
    res.clearCookie('access_token')
    res.clearCookie('refresh_token')
    res.sendStatus(200)
})

apiRouter.get('/cart/:id', async (req, res) => {
    try {
        const response = await addToCart(req, Number(req.params.id))

        res.sendStatus(response.status)
    } catch (e) {
        res.status(500).send('internal server error')
    }
})

apiRouter.get('/cart', async (req, res) => {
    try {
        const response = await getCart(req)

        res.status(response.status).send(response.data)
    } catch (e) {
        res.status(500).send('internal server error')
    }
})

apiRouter.post('/buy', async (req, res) => {
    try {
        const response = await pay(req)

        res.status(response.status).send({})
    } catch (e) {
        res.status(500).send('internal server error')
    }
})

apiRouter.get('/purchases', async (req, res) => {
    try {
        const response = await purchases(req)
        res.status(200).send(response.data)
    } catch (e) {
        res.status(500).send('internal server error')
    }
})

apiRouter.all('*', (req, res) => {
    res.status(404).send('not found')
})