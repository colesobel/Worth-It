exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_income', function(table){
    table.increments();
    table.integer('user_id');
    table.integer('monthly_income');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('user_income');
};