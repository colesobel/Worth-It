exports.up = function(knex, Promise) {
  return knex.schema.createTable('daily_expenses', function(table){
    table.increments();
    table.integer('user_id');
    table.string('expense_category');
    table.integer('expense_amount');
    table.string('memo');
    table.string('day');
    table.string('month');
    table.integer('year');
    table.string('full_date');
    table.bigint('unix_timestamp');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('daily_expenses');
};
