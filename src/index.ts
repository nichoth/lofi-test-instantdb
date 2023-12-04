import { html } from 'htm/preact'
import { FunctionComponent, render } from 'preact'
import { createDebug } from '@nichoth/debug'
import { State } from './state.js'
import Router from './routes/index.js'
import '@nichoth/components/button-outline.css'
import './style.css'

const router = Router()
const state = State()
const debug = createDebug()

const Example:FunctionComponent<{ state }> = function Example ({ state }) {
    debug('rendering example...')
    const match = router.match(state.route.value)
    const ChildNode = match.action(match, state.route)

    if (!match) {
        return html`<div class="404">
            <h1>404</h1>
        </div>`
    }

    return html`<div>
        <h1>example</h1>

        <${ChildNode} state=${state} />
    </div>`
}

render(html`<${Example} state=${state} />`, document.getElementById('root')!)
