import { uuid as id, transact, instatx } from '@instantdb/core'
const { tx } = instatx

export const workoutId = id()
export const proteinId = id()
export const sleepId = id()
export const standupId = id()
export const reviewPRsId = id()
export const focusId = id()
export const healthId = id()
export const workId = id()

export const ids = [
    workoutId,
    proteinId,
    sleepId,
    standupId,
    reviewPRsId,
    focusId,
    healthId,
    workId
]

export function doTransaction () {
    transact([
        tx.todos[workoutId].update({ title: 'Go on a run' }),
        tx.todos[proteinId].update({ title: 'Drink protein' }),
        tx.todos[sleepId].update({ title: 'Go to bed early' }),
        tx.todos[standupId].update({ title: 'Do standup' }),
        tx.todos[reviewPRsId].update({ title: 'Review PRs' }),
        tx.todos[focusId].update({ title: 'Code a bunch' }),
        /**
         * @NOTE -- this is where we link to other data
         */
        tx.goals[healthId]
            .update({ title: 'Get fit!' })
            .link({ todos: workoutId })
            .link({ todos: proteinId })
            .link({ todos: sleepId }),
        tx.goals[workId]
            .update({ title: 'Get promoted!' })
            .link({ todos: standupId })
            .link({ todos: reviewPRsId })
            .link({ todos: focusId }),
    ])
}
