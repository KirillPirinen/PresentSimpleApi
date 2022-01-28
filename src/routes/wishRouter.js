const wishRouter = require('express').Router()
const { allUserProfile, addNewWish, editWish, deleteWish, wishToggleStatusByOwner, unBindWish, giveWish } = require('../controllers/wishController')
const upload = require('../middleware/uploadMulter')

wishRouter.get('/', allUserProfile)
            .post('/wish', upload.single('photo'), addNewWish)
             .put('/wish', upload.single('photo'), editWish)
                .delete('/wish/:id', deleteWish)
                  .patch('/wish/own/:id', wishToggleStatusByOwner)
                    .patch('/wish/given/:id', giveWish)
                      .patch('/wish/revert/:id', unBindWish)

module.exports = wishRouter;
