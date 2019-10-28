import {Firestore} from "../client/src/Firebase";

exports.userSignup = (req, res) => {

  const user = {
    firstname:req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    postalCode: req.body.postalCode
  }

  let db = new Firestore();
  db.User()
      .insert(user)
      .then(
          ()=>{
            console.log("user is registered in the database")
          }
      )
      .catch(err => {
        console.log("Error getting documents", err);
      });
}
