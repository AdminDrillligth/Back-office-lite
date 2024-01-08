var jwt = require("jsonwebtoken");
const fs = require('firebase-admin');
const db = fs.firestore();
import { v4 as uuidv4 } from 'uuid';
var btoa = require('btoa');

// 



// // var DateString = new Date().toLocaleDateString('en-GB');
var isoDateString = new Date().toISOString();

const getToken = async (req: any, res: any) => {
    let newUuid = uuidv4();
    // Id: l'id de l'utilisateur. 'String'
    // key: la clef du token. 'String'
    // date: la date de création du token. 'DateIso'
    // actualToken: le token en cours. 'String Opaque'
    // lastUseDate: la date de la dernière utilisation du token. 'DateIso'
    // expiration: la durée du token '24h or 30d'
    // valid: true false ; mode sécurité, le token est désactivé TRUE au départ

    let reqs = req;
    let headers = reqs.headers;
    let username = headers.username;
    // let expiration = headers.expiration;
    let password = headers.password
    let passwordhash = headers.passwordhash
    const authorizationValue = 'Basic ' + btoa( username + ':' + password );
    try {
      let userhandlerProfil = await db.collection('account-handler').where('email', '==', username).get();
      // const entryToken = db.collection('token-handler')
      let userDetail :any = '';
      // let tokenHandler :any = '';
      // let idOfTokenHandler :string='';
      if( userhandlerProfil._size !== 0 ){
            // si le token de ce user existe
            userhandlerProfil.forEach(async (doc:any) =>{
              userDetail = doc.data();
              if(userDetail.passwordHash === passwordhash){
                // Si le hash est correct : 
                jwt.sign({
                  hash:userDetail.passwordHash,
                  id: userDetail.id,
                  date: isoDateString,
                  key:newUuid,
                  authorizationValue: authorizationValue
                },'secret',{ expiresIn:'2d'},
                function(err:any, encoded:any){
                  if(err){
                    return res.status(200).json({
                      status: 'error',
                    })
                  }else{
                    return res.status(200).json({
                        status: 'success',
                        token:encoded,
                        authorizationValue: authorizationValue
                    })
                  }
                })
              }else{
                return res.status(200).json({
                  status: 'success',
                  message: 'Mot de passe incorrect',
                  authorizationValue: authorizationValue
                  // userDetailpasswordHash: userDetail.passwordHash,
                  // passwordhash:passwordhash,
                  // headers:headers
                });
            }
          })
        }
        else {
          return res.status(200).json({
            status: 'error',
            message: 'aucun utilisateur',
          });
       }
    }
    catch(error:any) {
        return res.status(500).json(error.message)
    }
}

const validateToken = async  (req: any, res: any) => {
  let reqs = req;
  let headers = reqs.headers;
  let token = headers.token
  try {
    jwt.verify(token, 'secret', { expiresIn: '2d' },  function(err:any, decoded:any) {
      if(err) {
        return res.status(200).json({
          status:'Votre token a expiré',
          token:token,
        });
      }else {
        return res.status(200).json({
          status: 'return',
          message: 'token valide',
          token:token,
        });
      }
    })
    }
    catch(error:any) {
      return res.status(500).json(error.message)
    }
  
}

const invalidateToken = async  (req: any, res: any) => {


}

const passwordHash  = async (req: any, res: any) => {
  let reqs = req;
  let headers = reqs.headers;
  let passwordHash = headers.passwordhash;
  let username = headers.username;
  let userDetail :any = '';
  try {
    let userhandlerProfil = await db.collection('account-handler').where('email', '==', username).get();
    userhandlerProfil.forEach((doc:any) =>{
      userDetail = doc.data();   
      if(userDetail !== ""){
        let idOfUser = doc.id;
        if(passwordHash !== undefined){ userDetail.passwordHash = passwordHash }
        const account_handler = db.collection('account-handler'); 
        account_handler.doc(idOfUser).update(userDetail).then((ref:any) => {
            return res.status(200).json({
              status: 'success',
              message: 'Mis a jour du hash valide',
              userDetail:userDetail,
              idOfUser:idOfUser,
              passwordHash: passwordHash,
              username:username
            });
          });
      }else{
        return res.status(200).json({
          status: 'error',
          message: 'pas d\'utilisateur correspondant',
          userDetail:userDetail,
        });
      }
    });
  } catch(error:any) { return res.status(500).json(error.message) }

}



export { getToken, validateToken, invalidateToken, passwordHash }
