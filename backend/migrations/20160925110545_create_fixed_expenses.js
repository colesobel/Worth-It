exports.up = function(knex, Promise) {
  return knex.schema.createTable('fixed_expenses', function(table){
    table.increments();
    table.integer('user_id');
    table.string('expense_category');
    table.integer('expense_amount');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('fixed_expenses');
};