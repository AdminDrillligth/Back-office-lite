// import { Response } from "express"
import { db } from './config/firebase'
// import * as functions from 'firebase-functions'
// import { v4 as uuidv4 } from 'uuid';
var jwt = require("jsonwebtoken");
// var btoa = require('btoa');
// var DateString = new Date().toLocaleDateString('en-GB');
// var isoDateString = new Date().toISOString();
// var timeNow = new Date().toLocaleTimeString();




const createExercise  = async (req: any, res: any) => {
    let reqs = req;
    let headers = reqs.headers;
    let token = headers.token;
    let body = reqs.body;
    // let status_private = false;
    const json = JSON.parse(body);
    try {
      // let decodeds: any;
      jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err:any, decoded:any) {
          if(err) {
            // decodeds = 'err';
            return res.status(200).json({
              response: {
                result:'expiredTokenError',
                message:'Votre token a expiré'
              },
              token:token,
              // decoded:decodeds
            });
           }else {
            // decodeds = 'no error';
            // if(json.json.description.status === 'status_private'){
            //   status_private = true;
            // }
            const exercise_handler = db.collection('exercise-handler'); 
            exercise_handler.doc(json.json.header.id).set(json.json).then((ref:any) => {
                return res.status(200).json({
                  response: {
                    result:'success',
                    message:''
                  },
                  json:json.json,
                  // status_private:status_private,
                  token: token,
                  // exercise_handler:exercise_handler,
                  // decoded: decodeds 
                });
            });
        }
      });
    } catch(error:any) {
       return res.status(500).json(error.message) 
    }
}


// Exercise details
const getExerciseDetails = async (req: any, res: any) => {
  // 
  // let reqs = req;
  // let headers = reqs.headers;
  // let token = headers.token;
  // let username = headers.username;
  // let idExercise = headers.id
  try {
  //   let decodeds: any;
  //   let Exercise: any = [];
  //   let ExerciseDetails : {header:any, steps:any} = {header:"", steps:""};
  //   jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err:any, decoded:any) {
  //       if(err) {
  //         decodeds = 'err';
  //         return res.status(200).json({
  //           response: {
  //             result:'expiredTokenError',
  //             message:'Votre token a expiré'
  //           }
  //           token:token,
  //           decoded:decodeds
  //         });
  //       } else {
  //         decodeds = 'no error';
  //         const querySnapshot = await db.collection('exercise-handler').doc(idExercise).get();
  //         Exercise = querySnapshot.data();
  //         // ExerciseDetail.header = Exercise.header;
  //         // ExerciseDetail.steps = Exercise.steps;
  //         ExerciseDetails.header = Exercise.header;
  //         ExerciseDetails.steps = Exercise.steps;
  //         return res.status(200).json({
  //           response: {
  //             result:'success',
  //             message:'Requête effectuée avec succès'
  //           },
  //           ExerciseDetails:ExerciseDetails,
  //           token: token,
  //           username:username,
  //           decoded: decodeds 
  //         });
  //       }
  //   });
  } catch(error:any) { return res.status(500).json(error.message) }
}




// 
const getExercisesList = async (req: any, res: any) => {
    // Liste des exercises disponibles pour cet utilisateur
    // Tous les exercises publics + les exercises présents en mode privé
    let reqs = req;
    let headers = reqs.headers;
    let allExercises:any = [];
    let publicExercises:any=[];
    // let privateExercises:any=[];
    // let token = headers.token;
    let username = headers.username;
    try {
      // let decodeds: any;
      // const allExercisesOfUser: any[] = [];
      const querySnapshot = await db.collection('exercise-handler').get();
      querySnapshot.forEach((doc: any) => {
          allExercises.push({data:doc.data(), id: doc.id});
      });
      allExercises.forEach((exercise:any)=> {
        if(exercise.data.header.status === 'status_public'){
          publicExercises.push(exercise.data)
        }
      });
      // jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
      //     if(err) {
      //       decodeds = 'err';
      //       return res.status(200).json({
      //         status:'Votre token a expiré',
      //         token:token,
      //         decoded:decodeds
      //       });
      //     }else {
            // decodeds = 'no error';
            return res.status(200).json({
              response: {
                result:'success',
                message:'Requête effectuée avec succès'
              },
              publicExercises:publicExercises,
              // privateExercises:privateExercises,
              numberOfPublicExercises:publicExercises.length,
              // numberOfPrivateExercises:privateExercises.length,
              // token: token,
              username:username,
              // decoded: decodeds 
            });
    //       }
    //  });
    } catch(error:any) { return res.status(500).json(error.message) }
  }

  const updateExercise = async (req: any, res: any) => {
    let reqs = req;
    let headers = reqs.headers;
    let token = headers.token;
    try {
      let decodeds: any;
      jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
        if(err) {
          decodeds = 'err';
          return res.status(200).json({
            response:'Votre token a expiré',
            token:token,
            decoded:decodeds
          });
        }else {
          decodeds = 'no error';

          return res.status(200).json({
            response:'votre requetes est exécutée avec succés',

            token: token,
            decoded: decodeds 
          });
        }
      });
    }
    catch(error:any) { return res.status(500).json(error.message)
    }
  }


  const deleteExercise = async (req: any, res: any) => {
    let reqs = req;
    let headers = reqs.headers;
    let token = headers.token;
    try {
      let decodeds: any;
      // const userCollection = db.collection('account-handler').doc(id)
      // await userCollection.delete().catch((error:any) => {
      //   return res.status(400).json({
      //     status: 'error',
      //     message: error.message
      //   })
      // })
      jwt.verify(token, 'secret', { expiresIn: '24h' },  function(err:any, decoded:any) {
        if(err) {
          decodeds = 'err';
          return res.status(200).json({
            response:'Votre token a expiré',
            token:token,
            decoded:decodeds
          });
        }else {
          decodeds = 'no error';
// //           querySnapshot.forEach((doc: any) => {
// //             allUsers.push({data:doc.data(), id: doc.id});
// //           });
          return res.status(200).json({
            response:'votre requetes est exécutée avec succés',
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
 export { createExercise, getExerciseDetails , getExercisesList, updateExercise, deleteExercise }



