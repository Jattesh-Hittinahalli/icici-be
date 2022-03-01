// const logo = require("../download")
module.exports = (data) => {
    console.log(data[0])
    var obj = {}
    if (data[0].Matched == "true") {
        obj.Result = "Passed";
        obj.Color = "green"
    } else {
        obj.Result = "Failed";
        obj.Color = "red"
    }
    console.log(obj.Result)
    console.log(obj.Color)
    return `
   <!doctype html>
   <html>
   
   <head>
       <meta charset="utf-8">
       <title>PDF Result Template</title>
       <style>
             
           .invoice-box {
               max-width: 800px;
               margin: auto;
               padding: 30px;
               border: 1px solid #eee;
               box-shadow: 0 0 10px rgba(0, 0, 0, .15);
               font-size: 9px;
               line-height: 24px;
               font-family: Arial, Helvetica, sans-serif,
   
   
           }
           * {
           margin: 0%;
           padding: 0%;
       }
   
           .margin-top {
               margin-top: 50px;
           }
   
           .justify-center {
               text-align: center;
           }
   
           .invoice-box table {
               width: 100%;
               line-height: inherit;
               text-align: left;
           }
   
           .invoice-box table td {
               padding: 5px;
               vertical-align: middle;
           }
   
           .invoice-box table tr td:nth-child(2) {
               text-align: center;
           }
   
           .invoice-box table tr.top table td {
               padding-bottom: 20px;
           }
   
           .invoice-box table tr.top table td.title {
               font-size: 45px;
               line-height: 45px;
               color: #333;
           }
   
           .invoice-box table tr.information table td {
               padding-bottom: 40px;
           }
   
           .invoice-box table tr.heading td {
               border-bottom: 1px solid black;
               font-weight: bold;
           }
   
           .invoice-box table tr.details td {
               padding-bottom: 20px;
           }
   
           .invoice-box table tr.item td {
               border-bottom: 1px solid #eee;
           }
   
           .invoice-box table tr.item.last td {
               border-bottom: none;
           }
   
           .invoice-box table tr.total td:nth-child(2) {
               border-top: 2px solid #eee;
               font-weight: bold;
           }
   
           @media only screen and (max-width: 600px) {
               .invoice-box table tr.top table td {
                   width: 100%;
                   display: block;
                   text-align: center;
               }
   
               .invoice-box table tr.information table td {
                   width: 100%;
                   display: block;
                   text-align: center;
               }
           }
   
           .table,
           .th,
           .td,
           .td1 {
               border: 1px solid black;
               border-collapse: collapse;
           }
   
           .th,
           .td {
               padding: 5px;
               text-align: left;
           }
   
           .td1 {
               padding: 5px;
               text-align: left;
           }
       </style>
   </head>
   
   <body>
       <div class="invoice-box">
           <img src="http://localhost:5000/api/profile/productimage_1629713175644.png" style="  display: block;
           margin-left: auto;
           margin-right: auto;
           width: 30%;">
   
           <h1 style="font-size:large;margin-left: 28%;;
           width: 50%;font-size: medium">Signature Verification - Individual
               Sample Report</h1>
   
           <table cellpadding="0" cellspacing="0">
   
               <tr class="heading">
                   <td>Details</td>
                   <td></td>
               </tr>
               <tr class="item">
                   <td>Policy Number:</td>
                   <!-- <td> <img src=${`${data[0].AdmittedSigneture1}`} /></td> -->
                   <td>${data[0].PolicyNumber}</td>
               </tr>
               <tr class="item">
                   <td>Customer Name:</td>
                   <td>${data[0].CustomerName}</td>
               </tr>
               <tr class="item">
                   <td>Customer Admitted Signature:</td>
                   <td class="title"><img src=${`${data[0].AdmittedSigneture1}`} width="150px" height="150px""></td>
                   <td>
               </tr>
               <tr class="item">
                   <td>Customer Questioned Signature:</td>
                   <td class="title"><img src=${`${data[0].AdmittedSigneture2}`} width="150px" height="150px"></td>
               </tr>
               <tr class="item">
                   <td>Verifier's Name:</td>
                   <td>${data[0].VerifiersName}</td>
               </tr>
               <tr class="item">
                   <td>Verifier's ID :</td>
                   <td>${data[0].VerifiersID}</td>
               </tr>
               <tr class="item">
                   <td>Date Applied :</td>
                   <td>${data[0].createdAt}</td>
               </tr>
               <tr class="item">
                   <td>percentage :</td>
                   <td>${data[0].percentage}</td>
               </tr>
               <tr class="item">
                   <td>Result :</td>
                   <td style="color:${obj.Color};">${obj.Result}</td>
               </tr>
           
            
            <tr class="">
                <td><span style="padding-top: 15px;"> </span>
                </td>
                <td></td>
            </tr>
            <tr class="">
                <td><span style="padding-top: 15px;"> </span>
                </td>
                <td></td>
            </tr>
            <tr class="">
                <td><span style="padding-top: 15px;"> </span>
                </td>
                <td></td>
            </tr>
            <tr class="">
                <td><span style="padding-top: 15px;"> </span>
                </td>
                <td></td>
            </tr>
               <tr class="heading">
                   <td>Verification Details
                   </td>
                   <td></td>
               </tr>
               <tr class="item">
                   <td>Admitted Signature:</td>
                   <td class="title"><img src=${`${data[0].resp_img1}`} width="150px" height="150px"></td>
               </tr>
               <tr class="item">
                   <td>Submitted Signature:</td>
                   <td class="title"><img src=${`${data[0].resp_img2}`} width="150px" height="150px"></td>
               </tr>
           </table>
           <br />
           <h4 style="margin: 3px 0">Inference Matrix</h4>
           <!-- <p style="margin-bottom:0;">This signature is validated using a Convolutional Siamese network model along with the Contrastive loss function. Euclidean distance was chosen as the distance metric for comparing the output feature vectors. The measured distance between the 2 signatures is.</p>
           <div>
               <h3 style="margin : 0; padding-bottom:0;padding-top: 5px;">Note on Accuracy:</h3>
               <p style="margin : 0; padding-top:0;">The model acheived an accuracy of 78.34% on the CEDAR signature dataset(test set size was around 4100 samples). Deviations of 1-2% are possible as accuracy depends on the threshold. The threshold for the siamese network was computed by taking the average of True positive rate and True negative rate using ROC.</p>
           </div> -->
           <table class="table" style="width:100%">
            <tr class="tr">
                <th class="th">Topic</th>
                <th class="th">Value</th>
            </tr>
            <tr class="tr">
                <td class="td">Base adherence </td>
                <td class="td1">${obj.Result}</td>
            </tr>
            <tr class="tr">
                <td class="td">Consistency adherence  </td>
                <td class="td1">${obj.Result}</td>
            </tr>
            <tr class="tr">
                <td class="td">Spatial Adherence</td>
                <td class="td1">${obj.Result}</td>
            </tr>
            <tr class="tr">
                <td class="td">Spacing Adherence
                </td>
                <td class="td1">${obj.Result}</td>
            </tr>
            <tr class="tr">
                <td class="td">Overall Indicator
                </td>
                <td class="td1">Technically, the parameter thresholds have been
                    breached hence the questioned signature stands
                    <p style="color: ${obj.Color};">${obj.Result}</p>
                    </td>
            </tr>

        </table>
        <div>
        <p style="margin-bottom:0;line-height:15px;margin-top : 10px;">1. This signature is validated using a Convolutional Siamese network model along
                with the Contrastive loss function. Euclidean distance was chosen as the distance metric for comparing
                the output feature vectors. The measured distance between the 2 signatures is ${data[0].distance}</p>
            <p style="margin : 0; padding-top:0;line-height:15px;">2. The model acheived an accuracy of 78.34% on the CEDAR signature
                dataset(test set size was around 4100 samples). Deviations of 1-2% are possible as accuracy depends on
                the threshold. The threshold for the siamese network was computed by taking the average of True positive
                rate and True negative rate using ROC</p>
        <h3 style="margin-top : 80px; padding-bottom:0;padding-top: 5px;">Note:</h3>
        <p style="margin-bottom:0;line-height:15px;">1. The above result is an indicator of the signature verification tool based on
            scientific approach.</p>
        <p style="margin-bottom:0;line-height:15px;">2. The legal modalities must be entrust on human eye for any
            contingencies and secularism</p>
    </div>
   
       </div>
   </body>
   
   </html>
    `;
};