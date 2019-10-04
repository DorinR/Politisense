export const signUp = (newUser) => {
    return(dispatch, getState, {getFirebase, getFireStore}) => {
      const firebase = getFirebase();
      const firestore = getFireStore();
  
      firebase.auth.createUserWithEmailAndPassword(
        newUser.email,
        newUser.password
      ).then((resp) => {
        return firestore.collection('users').doc(resp.user.uid).set({
          fistName: newUser.firstName,
          lastName: newUser.lastName,
        })   
       }).then(() => {
         dispatch({ type: 'SIGNUP_ACCESS'})
       }).catch(err => {
         dispatch({ type: 'SIGNUP_ERROR', err})
       })
  
    }
  }
