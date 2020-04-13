const Firestore = require('@firestore').Firestore

exports.getCabinetMinisters = (req, res) => {
  const db = new Firestore(false).forParliament(43)
  db.Role()
    .where('toDate', '==', 0)
    .where('fromDate', '>=', 2015)
    .where('type', '==', 'parliamentary')
    .innerJoin('politician', db.Politician(), '_id')
    .then(entries => {
      const filteredEntries = []
      entries.forEach((element) => {
        if (element.title.includes('minister') && !(element.title.includes('secretary'))) {
          filteredEntries.push(element)
        }
      })
      res.json({
        success: true,
        data: filteredEntries
      })
    })
}

exports.getPartyInfo = (req, res) => {
  const parties = []
  const db = new Firestore(false).forParliament(43)
  db.PoliticalParty().select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).json({
          message: 'parties not found',
          success: false
        })
      } else {
        snapshot.forEach(doc => {
          parties.push(doc.data())
        })
        res.json({
          success: true,
          data: parties
        })
      }
    })
}

exports.getRoleDescription = (req, res) => {
  const db = new Firestore(false)
  db.MinisterDescription().where('identifier', '==', req.body.ministry).select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(200).json({
          message: 'description not found',
          success: false
        })
      } else {
        snapshot.forEach(doc => {
          res.json({
            success: true,
            data: doc.data()
          })
        })
      }
    })
}
