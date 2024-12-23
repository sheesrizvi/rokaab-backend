const asyncHandler = require("express-async-handler");
const City = require("../models/cityModel");
const Company = require("../models/companyModel");
const User = require("../models/userModel");
const Subscription = require("../models/subscriptionModel");
const { endOfDay, startOfDay, parseISO } = require("date-fns");

const createCity = asyncHandler(async (req, res) => {
  const { name, nameAr, nameBn, nameUr } = req.body;

  const plan = await City.create({
    name,
    nameAr,
    nameBn,
    nameUr,
  });

  if (plan) {
    res.status(201).json({
      plan,
    });
  } else {
    res.status(400);
    throw new Error("City not created");
  }
});

const getCities = asyncHandler(async (req, res) => {
  const plans = await City.find({});

  if (plans) {
    res.status(201).json(plans);
  } else {
    res.status(400);
    throw new Error("Cannot get Plans error");
  }
});

const deleteCities = asyncHandler(async (req, res) => {
  const PlanId = req.query.cityId;
  const plan = await City.deleteOne({ _id: PlanId });

  res.json({ message: "Location removed" });
});

const getReport = asyncHandler(async (req, res) => {
  const today = new Date();
  const priorDate = new Date(new Date().setDate(today.getDate() + 10));
  const totalDriver = await User.countDocuments({});
  const totalSubscription = await Subscription.countDocuments({});
  const company = await Company.countDocuments({});
  const expiry = await Subscription.countDocuments({
    $and: [
      {
        expiry: {
          $gte: startOfDay(today),
          $lte: endOfDay(priorDate),
        },
      },
    ],
  });

  res.json({ expiry, totalDriver, totalSubscription, company });
});
const getReportSubscription = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const s1 = parseISO(startDate);
  const s2 = parseISO(endDate);

  const totalSubscription = await Subscription.find({
    createdAt: {
      $gte: startOfDay(s1),
      $lte: endOfDay(s2),
    },
  }).populate("user plan");

  res.json(totalSubscription);
});
const getReportDriver = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const s1 = parseISO(startDate);
  const s2 = parseISO(endDate);
  const totalSubscription = await User.find({
    createdAt: {
      $gte: startOfDay(s1),
      $lte: endOfDay(s2),
    },
  })
    .populate("company", "_id name")
    .populate({ path: "subscription", populate: [{ path: "plan" }] });

  res.json(totalSubscription);
});
const getReportCompany = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const s1 = parseISO(startDate);
  const s2 = parseISO(endDate);
  const totalSubscription = await Company.find({
    createdAt: {
      $gte: startOfDay(s1),
      $lte: endOfDay(s2),
    },
  });

  res.json(totalSubscription);
});

module.exports = {
  createCity,
  deleteCities,
  getCities,
  getReport,
  getReportCompany,
  getReportDriver,
  getReportSubscription,
};
