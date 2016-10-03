let knex = require('../db/knex')
// let DailyExpensesService = require('./dailyExpensesService')

let home = {
    getDailyAverage: (user_id, currentMonth) => {
        return new Promise((resolve, reject) => {
            return knex.raw(`select day, avg(expense_amount) as average 
            from daily_expenses 
            where user_id = ${user_id} and month = '${currentMonth}' 
            group by day`).then(averages => resolve(averages.rows))
        })
    }
}

module.exports = home