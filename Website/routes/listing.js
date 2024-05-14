const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const user = require("../models/user.js");
const listingController=require("../controllers/listing.js")
const multer = require("multer");
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};


//1) index route
//2) create route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
  isLoggedIn,
  upload.single("listing[image]"),
  wrapAsync(listingController.createListing) 
);
  

//New Route
router.get("/new", isLoggedIn, listingController.RenderNewForm);

//1) show route
//2) update route
//3) delete route
router
  .route("/:id")
  .get(wrapAsync(listingController.show))
  .put(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn, wrapAsync(listingController.destroyListing));


//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.editForm)
);

module.exports = router;
