var jwt = require("jsonwebtoken");
const fs = require('firebase-admin');
// import { Response } from "express"
// import { db } from './config/firebase'
// import * as express from 'express';
const db = fs.firestore(); 
// const usersDblogs = db.collection('logsofconnection'); 
// const username = "snaimuh@googlemail.com";
// const password = "Deconnecter22";
const username = "snaimuh@googlemail.com";
// let userhandlerProfils;
// let dataOfUsers = [];
const connectToAccount = async (req:any, res:any) => {


  try {
    let reqs = req.query;
    let id = reqs.username;
    let userhandlerProfil = await db.collection('account-handler').where('email', '==', username).get();
    let userDetail :any = '';
    if(userhandlerProfil.length !== 0){
      userhandlerProfil.forEach((doc:any) =>{
        userDetail = doc.data();
        jwt.sign({ data: 'foobar'}, 'secret', { expiresIn: '1h' }, 
        function(err:any, encoded:any) {
          if (err) {
            return res.status(401).json({
              status: 'error',
              message: 'Veuillez vous reconnecter',
              err: err
            });
          }else{
            jwt.verify(encoded, 'secret', { expiresIn: '1h' },  function(err:any, decoded:any) {
              if (err) {
                return res.status(200).json({
                  status: 'success',
                  message: 'Yo just get ERROR the token',
                  err: err
                });
              }else{
                return res.status(200).json({
                  status: 'success',
                  message: 'Yo just get the token',
                  decoded: decoded,
                  emailUser:id,
                  encoded:encoded,
                  user:userDetail,
                });
              }
            });
          }
        }
      );
      })
      
    }else{
      return res.status(401).json({
        status: 'error',
        message: 'Pas d\'utilisateur à cet adresse email',
      });
    }
    
  }
  catch(error:any) { 
    return res.status(500).json(error.message) 
  }
}


export { connectToAccount }