var jwt = require("jsonwebtoken");
const fs = require('firebase-admin');
// import { Response } from "express"
// import { db } from './config/firebase'
// import * as express from 'express';
const db = fs.firestore(); 
// const usersDblogs = db.collection('logsofconnection'); 
//  const username = "snaimuh@googlemail.com";
// const password = "Deconnecter22";
// const username = "snaimuh@googlemail.com";
// let userhandlerProfils;
// let dataOfUsers = [];
const connectToAccount = async (req:any, res:any) => {
  try {
    let reqs = req.body;
    let id = reqs.username;
    let userhandlerProfil = await db.collection('account-handler').where('email', '==', id).get();
    let userDetail :any = '';
    if(userhandlerProfil.length !== 0){
      userhandlerProfil.forEach((doc:any) =>{
        userDetail = doc.data();
        jwt.sign({ data: id}, 'secret', { expiresIn: '1h' }, 
        function(err:any, encoded:any) {
          if (err) {
              return res.status(401).json({
                status: 'error',
                message: 'Veuillez vous reconnecter token expiration',
                err: err
              });
          }else{
              jwt.verify(encoded, 'secret', { expiresIn: '1h' },  function(err:any, decoded:any) {
                if (err) {
                  return res.status(200).json({
                    status: 'success',
                    message: 'Yo just get ERROR the token',
                    token: encoded,
                    err: err
                  });
                }else{
                  return res.status(200).json({
                    status: 'success',
                    message: 'Yo just get the token',
                    decoded: decoded,
                    emailUser:id,
                    token:encoded,
                    user:userDetail,
                  });
                }
              });
          }
        }
      );
      })
    }
  }
  catch(error:any) { 
    return res.status(500).json(error.message) 
  }
}


export { connectToAccount }