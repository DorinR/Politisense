/* eslint-env jest */
import { PARTY_COLORS } from '../../../../component/dashboard/Sidebar/RidingShape/partyColors'
import { fallbackSvg } from '../../../../component/dashboard/Sidebar/RidingShape/fallbackSvg'
import { addColorFillToRidingShape } from '../../../../component/dashboard/Sidebar/RidingShape/RidingShape'

const chai = require('chai')
chai.should()

describe('Riding Shape Tests', () => {
  test('That the riding shape svg has the correct color fill added', () => {
    const colorToFillShapeWith = '%23355888'
    const coloredSvg = addColorFillToRidingShape(
      fallbackSvg,
      colorToFillShapeWith
    )
    coloredSvg
      .indexOf(
        `<path fill="${colorToFillShapeWith}" d="M 633.1889 1 799 68.4405 573.3365 327.3851 338.7976 526.7723 316.7199 626.4028 1 533.5598 146.8849 302.3286 425.8673 173.6108 633.1889 1 Z"/>`
      )
      .should.not.be.equals(-1)
  })
  test('Function correctly identified invalid color format and uses fallback color', () => {
    const basicHexColor = '#355888'
    const coloredSvg = addColorFillToRidingShape(fallbackSvg, basicHexColor)
    coloredSvg
      .indexOf(
        `<path fill="${basicHexColor}" d="M 633.1889 1 799 68.4405 573.3365 327.3851 338.7976 526.7723 316.7199 626.4028 1 533.5598 146.8849 302.3286 425.8673 173.6108 633.1889 1 Z"/>`
      )
      .should.equals(-1)

    const fallBackColorUsed = '%237766E4'
    coloredSvg
      .indexOf(
        `<path fill="${fallBackColorUsed}" d="M 633.1889 1 799 68.4405 573.3365 327.3851 338.7976 526.7723 316.7199 626.4028 1 533.5598 146.8849 302.3286 425.8673 173.6108 633.1889 1 Z"/>`
      )
      .should.not.be.equals(-1)
  })
  test('That correct party color is returned', () => {
    PARTY_COLORS['bloc québécois'].should.equals('%23355888')
    PARTY_COLORS.liberal.should.equals('%23D71921')
    PARTY_COLORS.conservative.should.equals('%230C499C')
    PARTY_COLORS['green party'].should.equals('%233D9B35')
    PARTY_COLORS.independent.should.equals('%2378D7CE')
    PARTY_COLORS.ndp.should.equals('%23EF7E52')
  })
})
