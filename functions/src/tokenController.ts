var jwt = require("jsonwebtoken");
const fs = require('firebase-admin');
const db = fs.firestore();
import { v4 as uuidv4 } from 'uuid';

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
    // let password = headers.password;
    let username = headers.username;
    let expiration = headers.expiration;

    try {
      let userhandlerProfil = await db.collection('account-handler').where('email', '==', username).get();
      const entryToken = db.collection('token-handler')
      let userDetail :any = '';
      let tokenHandler :any = '';
      let idOfTokenHandler :string='';
      if(userhandlerProfil._size !== 0){
            // si le token de ce user existe
            userhandlerProfil.forEach(async (doc:any) =>{
              userDetail = doc.data();
             let tokenOfUser = await db.collection('token-handler').where('id', '==', userDetail.id).get();
              if(tokenOfUser._size > 0){
                 tokenOfUser.forEach((doc:any) =>{
                   tokenHandler = doc.data();
                   idOfTokenHandler = doc.id;
                   // On verifie si il est tjrs valide
                   jwt.verify(tokenHandler.actualToken, 'secret', { expiresIn: expiration }, async function(err:any, decoded:any) {
                    if (err) {
                      // Si il n'est pas valide, on demande de se reconnecter
                      return res.status(401).json({
                        status: 'error',
                        message: 'Veuillez vous reconnecter token expiration',
                        err: err
                      });
                    }else{
                      // here we update the last date 
                      return res.status(200).json({
                        status: 'success',
                        message: 'Le token est toujours valide',
                        decoded: decoded,
                        token:tokenHandler.actualToken,
                        idOfTokenHandler:idOfTokenHandler
                      });
                    }
                  })
                })
              }
             else{
                // Si un token n'existe pas encore
                // on signe le token avec des identifiants uniques
                jwt.sign({
                  id: userDetail.id,
                  key:newUuid,
                  date: isoDateString,
                  lastUseDate:isoDateString,
                  expiration: expiration,
                  valid:true
                },
                'secret', { 
                  expiresIn: expiration 
                },
                function (err:any, encoded:any) {
                  if (err) {
                      return res.status(401).json({
                        status: 'error',
                        message: 'une erreur est survenue veuillez réessayer',
                        err: err
                      });
                  } else {
                      jwt.verify(encoded, 'secret', { expiresIn: expiration }, async function(err:any, decoded:any) {
                        if (err) {
                          return res.status(200).json({
                            status: 'error',
                            message: 'Yo just get ERROR the token',
                            token: encoded,
                            err: err
                          });
                        } else {
                          await entryToken.add({
                            id: userDetail.id,
                            key:newUuid,
                            actualToken:encoded,
                            date: isoDateString,
                            lastUseDate:isoDateString,
                            expiration: expiration,
                            valid:true
                          });
                          return res.status(200).json({
                            status: 'success',
                            message: 'Yo just get the token',
                            encoded: encoded,
                            decoded: decoded
                          });
                        }
                      });
                  }
                });
               }
         });
      }else{
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


}

const invalidateToken = async  (req: any, res: any) => {


}




export { getToken, validateToken, invalidateToken }
