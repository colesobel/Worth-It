exports.up = function(knex, Promise) {
  return knex.schema.createTable('extra_income', function(table){
    table.increments();
    table.integer('user_id');
    table.string('memo');
    table.integer('amount');
    table.string('month');
    table.integer('year');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('extra_income');
};
