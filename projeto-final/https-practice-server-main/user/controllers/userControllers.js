const express = require("express");
const router = express.Router();
const userService = require("../services/userServices");

router.get("/", userService.getAllUsers);

// router.get('/:id', userService.getOneUser)

router.post("/create", userService.createUser);

router.patch("/update/:id", userService.updateUser);

router.delete("/del/:id", userService.deleteUser);

module.exports = router;
