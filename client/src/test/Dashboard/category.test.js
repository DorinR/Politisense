/* eslint-env jest */
import { capitalizedName } from '../../Components/Dashboard/BillDialog'

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
