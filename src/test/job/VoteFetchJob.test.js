/* eslint-env jest */
const DupeVotesFilterAction = require('../../../src/job/VoteFetchJob').DupeVotesFilterAction

describe('VoteFetchJob DuplicateVotes', () => {
  it('should keep the vote with the greater id', async () => {
    const votes = [
      { billNumber: 'C-21', id: 1 },
      { billNumber: 'C-21', id: 2 },
      { billNumber: 'C-21', id: 3 }
    ]

    const result = await new DupeVotesFilterAction().perform([votes])
    expect(result).toHaveLength(1)
    expect(result[0].id).toEqual(3)
  })

  it('should keep all different bill votes', async () => {
    const votes = [
      { billNumber: 'C-21', id: 1 },
      { billNumber: 'C-22', id: 2 },
      { billNumber: 'C-23', id: 3 }
    ]

    const result = await new DupeVotesFilterAction().perform([votes])
    expect(result).toHaveLength(3)
    expect(result[0].id).toEqual(1)
  })

  it('should keep only the first duplicate', async () => {
    const votes = [
      { billNumber: 'C-21', id: 1, other: 'a' },
      { billNumber: 'C-21', id: 1, other: 'b' },
      { billNumber: 'C-21', id: 1, other: 'c' }
    ]

    const result = await new DupeVotesFilterAction().perform([votes])
    expect(result).toHaveLength(1)
    expect(result[0].other).toEqual('a')
  })
})
