const router = require('express').Router()
const PresentsController = require('../controllers/presents.controller');
router  
  .get('/:uuid', PresentsController.checkForm, PresentsController.getAllPresents)
    .patch('/:uuid', PresentsController.checkForm, PresentsController.bindPresent)
      .patch('/revert/:id', PresentsController.unbindPresent)
        .patch('/given/:id', PresentsController.givePresent)
  module.exports = router;
