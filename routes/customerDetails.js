const express = require('express');
const router = express.Router();
const customerDetail = require('../models/customerDetails');
const wrapAsync = require('../utils/wrapAsync');
const { savedRedirectUrl } = require('../middleware');
const passport = require('passport');

router.get('/signup',(req,res)=>{
    res.render('customerDetails/signUp.ejs');
})

router.post('/signup',wrapAsync(async(req,res)=>{
    
        let {username,emailId,password,Address,phone_no,location}=req.body;
        console.log(req.body)
        const existingUser = await customerDetail.findOne({username});
        console.log(`existingUser = ${existingUser}`)
        if(existingUser){
            
            req.flash('error','username is already exists, please choose another one.');

            return res.redirect('/signup');
        }
       
        const newUser = new customerDetail({emailId,username,Address,phone_no,location});
        console.log(`newUser = ${newUser._id}`)
        const registeredUser = await customerDetail.register(newUser,password);
        console.log(`registeredUser = ${registeredUser}`)
        //  req.session.quantity=0;
      
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
             req.session.quantity = registeredUser.quantity || 0;
            req.flash('success','user was successfully registered');
            res.redirect('/');
        })
  
}));

router.get('/login',(req,res)=>{
    res.render('customerDetails/login.ejs');
})
/
router.post('/login',savedRedirectUrl,passport.authenticate('local',{failureRedirect : '/login', failureFlash : true}),wrapAsync(async(req,res)=>{

    req.flash("success","welcome to chanchal saree! you are logged in! ");
     req.session.quantity = req.user.quantity || 0;
    req.session.save(err => {
        if (err) return next(err);
        res.redirect('/');
    });
}))

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
         req.session.orderItemList = [];
        req.session.quantity = 0;
        req.flash("success","you are logout now");
        res.redirect("/"); 
    });
});

module.exports =router;