const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
    {
        PolicyNumber:{
            type:String
        },
        CustomerName:{
            type:String
        },
        PhoneNumber:{
            type:String
        },
        VerifiersNamee:{
            type:String
        },
        Source:{
            type:String
        },
        AdmittedSigneture:{
            type:String
        },
        QuestionedSigneture:{
            type:String
        },
        LineMatch:{
            type:String
        },
        CurveMatch:{
            type:String
        },
        AngelMatch:{
            type:String
        },
        SpacingMatch:{
            type:String
        },
        Remarks:{
            type:String
        }

    },
    { timestamps: true }
);

module.exports = mongoose.model('SignLog', userSchema);