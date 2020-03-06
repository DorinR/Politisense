const Action = require('../JobAction').AbstractJobAction
const Firestore = require('@firestore').Firestore
const PoliticalParty = require('@model').PoliticalParty

const imageURLs = {}
imageURLs['bloc québécois'] = 'https://pbs.twimg.com/profile_images/735567130423394310/r33frJKG_400x400.jpg'
imageURLs['canadian alliance'] = 'https://en.wikipedia.org/wiki/Canadian_Alliance#/media/File:Canadian_Alliance_logo_-_logo_de_l\'Alliance_Canadienne.svg'
imageURLs['liberal'] = 'https://pbs.twimg.com/profile_images/1228661726868070401/MirE9eDB_400x400.jpg'
imageURLs['ndp'] = 'https://pbs.twimg.com/profile_images/1196465881087455232/hFKPjmeb_400x400.png'
imageURLs['pc'] = 'https://en.wikipedia.org/wiki/Progressive_Conservative_Party_of_Canada#/media/File:Parti_PC_Party_Canada_1996.svg'
imageURLs['reform'] = 'https://en.wikipedia.org/wiki/Co-operative_Commonwealth_Federation#/media/File:Co-operative_Commonwealth_Federation_logo.png'
imageURLs['conservative'] = 'https://pbs.twimg.com/profile_images/1081332155500777472/F-OH6Yz7_400x400.jpg'
imageURLs['indepedent'] = 'https://is2-ssl.mzstatic.com/image/thumb/Purple62/v4/12/56/74/125674b7-3a64-439c-194b-770f83e6060e/source/512x512bb.jpg'
imageURLs['green party'] = 'https://www.homelesshub.ca/sites/default/files/greens.png'
imageURLs['forces et démocratie'] = 'https://en.wikipedia.org/wiki/Strength_in_Democracy#/media/File:Strengthindemocracy.png'
imageURLs['co-operative commonwealth federation'] = 'https://en.wikipedia.org/wiki/Co-operative_Commonwealth_Federation#/media/File:Co-operative_Commonwealth_Federation_logo.png'
imageURLs['people\'s party'] = 'https://en.wikipedia.org/wiki/People%27s_Party_of_Canada#/media/File:PPC-logo-en.png'


class PartyClassificationAction extends Action {
  constructor (params) {
    super()
    this.parliament = params.parliament || 43
    const db = new Firestore(false).forParliament(this.parliament)
    this.politicians = this.retrievePoliticians(db)
  }

  retrievePoliticians (db) {
    return db
      .Politician()
      .select()
      .then(snapshot => {
        const politicians = []
        snapshot.forEach(doc => {
          politicians.push(doc.data())
        })
        return politicians
      })
      .then(politicians => {
        return politicians.filter(politician => {
          return politician.name
        })
      })
      .catch(console.error)
  }

  perform () {
    return this.createDerivedPartyModels()
  }

  async createDerivedPartyModels () {
    this.politicians = await Promise.resolve(this.politicians)

    const parties = {}
    parties['independent'] = new PoliticalParty('independent', 0, imageURLs.indepedent)
    this.politicians.forEach(politician => {
      if (!Object.keys(parties).includes(politician.party) && Object.keys(imageURLs).includes(politician.party)) {
        parties[`${politician.party}`] = new PoliticalParty(politician.party, 1, imageURLs[politician.party])
      } else if (Object.keys(imageURLs).includes(politician.party)) {
        parties[`${politician.party}`].seats++
      } else {
        parties['independent'].seats++
      }
    })
    return Object.values(parties)
  }
}

module.exports = {
  PartyClassificationAction: PartyClassificationAction
}
