// import { blake3 } from '@noble/hashes/blake3'
// import serialize from 'json-canon'
import { Signal, signal, effect } from '@preact/signals'
import timestamp from 'monotonic-timestamp'
import Route from 'route-event'
import {
    getDB,
    init,
    transact,
    instatx,
    uuid as id
} from '@instantdb/core'
import Debug from '@nichoth/debug'
const { tx } = instatx

/**
 * @see {@link https://docs.instantdb.com/docs/instaql The docs}
 */

const APP_ID = import.meta.env.VITE_APP_ID
const debug = Debug()

// @ts-ignore
window.transact = transact
// @ts-ignore
window.tx = tx

// an ID I copied from the browser console
const HEALTH_ID = '6b746a95-0b5c-42fe-81d6-dcfb3b24bde9'

export type AppState = ReturnType<typeof State>

export type Goal = {
    title:string,
    id:string
}

export type Todo = {
    title:string,
    id:string,
    isComplete?:boolean
}

export type GoalsWithTodos = ({
    isLoading?:boolean;
    data?: {
        goals: (Goal & { todos: Todo[] })[];
    }
})

export type Node = {
    seq:number;
    prev:string;
    content:string;
}

/**
 * Setup any state
 *   - routes
 *   - instantDB
 */
export function State ():{
    route:Signal<string>;
    goalsWithTodos:Signal<GoalsWithTodos>;
    nodes:ReturnType<typeof querySignal<Node[]>>['state']
    _setRoute:(path:string)=>void;
    _instant:ReturnType<typeof getDB>;
} {  // eslint-disable-line indent
    const onRoute = Route()

    init({
        appId: APP_ID,
        websocketURI: 'wss://api.instantdb.com/runtime/session',
    })

    const db = getDB()

    const queryHealth = {
        goals: {
            $: {
                where: {
                    id: HEALTH_ID,
                },
            },
        },
    }

    /**
     * This is todos, grouped by goals
     */
    const nestedQuery = {
        goals: {
            todos: {},
        },
    }

    const goalsQuery = { goals: {} }

    /**
     * We can fetch a specific entity in a namespace as well as it's
     * related associations
     */
    const { state: filterState } = querySignal(db, {
        goals: {
            $: {
                where: {
                    id: HEALTH_ID,
                },
            },
            todos: {},
        },
    })

    const { state: goalsSignal } = querySignal(db, goalsQuery)
    const { state: healthSignal } = querySignal(db, queryHealth)

    const {
        state: nestedState
    } = querySignal<{ goals:(Goal & { todos: Todo[] })[] }>(db, nestedQuery)

    effect(() => {
        debug('filtered results, with related docs', filterState.value)
    })

    effect(() => {
        debug('goals!!!!!!!', goalsSignal.value)
    })

    effect(() => {
        debug('filering...', healthSignal.value)
    })

    effect(() => {
        debug('nested query...', nestedState.value)
    })

    const nodesQuery = {

    }
    const { state: nodes } = querySignal<Node[]>(db, nodesQuery)

    const state = {
        _setRoute: onRoute.setRoute.bind(onRoute),
        _instant: db,
        goalsWithTodos: nestedState,
        nodes,
        route: signal<string>(location.pathname + location.search)
    }

    /**
     * set the app state to match the browser URL
     */
    onRoute((path:string) => {
        // for github pages
        const newPath = path.replace('/lofi-test-instantdb/', '/')
        state.route.value = newPath
    })

    return state
}

/**
 * Mark an item as complete.
 * @param {string} todoId The ID of the item you are updating
 */
State.Complete = function (todoId:string) {
    transact([
        tx.todos[todoId].update({ isComplete: true })
    ])
}

/**
 * Set an item as not complete
 * @param {string} todoId ID of the item
 */
State.Uncomplete = function (todoId:string) {
    transact([
        tx.todos[todoId].update({ isComplete: false })
    ])
}

/**
 * Create a new node with a link to the previous
 * @param content Text content
 */
State.CreateNode = function (content:string) {
    const newId = id()

    const newNodeValue = {
        ts: timestamp(),
        content: { type: 'post', text: content }
    }

    transact([
        tx.nodes[newId]
            .update({ content })
            .link({ nodes: '' })
    ])
}

/**
 * Create a signal for a query
 *
 * @param {ReturnType<typeof getDB>} db The instant DB
 * @param {object} query The query
 * @returns Unsubscribe function and query state
 */
function querySignal<T> (db:ReturnType<typeof getDB>, query):{
    unsubscribe:()=>void,
    state:Signal<({ isLoading:boolean, data?:T })>
} {
    const queryState = signal({ isLoading: true })

    const unsubscribe = db.subscribeQuery(query, (resp) => {
        queryState.value = { isLoading: false, ...resp }
    })

    return { unsubscribe, state: queryState }
}

// export function verify (post) {
//     const json = serialize(post)

//     if (post.seq % 100 === 0) {
//         const hash = blake3()
//         return verify()
//     }
// }
