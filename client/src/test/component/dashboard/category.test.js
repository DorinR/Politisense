/* eslint-env jest */
<<<<<<< HEAD:client/src/test/component/dashboard/category.test.js
import { capitalizedName } from '../../../Components/Dashboard/BillDialog'
import { checkDataExistForCategory } from '../../../Components/Dashboard/CategoryCard'
=======
import { capitalizedName } from '../../../component/dashboard/BillDialog'
import { checkDataExistForCategory } from '../../../component/dashboard/CategoryCard'
>>>>>>> #211 [feature/scraper-refactor] : refactored backend to be easier to traverse:client/src/test/component/dashboard/category.test.js

const chai = require('chai')
chai.should()

describe('checks failure cases ', () => {
  test('checks if string is in incorrect format (empty)', () => {
    const res = capitalizedName('')
    expect(res).not.toBe('Ishmam Murtaza')
  })

  test('checks if string is in incorrect format (number)', () => {
    const res = capitalizedName('123')
    expect(res).toBe(null)
  })
})

describe('this function checks if there exists at least one bill that has the category of interest', () => {
  test('successful case', () => {
    const bills = [{ billData: { category: 'religion' } },
      { billData: { category: 'trade' } }]
    const title = 'trade'
    const res = checkDataExistForCategory(bills, title)
    expect(res).toBe(true)
  })
  test('failure case 1 ', () => {
    const bills = [{ billData: { category: 'religion' } },
      { billData: { category: 'trade' } }]
    const title = 'humanRight'
    const res = checkDataExistForCategory(bills, title)
    expect(res).not.toBe(true)
  })

  test('failure case 2', () => {
    const bills = []
    const title = 'humanRight'
    const res = checkDataExistForCategory(bills, title)
    expect(res).not.toBe(true)
  })
})
