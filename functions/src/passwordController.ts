// import { Response } from "express"
// import { db } from './config/firebase'
// import * as functions from 'firebase-functions'
// import { v4 as uuidv4 } from 'uuid';
// var jwt = require("jsonwebtoken");
// var btoa = require('btoa');
// var DateString = new Date().toLocaleDateString();
// var isoDateString = new Date().toISOString();

const setPasswordHash  = async (req: any, res: any) => {
  let reqs = req;
  let headers = reqs.headers;
  try {
    // let decodeds: any;

    //  jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
    //     if(err) {
    //       decodeds = 'err';
    //       return res.status(200).json({
    //         status:'Votre token a expiré',
    //         token:token,
    //         decoded:decodeds
    //       });
    //      }else {
    //       decodeds = 'no error';
          return res.status(200).json({
            status:'votre requetes est exécutée avec succés',

            headers: headers,
            // decoded: decodeds 
          });
    //   }
  //  });
  } catch(error:any) { return res.status(500).json(error.message) }

}



export { setPasswordHash }