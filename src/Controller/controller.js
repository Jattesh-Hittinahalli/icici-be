const User = require("../Model/model");

exports.createProduct = (req, res) => {
    const { PolicyNumber,
        CustomerName,
        PhoneNumber,
        VerifiersNamee,
        Source,
        AdmittedSigneture,
        QuestionedSigneture,
        LineMatch,
        CurveMatch,
        AngelMatch,
        SpacingMatch,
        Remarks
    } = req.body;

    const _user = new User({
        PolicyNumber,
        CustomerName,
        PhoneNumber,
        VerifiersNamee,
        Source,
        AdmittedSigneture,
        QuestionedSigneture,
        LineMatch,
        CurveMatch,
        AngelMatch,
        SpacingMatch,
        Remarks
    });

    _user.save((error, data) => {
        if (error) {
            return res.status(400).json({
                message: error
            });
        }
        if (data) {
            return res.status(201).json({
                data
            });
        }
    });


};


exports.getDetails = (req, res) => {
    if (req.headers.token) {
        if (req.headers.token === "$2b$10$4GYYrR890sV1Ug0eJR20tuWwlDAQ79DLXJkgJANRgTpBHqW8g6rEi") {
            console.log(req.headers.token)
            const data = (req.query)
            const policyNumber = data.PolicyNumber
            console.log(policyNumber)
            User.find({ PolicyNumber: policyNumber }).exec((error, Products) => {
                if (error) return res.status(400).json({ error });
                if (Products) {
                    res.status(200).json({ Products });
                }
            });

        }
        else {
            return res.status(400).json({
                message: "Invalied Token"
            })
        }

    }
    else {
        return res.status(400).json({
            message: "Please Send Token In Header"
        })

    }

};
exports.verifyTransition = (req, res) => {
    const img = req.file.path;
    const { Name, categoryId, productCode } = req.body
    const _displayProduct = new displayProduct({
        Name,
        categoryId,
        productCode,
        img
    });

    _displayProduct.save((error, data) => {
        if (error) {
            return res.status(400).json({
                message: error
            });
        }
        if (data) {
            return res.status(201).json({
                message: data,
            });
        }
    });
}