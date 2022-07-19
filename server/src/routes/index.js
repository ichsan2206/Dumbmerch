const express = require("express");

const router = express.Router();

const {uploadFile} = require("../midleware/uploadFIle")

// validate token
const {auth} = require("../midleware/auth")

// Controller Import
const {getUsers, register, checkAuth, login, deleteUser, updateUser, getUser} = require("../controlers/user");
const {getProduct, addProduct, detailProduct, updateProduct, deleteProduct} = require("../controlers/product");
const {addTransaction, getTransactions, notification } = require("../controlers/transaction");
const { addCategory, getCategorys, getCategory, deleteCategory, updateCategory } = require("../controlers/category");
const {getProfile, updateProfile} = require("../controlers/profile")

// router User
router.get("/User", getUsers);
router.post("/Register", register);
router.post("/Login", login);
router.get("/User/:id", getUser);
router.delete("/User/:id", deleteUser);
router.patch("/User/:id", updateUser);
router.get('/check-auth', auth, checkAuth);

//router Product
router.get("/Product", auth, getProduct);
router.post("/Product", auth, uploadFile("image"), addProduct);
router.get("/Product/:id", auth, detailProduct);
router.delete("/Product/:id", auth, deleteProduct)
router.patch("/Product/:id",  auth, uploadFile("image"), updateProduct);

//router Category
router.post("/Category", auth, addCategory);
router.get("/Category", auth, getCategorys);
router.get("/Category/:id", auth, getCategory);
router.delete("/Category/:id", auth, deleteCategory);
router.patch("/Category/:id", auth, updateCategory);

// Profile
router.get("/Profile",auth, getProfile);
router.patch("/Profile", auth, uploadFile("image"), updateProfile);

//router Transaction
router.post("/Transaction", auth, addTransaction);
router.get("/Transaction", auth, getTransactions);

router.post("/notification", notification);

module.exports = router;
