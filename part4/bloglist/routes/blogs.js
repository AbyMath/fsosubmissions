const express = require('express')
const blogsController = require('../controllers/blogs')
const middleware = require('../utils/middleware')

const router = express.Router()

router.get('/', blogsController.getAll)
router.get('/:id', blogsController.getById)

router.post(
  '/',
  middleware.userExtractor,
  blogsController.create
)

router.put('/:id', blogsController.update)

router.delete(
  '/:id',
  middleware.userExtractor,
  blogsController.remove
)

module.exports = router