import { ExpendituresScraper } from '../scraper/ExpendituresScraper'
import { Firestore } from '../../firebase/Firestore'

export default async function retrieveAndStoreExpenditureData () {
  await new Firestore().FinancialRecord().delete()
    .then(count => {
      console.log(`deleted ${count} financial records before regeneration`)
    })
  await new ExpendituresScraper('https://www.ourcommons.ca/PublicDisclosure/MemberExpenditures.aspx?FormatType=XML')
    .createExpenditureRecords()
    .then(async records => {
      await Promise.all(
        records.map(record => {
          return new Firestore()
            .FinancialRecord()
            .insert(record)
        })
      )
    })
}
