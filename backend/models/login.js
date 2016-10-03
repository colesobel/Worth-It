let knex = require('../db/knex')
let bcrypt = require('bcrypt')
let loginService = require('./loginService')

let login = {
    signup: function (userInfo) {
        return loginService.checkForExistingUsername(userInfo.username).then(exists => {
            if (!exists) {
                return loginService.encryptPassword(userInfo.password).then(hashedPass => {
                    return knex.raw(`insert into users values (default, '${userInfo.firstName}', '${userInfo.lastName}', '${userInfo.username}', '${hashedPass}')`).then(() => {
                        return knex.raw(`select id from users where username = '${userInfo.username}'`)
                    })
                })
            } else {
                return new Promise((resolve, reject) => {resolve(false)})
            }
        })
    },
    login: function(userInfo) {
        return loginService.gethashedPassword(userInfo.username, userInfo.password)
    },
    addDefaultExpenseCategories: user_id => {
        return new Promise((resolve, reject) => {
            let expenseCategories = [{name: 'housing', percentage: 24}, {name: 'utilities', percentage: 8}, {name: 'food', percentage: 14}, {name: 'clothing', percentage: 4}, {name:'healthcare', percentage: 6}, {name:'miscellaneous', percentage: 16}, {name:'savings', percentage: 9}, {name:'entertainement', percentage: 5}, {name:'transportation', percentage: 14}]
            let databaseArray = []
            expenseCategories.forEach(exp => {
                databaseArray.push(knex.raw(`insert into expense_categories values (default, ${user_id}, '${exp.name}', ${exp.percentage})`))
            })

            Promise.all(databaseArray).then(() => {
                resolve()
            }).catch(e => console.log(e))
        })
    },

    getUserInfo: user_id => {
        return knex.raw(`select first_name, last_name, username from users where id = ${user_id}`)
    }
}

module.exports = login