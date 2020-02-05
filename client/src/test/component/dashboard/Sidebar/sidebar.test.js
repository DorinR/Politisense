/* global describe, test */
import { getAllRidings } from '../../../../Components/Dashboard/Sidebar/RidingSwitcher/RidingSwitcher'

const chai = require('chai')
chai.should()

describe('Sidebar Tests', () => {
  test('Testing that function can extract ridings from representative objects and return them in alphabetical order', () => {
    const representatives = [
      {
        imageUrl:
          'https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/42/ArnoldMel_CPC.jpg',
        name: 'mel arnold',
        politicalParty: 'conservative',
        riding: 'north okanagan-shuswap',
        yearElected: 2019
      },
      {
        imageUrl:
          'https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/Silhouette.jpg',
        name: 'tamara jansen',
        politicalParty: 'conservative',
        riding: 'cloverdale-langley city',
        yearElected: 2019
      },
      {
        imageUrl:
          'https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/42/LebouthillierDiane_Lib.jpg',
        name: 'diane lebouthillier',
        politicalParty: 'liberal',
        riding: 'gaspésie-les îles-de-la-madeleine',
        yearElected: 2019
      },
      {
        imageUrl:
          'https://www.ourcommons.ca/Content/Parliamentarians/Images/OfficialMPPhotos/42/AboultaifZiad_CPC.jpg',
        name: 'ziad aboultaif',
        politicalParty: 'conservative',
        riding: 'edmonton manning',
        yearElected: 2019
      }
    ]
    const ridings = getAllRidings(representatives)
    const expectedRidings = [
      'cloverdale-langley city',
      'edmonton manning',
      'gaspésie-les îles-de-la-madeleine',
      'north okanagan-shuswap'
    ]

    for (let i = 0; i < ridings.length; i++) {
      ridings[i].should.equals(expectedRidings[i])
    }
  })
})
