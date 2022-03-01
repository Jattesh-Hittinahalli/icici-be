const { check, body, validationResult } = require("express-validator");

exports.validateSignupRequest = [
    check("firstName")
        .notEmpty()
        .withMessage("firstName is required"),
    check("email")
        .isEmail()
        .withMessage("Valid Email is required"),
    check("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 character long"),
    check("PhoneNo")
        .notEmpty()
        .withMessage("Phone no is required")
];
exports.validatepassword = [
    check("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 character long"),
];

exports.validateSigninRequest = [
    check("email")
        .isEmail()
        .withMessage("Valid Email is required"),
    check("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 character long")
];
exports.validateVerifyRequest = [
    check("PolicyNumber")
        .isAlphanumeric()
        .withMessage("PolicyNumber Should be Alphanumeric"),
    check("firstName")
        .notEmpty()
        .withMessage("firstName is required"),
    check("VerifiersID")
        .notEmpty()
        .withMessage("VerifiersID is required"),
    check("CustomerName")
        .notEmpty()
        .withMessage("Valid Email is required"),
    check("PhoneNumber")
        .isLength({ min: 10 })
        .isMobilePhone()
        .withMessage("Valid Phone Number is required"),
    check("Source")
        .notEmpty()
        .withMessage("Source  is required")
];

exports.isRequestValidated = (req, res, next) => {
    console.log(req)
    const errors = validationResult(req);
    if (errors.array().length > 0) {
        return res.status(201).json({ error: errors.array()[0].msg });
    }
    next();
};


