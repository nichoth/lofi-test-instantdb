import { html } from 'htm/preact'
import Debug from '@nichoth/debug'
import { FunctionComponent } from 'preact'
import { Accordion } from '@nichoth/components/htm/accordion'
import { State, AppState } from '../state'
import '@nichoth/components/accordion.css'
import { doTransaction, clearData } from '../mock-data'

const debug = Debug()

export const HomeRoute: FunctionComponent<{
  state: AppState
}> = function ({ state }) {
    debug('state in home', state)

    return html`<div class="route home">
        <h2>home route</h2>

        ${state.goalsWithTodos.value.isLoading ?
            html`<div>Loading...</div>` :
            html`
                <h2>Goals</h2>
                <button onClick=${() => doTransaction()}>
                    Load Data
                </button>
                <button
                    onClick=${() => clearData(state.goalsWithTodos)}
                >
                    Delete Data
                </button>
                <${Goals} state=${state} goals=${state.goalsWithTodos} />
            `
        }
    </div>`
}

/**
 * Update something
 * transact([
 *   tx.goals[myId].update({ title: 'eat' })
 * ])
 */

/**
 * Use the `update` action to create entities also.
 *
 * ```js
 * transact([tx.goals[id()].update({ title: 'eat' })])
 * ```
 *
 * This creates a new `goal`
 */

function Goals ({ goals, state }:{
    goals:AppState['goalsWithTodos'];
    state:ReturnType<typeof State>;
}) {
    function check (ev) {
        const el = ev.target
        const isComplete = el.checked
        const { todoId } = el.dataset
        if (isComplete) {
            return State.Complete(todoId)
        }

        // is not complete
        State.Uncomplete(todoId)
    }

    return html`<ul class="goals">
        ${goals.value.data!.goals.map(goal => {
            return html`<li data-goalId="${goal.id}" class="goal">
                <${Accordion}>
                    <summary>${goal.title}</summary>
                    <ul>${goal.todos.map(todo => {
                        return html`<li id="${todo.id}">
                            <input class="toggle" type="checkbox"
                                checked=${todo.isComplete}
                                name="completed"
                                id=${todo.id}
                                onChange=${check}
                                data-todo-id=${todo.id}
                            />
                            ${' ' + todo.title}
                        </li>`
                    })}</ul>
                <//>
            </li>`
        })}
    </ul>`
}
