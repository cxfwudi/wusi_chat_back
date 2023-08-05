const {setAvatar} = require("../controllers/usersAvatarCon")

const router = require("express").Router();
router.post("/setAvatar/:id",setAvatar)

module.exports = router