/* eslint-env jest */
import { computeAverageEmployeeSpending } from '../../Components/Dashboard/Budget/BudgetContainer'

const chai = require('chai')
chai.should()

describe('checks success cases ', () => {
    test('checks if amount adds correctly', () => {
        const spendingItems = [{ amount: 2000 }, { amount: 1000 }, { amount: 10000 }]
        const res = computeAverageEmployeeSpending(spendingItems)
        expect(res).toBe(4333.333333333333)
    })

    test('checks if amount adds correctly', () => {
        const spendingItems = [{ amount: 0 }, { amount: 0 }, { amount: 0 }]
        const res = computeAverageEmployeeSpending(spendingItems)
        expect(res).toBe(0)
    })


    test('checks if empty amount returns 0', () => {
        const spendingItems = [{ amount: '' }, { amount: '' }, { amount: '' }]
        const res = computeAverageEmployeeSpending(spendingItems)
        expect(res).toBe(0)
    })

})


describe('checks failure cases ', () => {
    test('checks if string field returns null', () => {
        const spendingItems = [{ amount: 'burger' }, { amount: 1000 }, { amount: 10000 }]
        const res = computeAverageEmployeeSpending(spendingItems)
        expect(res).toBe(null)
    })



    test('checks if negative amounts return null', () => {
        const spendingItems = [{ amount: 2000 }, { amount: 1000 }, { amount: -10000 }]
        const res = computeAverageEmployeeSpending(spendingItems)
        expect(res).toBe(null)
    })

})
