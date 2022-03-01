const jwt = require("jsonwebtoken");
var multer = require("multer");
var path = require('path');
const pa = path.join(__dirname, "uploads")

exports.requiredsignin = (req, res, next) => {
    const token = req.headers.token;
    if (!req.headers.token)
        return res.status(400).json({
            message: "Please Enter Your Sign in token ",
        });
    jwt.verify(token, process.env.JWT_SECRET, function (err, data) {
        if (err)
            return res.status(400).json({
                message: "Access denied",
            });

        if (data) {
            req.User = data;
        }
    });
    next();
};

exports.verifyadmin = (req, res, next) => {
    if (req.User.role === "admin") {
        next();
    } else {
        return res.status(400).json({
            message: "You are Not Admin",
        });
    }
};


exports.multiplefile = (req, res, next) => {

    var storage = multer.diskStorage({
        // destination: function (req, file, cb) {
        //     cb(null, path.join(path.dirname(__dirname), "uploads"));
        // },
        destination: function (req, file, cb) {
            cb(null, './uploads')
        },
        // filename: (req, files, cb) => {
        //     cb(null, "img" + Date.now() + files.originalname);
        // },
        filename: (req, file, cb) => {
            return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
        },
        pathName: (req, files, cb) => {
            cb(null, pa + files.originalname);
        }
    });
    var upload = multer({ storage: storage });
    return upload.array("productimage", 10)


};

exports.multiplefilewithlocation = (req, res, next) => {

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.join(path.dirname(__dirname), "uploads"));
        },
        // destination: function (req, file, cb) {
        //     cb(null, './uploads')
        // },
        // filename: (req, files, cb) => {
        //     cb(null, "img" + Date.now() + files.originalname);
        // },
        filename: (req, file, cb) => {
            return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
        },
        pathName: (req, files, cb) => {
            cb(null, pa + files.originalname);
        }
    });
    var upload = multer({ storage: storage });
    return upload.array("productimage", 10)


};