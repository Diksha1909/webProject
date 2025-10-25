const express = require('express');
const router = express.Router();
const collection = require('../models/sareeData');
router.get("/collectDetails", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      req.flash('error', 'You must be signed in first!');
      return res.redirect('/login');
    }

    const sareeDetails = {
      blackGold: await collection.find({ type: 'blackGold' }),
      blueBell: await collection.find({ type: 'blueBell' }),
      nexa: await collection.find({ type: 'nexa' }),
      raga: await collection.find({ type: 'raga' }),
      rozy: await collection.find({ type: 'rozy' }),
      ruby: await collection.find({ type: 'ruby' }),
    };

    const type = req.query.type || 'blackGold';
    res.render("Ecom/mainPage", { sareeDetails, type });
  } catch (e) {
    console.error("Error in /collectDetails:", e);
    res.status(500).send("Server Error");
  }
});

router.get("/admin",(req,res)=>{
    res.render('Ecom/admin')
})



module.exports = router;
