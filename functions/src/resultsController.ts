// import { Response } from "express"
// import { db } from './config/firebase'
// // import * as functions from 'firebase-functions'
// import { v4 as uuidv4 } from 'uuid';
// var jwt = require("jsonwebtoken");
// // var btoa = require('btoa');
// var DateString = new Date().toLocaleDateString('en-GB');
// var isoDateString = new Date().toISOString();

// createResult
const createResult = async (req: any, res: any) => {
    // let newUuid = uuidv4();
    try {
      return res.status(200).json({
        response: {
            result:'success',
            message:'Utilisateur ajouté avec succés'
        },
      })
    }
    catch(error:any) { return res.status(500).json(error.message) }
  }
  

  
  
  export { createResult }
  