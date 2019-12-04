import { ExpendituresScraper } from './ExpendituresScraper'
import { Firestore } from '../../Firebase'

export default async function retrieveAndStoreExpenditureData () {
  await new ExpendituresScraper('https://www.ourcommons.ca/PublicDisclosure/MemberExpenditures.aspx?FormatType=XML')
    .createExpenditureRecords()
    .then(promises => {
      Promise.all(promises)
        .then(records => {
          records.forEach(record => {
            new Firestore()
              .FinancialRecord()
              .insert(record)
              .catch(e => {
                throw e
              })
          })
        })
        .catch(e => {
          throw e
        })
    })
    .catch(e => {
      throw e
    })
}
