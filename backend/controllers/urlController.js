import asyncHandler from "express-async-handler";
import Url from "../models/urlModel.js";

// @desc    List of user URLs
// @route   GET /api/url
// @access  Private
const getUserUrls = asyncHandler(async (req, res) => {
  const itemsPerPage = 5;
  const startPage = req.query.page || 1;
  await Url.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: null, totalUrls: { $sum: 1 } } },
  ])
    .exec()
    .then(async (result) => {
      const totalUrls = result.length > 0 ? result[0].totalUrls : 0;
      const urls = await Url.find({ user: req.user._id })
        .populate("user", "firstName lastName")
        .skip(itemsPerPage * startPage - itemsPerPage)
        .limit(itemsPerPage)
        .exec();
      const count = await Url.countDocuments({ user: req.user._id });
      res.status(200).json({
        data: urls,
        totalUrls,
        total: count,
        success: true,
        itemsPerPage,
        startPage,
        lastPage: Math.ceil(count / itemsPerPage),
      });
    })
    .catch((err) => {
      return next(err);
    });
});

// @desc    Create a URL
// @route   POST /api/url
// @access  Private - User
const createUrl = asyncHandler(async (req, res) => {
  const { originalUrl, shortUrl } = req.body;

  const url = await Url.create({
    originalUrl,
    shortUrl,
    user: req.user._id,
  });

  if (url) {
    res.status(201).json(url);
  } else {
    res.status(400);
    throw new Error("Invalid URL data");
  }
});

// @desc    Update existing URL
// @route   PATCH /api/url/:id
// @access  Private - Admin only
const updateUrl = asyncHandler(async (req, res) => {
  const url = await Url.findOne({ _id: req.params.id });

  if (
    url &&
    url.user.toString() !== req.user._id.toString() &&
    req.user.isAdmin === false
  ) {
    res.status(403);
    throw new Error("Only URL owner or admin can edit URL");
  }

  if (url) {
    url.originalUrl = req.body.originalUrl || url.originalUrl;
    url.shortUrl = req.body.shortUrl || url.shortUrl;
    const updatedUrl = await url.save();

    res.json(updatedUrl);
  } else {
    res.status(404);
    throw new Error("URL not found");
  }
});

// @desc    Delete existing URL
// @route   DELETE /api/url/:id
// @access  Private - Admin or User
const deleteUrl = asyncHandler(async (req, res) => {
  const url = await Url.findById(req.params.id);

  if (
    url.user.toString() !== req.user._id.toString() &&
    req.user.isAdmin === false
  ) {
    res.status(403);
    throw new Error("Only URL owner or admin can delete URL");
  }

  if (url) {
    await Url.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });
    res.json({ message: "URL removed" });
  } else {
    res.status(404);
    throw new Error("URL not found");
  }
});

// @desc    Get existing URL
// @route   GET /api/url/:id
// @access  Private - User or Admin
const getUrl = asyncHandler(async (req, res) => {
  const url = await Url.findById(req.params.id);

  if (
    url.user.toString() !== req.user._id.toString() &&
    req.user.isAdmin === false
  ) {
    res.status(403);
    throw new Error("Only URL owner and admin can view URLs");
  }

  if (url) {
    res.json(url);
  } else {
    res.status(404);
    throw new Error("URL not found");
  }
});

export { getUserUrls, createUrl, updateUrl, deleteUrl, getUrl };
