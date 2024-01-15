// import { Response } from "express"
// import { db } from './config/firebase'
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
    try {
      let decodeds: any;

      jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
          if(err) {
            decodeds = 'err';
            return res.status(200).json({
              status:'Votre token a expiré',
              token:token,
              decoded:decodeds
            });
           }else {
            decodeds = 'no error';
            return res.status(200).json({
              status:'votre requetes est exécutée avec succés',

              token: token,
              decoded: decodeds 
            });
        }
      });
    } catch(error:any) { return res.status(500).json(error.message) }
}


// ON RECUPERE LA LISTE DES ADMINS VIA GET
// REQUEST TEMPLATE
// JUST BEARER TOKEN
const getSessionDetails = async (req: any, res: any) => {

  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;
//   let username = headers.username
  try {
    let decodeds: any;
// // //     const allUsers: any[] = [];
// // //     const querySnapshot = await db.collection('exercises-handler').get();
    jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
        if(err) {
          decodeds = 'err';
          return res.status(200).json({
            status:'Votre token a expiré',
            token:token,
            decoded:decodeds
          });
        }else {
          decodeds = 'no error';
// //           querySnapshot.forEach((doc: any) => {
// //             allUsers.push({data:doc.data(), id: doc.id});
// //           });
          return res.status(200).json({
            status:'votre requetes est exécutée avec succés',
            // allUsers: allUsers,
            token: token,
            // username:username,
            decoded: decodeds 
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
      let decodeds: any;
    //   const allExercisesOfUser: any[] = [];
    //   const querySnapshot = await db.collection('exercises-handler').get();
      jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
          if(err) {
            decodeds = 'err';
            return res.status(200).json({
              status:'Votre token a expiré',
              token:token,
              decoded:decodeds
            });
          }else {
            decodeds = 'no error';
            // querySnapshot.forEach((doc: any) => {
            //   allExercisesOfUser.push({data:doc.data(), id: doc.id});
            // });
            return res.status(200).json({
              status:'votre requetes est exécutée avec succés',
              token: token,
              decoded: decodeds 
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
      let decodeds: any;
      jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
        if(err) {
          decodeds = 'err';
          return res.status(200).json({
            status:'Votre token a expiré',
            token:token,
            decoded:decodeds
          });
        }else {
          decodeds = 'no error';

          return res.status(200).json({
            status:'votre requetes est exécutée avec succés',

            token: token,
            decoded: decodeds 
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
      let decodeds: any;
//       // const userCollection = db.collection('account-handler').doc(id)
//       // await userCollection.delete().catch((error:any) => {
//       //   return res.status(400).json({
//       //     status: 'error',
//       //     message: error.message
//       //   })
//       // })
      jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
        if(err) {
          decodeds = 'err';
          return res.status(200).json({
            status:'Votre token a expiré',
            token:token,
            decoded:decodeds
          });
        }else {
          decodeds = 'no error';
// //           querySnapshot.forEach((doc: any) => {
// //             allUsers.push({data:doc.data(), id: doc.id});
// //           });
          return res.status(200).json({
            status:'votre requetes est exécutée avec succés',
            // allUsers: allUsers,
            token: token,
            decoded: decodeds 
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



