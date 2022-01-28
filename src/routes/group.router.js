const { Router } = require("express");
const groupController = require("../controllers/group.controller");

const groupRouter = Router();

groupRouter.get("/:user_id", groupController.allWishes)
              .get("/info/:id", groupController.getGroupInfo)
                .post("/", groupController.checkWish, groupController.addGroup)
                  .patch("/alone/", groupController.checkWish, groupController.addAlone)
                    .patch("/", groupController.joinGroup)
                      .patch("/leave/:id", groupController.leaveGroup)
                        .patch("/edit/:id", groupController.checkRights, groupController.editGroup)
                          .delete("/:id", groupController.checkRights, groupController.deleteGroup)

module.exports = groupRouter;

