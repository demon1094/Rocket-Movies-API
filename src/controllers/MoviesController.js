const knex = require('../database/knex')

class MoviesController {
  async create(request, response) {
    const { user_id, title, description, rating, tags } = request.body

    const [movie_id] = await knex('movies').insert({
      title,
      description,
      rating,
      user_id
    })

    const tagsInsert = tags.map(name => {
      return {
        movie_id,
        name,
        user_id
      }
    })

    await knex('tags').insert(tagsInsert)

    return response.status(201).json()
  }

  async show(request, response) {
    const { id } = request.params

    const movies = await knex('movies').where({ id }).first()
    const tags = await knex('tags').where({ movie_id: id }).orderBy('id')

    return response.json({
      ...movies,
      tags
    })
  }

  async delete(request, response) {
    const { id } = request.params

    await knex('movies').where({ id }).delete()

    return response.json()
  }
}

module.exports = MoviesController