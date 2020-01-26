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

})
