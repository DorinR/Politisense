// import * as ridingCodes from './ridingCodes'
const ridingCodes = require('./ridingCodes').ridingCodes

console.log('hello')

ridingCodes.forEach((item, index) => {
  console.log(index, item)
})
