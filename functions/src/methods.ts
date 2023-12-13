let jwt = require('jsonwebtoken');

// module.exports.ensureToken = function(req, res, next) {

//  var bearerHeader = req.headers["authorization"];
//  if(bearerHeader === undefined || bearerHeader === 'undefined'){
//     console.log('vous avez besoin d\'un token pour vous identifier ! ');
//     res.send({
//         ok: true,
//         message: "Vous n'êtes pas autorisé à accéder à cette page veuillez vous identifier"
//         });
//     res.sendStatus(401);
//  }else{
//     if(req.headers["authorization"] !== 'undefined' || req.headers["authorization"] !== undefined){
//         console.log(req.headers["authorization"], bearerHeader);
//         if( bearerHeader !== 'undefined' || bearerHeader !== undefined) {
//            console.log(bearerHeader);
//          const bearer = bearerHeader.split(" ");
//          const bearerToken = bearer[1];
//          console.log(bearerToken)
//           jwt.verify(bearerToken, 'secretkey', (err, result) => {
//            if(err){ 
//                res.sendStatus(403);
//            }
//            else{
//                next(); 
//            }
//         });
//         }
//     }
//  }
    
 
// }