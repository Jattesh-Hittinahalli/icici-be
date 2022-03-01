const express = require('express');
const { signup, signin, update, getuser, deleteuser, mail1, downloadfile,
    Multipaledownloadfile, postresetPassword, getforgotPassword, getresetPassword, postforgotPassword } = require('../Controller/user.auth');
const { validateSignupRequest, isRequestValidated, validateSigninRequest, validatepassword } = require('../validators/auth');
const { requiredsignin, verifyadmin } = require("../common-middleware/index")
const router = express.Router();
var multer = require("multer");
var path = require('path');
const pa = path.join(__dirname, "uploads")
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, files, cb) => {
        cb(null, "img" + Date.now() + files.originalname);
    },
    pathName: (req, files, cb) => {
        cb(null, pa + files.originalname);
    }
});
var upload = multer({ storage: storage });

// router.post(
//     "/createBook",
//     upload.single("productimage", 10),
//     createBook
// );


router.post('/signup', validateSignupRequest, isRequestValidated, signup);
router.post('/signin', validateSigninRequest, isRequestValidated, signin);
router.put('/update', validateSignupRequest, isRequestValidated, requiredsignin, verifyadmin, update);
router.get('/user/list', getuser);
router.get('/mail', mail1);
router.get('/download', downloadfile);
router.get('/Multipaledownloadfile', Multipaledownloadfile);
router.delete('/user/delete', deleteuser);
// router.get('/forgot/password', getforgotPassword);
router.post('/forgot/password', postforgotPassword);
router.get('/reset/password/:id/:token', getresetPassword);
router.post('/reset/password/:id/:token', validatepassword, isRequestValidated, postresetPassword);



// router.post('/profile', requireSignin, (req, res) => {
//     res.status(200).json({ user: 'profile' })
// });

module.exports = router;