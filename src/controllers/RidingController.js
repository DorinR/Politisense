const Firestore = require('@firestore').Firestore

exports.getRidingCode = (req, res) => {
  const targetRiding = req.params.riding
  const db = new Firestore()
  db.Riding()
    .where('nameEnglish', '==', targetRiding)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).json({
          success: false,
          message: 'Riding not found'
        })
      }
      snapshot.forEach(doc => {
        res.status(200).json({
          success: true,
          data: doc.data()
        })
      })
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        message: 'Error Fetching Riding Code'
      })
      console.error(err)
    })
}

exports.getRidingPopulation = (req, res) => {
  const targetRiding = req.params.riding
  const db = new Firestore()
  db.Riding()
    .where('nameEnglish', '==', targetRiding)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).json({
          success: false,
          message: 'Riding not found'
        })
      }
      snapshot.forEach(doc => {
        res.status(200).json({
          success: true,
          data: doc.data()
        })
      })
    })
    .catch(err =>
      res.status(400).json({
        success: false,
        message: err
      })
    )
}

exports.getRidingByRidingCode = async (req,res)=>{
    let ridings= []
    const db43 = new Firestore(false).forParliament(43)
    let pol = db43.Politician()
    let politicans = await getAllPoliticiansParl43()
    let ride = await getAllRidings()

    res.status(200).json({
        success: true,
        data: [politicans,ride]
    })

    // console.log("politicans.length",politicans.length,politicans[0],ride.l)
    // const db = new Firestore()
    // await db.Riding()
    //     .innerJoin("nameEnglish",politicans,"riding")
    //     .select()
    //     .then(snapshot => {
    //         if (snapshot.empty) {
    //             res.status(404).json({
    //                 success: false,
    //                 message: 'inner join not found By Code provided'
    //             })
    //         }
    //         snapshot.forEach(doc => {
    //             console.log(doc.data())
    //             ridings.push(doc.data())
    //         })
    //         res.status(200).json({
    //             success: true,
    //             data: ridings
    //         })
    //     })
    //     .catch(err =>
    //         res.status(400).json({
    //             success: false,
    //             message: err
    //         })
    //     )

    // let result =[]
    // ride.innerJoin('nameEnglish',politicans,'riding')
    //     .then(snapshot => {
    //         if (snapshot.empty) {
    //             res.status(404).json({
    //                 success: false,
    //                 message: 'inner join not found By Code provided'
    //             })
    //         }
    //         snapshot.forEach(doc => {
    //             console.log(doc.data())
    //             result.push(doc.data())
    //         })
    //         res.status(200).json({
    //             success: true,
    //             data: result
    //         })
    //     })
    //     .catch(err =>
    //         res.status(400).json({
    //             success: false,
    //             message: err
    //         })
    //     )

}

async function getAllPoliticiansParl43(){
    let politicains = []
    const db43 = new Firestore(false).forParliament(43)

    await db43.Politician().select()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log("NO politicans")
               return []
            }
            snapshot.forEach(doc => {
              politicains.push(doc.data())
            })
        })
        .catch(err => console.log("NO politicans",err)
        )
    return politicains
}

async function getAllRidings(){
    let ridings = []
    const db = new Firestore()
    await db.Riding()
        .select()
        .then(snapshot => {
            if (snapshot.empty) {
               console.log("no ridings")
                return []
            }
            snapshot.forEach(doc => {
              ridings.push(doc.data())
            })
        })
        .catch(err =>
            console.log("invlaid parameters")
        )
    return ridings
}