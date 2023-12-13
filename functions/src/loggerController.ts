var jwt = require("jsonwebtoken");
const fs = require('firebase-admin');
// import { Response } from "express"
// import { db } from './config/firebase'
// import * as express from 'express';
const db = fs.firestore(); 
// const usersDblogs = db.collection('logsofconnection'); 
// const username = "snaimuh@googlemail.com";
// const password = "Deconnecter22";
const username = "bigministudiopd@gmail.com";
// let userhandlerProfils;
// let dataOfUsers = [];
const getToken = async (req:any, res:any) => {
  try {
    let userhandlerProfil = await db.collection('account-handler').where('email', '==', username).get();
    let userDetail :any = '';
    userhandlerProfil.forEach((doc:any) =>{
      userDetail = doc.data();
    })
    jwt.sign({ data: 'foobar'}, 'secret', { expiresIn: '1h' }, 
      function(err:any, encoded:any) {
        if (err) {
          return res.status(200).json({
            status: 'error',
            message: 'Yo just get ERROR the token',
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
                encoded:encoded,
                user:userDetail,
              });
            }
          });
        }
      }
    );
  }
  catch(error:any) { 
    return res.status(500).json(error.message) 
  }
}


export { getToken }