const {getAllUsers} = require("../controllers/usersInfoCon")

const router = require("express").Router();
router.get("/allusers/:id",getAllUsers)

module.exports = router