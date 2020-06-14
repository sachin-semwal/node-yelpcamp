let express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       =require("connect-flash");
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/users"),
    seedDB      = require("./seed");

let campgroundRoutes = require("./routes/campground")
let commentRoutes = require("./routes/comment")
let indexRoutes = require("./routes/index")

//Seed the DB
// seedDB();

//Passport config
app.use(require("express-session")({
    secret: "This is a secret key",
    resave: false,
    saveUninitialized: false
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
// mongoose.connect("mongodb+srv://sachin:semwal@cluster0-libmt.mongodb.net/yelpcamp?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.connect(process.env.DATABASEURL,  {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use(indexRoutes);


app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("YelpCamp app has started!");
});