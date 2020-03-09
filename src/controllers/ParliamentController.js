import { ministers } from './CabinetMinisters'
const Firestore = require('@firestore').Firestore

exports.getCabinetMinisters = (req, res) => {
    const db = new Firestore(false).forParliament(43)
    db.Role()
        .where('toDate', '==', 0)
        .where('fromDate', '>=', 2015)
        .where('type', '==', 'parliamentary')
        .innerJoin('politician', db.Politician(), '_id')
        .then(entries => {
            let filteredEntries = []
            entries.forEach((element) => {
                if(element.title.includes('minister') && !(element.title.includes('secretary'))){
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
    let parties = []
    const db = new Firestore(false).forParliament(43)
    db.Party().select()
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
    let ministry = req.body.ministry
    console.log(req.body.ministry)
    db.MinisterDescriptions().where('identifier','==','Minister of Transport').select()
        .then(snapshot => {
            if (snapshot.empty) {
                res.status(404).json({
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