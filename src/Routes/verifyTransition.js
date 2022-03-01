const express = require("express");
const { verifyTransition, createPDF, allTransition, toexcel } = require("../Controller/verifyTransition");
const { multiplefile, multiplefilewithlocation } = require("../common-middleware/index")
const { validateSignupRequest, isRequestValidated, validateSigninRequest, validatepassword, validateVerifyRequest } = require('../validators/auth');
const router = express.Router();

router.use('/profile', express.static('uploads'));
router.use('/profile', express.static('src//uploads'));
router.post("/Verify/Transition", multiplefilewithlocation(), verifyTransition);
router.post("/create/pdf", createPDF);
router.post("/TransitionList", allTransition);
router.post("/excel", toexcel);
// router.post("/Senddata", multiplefilewithlocation(), senddata);


router.get('/fetch-pdf', (req, res) => {
    res.sendFile(`${process.cwd()}/result.pdf`)
})


module.exports = router;