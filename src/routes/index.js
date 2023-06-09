const { Router } = require('express')

const usersRouter = require('./user.routes')
const moviesRouter = require('./movies.routes')
const tagsRouter = require('./tags.routes')

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/movies', moviesRouter)
routes.use('/tags', tagsRouter)

module.exports = routes