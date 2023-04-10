const { Router } = require('express')
const TagsController = require('../controllers/TagsController')

const tagsRoutes = Router()

const tagsController = new TagsController()

tagsRoutes.get('/', tagsController.index)
tagsRoutes.delete('/', tagsController.delete)

module.exports = tagsRoutes