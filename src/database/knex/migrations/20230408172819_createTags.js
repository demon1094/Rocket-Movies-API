exports.up = knex => knex.schema.createTable('tags', table => {
  table.increments('id').notNullable()
  table.integer('movie_id').references('id').inTable('movies')
  table.integer('user_id').references('id').inTable('users')
  table.text('name')
})

exports.down = knex => knex.schema.dropTable('tags')
