const express = require("express");
const router = express.Router();

const { aunthenticateUser } = require("../app/middlewares/authentication");

const usersController = require("../app/controllers/usersController");
const contactsController= require ('../app/controllers/contactsController')

router.post("/register", usersController.register);
router.post('/login' ,usersController.login)
router.delete('/logout', aunthenticateUser,usersController.logout)

router.post('/contact', aunthenticateUser, contactsController.create)
router.get('/contacts', aunthenticateUser, contactsController.list)
router.put('/contact/:id', aunthenticateUser, contactsController.update)
router.delete('/contact/:id', aunthenticateUser, contactsController.destroy)

module.exports = router;
