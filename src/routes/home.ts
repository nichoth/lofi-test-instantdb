import { html } from 'htm/preact'
import Debug from '@nichoth/debug'
import { FunctionComponent } from 'preact'
import { AppState } from '../state'

const debug = Debug()

export const HomeRoute:FunctionComponent<{
    state:AppState
}> = function ({ state }) {
    debug('state in home', state)

    return html`<div class="route home">
        <h2>home route</h2>

        ${state.goalsWithTodos.value.isLoading ?
            html`<div>Loading...</div>` :
            html`
                <h2>Goals</h2>
                <${Goals} goals=${state.goalsWithTodos} />
            `
        }
    </div>`
}

function Goals ({ goals }:{
    goals:AppState['goalsWithTodos']
}) {
    return html`<ul class="goals">
        ${goals.value.data!.goals.map(goal => {
            return html`<li class="goal">
                ${goal.title}
            </li>`
        })}
    </ul>`
}
