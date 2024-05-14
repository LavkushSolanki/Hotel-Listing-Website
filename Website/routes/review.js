const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { isLoggedIn } = require("../middleware.js");
const reviewConroller=require("../controllers/reviews.js")

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//REVIEWS
//post route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewConroller.createReview)
);

//delete review route

router.delete(
  "/:reviewid",
  wrapAsync(reviewConroller.destroyReview)
);

module.exports = router;
