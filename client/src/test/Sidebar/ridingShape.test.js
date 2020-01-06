/* global describe, test */
import { getPartyColor } from '../../Components/Dashboard/Sidebar/RidingShape/RidingShape'

const { expect } = require('chai')

describe('Riding Shape Tests', () => {
  test('Test that correct color for riding shape is returned', () => {
    expect(getPartyColor('bloc québécois')).to.equal('%23355888')
    expect(getPartyColor('liberal')).to.equal('%23D71921')
    expect(getPartyColor('conservative')).to.equal('%230C499C')
    expect(getPartyColor('green party')).to.equal('%233D9B35')
    expect(getPartyColor('independent')).to.equal('%2378D7CE')
    expect(getPartyColor('ndp')).to.equal('%23EF7E52')
  })
})
