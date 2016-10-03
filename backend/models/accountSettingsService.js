let knex = require('../db/knex')

let accountSettings = {
    createFixedExpenseArray: fixedExpenses => {
        let finalArray = []
        for (let exp in fixedExpenses.fixed_expenses) {
            finalArray.push(knex.raw(`insert into fixed_expenses values (default, ${fixedExpenses.user_id}, '${fixedExpenses.fixed_expenses[exp].expenseCategory}', ${fixedExpenses.fixed_expenses[exp].amount})`)) 
        }
        return finalArray
    },

    createExpenseCategoriesArray: expCats => {
        let finalArray = []
        for (let exp in expCats.expenseCategories) {
            finalArray.push(knex.raw(`insert into expense_categories values (default, ${expCats.user_id}, '${expCats.expenseCategories[exp].expense_category}', ${expCats.expenseCategories[exp].percentage})`))
        }
        return finalArray
    }
}

module.exports = accountSettings