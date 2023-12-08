import { html } from 'htm/preact'
import { FunctionComponent } from 'preact'
import Debug from '@nichoth/debug'
import { AppState, State } from '../state.js'

const debug = Debug()

export const CreateRoute:FunctionComponent<{ state:AppState }> = function ({
    state
}) {
    function createNode (ev) {
        ev.preventDefault()
        const content = ev.target.elements.content
        debug('**content**', content.value)
        State.CreateNode(content)
    }

    return html`<div class="route create">
        <form onSubmit=${createNode}>
            <input type="text" name="content" />
            <button type="submit">Create</button>
        </form>
    </div>`
}
