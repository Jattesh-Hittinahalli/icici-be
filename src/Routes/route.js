const express = require("express");
const { createProduct, getDetails } = require("../Controller/controller");
const { verifyTransition, createPDF } = require("../Controller/verifyTransition");
const { multiplefile } = require("../common-middleware/index")
const router = express.Router();

// router.use('/profile', express.static('uploads'));
// router.post("/Verify/Transition", multiplefile(), verifyTransition);
// router.post("/create-pdf", createPDF);

// router.get('/fetch-pdf', (req, res) => {
//     res.sendFile(`${process.cwd()}/result.pdf`)
// })

router.post("/product/create", createProduct);
router.get("/getDetails", getDetails);
// router.put("/product/update", update);
// router.get("/product/list", getproduct);
// router.delete("/product/delete", deleteproduct);

module.exports = router;