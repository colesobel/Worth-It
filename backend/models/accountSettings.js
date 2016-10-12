'use strict'
let knex = require('../db/knex')
let AccountSettingsService = require('./accountSettingsService')

let accountSettings = {
    getExpenseCategories: user_id => {
        return knex.raw(`select id, expense_category, percentage from expense_categories where user_id = ${user_id}`)
    },

    addExpenseCategory: (user_id, category) => {
        return knex.raw(`insert into expense_categories values (default, ${user_id}, '${category}')`)
    },

    deleteExpenseCategory: (user_id, catId) => {
        return knex.raw(`delete from expense_categories where user_id = ${user_id} and id = ${catId}`)
    },

    updateExpenseCategories: userInfo => {
        return new Promise((resolve, reject) => {
            return knex.raw(`delete from expense_categories where user_id = ${userInfo.user_id}`).then(() => {
                let expenseCategoryUploads = AccountSettingsService.createExpenseCategoriesArray(userInfo)
                Promise.all(expenseCategoryUploads).then(() => resolve())
            })
        })
    },

    addFixedExpenses: (userInfo) => {
        return new Promise((resolve, reject) => {
            let expenseUploads = AccountSettingsService.createFixedExpenseArray(userInfo)
            Promise.all(expenseUploads).then(() => resolve())
        })
    },

    getFixedExpenses: (user_id) => {
        return knex.raw(`select id, expense_category, expense_amount from fixed_expenses where user_id = ${user_id}`)
    },

    deleteFixedExpense: id => {
      return knex.raw(`delete from fixed_expenses where id = ${id}`)
    },

    enterIncome: (incomeInfo) => {
        return knex.raw(`insert into user_income values (default, ${incomeInfo.user_id}, ${incomeInfo.income})`)
    },

    getIncome: user_id => {
        return knex.raw(`select monthly_income from user_income where user_id = ${user_id}`)
    },

    updateIncome: userInfo => {
        return knex.raw(`update user_income set monthly_income = ${userInfo.income} where user_id = ${userInfo.user_id}`)
    },

    addExtraIncome: userInfo => {
      return knex.raw(`insert into extra_income values (default, ${userInfo.user_id}, '${userInfo.memo}', ${userInfo.amount}, '${userInfo.month}', ${userInfo.year})`)
    },

    getExtraIncome: userInfo => {
      return knex.raw(`select * from extra_income where user_id = ${userInfo.user_id} and month = '${userInfo.month}' and year = ${userInfo.year}`)
    },

    deleteExtraIncome: id => {
      return knex.raw(`delete from extra_income where id = ${id}`)
    },

    updateExtraIncome: userInfo => {
      return knex.raw(`update extra_income set memo = '${userInfo.memo}', amount = ${userInfo.amount} where id = ${userInfo.id}`)
    }

}

module.exports = accountSettings
