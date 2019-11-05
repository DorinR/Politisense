exports.getInstance = (
  email,
  firstname,
  lastname,
  password,
  postalCode,
  riding,
  categories
) => {
  return {
    email,
    firstname,
    lastname,
    password,
    postalCode,
    riding,
    categories
  }
}
