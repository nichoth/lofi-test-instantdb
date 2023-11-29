import { Signal, signal, effect } from '@preact/signals'
import Route from 'route-event'
import { getDB, init, transact, instatx } from '@instantdb/core'
import Debug from '@nichoth/debug'
const { tx } = instatx

const APP_ID = import.meta.env.VITE_APP_ID
const debug = Debug()

// @ts-ignore
window.transact = transact
// @ts-ignore
window.tx = tx

// an ID I copied from the console
const HEALTH_ID = '6b746a95-0b5c-42fe-81d6-dcfb3b24bde9'

/**
 * Setup any state
 *   - routes
 *   - instantDB
 */
export function State ():{
    route:Signal<string>;
    count:Signal<number>;
    _setRoute:(path:string)=>void;
    _instant:ReturnType<typeof getDB>;
} {  // eslint-disable-line indent
    const onRoute = Route()

    init({
        appId: APP_ID,
        websocketURI: 'wss://api.instantdb.com/runtime/session',
    })

    const db = getDB()

    debug('the database', db)

    // doTransaction()

    const query = {
        goals: {
            $: {
                where: {
                    id: HEALTH_ID,
                },
            },
        },
    }

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
    const filterQuery = {
        goals: {
            $: {
                where: {
                    id: HEALTH_ID,
                },
            },
            todos: {},
        },
    }

    const {
        unsubscribe: filterUnsub,
        state: filterState
    } = querySignal(db, filterQuery)
    const { unsubscribe, state: goalsSignal } = querySignal(db, goalsQuery)
    const { unsubscribe: unsubscribeOne, state: oneSignal } = querySignal(db, query)
    const {
        unsubscribe: unsubNested,
        state: nestedState
    } = querySignal(db, nestedQuery)

    effect(() => {
        debug('filtered results, with related docs', filterState.value)
        return filterUnsub
    })

    effect(() => {
        debug('goals!!!!!!!', goalsSignal.value)
        return unsubscribe
    })

    effect(() => {
        debug('filering...', oneSignal.value)
        return unsubscribeOne
    })

    effect(() => {
        debug('nested query...', nestedState.value)
        return unsubNested
    })

    const state = {
        _setRoute: onRoute.setRoute.bind(onRoute),
        _instant: db,
        count: signal<number>(0),
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

State.Increase = function (state:ReturnType<typeof State>) {
    state.count.value++
}

State.Decrease = function (state:ReturnType<typeof State>) {
    state.count.value--
}

/**
 * Create a signal for a query
 * @param db The instant DB
 * @param query The query
 * @returns Unsubribe function and query state
 */
function querySignal (db:ReturnType<typeof getDB>, query):{
    unsubscribe:()=>void,
    state
} {
    const queryState = signal({ isLoading: true })

    const unsub = db.subscribeQuery(query, (resp) => {
        queryState.value = { isLoading: false, ...resp }
    })

    return { unsubscribe: unsub, state: queryState }
}
