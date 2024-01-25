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
    let globalHandler:any = [];
    // let lastPublicChange = "";
    // let dateEarler="";
    // let dateEarlerPrivate ="";
    // let lastUserChangeDate="";
    // let lastPrivateChangeDate="";
    let lastPublicChangeCount="";
    let lastExercicePublicChangeCount="";
    let userDetail :any = '';
    let idTable:any;
    // let status_private = false;
    const json = JSON.parse(body);
    let idUser = json.id;

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
            session_handler.doc(json.json.header.id).set(json.json).then(async (ref:any) => {
            // return res.status(200).json({
            //   response: {
            //     result:'success',
            //     message:''
            //   },
            //   session:json.json
            // });
            if(json.json.header.status === 'public'){
              const querySnapshotGlobalHandler = await db.collection('global_handler').get();
              querySnapshotGlobalHandler.forEach((doc: any) => {
                globalHandler.push(doc.data());
              });
              globalHandler.forEach((global:any)=>{
                if(global.publicSessionsChangeCount !== undefined){
                  lastPublicChangeCount = global.publicSessionsChangeCount;
                  lastExercicePublicChangeCount = global.publicExercisesChangeCount
                }
              })
              let data = {publicSessionsChangeCount:lastPublicChangeCount+1,publicExercisesChangeCount:lastExercicePublicChangeCount }
              const global_handler = db.collection('global_handler');
              global_handler.doc("9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d").set(data).then((ref:any) => {
                return res.status(200).json({
                  response: {
                    result:'success',
                    message:''
                  },
                  json:json.json,
                  lastPublicChangeCount:data.publicSessionsChangeCount
                });
              })
            }else{
              // if private
              let userhandlerProfil = await db.collection('account-handler').where('id', '==', idUser).get();

                userhandlerProfil.forEach(async (doc:any) =>{
                    userDetail = doc.data();
                    idTable = doc.id
                });
                if(userDetail.privateSessionsChangeCount === undefined){
                  userDetail.privateSessionsChangeCount = 1;
                }else{
                  let count =  userDetail.privateSessionsChangeCount +1
                  userDetail.privateSessionsChangeCount = count;
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
const testgetSessionsList = async (req: any, res: any) => {
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;
  let idUser = headers.id;
  let globalHandler:any = [];
  let publicSessionsChangeCount =  headers.publicsessionschangecount;
  publicSessionsChangeCount = Number(publicSessionsChangeCount);
  let lastPublicChangeCount="";
  // let username = headers.username;
  try {
    const allSessionsOfUser: any[] = [];
    let allSessionsPublic: any = [];
    let allSessionsPrivate: any = [];
    jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err:any, decoded:any) {
        if(err) {
          return res.status(200).json({
            response: {
              result:'expiredTokenErrror',
              message:''
            },
          });
        }else {

          if(idUser !== undefined){
            const querySnapshotGlobalHandler = await db.collection('global_handler').get();
            querySnapshotGlobalHandler.forEach((doc: any) => {
              globalHandler.push(doc.data());
            });
            globalHandler.forEach((global:any)=>{
              if(global.publicSessionsChangeCount !== undefined){
                lastPublicChangeCount = global.publicSessionsChangeCount;
              }
            })
            if(publicSessionsChangeCount === 0){
              const querySnapshot = await db.collection('session-handler').get();
              querySnapshot.forEach((doc: any) => {
            
                allSessionsOfUser.push(doc.data());
              });
              allSessionsOfUser.forEach((session:any)=> {
                if(session.header.status === 'public'){
                  allSessionsPublic.push(session)
                }
              });

              return res.status(200).json({
                response: {
                  result:'success',
                  message:''
                },
                publicSessions:allSessionsPublic,
                privateSessions:allSessionsPrivate,
                publicSessionsChangeCount:lastPublicChangeCount,
                publicChanged:true,
                privateChanged:false,
                privateSessionsChangeCount:1,
                idUser:idUser,
              });
    
    
            }
            // let userhandlerProfil = await db.collection('account-handler').where('id', '==', idUser).get();
            // // const entryToken = db.collection('token-handler')
          
            // // let tokenHandler :any = '';
            // // let idOfTokenHandler :string='';
            // userhandlerProfil.forEach(async (doc:any) =>{
            //     userDetail = doc.data();
            //     idTable = doc.id
            // })
            if(publicSessionsChangeCount === lastPublicChangeCount || publicSessionsChangeCount > lastPublicChangeCount){
              return res.status(200).json({
                response: {
                  result:'success',
                  message:''
                },
                publicSessions:allSessionsPublic,
                privateSessions:allSessionsPrivate,
                publicChanged:false,
                privateChanged:false,
                publicSessionsChangeCount:lastPublicChangeCount,
                privateSessionsChangeCount:1,
                idUser:idUser,
              });

    
            }
            // }
            else if(publicSessionsChangeCount < lastPublicChangeCount && publicSessionsChangeCount !== 0){
              const querySnapshot = await db.collection('session-handler').get();
              querySnapshot.forEach((doc: any) => {
            
                allSessionsOfUser.push(doc.data());
              });
              allSessionsOfUser.forEach((session:any)=> {
                if(session.header.status === 'public'){
                  allSessionsPublic.push(session)
                }
              });
              return res.status(200).json({
                response: {
                  result:'success',
                  message:''
                },
                publicSessions:allSessionsPublic,
                privateSessions:allSessionsPrivate,
                publicChanged:true,
                privateChanged:false,
                publicSessionsChangeCount:lastPublicChangeCount,
                privateSessionsChangeCount:1,
                idUser:idUser,
              });
            }


          }
        }
   });
  } catch(error:any) { return res.status(500).json(error.message) }
}


// 
const getSessionsList = async (req: any, res: any) => {
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token;
  let idUser = headers.id;
  let globalHandler:any = [];
  let publicSessionsChangeCount =  headers.publicsessionschangecount;
  publicSessionsChangeCount = Number(publicSessionsChangeCount);

  let privateSessionsChangeCount =  headers.privatesessionschangecount;
  privateSessionsChangeCount = Number(privateSessionsChangeCount);

  let lastPublicChangeCount="";
  let userDetail :any = '';

  // let username = headers.username;
  try {
    const allSessionsOfUser: any[] = [];
    let allSessionsPublic: any = [];
    let allSessionsPrivate: any = [];
    jwt.verify(token, 'secret', { expiresIn: '24h' }, async function(err:any, decoded:any) {
        if(err) {
          return res.status(200).json({
            response: {
              result:'expiredTokenErrror',
              message:''
            },
          });
        }else {

          if(idUser !== undefined){
            const querySnapshotGlobalHandler = await db.collection('global_handler').get();
            querySnapshotGlobalHandler.forEach((doc: any) => {
              globalHandler.push(doc.data());
            });
            globalHandler.forEach((global:any)=>{
              if(global.publicSessionsChangeCount !== undefined){
                lastPublicChangeCount = global.publicSessionsChangeCount;
              }
            })
            let userhandlerProfil = await db.collection('account-handler').where('id', '==', idUser).get();
            userhandlerProfil.forEach(async (doc:any) =>{
                userDetail = doc.data();
                // idTable = doc.id
            })

            let lastPrivateSessionsChangeCount = userDetail.privateSessionsChangeCount;
            if(publicSessionsChangeCount === 0){

              const querySnapshot = await db.collection('session-handler').get();
              querySnapshot.forEach((doc: any) => {
                allSessionsOfUser.push(doc.data());
              });
              allSessionsOfUser.forEach((session:any)=> {
                if(session.header.status === 'public'){
                  allSessionsPublic.push(session)
                }else{
                  if(privateSessionsChangeCount === lastPrivateSessionsChangeCount || privateSessionsChangeCount > lastPrivateSessionsChangeCount){

                  }
                  if(privateSessionsChangeCount === 0){
                    if(idUser !== 'null'){
                      if(session.header.owner  !== undefined){
                        if(idUser === session.header.owner.id){ allSessionsPrivate.push(session) }
                      }
                    }
                  }
                  else if(privateSessionsChangeCount < lastPrivateSessionsChangeCount && privateSessionsChangeCount !== 0){
                    if(idUser !== 'null'){
                      if(session.header.owner  !== undefined){
                        if(idUser === session.header.owner.id){ allSessionsPrivate.push(session) }
                      }
                    }
                  }
                }

              });

              return res.status(200).json({
                response: {
                  result:'success',
                  message:''
                },
                publicSessions:allSessionsPublic,
                privateSessions:allSessionsPrivate,
                publicSessionsChangeCount:lastPublicChangeCount,
                publicChanged:true,
                privateChanged:false,
                privateSessionsChangeCount:lastPrivateSessionsChangeCount,
                idUser:idUser,
              });
    
    
            }
            // let userhandlerProfil = await db.collection('account-handler').where('id', '==', idUser).get();
            // // const entryToken = db.collection('token-handler')
          
            // // let tokenHandler :any = '';
            // // let idOfTokenHandler :string='';
            // userhandlerProfil.forEach(async (doc:any) =>{
            //     userDetail = doc.data();
            //     idTable = doc.id
            // })
            if(publicSessionsChangeCount === lastPublicChangeCount || publicSessionsChangeCount > lastPublicChangeCount){
                if(privateSessionsChangeCount === lastPrivateSessionsChangeCount || privateSessionsChangeCount > lastPrivateSessionsChangeCount){

                }
                if(privateSessionsChangeCount === 0){
                  if(idUser !== 'null'){
                    const querySnapshot = await db.collection('session-handler').get();
                    querySnapshot.forEach((doc: any) => {
                      allSessionsOfUser.push(doc.data());
                    });
                    allSessionsOfUser.forEach((session:any)=> {
                      if(session.header.status === 'private'){
                        if(session.header.owner  !== undefined){
                          if(idUser === session.header.owner.id){ allSessionsPrivate.push(session) }
                        }
                      }
                    })

                  }
                }
                else if(privateSessionsChangeCount < lastPrivateSessionsChangeCount && privateSessionsChangeCount !== 0){
                  if(idUser !== 'null'){
                    const querySnapshot = await db.collection('session-handler').get();
                    querySnapshot.forEach((doc: any) => {
                      allSessionsOfUser.push(doc.data());
                    });
                    allSessionsOfUser.forEach((session:any)=> {
                      if(session.header.status === 'private'){
                        if(session.header.owner  !== undefined){
                          if(idUser === session.header.owner.id){ allSessionsPrivate.push(session) }
                        }
                      }
                    })

                  }
                }
              
              return res.status(200).json({
                response: {
                  result:'success',
                  message:''
                },
                publicSessions:allSessionsPublic,
                privateSessions:allSessionsPrivate,
                publicChanged:false,
                privateChanged:false,
                publicSessionsChangeCount:lastPublicChangeCount,
                privateSessionsChangeCount:lastPrivateSessionsChangeCount,
                idUser:idUser,
              });

    
            }
            // }
            else if(publicSessionsChangeCount < lastPublicChangeCount && publicSessionsChangeCount !== 0){
              const querySnapshot = await db.collection('session-handler').get();
              querySnapshot.forEach((doc: any) => {
            
                allSessionsOfUser.push(doc.data());
              });
              allSessionsOfUser.forEach((session:any)=> {
                if(session.header.status === 'public'){
                  allSessionsPublic.push(session)
                }else{
                  if(privateSessionsChangeCount === lastPrivateSessionsChangeCount || privateSessionsChangeCount > lastPrivateSessionsChangeCount){

                  }
                  if(privateSessionsChangeCount === 0){
                    if(idUser !== 'null'){
                      if(session.header.owner  !== undefined){
                        if(idUser === session.header.owner.id){ allSessionsPrivate.push(session) }
                      }
                    }
                  }
                  else if(privateSessionsChangeCount < lastPrivateSessionsChangeCount && privateSessionsChangeCount !== 0){
                    if(idUser !== 'null'){
                      if(session.header.owner  !== undefined){
                        if(idUser === session.header.owner.id){ allSessionsPrivate.push(session) }
                      }
                    }
                  }
                }
              });
              return res.status(200).json({
                response: {
                  result:'success',
                  message:''
                },
                publicSessions:allSessionsPublic,
                privateSessions:allSessionsPrivate,
                publicChanged:true,
                privateChanged:false,
                publicSessionsChangeCount:lastPublicChangeCount,
                privateSessionsChangeCount:lastPrivateSessionsChangeCount,
                idUser:idUser,
              });
            }


          }
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
 export { createSession, getSessionDetails , getSessionsList, updateSession, deleteSession, testgetSessionsList }



