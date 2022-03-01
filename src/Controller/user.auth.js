const User = require("../model/user");
// const User = require("../views/");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
var hbs = require("nodemailer-express-handlebars");
const AdmZip = require('adm-zip');
var fs = require('fs');
const path = require('path');

exports.signup = (req, res) => {
    User.findOne({ email: req.body.email }).exec(async (error, user) => {
        if (user)
            return res.status(400).json({
                message: "user already exist",
            });
        const { firstName, PhoneNo, email, password } = req.body;
        const hash_password = await bcrypt.hash(password, 10);
        const _user = new User({
            firstName,
            PhoneNo,
            email,
            hash_password,
            username: firstName + "_" + Math.random().toString(36).substring(2),
            role: "user",
        });

        _user.save((error, data) => {
            if (error) {
                return res.status(400).json({
                    message: error
                });
            }

            if (data) {
                return res.status(201).json({
                    message: "user created Successfully..!",
                });
            }
        });
    });
};

exports.signin = (req, res) => {
    User.findOne({ email: req.body.email }).exec(async (error, user) => {
        if (error)
            return res.status(400).json({
                message: "something went wrong",
            });

        if (user)
            var verified = bcrypt.compareSync(req.body.password, user.hash_password);
        if (verified && user.role == "user") {
            console.log(process.env.JWT_SECRET)
            const { _id, firstName, username, role, PhoneNo, Address } = user;
            const { email } = req.body;
            const token = jwt.sign({ email, role, _id }, "Base64Url", {
                algorithm: "HS256",
                expiresIn: "1d",
            });

            return res.status(200).json({
                token: token,
                user: { _id, firstName, Address, PhoneNo, email, username, role },
            });
        } else {
            return res.status(400).json({
                message: "Please Check Email and Password ",
            });
        }
    });
};


exports.update = (req, res) => {
    const { firstName, PhoneNo, email } = req.body;
    const userName = firstName + "_" + Math.random().toString(36).substring(2);
    User.findOne({ _id: req.body._id })
        .exec().then((data) => {
            // if (!data) {
            //     const _user = new User({
            //         title,
            //         author,
            //         gener,
            //         img
            //     });

            //     _user.save((error, data) => {
            //         if (error) {
            //             res.status(400).json({
            //                 message: "Something Went Wrong ...",
            //             });
            //         } else {
            //             res.status(200).json({
            //                 message: "Product is Successfully Added to Cart255...",
            //             });
            //         }
            //     });
            // }
            if (data) {
                User
                    .find(
                        { _id: req._id },
                    ).exec().then((data) => {
                        if (data) {
                            var myquery = { _id: req.body._id };
                            var newvalues = { $set: { firstName: firstName, PhoneNo: PhoneNo, email: email, username: userName } };
                            User
                                .updateOne(myquery, newvalues).exec((error, data) => {
                                    if (error) {
                                        res.status(400).json({
                                            message: "Something went wrong...",
                                        });
                                    } else {
                                        res.status(200).json({
                                            message: "User has Updated"

                                        });
                                    }
                                });
                        }
                    })
            }

        })

}


exports.getuser = (req, res) => {
    User.find({}).exec((error, data) => {
        if (error) return res.status(400).json({ error });
        if (data) {
            return res.status(200).json({ data });

        }
    });
};

exports.deleteuser = (req, res) => {
    console.log(req.body._id)
    if (req.body._id) {
        User.findOneAndDelete({ _id: req.body._id }).then((data) => {
            if (data) {
                return res.status(200).json({
                    data
                })
            }
            else {
                return res.status(400).json(
                    {
                        message: "something went wrong"
                    }

                )

            }
        });
    }
};

exports.mail1 = (req, res) => {
    var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: "jattesh13@gmail.com",
            pass: "Jrh@9686648757"
        }
    });
    const handlebarOptions = {
        viewEngine: {
            extName: ".hbs",
            partialsDir: path.resolve(__dirname, "templates"),
            defaultLayout: false
        },
        // C: \Users\admin\Desktop\Six30Labs\Backend\src\controller\templates\index.hbs
        viewPath: path.resolve(__dirname, "templates"),
        extName: ".hbs"
    };

    transporter.use('compile', hbs(handlebarOptions));

    // // transporter.use('compile', hbs(
    // //     {
    // //         viewEngine: "express-handlebars",
    // //         viewPath: './view/',
    // //         defaultLayout: "main"
    // //         // src\views

    // //     }
    // ))
    var mailOptions = {
        from: "Jattesh13@gmail.com",
        to: "Jattesh13@gmail.com",
        subject: "Youtube tutorial",
        text: "Hello",
        html: '<b>Click <a href="http://localhost:2000/api/download?file=img1623800832181IMG_2618.JPG">Download File</a> to access the Revit File</b>',
        template: 'index'
        // attachments: [
        //     {
        //         filename: 'img1623941390135BIM_Projekt_Golden_Nugget-Architektur_und_Ingenieurbau.rvt',
        //         path: __dirname + '/img1623941390135BIM_Projekt_Golden_Nugget-Architektur_und_Ingenieurbau.rvt' // stream this file
        //     },
        // ]
    }

    transporter.sendMail(mailOptions, function (error, data) {
        if (error) {
            return res.status(400).json(
                {
                    error
                }

            )
        }
        else {
            return res.status(400).json(
                {
                    message: data
                }

            )
        }
    })
}

exports.Multipaledownloadfile = (req, res) => {
    var uploadDir = fs.readdirSync(__dirname + "/uploads/");
    console.log(uploadDir)
    const zip = new AdmZip();
    for (var i = 0; i < uploadDir.length; i++) {
        zip.addLocalFile(__dirname + "/uploads/" + uploadDir[i]);
    }

    const downloadName = `DownloadZipFile.zip`;
    const data = zip.toBuffer();

    // save file zip in root directory
    zip.writeZip(__dirname + "/" + downloadName);
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${downloadName}`);
    res.set('Content-Length', data.length);
    res.send(data);
}

exports.downloadfile = (req, res) => {
    console.log(req.query);
    // var uploadDir = fs.readdirSync(__dirname + "/uploads/");
    // console.log(uploadDir)
    const zip = new AdmZip();
    zip.addLocalFile(__dirname + `/uploads/${req.query.file}`);
    // for (var i = 0; i < uploadDir.length; i++) {
    //     zip.addLocalFile(__dirname + "/uploads/" + uploadDir[i]);
    // }

    const downloadName = `DownloadZipFile.zip`;
    const data = zip.toBuffer();

    // save file zip in root directory
    zip.writeZip(__dirname + "/" + downloadName);
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${downloadName}`);
    res.set('Content-Length', data.length);
    res.send(data);
}
exports.getforgotPassword = (req, res, next) => {

}

exports.postforgotPassword = (req, res, next) => {
    User.findOne({ email: req.body.email }).exec((error, data) => {
        if (error) {
            return res.status(400).json(
                error
            )
        }
        if (data) {
            const secret = process.env.JWT_SECRET + data.hash_password
            const payload = {
                email: data.email,
                id: data._id
            }
            const token = jwt.sign(payload, secret, { expiresIn: '59m' })
            const link = `http://localhost:2000/api/reset/password/${data._id}/${token}`
            var transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                    user: "jattesh13@gmail.com",
                    pass: "Jrh@9686648757"
                }
            });
            const handlebarOptions = {
                viewEngine: {
                    extName: ".hbs",
                    partialsDir: path.resolve(__dirname, "templates"),
                    defaultLayout: false
                },
                // C: \Users\admin\Desktop\Six30Labs\Backend\src\controller\templates\index.hbs
                viewPath: path.resolve(__dirname, "templates"),
                extName: ".hbs"
            };

            transporter.use('compile', hbs(handlebarOptions));

            // // transporter.use('compile', hbs(
            // //     {
            // //         viewEngine: "express-handlebars",
            // //         viewPath: './view/',
            // //         defaultLayout: "main"
            // //         // src\views

            // //     }
            // ))
            var mailOptions = {
                from: "Jattesh13@gmail.com",
                to: "Jattesh13@gmail.com",
                subject: "Youtube tutorial",
                text: "Hello",
                html: '<b>Click <a href=' + link + '>Reset Password</a> to access the Revit File</b>',
                template: 'index'
                // attachments: [
                //     {
                //         filename: 'img1623941390135BIM_Projekt_Golden_Nugget-Architektur_und_Ingenieurbau.rvt',
                //         path: __dirname + '/img1623941390135BIM_Projekt_Golden_Nugget-Architektur_und_Ingenieurbau.rvt' // stream this file
                //     },
                // ]
            }

            transporter.sendMail(mailOptions, function (error, data) {
                if (error) {
                    return res.status(400).json(
                        {
                            error
                        }

                    )
                }
                else {
                    return res.status(200).json(
                        {
                            data: data
                        }

                    )
                }
            })
        }

    })


}
exports.getresetPassword = (req, res, next) => {
    const { id, token } = req.params
    console.log(id, token)
    User.findOne({ _id: id }).exec((error, data) => {
        if (error) {
            return res.status(400).json(
                error
            )
        }
        if (data) {
            const secret = process.env.JWT_SECRET + data.hash_password
            try {
                const payload = jwt.verify(token, secret)
                return res.status(400).json(
                    payload
                )
            } catch (error) {

                return res.status(400).json(
                    error
                )
            }

        }

    })

}
exports.postresetPassword = (req, res, next) => {
    const { password, newpassword } = req.body
    console.log(password, newpassword)
    const { id, token } = req.params
    User.findOne({ _id: id }).exec(async (error, data) => {
        if (error) {
            return res.status(400).json(
                error
            )
        }
        if (data) {

            const secret = process.env.JWT_SECRET + data.hash_password
            try {
                const payload = jwt.verify(token, secret)
                if (password === newpassword) {
                    const hash_password = await bcrypt.hash(password, 10);
                    User.findOneAndUpdate({ _id: id },
                        { hash_password: hash_password }, null, function (err, data) {
                            if (err) {
                                return res.status(400).json({
                                    error
                                })
                            }
                            else {
                                return res.status(200).json({
                                    data
                                })
                            }
                        });
                }
                else {
                    return res.status(400).json({
                        message: "Password are Not Matched"
                    })
                }
            } catch (error) {

                return res.status(400).json({
                    message: error
                })
            }

        }

    })

}