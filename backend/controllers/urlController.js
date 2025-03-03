import asyncHandler from "express-async-handler";
import Url from "../models/urlModel.js";
import redis from "redis";

const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisClient.connect().catch(console.error);

// @desc    List of user URLs
// @route   GET /api/url
// @access  Private
const getUserUrls = asyncHandler(async (req, res) => {
  const itemsPerPage = 5;
  const startPage = req.query.page || 1;
  const userId = req.user._id;
  const cacheKey = `userUrls:${userId}:${startPage}:${itemsPerPage}`;

  try {
    // Attempt to retrieve data from Redis cache
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("Cache hit!");
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log("Cache miss, fetching from database");

    const result = await Url.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: null, totalUrls: { $sum: 1 } } },
    ]).exec();

    const totalUrls = result.length > 0 ? result[0].totalUrls : 0;
    const urls = await Url.find({ user: req.user._id })
      .populate("user", "email username")
      .skip(itemsPerPage * startPage - itemsPerPage)
      .limit(itemsPerPage)
      .exec();
    const count = await Url.countDocuments({ user: req.user._id });

    const response = {
      data: urls,
      totalUrls,
      total: count,
      success: true,
      itemsPerPage,
      startPage,
      lastPage: Math.ceil(count / itemsPerPage),
    };

    // Store data in Redis cache with an expiration time (e.g., 60 seconds)
    await redisClient.set(cacheKey, JSON.stringify(response), {
      EX: 120, // Expires in 120 seconds
    });

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

// @desc    Create a URL
// @route   POST /api/url
// @access  Private - User
const createUrl = asyncHandler(async (req, res) => {
  const { originalUrl } = req.body;
  const userId = req.user._id;

  // Original url must be a valid URL
  if (!originalUrl) {
    res.status(400);
    throw new Error("Original URL is required");
  }

  // check if the Url is valid url or not using regex
  const urlRegex = new RegExp(
    "^(http|https)://",
    "i"
  );
  if (!urlRegex.test(originalUrl)) {
    res.status(400);
    throw new Error("Invalid URL");
  }

  const urlCode = Math.random().toString(36).substring(7);  

  const url = await Url.create({
    originalUrl,
    urlCode,
    user: req.user._id,
  });

  if (url) {
    // Clear cache for the user's URLs
    const cacheKey = `userUrls:${userId}:*`;
    try {
      const keys = await redisClient.keys(cacheKey);
      if (keys.length > 0) {
        const count = await redisClient.del(keys);
      }
    } catch (err) {
      console.error("Error deleting cache keys", err);
    }
    res.status(201).json(url);
  } else {
    res.status(400);
    throw new Error("Invalid URL data");
  }
});

// @desc    Delete existing URL
// @route   DELETE /api/url/:id
// @access  Private - Admin or User
const deleteUrl = asyncHandler(async (req, res) => {
  const url = await Url.findById(req.params.id);
  const userId = req.user._id;

  if (
    url.user.toString() !== req.user._id.toString() &&
    req.user.isAdmin === false
  ) {
    res.status(403);
    throw new Error("Only URL owner or admin can delete URL");
  }

  if (url) {
    // check if redis is connected
    await Url.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });
    const cacheKey = `userUrls:${userId}:*`;
    try {
      const keys = await redisClient.keys(cacheKey);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (err) {
      console.error("Error deleting cache keys", err);
    }
    res.json({ message: "URL removed" });
  } else {
    res.status(404);
    throw new Error("URL not found");
  }
});

// @desc    Increment view count of URL
// @route   GET /api/url/:id
// @access  Private - User or Admin
const incrementUrlCount = asyncHandler(async (req, res) => {
  const url = await Url.findById(req.params.id);
  const userId = req.user._id;

  if (url) {
    url.count = url.count + 1;
    await url.save();
    // Clear cache for the user's URLs
    const cacheKey = `userUrls:${userId}:*`;
    try {
      const keys = await redisClient.keys(cacheKey);
      if (keys.length > 0) {
        await redisClient.del(keys);
      }
    } catch (err) {
      console.error("Error deleting cache keys", err);
    }
    res.json(url);
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

export { getUserUrls, createUrl, deleteUrl, getUrl, incrementUrlCount };
