let knex = require('../db/knex')
let DailyExpensesService = require('./dailyExpensesService')

let dailyExpenses = {
    addExpense: userInfo => {
        return new Promise((resolve, reject) => {
            let uploadArray = DailyExpensesService.createUploadExpensesArray(userInfo)
            Promise.all(uploadArray).then(() => resolve()).catch(e => console.log(e))
        })
    },

    getGaugeStats: (user_id, monthName, year) => {
        return new Promise((resolve, reject) => {
            DailyExpensesService.gaugeQuery(user_id, monthName, year).then(gaugeStats => {
                console.log(gaugeStats)
                resolve(gaugeStats)
            })
        })
    },

    getDailyAverages: (user_id, month) => {
            return knex.raw(`select user_id, day, sum(expense_amount) as sum from daily_expenses where user_id = ${user_id} and month = '${month}' and year = 2016 group by user_id, day`)
    },

    getHeatmap: userInfo => {
      return knex.raw(`select user_id, expense_category, day, sum(expense_amount) as spend_total
        from daily_expenses
        where user_id = ${userInfo.user_id} and month = '${userInfo.month}' and year = ${userInfo.year}
        group by user_id, expense_category, day`)
    }
}

module.exports = dailyExpenses
