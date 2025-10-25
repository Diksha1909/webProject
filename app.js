const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const customerDetail = require('./models/customerDetails');
const customerDetailsRouter = require('./routes/customerDetails');
const sareeData = require('./routes/collections')
const {saredata} = require('./init/data')

mongoose.connect('mongodb://127.0.0.1:27017/chanchalSaree1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => { console.error("MongoDB connection error:", err); process.exit(1); });

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false
  }
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(customerDetail.authenticate()));
passport.serializeUser(customerDetail.serializeUser());
passport.deserializeUser(customerDetail.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user || null;
  next();
});

app.get('/', (req, res) => {
  res.render('Ecom/homePage');
});

app.get('/collection', async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      req.flash('error', 'You must be signed in first!');
      return res.redirect('/login');
    }
    const username = req.user.username;
    const user = await customerDetail.findOne({ username });
    if (!user) {
      req.flash('error', 'Please create an account first');
      return res.redirect('/signup');
    }
    res.render('Ecom/homePage');
  } catch (err) {
    next(err);
  }
});


app.use('/', customerDetailsRouter);
app.use('/',sareeData);

app.get('/profile',async(req,res)=>{
    res.render('Ecom/profile');
})
// e.g., in routes or app.js
app.get('/checkOut', (req, res) => {
  try {
    // If you’re using passport for authentication
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      req.flash('error', 'You must be signed in first!');
      return res.redirect('/login');
    }

    const currUser = req.user;                  // the authenticated user
    const cartItems = req.session.cart || [];   // default to empty array

    res.render('Ecom/checkCart', { currUser, cartItems });
  } catch (e) {
    console.error(e);
    res.status(500).render('error', { message: 'Internal server error' });
  }
});



app.use((err, req, res, next) => {
  const { status = 500 } = err;
  if (!err.message) err.message = 'Something went wrong';
  res.status(status).render('error', { err });
});


app.listen('8080', () => {
  console.log(`Server running on port 8080`);
});
