const verifyTransition = require("../Model/verifyTransition");
const pdf = require('html-pdf');
const pdfTemplate = require('../document/index');
const ExcelJs = require('exceljs')
var fs = require('fs');
// const request = require('request');
const request = require("request-promise");
http = require('http');
https = require('https');
var Stream = require('stream').Transform;




// Function to check letters and numbers
// exports.senddata = async (req, res) => {

exports.verifyTransition = async (req, res) => {
    const { PolicyNumber, CustomerName, PhoneNumber, VerifiersName, VerifiersID, Source } = req.body
    console.log(req.files)


    const isAlphanumeric = alphanumeric(PolicyNumber)

    if (isAlphanumeric == false) {
        res.status(400).json({
            message: "PolicyNumber Number Should be AlphaNumeric"
        })
    }
    const formData = {
        // Pass a simple key-value pair
        // id: 8
        newSignature: fs.createReadStream(req.files[0].path),
        questioned: fs.createReadStream(req.files[1].path)

    };
    let respverify = await request.post({ url: `${process.env.PYTHON_DEV_URL}/verify`, formData: formData });
    const data = JSON.parse(respverify);
    console.log(respverify.distance)
    const Matched = data.match
    const percentage = data.percentage
    const difference = data.difference
    const distance = data.distance
    const error = data.error
    const threshold = data.threshold
    const dnoised1 = `${process.env.PYTHON_DEV_URL}/static/aaa${data.fileid}.png`
    const dnoised2 = `${process.env.PYTHON_DEV_URL}/static/bbb${data.fileid}.png`
    const AdmittedSigneture1 = `${process.env.NODE_DEV_URL}/api/profile/${req.files[0].filename}`
    const AdmittedSigneture2 = `${process.env.NODE_DEV_URL}/profile/${req.files[1].filename}`

    var downloadImageFromURL = (url, filename, callback) => {
        var client = http;
        if (url.toString().indexOf("https") === 0) {
            client = https;
        }

        client.request(url, function (response) {
            var data = new Stream();

            response.on('data', function (chunk) {
                data.push(chunk);
            });

            response.on('end', function () {
                fs.writeFileSync(filename, data.read());
            });
        }).end();
    };
    let Image_dnoise1 = `dnoise1_${Date.now()}.png`
    let Image_dnoise2 = `dnoise2_${Date.now()}.png`
    let image1 = `uploads//${Image_dnoise1}`
    let image2 = `uploads//${Image_dnoise2}`
    downloadImageFromURL(dnoised1, image1);
    downloadImageFromURL(dnoised2, image2);
    const resp_img1 = `${process.env.NODE_DEV_URL}/api/profile/${Image_dnoise1}`
    const resp_img2 = `${process.env.NODE_DEV_URL}/api/profile/${Image_dnoise2}`
    const _verifyTransition = new verifyTransition({
        PolicyNumber,
        difference,
        distance,
        error,
        threshold,
        CustomerName,
        PhoneNumber,
        VerifiersName,
        VerifiersID,
        Source,
        Matched,
        percentage,
        AdmittedSigneture1,
        AdmittedSigneture2,
        resp_img1,
        resp_img2
    });

    _verifyTransition.save((error, data) => {
        if (error) {
            return res.status(400).json({
                message: error
            });
        }
        if (data) {
            return res.status(201).json({
                data: data,
            });
        }
    });
}

// Function to check letters and numbers
function alphanumeric(inputtxt) {
    var letterNumber = /[^0-9a-bA-B\s]/gi;
    if (inputtxt.match(letterNumber)) {
        return true;
    }
    else {
        return false;
    }
}
// Function to check Phone number


exports.createPDF = (req, res) => {
    console.log(req.body)
    const PolicyNumber = req.body.PolicyNumber
    verifyTransition.find({ PolicyNumber: PolicyNumber }).exec((error, data) => {
        if (error) return res.status(400).json({ error });
        if (data) {
            pdf.create(pdfTemplate(data), { format: 'A4' }).toFile('result.pdf', (err) => {
                if (err) {
                    console.log("HIS")
                    console.log(error)
                }
                else {
                    res.sendFile(`${process.cwd()}/result.pdf`)
                }

            });

        }
    });

}


exports.allTransition = (req, res) => {
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    let date = new Date(endDate);
    // add a day
    date.setDate(date.getDate() + 1);
    // { "$match": req.body.department ? { department: req.body.department } : {} },
    verifyTransition.find(req.body.startDate && req.body.endDate ? { "createdAt": { $gte: (startDate), $lt: (date) } } : {}).exec((error, data) => {
        if (error) return res.status(400).json({ error });
        if (data) {
            res.status(200).json({
                data: data
            })
        }
    });
}
exports.toexcel = async (req, res) => {
    const startDate = req.body.startDate
    const endDate = req.body.endDate
    let date = new Date(endDate);
    try {
        const users = await verifyTransition.find(req.body.startDate && req.body.endDate ? { "createdAt": { $gte: (startDate), $lt: (date) } } : {});
        console.log(users)
        const workbook = new ExcelJs.Workbook();
        const worksheet = workbook.addWorksheet('My Users');
        worksheet.columns = [
            { header: 'S.no', key: 's_no', width: 10 },
            { header: 'PolicyNumber', key: 'PolicyNumber', width: 10 },
            { header: 'CustomerName', key: 'CustomerName', width: 10 },
            { header: 'PhoneNumber', key: 'PhoneNumber', width: 10 },
            { header: 'VerifiersName', key: 'VerifiersName', width: 10 },
            { header: 'VerifiersID', key: 'VerifiersID', width: 10 },
            { header: 'Source', key: 'Source', width: 10 },
        ];
        let count = 1;
        users.forEach(user => {
            user.s_no = count;
            worksheet.addRow(user);
            count += 1;
        });
        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });
        const data = await workbook.xlsx.writeFile('users.xlsx')
        res.sendFile(`${process.cwd()}/users.xlsx`)
    } catch (e) {
        res.status(500).send(e);
    }

}
