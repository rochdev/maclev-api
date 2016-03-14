
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('python_versions', function(table) {
      table.string('name').primary();
    }),

    knex.schema.createTable('python_packages', function(table) {
      table.string('name').primary();
    }),

    knex.insert([
      {name: 'python_versions'},
      {name: 'python_packages'}
    ]).into('updates')
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('python_versions'),
    knex.schema.dropTable('python_packages'),

    knex('updates')
      .whereIn('name', ['python_versions', 'python_packages'])
      .delete()
  ]);
};
