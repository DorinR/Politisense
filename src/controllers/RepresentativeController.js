const Firestore = require('@firestore').Firestore

exports.getImageData = async (req, res) => {
  const name = req.params.name.toLowerCase()
  new Firestore()
    .Politician()
    .where('name', '==', name)
    .select()
    .then(snapshot => {
      if (snapshot.empty || snapshot.size > 1) {
        res.status(400).json({
          message: `Could not find: ${name}`,
          success: false,
          data: {}
        })
      } else {
        snapshot.forEach(doc => {
          res.status(200).json({
            message: `Found Politician: ${name}`,
            success: true,
            data: doc.data()
          })
        })
      }
    })
    .catch(console.error)
}

exports.getRepresentativeByRiding = (req, res) => {
  const db = new Firestore()
  const riding = req.params.riding.toLowerCase()
  db.Politician()
    .select('riding', '==', riding)
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'Riding Not Found',
          success: false
        })
      }
      snapshot.forEach(doc => {
        res.json({
          success: true,
          data: doc.data()
        })
      })
    })
    .catch(console.error)
}

exports.getAllRepresentatives = (req, res) => {
  const representativesAccumulator = []
  const db = new Firestore()
  db.Politician()
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(400).json({
          message: 'No Representatives Found in Database',
          success: false
        })
      }
      snapshot.forEach(doc => {
        representativesAccumulator.push(doc.data())
      })

      if (!representativesAccumulator.empty) {
        res.status(200).json({
          data: representativesAccumulator,
          success: true
        })
      }
    })
    .catch(err => {
      console.error(err.message)
      res.status(400).json({
        data: representativesAccumulator,
        success: false
      })
      console.log(err)
    })
}

// getRepresentativesInfo
exports.getRepresentativesInfo = (req, res) => {
  const name = req.params.name.toLowerCase()
  let repInfo = {}
  const db = new Firestore()
  db.Politician()
    .select('name', '==', name)
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching documents.')
        return
      }
      snapshot.forEach(doc => {
        const {
          name,
          politicalParty,
          riding,
          yearElected,
          imageUrl
        } = doc.data()
        repInfo = {
          name: name,
          politicalParty: politicalParty,
          riding: riding,
          yearElected: yearElected,
          imageUrl: imageUrl
        }
      })
      res.status(200).json({
        data: repInfo,
        success: true
      })
    })
    .catch(err => {
      console.log('Error getting documents', err)
    })
}

exports.getRepresentativeId = async (req, res) => {
  const db = new Firestore()
  await db
    .Politician()
    .where('name', '==', req.params.representative)
    .select()
    .then(snapshot => {
      if (snapshot.empty) {
        res.status(404).json({
          success: false,
          message: 'Representative not found'
        })
      }
      snapshot.forEach(doc => {
        res.status(200).json({
          success: true,
          data: doc.id
        })
      })
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        message: err
      })
    })
}
//getAllRolesByRep
exports.getAllRolesByRep = async (req, res) => {
    const db43 = new Firestore(false).forParliament(43)
    const role43= db43.Role()

    const db42 = new Firestore(false).forParliament(42)
    const role42= db42.Role()

    const db41 = new Firestore(false).forParliament(41)
    const role41= db41.Role()

    const db40 = new Firestore(false).forParliament(40)
    const role40= db40.Role()


    let roless= []
   let id= null
    db43.Politician()
        .where('name','==',req.params.repName)
        .select()
        .then(snapshot => {
            if (snapshot.empty) {
                res.status(404).json({
                    success: false,
                    message: 'Representative not found'
                })
            }
            snapshot.forEach(doc => {
                // const name = doc.id
                id = doc.id
            })
            if(id){
                console.log("IM HERE ",id)
                role43.where('politician','==',id)
                    .select()
                    .then(snapshot => {
                        if (snapshot.empty) {
                            res.status(404).json({
                                success: false,
                                message: 'Representative not found'
                            })
                        }
                        snapshot.forEach(doc => {
                            const {fromDate,group,title,toDate,type} = doc.data()
                            let test={
                                fromDate:fromDate,
                                group:group,
                                title:title,
                                toDate:toDate,
                                type:type
                            }
                            console.log(test)
                            roless.push(test)
                        })
                        // res.status(200).json({
                        //     success: true,
                        //     data: roless
                        // })
                        db42.Politician()
                            .where('name','==',req.params.repName)
                            .select()
                            .then(snapshot => {
                                if (snapshot.empty) {
                                    res.status(404).json({
                                        success: false,
                                        message: 'Representative not found'
                                    })
                                }
                                snapshot.forEach(doc => {
                                    // const name = doc.id
                                    id = doc.id
                                })
                                if(id){
                                    console.log("IM HERE ",id)
                                    role42.where('politician','==',id)
                                        .select()
                                        .then(snapshot => {
                                            if (snapshot.empty) {
                                                res.status(404).json({
                                                    success: false,
                                                    message: 'Representative not found'
                                                })
                                            }
                                            snapshot.forEach(doc => {
                                                const {fromDate,group,title,toDate,type} = doc.data()
                                                let test={
                                                    fromDate:fromDate,
                                                    group:group,
                                                    title:title,
                                                    toDate:toDate,
                                                    type:type
                                                }
                                                console.log(test)
                                                roless.push(test)
                                            })
                                            // res.status(200).json({
                                            //     success: true,
                                            //     data: roless
                                            // })
                                            db42.Politician()
                                                .where('name','==',req.params.repName)
                                                .select()
                                                .then(snapshot => {
                                                    if (snapshot.empty) {
                                                        res.status(404).json({
                                                            success: false,
                                                            message: 'Representative not found'
                                                        })
                                                    }
                                                    snapshot.forEach(doc => {
                                                        // const name = doc.id
                                                        id = doc.id
                                                    })
                                                    if(id){
                                                        console.log("IM HERE ",id)
                                                        role42.where('politician','==',id)
                                                            .select()
                                                            .then(snapshot => {
                                                                if (snapshot.empty) {
                                                                    res.status(404).json({
                                                                        success: false,
                                                                        message: 'Representative not found'
                                                                    })
                                                                }
                                                                snapshot.forEach(doc => {
                                                                    const {fromDate,group,title,toDate,type} = doc.data()
                                                                    let test={
                                                                        fromDate:fromDate,
                                                                        group:group,
                                                                        title:title,
                                                                        toDate:toDate,
                                                                        type:type
                                                                    }
                                                                    console.log(test)
                                                                    roless.push(test)
                                                                })
                                                                res.status(200).json({
                                                                    success: true,
                                                                    data: roless
                                                                })
                                                            })

                                                    }
                                                    // res.status(200).json({
                                                    //     success: true,
                                                    //     data: "NOTHING!"
                                                    // })

                                                })
                                                .catch(err => {
                                                    res.status(400).json({
                                                        success: false,
                                                        message: err
                                                    })
                                                })
                                        })

                                }
                                // res.status(200).json({
                                //     success: true,
                                //     data: "NOTHING!"
                                // })

                            })
                            .catch(err => {
                                res.status(400).json({
                                    success: false,
                                    message: err
                                })
                            })
                    })

            }
            // res.status(200).json({
            //     success: true,
            //     data: "NOTHING!"
            // })

        })
        .catch(err => {
            res.status(400).json({
                success: false,
                message: err
            })
        })
}