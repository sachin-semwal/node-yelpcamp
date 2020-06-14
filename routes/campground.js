let express = require("express");
let router = express.Router();
let Campground = require("../models/campground");
let middleware = require("../middleware");

//Index Route
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log("Something went Wrong");
            console.log(err);
        }else{
            res.render("campgrounds/index",{campgrounds: campgrounds});
        }
    })
    
})

//Create Route
router.post("/",middleware.isLoggedIn, function(req, res){
    let name = req.body.name;
    let price = req.body.price;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let campground = { name: name, price: price, image: image, description: desc, author: author};
    Campground.create(campground, function(err, campground){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds");
        }
    })
    
})


//New Route
router.get("/new",middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
})

//SHOW Route
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    })
})


//Edit Campground Route
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
        Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", {campground: foundCampground});
        });
});

//Update Campground Route
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})


//Destroy Route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    })
})


module.exports = router;