const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        PolicyNumber: {
            type: String
        },
        CustomerName: {
            type: String
        },
        PhoneNumber: {
            type: String
        },
        VerifiersName: {
            type: String
        },
        VerifiersID: {
            type: String
        },
        Source: {
            type: String
        },
        AdmittedSigneture1: {
            type: JSON
        },

        AdmittedSigneture2: {
            type: String
        },
        Matched: {
            type: String
        },
        percentage: {
            type: String
        },
        distance: {
            type: String
        },
        error: {
            type: String
        },
        threshold: {
            type: String
        },
        difference: {
            type: String
        },
        resp_img1: {
            type: String
        },
        resp_img2: {
            type: String
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model('verifytransition', userSchema);