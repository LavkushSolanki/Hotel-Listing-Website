const Review=require("../models/review.js");
const Listing = require("../models/listing.js");
const { reviewSchema } = require("../schema.js");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id).populate("reviews");
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  console.log("new review saved");
  res.redirect(`/listings/${req.params.id}`); 
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewid } = req.params;
  let review = await Review.findById(reviewid);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to delete");
    return res.redirect(`/listings/${id}`);
  }
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
  await Review.findByIdAndDelete(reviewid);
  res.redirect(`/listings/${id}`);
};