const asyncHandler = require("express-async-handler");
const Company = require("../models/companyModel");
const AWS = require("aws-sdk");
const ID = process.env.AWS_ACCESS_KEY;
const SECRET = process.env.AWS_SECRET_KEY;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  region: "ap-south-1",
});

const createCompany = asyncHandler(async (req, res) => {
  const {
    name,
    nameAr,
    nameBn,
    nameUr,
    email,
    phone,
    companyCR,
    header,
    footer,
    stamp,
  } = req.body;

  const plan = await Company.create({
    name,
    nameAr,
    phone,
    nameBn,
    nameUr,
    email,
    companyCR,
    header,
    footer,
    stamp,
  });

  if (plan) {
    res.status(201).json({
      plan,
    });
  } else {
    res.status(400);
    throw new Error("Company not created");
  }
});

const updateCompany = asyncHandler(async (req, res) => {
  const { name, email, companyCR, header, footer, stamp, companyId } = req.body;

  const plan = await Company.findById(companyId);

  if (plan) {
    plan.name = name;
    plan.email = email;
    plan.companyCR = companyCR;
    plan.header = header ? header : plan.header;
    plan.footer = footer ? footer : plan.footer;
    plan.stamp = stamp ? stamp : plan.stamp;

    const updatedplan = await plan.save();

    res.status(201).json(updatedplan);
  } else {
    res.status(400);
    throw new Error("Company not updated");
  }
});

const getcompanies = asyncHandler(async (req, res) => {
  const page = Number(req.query.pageNumber) || 1;
  const pageSize = 30;
  const count = await Company.countDocuments({});
  var pageCount = Math.floor(count / 30);
  if (count % 30 !== 0) {
    pageCount = pageCount + 1;
  }
  const companies = await Company.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  if (companies) {
    res.status(201).json({companies, pageCount});
  } else {
    res.status(400);
    throw new Error("Cannot get Companies error");
  }
});
const searchCompany = asyncHandler(async (req, res) => {
  
    const users = await Company.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: req.query.Query,
            path: ["name"],
          },
        },
      },
    ]);
    if (users) {
      res.json(users);
    } else {
      res.status(404);
      throw new Error("users not found");
    
  }
});

const deleteCompany = asyncHandler(async (req, res) => {
  const PlanId = req.query.id;
  const plan = await Company.findById(PlanId);

  if (plan) {
    if (plan.header) {
      const fileName = plan.header.split("//")[1].split("/")[1];
      var params = { Bucket: process.env.AWS_BUCKET, Key: fileName };

      s3.deleteObject(params, function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log("Header deleted successfully");
      });
    }
    if (plan.footer) {
      const fileNam = plan.footer.split("//")[1].split("/")[1];
      var param = { Bucket: process.env.AWS_BUCKET, Key: fileNam };

      s3.deleteObject(param, function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log("Footer deleted successfully");
      });
    }

    if (plan.stamp) {
      const fileNam = plan.stamp.split("//")[1].split("/")[1];
      var param = { Bucket: process.env.AWS_BUCKET, Key: fileNam };

      s3.deleteObject(param, function (err, data) {
        if (err) console.log(err, err.stack);
        else console.log("Stamp deleted successfully");
      });
    }

    await plan.deleteOne({ _id: plan._id });
    res.json({ message: "Company removed" });
  } else {
    res.status(404);
    throw new Error("Plan not found");
  }
});

const getCompanyById = asyncHandler(async (req, res) => {
  const plan = await Company.findById(req.query.id);

  if (plan) {
    res.json(plan);
  } else {
    res.status(404);
    throw new Error("Company not found");
  }
});

module.exports = {
  createCompany,
  getCompanyById,
  getcompanies,
  updateCompany,
  deleteCompany,
  searchCompany
};
