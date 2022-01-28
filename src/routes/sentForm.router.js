const SentFormController = require('../controllers/sentForm.controller')

const router = require('express').Router()

router
  .get('/:uuid', SentFormController.checkForm, SentFormController.getPriceRanges)
    .get('/delivery/:uuid', SentFormController.checkForm, SentFormController.deliverForm)
      .patch('/:uuid', SentFormController.checkForm, SentFormController.fillingForm)

module.exports = router;
