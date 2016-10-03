let knex = require('../db/knex')
let DailyExpensesService = require('./dailyExpensesService')

let dailyExpenses = {
    addExpense: userInfo => {
        return new Promise((resolve, reject) => {
            let uploadArray = DailyExpensesService.createUploadExpensesArray(userInfo)
            console.log(uploadArray)
            Promise.all(uploadArray).then(() => resolve()).catch(e => console.log(e))
        })
    },

    getGaugeStats: user_id => {
        return new Promise((resolve, reject) => {
            DailyExpensesService.gaugeQuery(user_id).then(gaugeStats => {
                console.log(gaugeStats)
                resolve(gaugeStats)
            })
        })
    },

    getDailyAverages: user_id => {
            return knex.raw(`select user_id, day, avg(expense_amount)from daily_expenses where user_id = ${user_id} and month = 'September' and year = 2016 group by user_id, day`)
    }
}

module.exports = dailyExpenses