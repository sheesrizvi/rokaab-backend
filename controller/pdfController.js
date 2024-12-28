const asyncHandler = require("express-async-handler");
const pdf = require("html-pdf");
const template = require("./template");
const axios = require("axios");
const QRCode = require('qrcode');
const aws = require("aws-sdk");
const fs = require("fs");
const Pdf = require("../models/pdfModel");
const City = require("../models/cityModel");
const Template2 = require("./template2");
const nodemailer = require("nodemailer");
const { DeleteObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const TripHistory = require('../models/tripHistoryModel.js')

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const config = {
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
};
const s32 = new S3Client(config);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const generatePdf = asyncHandler(async (req, res) => {
  const { company, userData, driver, locto, locfrom, plateno } = req.body;
  // console.log(req.body)
  const userData1 = userData[0];

  const userData2 = userData.slice(1);
  const loc = await City.findById(locto);
  const locF = await City.findById(locfrom);
  const imgurl = company.header;

  const imgurlF = company.footer;
  const imgurlS = company.stamp;

  var options = {
    format: "A4",

    header: {
      height: "40mm",
      contents: `<header style="margin:0 auto; width: 90%; height:40mm;">
      <img style="float: left; width: 95%;"src=${imgurl}  />
    </header>`,
    },
    footer: {
      height: "58mm",
      contents: `<footer style="margin: auto; width: 90%">
      <p style="margin-left:20px">التوقيع</p>
    <img style="float: left; width: 15%" src=${imgurlS}  />
    <img style="float: left; width: 95%" src=${imgurlF}  />
  </footer>`,
    },
    childProcessOptions: {
      env: {
        OPENSSL_CONF: "/dev/null",
      },
    },
  };

  const tripHistory = await TripHistory.create({
    locto: loc,
    locfrom: locF,
    company: company._id,
    driver: driver._id,
    plateno,
    passengers: userData
  })


  //creating pdf model first and update the url later 
  const newPdf = await Pdf.create({
    company: company._id,
    pdf: "", // Placeholder for URL
    user: driver._id,
  });

  const url = `http://rokab.mmhtechnologies.com/pdf/${newPdf._id}`;



  //  generate QR code as a string (data URL)
  QRCode.toDataURL(url, (err, urlString) => {
    if (err) {
      console.error('Error generating QR code as Data URL:', err);
    } else {

      //url String is a base64 image having qrcode with the url 
      pdf
        .create(
          template({
            userData1,
            userData2,
            driver,
            locto: loc.nameAr,
            locfrom: locF.nameAr,
            plateno,
            imgurl,
            imgurlF,
            imgurlS,
            company,
            qrUrl: urlString
          }),
          options
        )
        .toFile(`${__dirname}/${driver._id}.pdf`, (err) => {
          if (err) {
            res.json(err);
          } else {
            transporter.sendMail(
              {
                from: ` Rokaab <rokaab026@gmail.com>`, // sender address
                to: `${company.email}`, // list of receivers
                replyTo: `<rokaab026@gmail.com>`,
                subject: `PDF Document`, // Subject line
                text: `Find the attached document`, // plain text body
                // html: emailTemplate(orderItems, paymentMethod, totalPrice), // html body
                attachments: [
                  {
                    filename: `${driver._id}.pdf`,
                    path: `${__dirname}/${driver._id}.pdf`,
                  },
                ],
              },
              function (err, info) {
                const fileContent = fs.readFileSync(
                  `${__dirname}/${driver._id}.pdf`
                );

                const fileName = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
                const params = {
                  Bucket: process.env.AWS_BUCKET,
                  Key: `${fileName}.pdf`,
                  Body: fileContent,
                };

                s3.upload(params, async (err, data) => {
                  if (err) {
                    console.error("Error uploading file:", err);
                  } else {


                    // Update the PDF model with the S3 URL
                    newPdf.pdf = data.Location;
                    await newPdf.save();


                    fs.unlinkSync(`${__dirname}/${driver._id}.pdf`);
                    res.json(data.Location);
                  }
                });
              }
            );
          }
        });
    }
  });



});

const getPdf = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = 30;
  const count = await Pdf.countDocuments({});
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const pdf = await Pdf.find({})
    .populate("user company")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });
  res.json({ pdf, pageCount });
});

const getPdfById = asyncHandler(async (req, res) => {


  const pdf = await Pdf.findById(req.query.id)
    .populate("user company");
  res.json(pdf);
});

const getPdfByDriverId = asyncHandler(async (req, res) => {
  const { driverId } = req.query;
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = 20;

  if (!driverId) {
    res.status(400);
    throw new Error("Driver ID is required");
  }


  const count = await Pdf.countDocuments({ user: driverId });


  var pageCount = Math.floor(count / pageSize);
  if (count % pageSize !== 0) {
    pageCount = pageCount + 1;
  }


  const pdf = await Pdf.find({ user: driverId })
    .populate("user company")
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  // Return the results
  res.json({ pdf, pageCount });
});



const deletePdf = asyncHandler(async (req, res) => {
  const sub = await Pdf.findById(req.query.id);

  const f1 = sub.pdf;

  if (f1) {
    const fileName = f1.split("//")[1].split("/")[1];

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: fileName,
    });
    const response = await s32.send(command);
  }
  await Pdf.deleteOne({ _id: req.query.id });
  res.json("deleted");
});


const getAllTripsHistory = asyncHandler(async (req, res) => {
  const { pageNumber = 1, pageSize = 20 } = req.query

  const tripHistories = await TripHistory.find({}).sort({ createdAt: -1 }).populate('driver').populate('company').skip((pageNumber - 1) * pageSize).limit(pageSize)

  if (!tripHistories || tripHistories.length === 0) {
    return res.status(400).send({ message: "No Trip History Found " })
  }

  const totalDocuments = await TripHistory.countDocuments({})
  const pageCount = Math.ceil(totalDocuments / pageSize)

  res.status(200).send({ tripHistories, pageCount })
})

const getTripsByDriverId = asyncHandler(async (req, res) => {
  const { driverId } = req.query

  const tripHistory = await TripHistory.find({ driver: driverId }).populate('company').populate('driver')

  if (!tripHistory || tripHistory.length === 0) {
    return res.status(400).send({ message: 'No Trips found for this driver' })
  }

  res.status(200).send({ tripHistory })
})

const getTripsById = asyncHandler(async (req, res) => {
  const { tripId } = req.query

  const tripHistory = await TripHistory.findOne({ _id: tripId }).populate('company').populate('driver')

  if (!tripHistory || tripHistory.length === 0) {
    return res.status(400).send({ message: 'No Trips found for this driver' })
  }

  res.status(200).send({ tripHistory })
})

module.exports = {
  generatePdf,
  getPdf,
  deletePdf,
  getPdfByDriverId,
  getPdfById,
  getAllTripsHistory,
  getTripsByDriverId,
  getTripsById
};
