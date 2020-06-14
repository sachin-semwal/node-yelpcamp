let express = require("express");
let router = express.Router();
let passport = require("passport");
let User = require("../models/users");


//Root Route
router.get("/", function(req, res){
    res.render("landing");
})


//=====================================================================
//Auth Routes
//=====================================================================

//Sign Up Route
router.get("/register", function(req, res){
    res.render("register");
})

router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error",err.message);
            res.render("register");
        }else(
            passport.authenticate("local")(req, res, function(){
                req.flash("success","Welcome to YelpCamp "+user.username);
                res.redirect("/campgrounds");
            })
        )
    })
});


//login Route
router.get("/login", function(req, res){
    res.render("login");
})

router.post("/login",passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});


//logout Route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success","Logged you out");
    res.redirect("/campgrounds");
});



module.exports = router;
