import { html } from 'htm/preact'
import { FunctionComponent, render } from 'preact'
// import {
//     Primary as ButtonOutlinePrimary,
//     ButtonOutline
// } from '@nichoth/components/htm/button-outline'
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

        <h2>routes</h2>
        <ul>
            <li><a href="/aaa">aaa</a></li>
            <li><a href="/bbb">bbb</a></li>
            <li><a href="/ccc">ccc</a></li>
        </ul>

        <${ChildNode} state=${state} />
    </div>`
}

render(html`<${Example} state=${state} />`, document.getElementById('root')!)

// <h2>counter</h2>
// <div>
//     <div>count: ${state.count.value}</div>
//     <ul class="count-controls">
//         <li>
//             <${ButtonOutlinePrimary} onClick=${plus}>
//                 plus
//             </${ButtonOutline}>
//         </li>
//         <li>
//             <${ButtonOutline} onClick=${minus}>
//                 minus
//             </${ButtonOutline}>
//         </li>
//     </ul>
// </div>

// <h2>the API response</h2>
// <pre>
//     ${JSON.stringify(json, null, 2)}
// </pre>

// function plus (ev) {
//     ev.preventDefault()
//     State.Increase(state)
// }

// function minus (ev) {
//     ev.preventDefault()
//     State.Decrease(state)
// }
