const { Router } = require('express')
const MoviesController = require('../controllers/MoviesController')

const moviesRoutes = Router()

const moviesController = new MoviesController()

moviesRoutes.post('/', moviesController.create)
moviesRoutes.delete('/:id', moviesController.delete)

module.exports = moviesRoutes