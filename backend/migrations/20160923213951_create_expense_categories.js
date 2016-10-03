exports.up = function(knex, Promise) {
  return knex.schema.createTable('expense_categories', function(table){
    table.increments();
    table.integer('user_id');
    table.string('expense_category');
    table.integer('percentage')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('expense_categories');
};