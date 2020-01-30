const GovtDataScraper = require('./backend/governmentDataScraper/GovtDataScraper')

console.log('producing new data...')
new GovtDataScraper().getGovernmentData(500)
  .then(({bills, mps, votes}) => {
    console.log(bills)
    console.log(mps)
    console.log(votes)
    return ({bills, mps, votes})
  })/*
      .then(async (data) => {
        const db = new Firestore()
        console.log('clearing old data...')
        await db.Politician().delete()
          .then(count => {
            console.log(`${count} politicians were deleted`)
          })
        await db.Bill().delete()
          .then(count => {
            console.log(`${count} bills were deleted`)
          })
        await db.VoteRecord().delete()
          .then(count => {
            console.log(`${count} voterecords were deleted`)
          })
        await db.Vote().delete()
          .then(count => {
            console.log(`${count} votes were deleted`)
          })
        return data
      })
      .then(async ({bills, mps, votes})=> {
        console.log('inserting new data...')
        const db = new Firestore()
        return await Promise.all(
          [Promise.all(
            bills.map(bill => {
              db.Bill().insert(bill)
            })
          ),
            Promise.all(
              mps.map(mp => {
                db.Politician().insert(mp)
              })
            ),
            Promise.all(
              votes.map(vote => {
                db.VoteRecord().insert(vote)
              })
            )]
        )
      })
      .then(async () => {
        const scraper = new GovtDataScraper()
        console.log('creating new collections...')
        return await Promise.all(
          [
            scraper.standardiseRidingHyphens(),
            scraper.createVotes(),
            scraper.modifyVoteRecords()
          ]
        )

      })*/
  .then(() => {
    console.log('data pipeline successful!')
  })