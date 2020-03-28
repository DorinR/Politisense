/* eslint-env jest */
const Jobs = require('../../job/jobs')

const chai = require('chai')
const Assert = chai.assert

describe('Jobs', () => {
  const jobs = []
  const params = {
    url: 'some url',
    id: 'some id',
    params: {},
    name: 'some name',
    group: ['some group elem']

  }
  beforeAll(() => {
    jobs.push(Jobs.BillPDFFetchJob.create(params, () => {}))
    jobs.push(Jobs.BillLinkFetchJob.create(params, () => {}))
    jobs.push(Jobs.ClassificationJob.create(params, () => {}))
    jobs.push(Jobs.PoliticianFetchJob.create(params, () => {}))
    jobs.push(Jobs.RoleFetchJob.create(params, () => {}))
    jobs.push(Jobs.ScrapeJob.create(params, () => {}))
    jobs.push(Jobs.VoteParticipantFetchJob.create(params, () => {}))
    jobs.push(Jobs.VoteRecordFetchJob.create(params, () => {}))
    jobs.push(Jobs.CategoryGenerationJob.create(params, () => {}))
    jobs.push(Jobs.LegislativeActivityFetchJob.create(params, () => {}))
  })

  test('BillPDFFetchJob.js', async (done) => {
    const job = jobs[0]
    Assert.equal(job.registry.length, 4)
    Assert.equal(job.actions.length, 4)

    Assert.equal(job.actions[0].name, 'bound perform')
    Assert.equal(job.registry[0], 'PDFFileRetrieverAction')

    Assert.equal(job.actions[1].name, 'bound perform')
    Assert.equal(job.registry[1], 'PDFParseAction')

    Assert.equal(job.actions[2].name, 'bound perform')
    Assert.equal(job.registry[2], 'QueryResponseAdapterAction')

    Assert.equal(job.actions[3].name, 'bound perform')
    Assert.equal(job.registry[3], 'FileOutputAction')
    done()
  })

  test('BillLinkFetchJob.js', async (done) => {
    const job = jobs[1]
    Assert.equal(job.registry.length, 5)
    Assert.equal(job.actions.length, 5)

    Assert.equal(job.actions[0].name, 'bound perform')
    Assert.equal(job.registry[0], 'FetchAction')

    Assert.equal(job.actions[1].name, 'bound perform')
    Assert.equal(job.registry[1], 'TextParserAction')

    Assert.equal(job.actions[2].name, 'bound perform')
    Assert.equal(job.registry[2], 'SelectionAction')

    Assert.equal(job.actions[3].name, 'bound perform')
    Assert.equal(job.registry[3], 'SelectionAction')

    Assert.equal(job.actions[4].name, 'bound perform')
    Assert.equal(job.registry[4], 'BillLinkFetchAdapterAction')
    done()
  })

  test('ClassificationJob.js', async (done) => {
    const job = jobs[2]
    Assert.equal(job.registry.length, 4)
    Assert.equal(job.actions.length, 4)

    Assert.equal(job.actions[0].name, 'bound perform')
    Assert.equal(job.registry[0], 'Wrapped BillLinkFetchRunner')

    Assert.equal(job.actions[1].name, 'bound perform')
    Assert.equal(job.registry[1], 'Wrapped BillPDFFetchRunner')

    Assert.equal(job.actions[2].name, 'bound perform')
    Assert.equal(job.registry[2], 'BillClassificationAction')

    Assert.equal(job.actions[3].name, 'bound perform')
    Assert.equal(job.registry[3], 'QueryResponseAdapterAction')
    done()
  })

  test('PoliticianFetchJob.js', async (done) => {
    const job = jobs[3]
    Assert.equal(job.registry.length, 3)
    Assert.equal(job.actions.length, 3)

    Assert.equal(job.actions[0].name, 'bound perform')
    Assert.equal(job.registry[0], 'FetchAction')

    Assert.equal(job.actions[1].name, 'bound perform')
    Assert.equal(job.registry[1], 'Wrapped MpXmlParser')

    Assert.equal(job.actions[2].name, 'bound perform')
    Assert.equal(job.registry[2], 'QueryResponseAdapterAction')

    done()
  })

  test('RoleFetchJob.js', async (done) => {
    const job = jobs[4]
    Assert.equal(job.registry.length, 5)
    Assert.equal(job.actions.length, 5)

    Assert.equal(job.actions[0].name, 'bound perform')
    Assert.equal(job.registry[0], 'SelectionGroupAction')

    Assert.equal(job.actions[1].name, 'bound perform')
    Assert.equal(job.registry[1], 'RoleFetchLinkAdapterAction')

    Assert.equal(job.actions[2].name, 'bound perform')
    Assert.equal(job.registry[2], 'FetchAction')

    Assert.equal(job.actions[3].name, 'bound perform')
    Assert.equal(job.registry[3], 'Wrapped RoleXmlParser')

    Assert.equal(job.actions[4].name, 'bound perform')
    Assert.equal(job.registry[4], 'RoleQueryResponseAdapterAction')

    done()
  })

  test('ScrapeJob.js', async (done) => {
    const job = jobs[5]
    Assert.equal(job.registry.length, 4)
    Assert.equal(job.actions.length, 4)

    Assert.equal(job.actions[0].name, 'bound perform')
    Assert.equal(job.registry[0], 'LinkScraperAction')

    Assert.equal(job.actions[1].name, 'bound perform')
    Assert.equal(job.registry[1], 'TextParserAction')

    Assert.equal(job.actions[2].name, 'bound perform')
    Assert.equal(job.registry[2], 'SelectionAction')

    Assert.equal(job.actions[3].name, 'bound perform')
    Assert.equal(job.registry[3], 'RequeueConnectionAction')

    done()
  })

  test('VoteParticipantFetchJob.js', async (done) => {
    const job = jobs[6]
    Assert.equal(job.registry.length, 3)
    Assert.equal(job.actions.length, 3)

    Assert.equal(job.actions[0].name, 'bound perform')
    Assert.equal(job.registry[0], 'FetchAction')

    Assert.equal(job.actions[1].name, 'bound perform')
    Assert.equal(job.registry[1], 'Wrapped VoteParticipantsXmlParser')

    Assert.equal(job.actions[2].name, 'bound perform')
    Assert.equal(job.registry[2], 'QueryResponseAdapterAction')

    done()
  })

  test('VoteRecordFetchJob.js', async (done) => {
    const job = jobs[7]
    Assert.equal(job.registry.length, 3)
    Assert.equal(job.actions.length, 3)

    Assert.equal(job.actions[0].name, 'bound perform')
    Assert.equal(job.registry[0], 'FetchAction')

    Assert.equal(job.actions[1].name, 'bound perform')
    Assert.equal(job.registry[1], 'Wrapped VoteXmlParser')

    Assert.equal(job.actions[2].name, 'bound perform')
    Assert.equal(job.registry[2], 'QueryResponseAdapterAction')

    done()
  })

  test('CategoryGenerationJob.js', async (done) => {
    const job = jobs[8]
    Assert.equal(job.registry.length, 2)
    Assert.equal(job.actions.length, 2)

    Assert.equal(job.actions[0].name, 'bound perform')
    Assert.equal(job.registry[0], 'BillTagCreationAction')

    Assert.equal(job.actions[1].name, 'bound perform')
    Assert.equal(job.registry[1], 'QueryResponseAdapterAction')

    done()
  })

  test('LegislativeActivityFetchJob.js', async (done) => {
    const job = jobs[9]
    Assert.equal(job.registry.length, 3)
    Assert.equal(job.actions.length, 3)

    Assert.equal(job.actions[0].name, 'bound perform')
    Assert.equal(job.registry[0], 'FetchAction')

    Assert.equal(job.actions[1].name, 'bound perform')
    Assert.equal(job.registry[1], 'Wrapped LegislativeActivityXmlParser')

    Assert.equal(job.actions[2].name, 'bound perform')
    Assert.equal(job.registry[2], 'QueryResponseAdapterAction')

    done()
  })
})
