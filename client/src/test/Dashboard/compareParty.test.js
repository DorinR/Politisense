/* eslint-env jest */
import {
  getSpendingCategoriesAverages,
  getAverage,
  getHexColor
} from '../../Components/Dashboard/Compare/CompareParties/Party'

const chai = require('chai')
chai.should()

describe('Checks happy and non-happy paths for getSpendingCategoriesAverages function', () => {
  let mockSpendingItems
  beforeEach(() => {
    mockSpendingItems = [
      {
        amount: 75,
        category: "1-Employees' salaries"
      },
      {
        amount: 125,
        category: "1-Employees' salaries"
      },
      {
        amount: 175,
        category: '2-Service Contracts'
      },
      {
        amount: 225,
        category: '2-Service Contracts'
      },
      {
        amount: 275,
        category: '3-Travel'
      },
      {
        amount: 325,
        category: '3-Travel'
      },
      {
        amount: 375,
        category: '4-Hospitality'
      },
      {
        amount: 425,
        category: '4-Hospitality'
      },
      {
        amount: 475,
        category: '5-Gifts'
      },
      {
        amount: 525,
        category: '5-Gifts'
      },
      {
        amount: 575,
        category: '6-Advertising'
      },
      {
        amount: 625,
        category: '6-Advertising'
      }
    ]
  })

  test('correctly extracts salaries average', () => {
    const { salariesAverage } = getSpendingCategoriesAverages(mockSpendingItems)
    expect(salariesAverage).toBe(100)
  })
  test('correctly extracts services average', () => {
    const { serviceAverage } = getSpendingCategoriesAverages(mockSpendingItems)
    expect(serviceAverage).toBe(200)
  })
  test('correctly extracts travel average', () => {
    const { travelAverage } = getSpendingCategoriesAverages(mockSpendingItems)
    expect(travelAverage).toBe(300)
  })
  test('correctly extracts hospitality average', () => {
    const { hospitalityAverage } = getSpendingCategoriesAverages(
      mockSpendingItems
    )
    expect(hospitalityAverage).toBe(400)
  })
  test('correctly extracts gifts average', () => {
    const { giftsAverage } = getSpendingCategoriesAverages(mockSpendingItems)
    expect(giftsAverage).toBe(500)
  })
  test('correctly extracts advertising average', () => {
    const { advertisingAverage } = getSpendingCategoriesAverages(
      mockSpendingItems
    )
    expect(advertisingAverage).toBe(600)
  })
  test('when one of the spending categories is absent from spending items should return NaN', () => {
    mockSpendingItems.pop()
    mockSpendingItems.pop()
    const { advertisingAverage } = getSpendingCategoriesAverages(
      mockSpendingItems
    )
    expect(advertisingAverage).toBe(NaN)
  })

  test('when amount value is a string that can easily be cast to int', () => {
    mockSpendingItems.push({
      amount: '600',
      category: '6-Advertising'
    })
    const { advertisingAverage } = getSpendingCategoriesAverages(
      mockSpendingItems
    )
    expect(advertisingAverage).toBe(600)
  })
  test('averages still compute correctly even when an item with wrong amount type is fed into the function', () => {
    mockSpendingItems.push({
      amount: 'definitely not a number',
      category: '6-Advertising'
    })
    const { advertisingAverage } = getSpendingCategoriesAverages(
      mockSpendingItems
    )
    expect(advertisingAverage).toBe(600)
  })
})

describe('test that averaging function with variable number of arguments works correctly', () => {
  test('regular input', () => {
    const avg = getAverage(1, 2, 3, 4, 5, 6, 7, 8, 9)
    expect(avg).toBe(5)
  })
  test('single value input', () => {
    const avg = getAverage(25)
    expect(avg).toBe(25)
  })
  test('empty input', () => {
    const avg = getAverage()
    expect(avg).toBe(NaN)
  })
  test('if non-number values are fed into function average is still correctly calculated', () => {
    const avg = getAverage(1, 2, 3, 'definitely not a number')
    expect(avg).toBe(2)
  })
})

describe('test that getting the hex-format color is correctly gotten from the svg-format color', () => {
  test('color extraction works with regular expected input', () => {
    let color = getHexColor('liberal')
    expect(color).toBe('#D71921')
    color = getHexColor('bloc québécois')
    expect(color).toBe('#355888')
    color = getHexColor('conservative')
    expect(color).toBe('#0C499C')
    color = getHexColor('green party')
    expect(color).toBe('#3D9B35')
    color = getHexColor('independent')
    expect(color).toBe('#78D7CE')
    color = getHexColor('ndp')
    expect(color).toBe('#EF7E52')
  })
  test('color extraction returns fallback color if passed argument is not among existing parties', () => {
    const color = getHexColor('definitely not a party name')
    expect(color).toBe('#78D7CE')
  })
})
