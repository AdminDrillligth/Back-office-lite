// var jwt = require("jsonwebtoken");
// const fs = require('firebase-admin');
import * as express from 'express';

// const app = express()

// const db = fs.firestore(); 
// const usersDblogs = db.collection('logsofconnection'); 
var router = express.Router();


// const username = "snaimuh@googlemail.com";
// const password = "Deconnecter22";

// let userhandlerProfils;
// let dataOfUsers = [];
router.post('/login', async (req, res) => {
  try {

    return res.status(200).json({
      status: 'success',
      message: 'entry updated successfully',

    })
  }
  catch(error:any) { return res.status(500).json(error.message) }
})