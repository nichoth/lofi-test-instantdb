import { html } from 'htm/preact'
import Debug from '@nichoth/debug'
import { FunctionComponent } from 'preact'
import { Accordion } from '@nichoth/components/htm/accordion'
import { AppState } from '../state'
import '@nichoth/components/accordion.css'

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
                <${Accordion}>
                    <summary>${goal.title}</summary>
                    <ul>${goal.todos.map(todo => {
                        return html`<li>${todo.title}</li>`
                    })}</ul>
                <//>
            </li>`
        })}
    </ul>`
}
