
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('brew_casks', function(table) {
      table.string('name').primary();
    }),

    knex.schema.createTable('brew_formulas', function(table) {
      table.string('name').primary();
    }),

    knex.schema.createTable('node_modules', function(table) {
      table.string('name').primary();
    }),

    knex.schema.createTable('node_versions', function(table) {
      table.string('name').primary();
    }),

    knex.schema.createTable('python_versions', function(table) {
      table.string('name').primary();
    }),

    knex.schema.createTable('python_packages', function(table) {
      table.string('name').primary();
    }),

    knex.schema.createTable('ruby_versions', function(table) {
      table.string('name').primary();
    }),

    knex.schema.createTable('ruby_gems', function(table) {
      table.string('name').primary();
    }),

    knex.schema.createTable('updates', function(table) {
      table.string('name').primary();
      table.timestamp('updated_at');
    }).then(function() {
      return knex.insert([
        {name: 'brew_casks'},
        {name: 'brew_formulas'},
        {name: 'node_modules'},
        {name: 'node_versions'},
        {name: 'python_versions'},
        {name: 'python_packages'},
        {name: 'ruby_versions'},
        {name: 'ruby_gems'}
      ]).into('updates');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('brew_casks'),
    knex.schema.dropTable('brew_formulas'),
    knex.schema.dropTable('node_modules'),
    knex.schema.dropTable('node_versions'),
    knex.schema.dropTable('python_packages'),
    knex.schema.dropTable('python_versions'),
    knex.schema.dropTable('ruby_gems'),
    knex.schema.dropTable('ruby_versions'),
    knex.schema.dropTable('updates')
  ]);
};
