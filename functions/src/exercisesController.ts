// import { Response } from "express"
import { db } from './config/firebase'
import * as functions from 'firebase-functions'
// import { v4 as uuidv4 } from 'uuid';
var jwt = require("jsonwebtoken");
// var btoa = require('btoa');
// var DateString = new Date().toLocaleDateString('en-GB');
// var isoDateString = new Date().toISOString();
// var timeNow = new Date().toLocaleTimeString();




const createExercise  = async (req: any, res: any) => {
    let reqs = req;
    // let headers = reqs.headers;
    // let token = headers.token;
    let body = reqs.body;
    let globalHandler:any = [];
    // let lastPublicChangeCount="";
    // let lastSessionChangeCount = "";
    let userDetail :any = '';
    let idTable:any;

    const json = JSON.parse(body);
    let idUser = json.id;
    try {
      // jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err:any, decoded:any) {
      //     if(err) {
      //       return res.status(200).json({
      //         response: {
      //           result:'expiredTokenError',
      //           message:'Votre token a expiré'
      //         },
      //         token:token,
      //       });
      //      }else {
            const exercise_handler = db.collection('exercise-handler');
            exercise_handler.doc(json.json.header.id).set(json.json).then( async (ref:any) => {
              if(json.json.header.status === 'public'){
                const querySnapshotGlobalHandler = await db.collection('global_handler').get();
                querySnapshotGlobalHandler.forEach((doc: any) => {
                  globalHandler.push(doc.data());
                });

                globalHandler[0].lastPublicChangeCount = globalHandler[0].lastPublicChangeCount +1;
                const global_handler = db.collection('global_handler');
                global_handler.doc("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d").set(globalHandler[0]).then((ref:any) => {

                  return res.status(200).json({
                    response: {
                      result:'success',
                      message:''
                    },
                    json:json.json,
                    lastPublicChangeCount:globalHandler[0].publicExercisesChangeCount
                  });
                })
              }else{
                let userhandlerProfil = await db.collection('account-handler').where('id', '==', idUser).get();

                userhandlerProfil.forEach(async (doc:any) =>{
                    userDetail = doc.data();
                    idTable = doc.id
                });
                if(userDetail.privateExercisesChangeCount === undefined){
                  userDetail.privateExercisesChangeCount = 1;
                }else{
                  let count =  userDetail.privateExercisesChangeCount +1
                  userDetail.privateExercisesChangeCount = count;
                }

                // userDetail.privateExercisesChangeCount = isoDateString;
                const account_handler = db.collection('account-handler');
                account_handler.doc(idTable).update(userDetail);
                 return res.status(200).json({
                  response: {
                    result:'success',
                    message:''
                  },
                  json:json.json,
                  idUser:idUser,
                  userDetail:userDetail,
                  idTable:idTable
                 });
               }


            });
      //   }
      // });
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
          // return res.status(200).json({
          //   response: {
          //     result:'expiredTokenError',
          //     message:'Votre token a expiré'
          //   }
          //   token:token,
          //   decoded:decodeds
          // });
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
    let privateExercises:any=[];
    let token = headers.token;
    let webapp = headers.webapp
    let publicExercisesChangeCount =  headers.publicexerciseschangecount;
    publicExercisesChangeCount = Number(publicExercisesChangeCount);
    let privateExercisesChangeCount:any =  headers.privateexerciseschangecount;
    privateExercisesChangeCount = Number(privateExercisesChangeCount);
    let idUser = headers.id;
    let userDetail :any = '';
    // let idTable:any;
    let globalHandler:any = [];
    // let lastPublicChange = "";
    // let dateEarler="";
    // let dateEarlerPrivate ="";
    // let lastUserChangeDate="";
    // let lastPrivateChangeDate="";
    let lastPublicChangeCount="";
    let privatechanged = false;
    let publicChanged = false;
    let privateOnly = false;
    // let publicChanged = false;
    try {
      // sign token
      jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err:any, decoded:any) {
        if(err) {
          return res.status(200).json({
            response: {
              result:'expiredTokenError',
              message:'Votre token a expiré'
            },
          });
        }else {
          if(idUser !== undefined){
            const querySnapshotGlobalHandler = await db.collection('global_handler').get();
            querySnapshotGlobalHandler.forEach((doc: any) => {
              globalHandler.push(doc.data());
            });
            globalHandler.forEach((global:any)=>{
              if(global.publicExercisesChangeCount !== undefined){
                lastPublicChangeCount = global.publicExercisesChangeCount;
              }
            })
            let userhandlerProfil = await db.collection('account-handler').where('id', '==', idUser).get();
            // // const entryToken = db.collection('token-handler')

            // // let tokenHandler :any = '';
            // // let idOfTokenHandler :string='';
            userhandlerProfil.forEach(async (doc:any) =>{
                userDetail = doc.data();
            })
            privateOnly = userDetail.privateOnly;
            // functions.logger.log("DETAIL DU ROLE DANS LE GET EXERCIES ::::  ",userDetail.role )
            functions.logger.log("DETAIL TAININGS OF USER ::::  ",userDetail.trainings )
            // functions.logger.log("NOUS ALLONS CHERCHER LES EXERCIES ATTRIBUES AU OWNER ::::  ",userDetail.owner )
            // functions.logger.log("DETAIL COMPLET DU COMPTE ::::  ",userDetail )
            if(userDetail.role === 'staff'){
              // functions.logger.log("NOUS ALLONS CHERCHER LES EXERCIES ATTRIBUES AU OWNER ::::  ",userDetail.owner )
              userhandlerProfil = await db.collection('account-handler').where('id', '==', userDetail.owner).get();
              userhandlerProfil.forEach(async (doc:any) =>{
                userDetail = doc.data();
                if(userDetail.privateOnly === true){
                  privateOnly = userDetail.privateOnly;
                }
            })
            }
            let lastPrivateExercisesChangeCount = userDetail.privateExercisesChangeCount;
            if(userDetail.trainings.length > 0){
              const querySnapshot = await db.collection('exercise-handler').get();

              querySnapshot.forEach((doc: any) => { 
                allExercises.push({data:doc.data(), id: doc.id});
              });
              allExercises.forEach((exercise:any)=> {
                if(exercise.data.header.status === 'public'){
                  if(userDetail.privateOnly !== undefined ){
                    if(userDetail.privateOnly === false){
                      publicChanged = true;
                      if(userDetail.trainings.length > 0 && webapp !== '1'){
                        userDetail.trainings.forEach((training:any)=>{
                          if(training === exercise.data.header.id){
                            publicExercises.push(exercise.data)
                          }
                        })
                      }else{
                        publicExercises.push(exercise.data)
                      }
                    }
                  }else{
                    publicChanged = true;
                    if(userDetail.trainings.length > 0 && webapp !== '1'){
                      userDetail.trainings.forEach((training:any)=>{
                        if(training === exercise.data.header.id){
                          publicExercises.push(exercise.data)
                        }
                      })
                    }else{
                      publicExercises.push(exercise.data)
                    }
                  }
                  publicExercises.sort((a:any, b:any) => a.header.title.normalize().localeCompare(b.header.title.normalize()));
                }else{
                  if(idUser !== 'null'){
                    if(lastPrivateExercisesChangeCount > 0){
                      privatechanged = true;
                      if(exercise.data.header.owner  !== undefined){
                        if(idUser === exercise.data.header.owner.id){ 
                          if(userDetail.trainings.length > 0 && webapp !== '1'){
                            userDetail.trainings.forEach((training:any)=>{
                              if(training === exercise.data.header.id){
                                privateExercises.push(exercise.data)
                              }
                            })
                          }else{
                            privateExercises.push(exercise.data)
                          }
                          
                          privateExercises.sort((a:any, b:any) => a.header.title.normalize().localeCompare(b.header.title.normalize()));}
                      }
                    }
                    
                  }

                }
              })
              if(lastPrivateExercisesChangeCount === undefined || lastPrivateExercisesChangeCount === 0){
                privateExercises = [];
                lastPrivateExercisesChangeCount = 0;
                privatechanged = false;
              }
              return res.status(200).json({
                response: {
                  result:'success',
                  message:''
                },
                publicExercises:publicExercises,
                privateExercises:privateExercises,
                publicChanged:publicChanged,
                privateChanged:privatechanged,
                publicExercisesChangeCount:0,
                privateExercisesChangeCount:0,
                idUser:idUser,
              });
            }else{
              if(publicExercisesChangeCount === lastPublicChangeCount || publicExercisesChangeCount > lastPublicChangeCount){

                if(privateExercisesChangeCount === lastPrivateExercisesChangeCount || privateExercisesChangeCount > lastPrivateExercisesChangeCount){
                  privatechanged = false;
                }
                if(privateExercisesChangeCount === 0){
                  privatechanged = true;
                  const querySnapshot = await db.collection('exercise-handler').get();
  
                  querySnapshot.forEach((doc: any) => { 
                    
                    allExercises.push({data:doc.data(), id: doc.id});
                  });
  
                  allExercises.forEach((exercise:any)=> {
                    if(exercise.data.header.status === 'private'){
                      if(idUser !== 'null'){
                        if(exercise.data.header.owner  !== undefined){
                          if(idUser === exercise.data.header.owner.id){
                            // if a selection was doing trainings data inside account :
                            // if()
                            functions.logger.log("DETAIL TAININGS OF USER :::: + HEADER EX ",userDetail.trainings , exercise.data.header.id)
                            privateExercises.push(exercise.data)
                            privateExercises.sort((a:any, b:any) => a.header.title.normalize().localeCompare(b.header.title.normalize())); }
                        }
                      }
                    }
                  })
                }
                else if(privateExercisesChangeCount < lastPrivateExercisesChangeCount && privateExercisesChangeCount !== 0){
                  const querySnapshot = await db.collection('exercise-handler').get();
                  privatechanged = true;
                  querySnapshot.forEach((doc: any) => { allExercises.push({data:doc.data(), id: doc.id});});
  
                  allExercises.forEach((exercise:any)=> {
                    if(exercise.data.header.status === 'private'){
                      if(idUser !== 'null'){
                        if(exercise.data.header.owner  !== undefined){
                          if(idUser === exercise.data.header.owner.id){ 
                            privateExercises.push(exercise.data)
                            privateExercises.sort((a:any, b:any) => a.header.title.normalize().localeCompare(b.header.title.normalize()));}
                        }
                      }
                    }
                  })
                }
                if(lastPrivateExercisesChangeCount === undefined || lastPrivateExercisesChangeCount === 0){
                  privateExercises = [];
                  lastPrivateExercisesChangeCount = 0;
                  privatechanged = false;
                }
                if(privateOnly === true){
                  publicExercises = [];
                  publicChanged = false;
                }
  
                // functions.logger.log("DETAIL LAST PRIVATE EXERCISE ::::  ",lastPrivateExercisesChangeCount )
                return res.status(200).json({
                  response: {
                    result:'success',
                    message:''
                  },
                  publicExercises:publicExercises,
                  privateExercises:privateExercises,
                  publicChanged:publicChanged,
                  privateChanged:privatechanged,
                  publicExercisesChangeCount:lastPublicChangeCount,
                  privateExercisesChangeCount:lastPrivateExercisesChangeCount,
                  idUser:idUser,
                });
  
              }
              if(publicExercisesChangeCount === 0){
                const querySnapshot = await db.collection('exercise-handler').get();
                
                querySnapshot.forEach((doc: any) => {
                    allExercises.push({data:doc.data(), id: doc.id});
                });
                allExercises.forEach((exercise:any)=> {
                  functions.logger.log("DETAIL TAININGS OF USER :::: + HEADER EX ",userDetail.trainings , exercise.data.header.id)
           
                  if(exercise.data.header.status === 'public'){
                    if(userDetail.privateOnly !== undefined ){
                      if(userDetail.privateOnly === false){
                          publicExercises.push(exercise.data)
                      }
                    }else{
                        publicExercises.push(exercise.data)
                    }
                    publicExercises.sort((a:any, b:any) => a.header.title.normalize().localeCompare(b.header.title.normalize()));
                  }else{
                    if(privateExercisesChangeCount === lastPrivateExercisesChangeCount || privateExercisesChangeCount > lastPrivateExercisesChangeCount){
                      privatechanged = false;
                    }
                    if(privateExercisesChangeCount === 0){
                      if(idUser !== 'null'){
                        privatechanged = true;
                        if(exercise.data.header.owner  !== undefined){
                          if(idUser === exercise.data.header.owner.id){
                            privateExercises.push(exercise.data)
                            privateExercises.sort((a:any, b:any) => a.header.title.normalize().localeCompare(b.header.title.normalize()));}
                        }
                      }
                    }
                    else if(privateExercisesChangeCount < lastPrivateExercisesChangeCount && privateExercisesChangeCount !== 0){
                      privatechanged = true;
                      if(idUser !== 'null'){
                        if(exercise.data.header.owner  !== undefined){
                          if(idUser === exercise.data.header.owner.id){ 
                            privateExercises.push(exercise.data)
                            privateExercises.sort((a:any, b:any) => a.header.title.normalize().localeCompare(b.header.title.normalize()));}
                        }
                      }
                    }
                    if(lastPrivateExercisesChangeCount === undefined || lastPrivateExercisesChangeCount === 0){
                      privateExercises = [];
                      lastPrivateExercisesChangeCount = 0;
                      privatechanged = false;
                    }
  
  
                  }
                })
  
                if(privateOnly === true){
                  publicExercises = [];
                  publicChanged = false;
                }else{
                  publicChanged = true;
                }
                return res.status(200).json({
                  response: {
                    result:'success',
                    message:''
                  },
                  publicExercises:publicExercises,
                  privateExercises:privateExercises,
                  publicChanged:publicChanged,
                  privateChanged:privatechanged,
                  publicExercisesChangeCount:lastPublicChangeCount,
                  privateExercisesChangeCount:lastPrivateExercisesChangeCount,
                  idUser:idUser,
                });
  
              }
              else if(publicExercisesChangeCount < lastPublicChangeCount && publicExercisesChangeCount !== 0){
  
                const querySnapshot = await db.collection('exercise-handler').get();
                querySnapshot.forEach((doc: any) => {
                    allExercises.push({data:doc.data(), id: doc.id});
                });
                allExercises.forEach((exercise:any)=> {
                  functions.logger.log("DETAIL TAININGS OF USER :::: + HEADER EX ",userDetail.trainings , exercise.data.header.id)
                  if(exercise.data.header.status === 'public'){
                    if(userDetail.privateOnly !== undefined ){
                      if(userDetail.privateOnly === false){
                          publicExercises.push(exercise.data)
                      }
                    }else{
                          publicExercises.push(exercise.data)
                    }
                  }else{
                    if(privateExercisesChangeCount === lastPrivateExercisesChangeCount || privateExercisesChangeCount > lastPrivateExercisesChangeCount){
                      privatechanged = false;
                    }
                    if(privateExercisesChangeCount === 0){
                      if(idUser !== 'null'){
                        privatechanged = true;
                        if(exercise.data.header.owner  !== undefined){
                          if(idUser === exercise.data.header.owner.id){ 
                            privateExercises.push(exercise.data)
                            privateExercises.sort((a:any, b:any) => a.header.title.normalize().localeCompare(b.header.title.normalize()));
                          }
                        }
                      }
                    }
                    else if(privateExercisesChangeCount < lastPrivateExercisesChangeCount && privateExercisesChangeCount !== 0){
                      if(idUser !== 'null'){
                        privatechanged = true;
                        if(exercise.data.header.owner  !== undefined){
                          if(idUser === exercise.data.header.owner.id){ 
                            privateExercises.push(exercise.data)
                            privateExercises.sort((a:any, b:any) => a.header.title.normalize().localeCompare(b.header.title.normalize()));}
                        }
                      }
                    }
                    if(lastPrivateExercisesChangeCount === undefined || lastPrivateExercisesChangeCount === 0){
                      privateExercises = [];
                      lastPrivateExercisesChangeCount = 0;
                      privatechanged = false;
                    }
  
                  }
                })
                publicExercises.sort((a:any, b:any) => a.header.title.normalize().localeCompare(b.header.title.normalize()));
                // publicExercises.sort(compareByName())
                if(privateOnly === true){
                  publicExercises = [];
                  publicChanged = false;
                }
                else{
                  publicChanged = true;
                }
                return res.status(200).json({
                  response: {
                    result:'success',
                    message:''
                  },
                  publicExercises:publicExercises,
                  privateExercises:privateExercises,
                  publicChanged:publicChanged,
                  privateChanged: privatechanged,
                  publicExercisesChangeCount:lastPublicChangeCount,
                  privateExercisesChangeCount:lastPrivateExercisesChangeCount,
                  // lastPublicChangeCount:lastPublicChangeCount,
                  idUser:idUser,
                });
  
              }
            }
            }
            
    //  });
        }
      })
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



