// import { Response } from "express"
import { db } from './config/firebase'
// import * as functions from 'firebase-functions'
// import { v4 as uuidv4 } from 'uuid';
var jwt = require("jsonwebtoken");
// var btoa = require('btoa');
// var DateString = new Date().toLocaleDateString('en-GB');
// var isoDateString = new Date().toISOString();
// var timeNow = new Date().toLocaleTimeString();

const createSession  = async (req: any, res: any) => {
    let reqs = req;
    let headers = reqs.headers;
    let token = headers.token;
    let body = reqs.body;
    // let status_private = false;
    const json = JSON.parse(body);
    try {
      jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
          if(err) {
            return res.status(200).json({
              response: {
                result:'expiredTokenError',
                message:''
              },
            });
           }else {
            const session_handler = db.collection('session-handler'); 
            session_handler.doc(json.json.header.id).set(json.json).then((ref:any) => {
            return res.status(200).json({
              response: {
                result:'success',
                message:''
              },
              session:json.json
            });
          })
        }
      });
    } catch(error:any) { return res.status(500).json(error.message) }
}


// ON RECUPERE LA LISTE DES ADMINS VIA GET
const getSessionDetails = async (req: any, res: any) => {

  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;
//   let username = headers.username
  try {
// // //     const allSessions: any[] = [];
// // //     const querySnapshot = await db.collection('session-handler').get();
    jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
        if(err) {
          return res.status(200).json({
            response: {
              result:'expiredTokenError',
              message:''
            },

          });
        }else {
// //           querySnapshot.forEach((doc: any) => {
// //             allUsers.push({data:doc.data(), id: doc.id});
// //           });
          return res.status(200).json({
            response: {
              result:'success',
              message:''
            },
            // allUsers: allUsers,
            // username:username,
          });
        }
    });
  } catch(error:any) { return res.status(500).json(error.message) }
}


// 
const getSessionsList = async (req: any, res: any) => {
    let reqs = req;
    let headers = reqs.headers;
    let token = headers.token;
    // let username = headers.username;
    try {
      const allSessionsOfUser: any[] = [];
      const querySnapshot = await db.collection('session-handler').get();
      jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
          if(err) {
            return res.status(200).json({
              response: {
                result:'expiredTokenErrror',
                message:''
              },
            });
          }else {
            querySnapshot.forEach((doc: any) => {
              allSessionsOfUser.push(doc.data());
            });
            return res.status(200).json({
              response: {
                result:'success',
                message:''
              },
              publicSessions:allSessionsOfUser
            });
          }
     });
    } catch(error:any) { return res.status(500).json(error.message) }
  }

  const updateSession = async (req: any, res: any) => {
    let reqs = req;
    let headers = reqs.headers;
    let token = headers.token;
    try {
      jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
        if(err) {
          return res.status(200).json({
            response: {
              result:'expiredTokenError',
              message:''
            },
          });
        }else {

          return res.status(200).json({
            response: {
              result:'success',
              message:''
            },
          });
        }
      });
    }
    catch(error:any) { return res.status(500).json(error.message)
    }
  }


  const deleteSession = async (req: any, res: any) => {
    let reqs = req;
    let headers = reqs.headers;
    let token = headers.token;
    try {
//       // const userCollection = db.collection('session-handler').doc(id)
//       // await userCollection.delete().catch((error:any) => {
//       //   return res.status(400).json({
//       //     status: 'error',
//       //     message: error.message
//       //   })
//       // })
      jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
        if(err) {
          return res.status(200).json({
            response: {
              result:'expiredTokenError',
              message:''
            },
          });
        }else {
// //           querySnapshot.forEach((doc: any) => {
// //             allUsers.push({data:doc.data(), id: doc.id});
// //           });
          return res.status(200).json({
            response: {
              result:'success',
              message:''
            },
          });
        }
      });
    }
    catch(error:any) { 
      return res.status(500).json(error.message) 
    }
  }

  // 
 export { createSession, getSessionDetails , getSessionsList, updateSession, deleteSession }



