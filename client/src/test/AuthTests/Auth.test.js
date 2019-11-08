import {describe} from "mocha";
const { check } = require('../../../../Controllers/UserController')
const assert = require('assert')

describe ('checks if email existed or not',function () {
    it('should return either true or false as success and message as data',function () {
        // call the function
        let req = {
            body:{
                email:"james_bond12@gmail.com"
            }
        }
        let res={}
        check(req,res)
    })
})