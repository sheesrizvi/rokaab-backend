const asyncHandler = require("express-async-handler");
const pdf = require("html-pdf");
const template = require("./template");
const axios = require("axios");

const aws = require("aws-sdk");
const fs = require("fs");
const Pdf = require("../models/pdfModel");
const City = require("../models/cityModel");
const Template2 = require("./template2");
const nodemailer = require("nodemailer");
const { DeleteObjectCommand, S3Client } = require("@aws-sdk/client-s3");
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

  const loc = await City.findById(locto);
  const locF = await City.findById(locfrom);
  const imgurl = company.header;

  const imgurlF = company.footer;
  const imgurlS = company.stamp;

  var options = {
    format: "A4",

    header: {
      height: "70mm",
      contents: `<header style="margin: auto; width: 90%; height:70mm;">
      <img style="float: left; width: 95%;"src=${imgurl}  />
    </header>`,
    },
    footer: {
      height: "48mm",
      contents: `<footer style="margin: auto; width: 90%">
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
  var options2 = {
    format: "A4",

    header: {
      height: "70mm",
      contents: `<header style="margin: auto; width: 90%; height:70mm;">
      <img style="float: left; width: 95%;"src=${imgurl}  />
    </header>`,
    },
    footer: {
      height: "48mm",
      contents: `<footer style="margin: auto; width: 90%;display:flex;align-items:center">
    <img style="flex:1;float: left; width: 30%" src=${imgurlS}  />
    <p style="flex:1;float: right;margin-top:30px">ونشکرکم عیل تسھیل الخدمة للمعتمرین۔</p>
  </footer>`,
    },
    childProcessOptions: {
      env: {
        OPENSSL_CONF: "/dev/null",
      },
    },
  };

  if (loc.name.match(/Airport/g)) {
    pdf
      .create(
        Template2({
          userData,
          driver,
          locto: loc.nameAr,
          locfrom: locF.nameAr,
          plateno,
          imgurl,
          imgurlF,
          imgurlS,
          company,
        }),
        options2
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

              const fileName = `${Date.now()}_${Math.round(
                Math.random() * 1e9
              )}`;
              const params = {
                Bucket: process.env.AWS_BUCKET,
                Key: `${fileName}.pdf`,
                Body: fileContent,
              };

              s3.upload(params, async (err, data) => {
                if (err) {
                  console.error("Error uploading file:", err);
                } else {
                  const pdf = await Pdf.create({
                    company: company._id,
                    pdf: data.Location,
                    user: driver._id,
                  });
                  fs.unlinkSync(`${__dirname}/${driver._id}.pdf`);
                  res.json(pdf);
                }
              });
            }
          );
        }
      });
  } else {
    pdf
      .create(
        template({
          userData,
          driver,
          locto: loc.nameAr,
          locfrom: locF.nameAr,
          plateno,
          imgurl,
          imgurlF,
          imgurlS,
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

              const fileName = `${Date.now()}_${Math.round(
                Math.random() * 1e9
              )}`;
              const params = {
                Bucket: process.env.AWS_BUCKET,
                Key: `${fileName}.pdf`,
                Body: fileContent,
              };

              s3.upload(params, async (err, data) => {
                if (err) {
                  console.error("Error uploading file:", err);
                } else {
                  const pdf = await Pdf.create({
                    company: company._id,
                    pdf: data.Location,
                    user: driver._id,
                  });
                  fs.unlinkSync(`${__dirname}/${driver._id}.pdf`);
                  res.json(pdf);
                }
              });
            }
          );
        }
      });
  }

  // const a = await axios.get(imgurl, {
  //   responseType: "arraybuffer",
  //   responseEncoding: "null",
  // });

  // let jpgDataUrlPrefix = "data:image/png;base64,";
  // let imageBuffer = Buffer.from(a.data);
  // let imageBase64 = imageBuffer.toString("base64");
  // bas64Image = jpgDataUrlPrefix + imageBase64;
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
    .skip(pageSize * (page - 1));
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

module.exports = {
  generatePdf,
  getPdf,
  deletePdf,
};
