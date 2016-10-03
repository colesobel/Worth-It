let knex = require('../db/knex')
let bcrypt = require('bcrypt')

let loginService = {
    checkForExistingUsername: username => {
        return new Promise((resolve, reject) => {
            return knex.raw(`select * from users where username = '${username}'`).then(user => {
                if (user.rows.length > 0) {
                    resolve({
                        userId: user.rows[0].id,
                        hash: user.rows[0].password
                    })
                } else {
                    resolve(false)
                }
            })
        })
    },

    encryptPassword: password => {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, function(err, hash) {  
                resolve(hash)
            })
        })
    },

    gethashedPassword: (username, password) => {
        return new Promise((resolve, reject) => {
            loginService.checkForExistingUsername(username).then(user => {
                if (user) {
                    loginService.comparePassword(password, user.hash).then(compared => {
                        return compared ? resolve(user.userId) : resolve(false)
                    })
                } else {
                    resolve(user)
                }
            })
        })
    },

    comparePassword: (password, hash) => {
        console.log(password)
        console.log(hash)
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, function(err, res) {
                console.log(res)
                resolve(res)
            });
        })
    }
}

module.exports = loginService