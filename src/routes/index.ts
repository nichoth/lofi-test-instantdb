import { html } from 'htm/preact'
import Router from '@nichoth/routes'
import { HomeRoute } from './home.js'
import { CreateRoute } from './create.js'

export default function _Router ():ReturnType<Router> {
    const router = Router()

    router.addRoute('/', () => {
        return HomeRoute
    })

    router.addRoute('/create', () => {
        return CreateRoute
    })

    router.addRoute('/aaa', () => {
        return () => {
            return html`<h2>aaa</h2>`
        }
    })

    router.addRoute('/bbb', () => {
        return () => {
            return html`<h2>bbb</h2>`
        }
    })

    router.addRoute('/ccc', () => {
        return () => {
            return html`<h2>ccc</h2>`
        }
    })

    return router
}
