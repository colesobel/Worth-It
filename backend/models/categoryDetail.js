let knex = require('../db/knex')

let categoryDetail = {
  getStats: (user_id, month, category) => {
    return knex.raw(`select distinct ec.user_id,
            ec.expense_category,
            ec.id,
            ec.percentage as desired_spend_percentage,
            coalesce(round(sum(de.expense_amount) / (select sum(expense_amount) from daily_expenses where user_id = ${user_id} and month = '${month}')::float * 100), 0) as spend_percentage,
            round(ec.percentage / 100::float * (select sum(expense_amount) from daily_expenses where user_id = ${user_id} and month = '${month}')) as desired_spend_total,
            coalesce(sum(de.expense_amount), 0) as spend_total,
            ui.monthly_income,
            coalesce(fe.expense_amount, 0) as fixed_expense_amount
            from expense_categories ec
            left join (select * from daily_expenses where user_id = ${user_id} and month = '${month}') de on ec.user_id = de.user_id and ec.expense_category = de.expense_category
            left join (select user_id, monthly_income from user_income where user_id = ${user_id}) ui on ec.user_id = ui.user_id
            left join (select user_id, expense_category, expense_amount from fixed_expenses where user_id = ${user_id}) fe on ec.user_id = fe.user_id and ec.expense_category = fe.expense_category
            where ec.user_id = ${user_id}
            and ec.expense_category = '${category}'
            group by ec.user_id, ec.expense_category, ec.id, ec.percentage, ui.monthly_income, fixed_expense_amount`)
  },

  purchaseHistory: (user_id, month, category) => {
    return knex.raw(`select * from daily_expenses where user_id = ${user_id} and month = '${month}' and expense_category = '${category}' order by unix_timestamp desc, id desc`)
  },

  deletePurchase: id => {
    return knex.raw(`delete from daily_expenses where id = ${id}`)
  },

  updatePurchase: userInfo => {
    return knex.raw(`update daily_expenses set expense_amount = ${userInfo.expense_amount}, memo = '${userInfo.memo}', day = '${userInfo.day}', month = '${userInfo.month}', year = ${userInfo.year}, full_date = '${userInfo.full_date}' where id = ${userInfo.id}`)
  }
}


module.exports = categoryDetail
