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
    let respverify = await request.post({ url: 'https://signic.ml/verify', formData: formData });
    const data = JSON.parse(respverify);
    console.log(respverify.distance)
    const Matched = data.match
    const percentage = data.percentage
    const difference = data.difference
    const distance = data.distance
    const error = data.error
    const threshold = data.threshold
    const dnoised1 = `https://signic.ml/static/aaa${data.fileid}.png`
    const dnoised2 = `https://signic.ml/static/bbb${data.fileid}.png`
    const AdmittedSigneture1 = `http://3.110.47.142:5000/api/profile/${req.files[0].filename}`
    const AdmittedSigneture2 = `http://3.110.47.142:5000/api/profile/${req.files[1].filename}`

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
    const resp_img1 = `http://3.110.47.142:5000/api/profile/${Image_dnoise1}`
    const resp_img2 = `http://3.110.47.142:5000/api/profile/${Image_dnoise2}`

    // const formData1 = {
    //     id: data.fileid
    // };
    // let AdmittedSigneture1 = await request.post({ url: 'https://signic.ml/imagedenoise1', formData: formData1 });



    // const formData2 = {
    //     id: data.fileid
    // };

    // let blob2 = await request.post({ url: 'https://signic.ml/imagedenoise2', formData: formData2 });




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
    console.log(date)
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
// exports.senddata = async (req, res) => {
console.log("hi")
// var formData = new FormData();
// formData.append("newSignature", fs.createReadStream('C:/Users/admin/Desktop/Six30Labs/Node/uploads/productimage_1632315406845.jpeg'));
// formData.append("questioned", fs.createReadStream('C:/Users/admin/Desktop/Six30Labs/Node/uploads/productimage_1632315406849.jpeg'));
// try {
//     var data = await axios.post('https://signic.ml/verify', formData, {
//         headers: {
//             'Content-Type': 'multipart/form-data'
//         }
//     })
//     res.status(200).json({
//         data
//     })
// } catch (err) {
//     res.status(500).json({ message: err });
// }
// var formData = new FormData();
// formData.append("id", 8);

// try {
//     var data = await axios.post('https://signic.ml/imagedenoise2', formData, {
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     res.status(200).json({
//         data
//     })
// } catch (err) {
//     res.status(400).json({ message: err });
// }

// axios.post('https://signic.ml/imagedenoise1', formData)
//     .then(function (response) {
//         // handle success
//         console.log(response);
//     })
//     .catch(function (error) {
//         // handle error
//         console.log(error);
//     })
//     .then(function () {
//         // always executed
//     });
// console.log(req.files)

// const formData = {
//     // Pass a simple key-value pair
//     id: 8
//     // newSignature: fs.createReadStream('C://Users//admin//Desktop//Six30Labs//Node//uploads//productimage_1632315406845.jpeg'),
//     // questioned: fs.createReadStream('C://Users//admin//Desktop//Six30Labs//Node//uploads//productimage_1632315406849.jpeg')

// };
// request.post({ url: 'https://signic.ml/imagedenoise1', formData: formData }, function optionalCallback(err, httpResponse, body) {
//     if (err) {
//         return console.error('upload failed:', err);
//     }
//     // const obj = JSON.parse(body);
//     console.log(body)
//     const AdmittedSigneture1 = body
//     // res.status(200).json({
//     //     obj.
//     // })
//     // resv = body.blob()
//     // .then(function (response) {
//     //     res.end(response)
//     // })

//     const _verifyTransition = new verifyTransition({
//         AdmittedSigneture1
//     });

//     _verifyTransition.save((error, data) => {
//         if (error) {
//             return res.status(400).json({
//                 message: error
//             });
//         }
//         if (data) {
//             return res.status(201).json({
//                 data: data,
//             });
//         }
//     });


// });


    // var formData = new FormData();
    // formData.append("id", 8);
    // try {
    //     const response = await axios.get('https://signic.ml/imagedenoise1', formData)
    //     console.log(response);
    //     console.log(response);
    // } catch (error) {
    //     console.log(error.response.body);
    // }

    // verify transition
    // const sendGetRequest = async () => {
    //     try {
    //         const resp = await axios.get('https://jsonplaceholder.typicode.com/posts');
    //         console.log(resp);
    //     } catch (err) {
    //         // Handle Error Here
    //         console.error(err);
    //     }
    // };

    // sendGetRequest();
    // it is my api calling
    // const sendGetRequest = async () => {
    //     try {
    //         var formData = new FormData();
    //         formData.append("id", 8);
    //         const resp = await axios.post('http://ec2-13-233-115-28.ap-south-1.compute.amazonaws.com:5000/api/TransitionList', formData);
    //         console.log(resp);
    //     } catch (err) {
    //         // Handle Error Here
    //         console.error(err);
    //     }
    // };

    // sendGetRequest();
    // const sendGetRequest = async () => {
    //     try {
    //         // const formData = {
    //         //     // Pass a simple key-value pair
    //         //     id: 8
    //         //     // newSignature: fs.createReadStream('C://Users//admin//Desktop//Six30Labs//Node//uploads//productimage_1632315406845.jpeg'),
    //         //     // questioned: fs.createReadStream('C://Users//admin//Desktop//Six30Labs//Node//uploads//productimage_1632315406849.jpeg')

    //         // };
    //         // console.log("HI Axios")
    //         // var formData = new FormData();
    //         // formData.append("id", 8);

    //         let bodyFormData = new FormData();
    //         bodyFormData.append('id', 8);
    //         const headers = {
    //             "Content-Type": 'multipart/form-data',
    //         };
    //         // formData.append("newSignature", fs.createReadStream('C://Users//admin//Desktop//Six30Labs//Node//uploads//productimage_1632315406845.jpeg'));
    //         // formData.append("questioned", fs.createReadStream('C://Users//admin//Desktop//Six30Labs//Node//uploads//productimage_1632315406845.jpeg'));
    //         const resp = await axios.post('https://signic.ml/imagedenoise1', formData);
    //         console.log(resp);
    //         // axios({
    //         //     method: 'post',
    //         //     url: 'https://signic.ml/imagedenoise1',
    //         //     data: formData,
    //         //     config: { headers: { 'Content-Type': 'multipart/form-data' } }
    //         // })
    //         //     .then(function (response) {
    //         //         //handle success
    //         //         console.log(response);
    //         //     })
    //         //     .catch(function (response) {
    //         //         //handle error
    //         //         console.log(response);
    //         //     });
    //     } catch (err) {
    //         // Handle Error Here
    //         console.error(err);
    //     }
    // };

    // sendGetRequest();

// }