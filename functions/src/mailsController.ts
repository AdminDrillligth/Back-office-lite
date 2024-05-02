// import { Response } from "express"
import { db } from './config/firebase'
import * as functions from 'firebase-functions'
// import { v4 as uuidv4 } from 'uuid';
// import { sendCreateAccount } from './AccountController';

// var jwt = require("jsonwebtoken");
// // var btoa = require('btoa');
// var DateString = new Date().toLocaleDateString('en-GB');
// var isoDateString = new Date().toISOString();


const sendEmailResetPassword = async (data:any) =>{
  // res.status(200).send({
  //   response: {
  //     result:'success',
  //     message:''
  //   },
  //   data:data
  // });
  functions.logger.log("ON VEUT UN RESET PASSWORD REAL:  ",data.fullName, data )
  return new Promise<any>((resolve, reject) => {
     db.collection('mail').add({ reason:'update password', message:{text:'Réinitialisation du mot de passe Drilllight',

    html:"<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head>"+
    "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /><meta name='viewport' content='width=device-width' /><title>Drilllight mail</title><link rel='preconnect' href='https://fonts.googleapis.com'>"+
    "<link href='https://fonts.googleapis.com/css?family=Roboto:400,500,700,900&display=swap' rel='stylesheet'><link href='https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@100;300;400;700&display=swap' rel='stylesheet'><style type='text/css'>"+
    ".over-button{cursor: pointer;}body,#bodyTable,#bodyCell { font-family: 'Roboto', sans-serif;height: 100% !important;margin: 0;padding: 0;width: 100% !important;}table {border-collapse: collapse;}"+
    " img,a { border: 0; outline: none; text-decoration: none;} h1,h2,h3,h4,h5,h6 { font-family: 'Roboto', sans-serif; margin: 0; padding: 0;}p { margin: 1em 0;}table,td {mso-table-lspace: 0pt; mso-table-rspace: 0pt;}img { -ms-interpolation-mode: bicubic;}"+
    "body,table,td, p,a,li,blockquote {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; }.flexibleContainerCell {padding-left: 20px;padding-right: 20px;padding-top: 20px;}body,#bodyTable { background-color: #E5E5E5; }#bodyCell { padding-bottom: 40px; padding-top: 40px;}"+
    ".textContent,.textContentLast { color: #404040;font-size: 17px; line-height: 125%; padding: 20px 25px 0;}.textContentLast{ padding-top: 0px;}.textContent a, .textContentLast a { color: #2C9AB7; text-decoration: underline;}"+
    "@media only screen and (max-width: 576px) {body { min-width: 100% !important; width: 100% !important;}"+
    ".bg-top { background-size: cover !important;}} .text-center {text-align: center;}.w-100 { width: 100%;}.d-block { display: block;"+
    "}td.d-flex.textContentLast:after {clear: both; content: ''; display: block;}.mf-bg { background: radial-gradient(50% 50% at 50% 50%, #424657 0%, #0C0F20 100%);} .mf-logo {display: block;margin: 45px auto 65px; max-width: 265px;}"+
    ".mf-title {display: block; margin-left: 13px;margin-top: 56px;}.position-relative { position: relative;}"+
    ".page-top { background: radial-gradient(90.16% 143.26% at 15.32% 20.99%, rgba(235, 236, 240, 0.2) 0%, rgba(235, 236, 240, 0.0447917) 77.08%, rgba(235, 236, 240, 0) 100%); border: 1px solid; border-image-source: radial-gradient(106.72% 284.69% at 100% 100%, #A1EAFB 0%, rgba(255, 255, 255, 0) 51.04%, #A1EAFB 100%); border-radius: 12px;margin-bottom: 55px; width: calc(100% - 120px); margin-left: 60px;margin-right: 60px; }"+
    ".email-title {color: #FDFDFD;font-family: 'Be Vietnam Pro', sans-serif;font-weight: 700;font-size: 36px;line-height: 48px;margin: 50px 0 20px;text-align: center;}"+
    ".email-sub-title {color: rgba(61, 54, 84, .7);font-weight: bold;font-size: 16px;line-height: 24px;text-align: center;}"+
    ".email-content, .email-content p {color: #FDFDFD;font-family: 'Be Vietnam Pro', sans-serif;font-size: 18px;font-weight: 400;line-height: 28px;text-align: center;}"+
    ".email-content button {cursor:pointer;color: #0C0F20;width: 300px;height: 40px;background: #A1EAFB;border: 1px solid #A1EAFB;border-radius: 8px; padding: 12px 0;font-family: 'Be Vietnam Pro', sans-serif;font-weight: 600;font-size: 14px;line-height: 16px; margin: 50px auto; text-align: center; }"+
    ".mf-footer {margin-bottom: 50px;}.mf-footer p { color: #5183ff;font-family: lato;font-size: 17px;font-weight: 300;line-height: 1.53;}"+
    ".drill-footer tr td {text-align: center; display: table;margin: 0 auto 65px;}"+
    ".mf-copyrights, .mf-copyrights a { color: #FDFDFD; font-family: 'Be Vietnam Pro', sans-serif; font-size: 17px;font-weight: 300;line-height: 26px;margin-bottom: 30px;text-align: center; }"+
    ".mf-copyrights a {color: #A1EAFB; } .get-app {margin-top: 50px;}.get-app a { background: #67D0BA !important; }"+
    "</style></head>"+
    "<body><center><table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable'>"+
    "<tr><td align='center' valign='top' id='bodyCell'> <table class='position-relative' border='0' cellpadding='0' cellspacing='0' width='800'>"+
    "<tr><td align='center' valign='top'><table class='mf-bg' border='0' cellpadding='0' cellspacing='0' width='100%'><tr>"+
    "<td align='center' valign='top'><table border='0' cellpadding='0' cellspacing='0' class='flexibleContainer'> <tr>"+
    "<td align='center' valign='top' class='flexibleContainerCell'> <table border='0' cellpadding='0' cellspacing='0' width='100%'><tr>"+
    "<td valign='top'><img style='width: 60px;' src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2FProduct%20image.png?alt=media&token=dc198145-d252-4df3-b5cc-0d9013e1cf74' class='mf-logo' alt='Drilllight'></td><td valign='top'> <img style='width: 200px;' src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Flogo.png?alt=media&token=63b77c85-2c42-4b13-8e23-726b1765e178' class='mf-title' alt='Drilllight'> </td></tr></table>"+
    "</td></tr></table><table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' valign='top'><table class='page-top' border='0' cellpadding='0' cellspacing='0' class='flexibleContainer'>"+
    "<tr><td valign='top' class=''><table class='flexibleContainer text-center' align='center' border='0' cellpadding='0' cellspacing='0'><tr><h2 class='email-title'>Bienvenue sur <br> Drilllight !</h2><td></td></tr></table>"+
    "<table align='center' border='0' cellpadding='0' cellspacing='0' class='flexibleContainer text-center w-100'><tr><td valign='top' class='d-block textContentLast email-content'><p>Bonjour</p><p>"+
    " !<br>Vous avez demandé à réiniialiser votre mot de passe <br>Des questions ?<br>N\'hésitez pas à nous contacter par mail à contact@drilllight.com pour quoi que ce soit et nous nous ferons un plaisir de revenir vers vous très rapidement.<br>À bientôt !<br>Sportivement, l’équipe Drilllight"+

    "</p><a  style='cursor:pointer;' href='https://drilllight.web.app/reset?email=''><button style='cursor:pointer;'>Modifier le mot de passe</button></a> </td> </tr> </table> </td> </tr></table>"+
    "<table class='mf-footer w-100' cellpadding='0' cellspacing='0'><tr><td><tr class='mf-copyrights'><td>Pour vos questions et suggestions, nous vous invitons à nous<br>contacter sur <a href='mailto:contact@drilllight.fr'>contact@drilllight.fr</a>"+
    "</td></tr></td></tr></table><table class='drill-footer w-100' cellpadding='0' cellspacing='0'><tr><td class='social-icons'><a href='https://www.facebook.com/' title='Facebook'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ffacebook.png?alt=media&token=91f5edc6-ae6f-4403-86a7-ac72f036970d' style='margin-right: 30px;' alt='Facebook'></a>"+
    "<a href='https://www.instagram.com/' title='Instagram'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Finstagram.png?alt=media&token=a576f53a-91ac-44ba-a701-c1d3b8e918df' style='margin-right: 30px;' alt='Instagram'></a><a href='https://twitter.com/' title='Twitter'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ftwitter.png?alt=media&token=40dae9b3-1c85-4956-bb47-2df12cf37c00' style='margin-right: 30px;' alt='Twitter'></a></td>"+
    "</tr></table></td></tr></table></td></tr></table></td></tr><tr><td align='center' valign='top'></td></tr></table></td></tr></table></center></body></html>",

    subject:'Mise à jour du password'},
    to:'snaimuh@googlemail.com',
    date: new Date().toLocaleDateString('en-GB'),
    dateIso: new Date().toISOString()}).then(
     (r: any) => {
          // localStorage.setItem('id-user-inf', JSON.stringify(r.id));
          // this.idUser = JSON.parse(localStorage.getItem('id-user-inf') || '{}');
          functions.logger.log("NO ERROR : WITH THE SEND MAIL RESET PASSWORD " )
          console.log('NO ERROR',r);
        },
        (err: any) => {
          console.log('ERROR  : WITH THE SEND MAIL ',err)
        }
      );
   });
}


const sendEmailResetPasswordAccount = async (data:any) =>{
    // functions.logger.log("ON VA CREER UN SERVICE MAIL AU TOP  ::::  ",data )
    // functions.logger.log("ON VEUT UN RESET PASSWORD :  ",data.fullName, data )
    // console.log('okokok send mail admin: ADMIN GO NEW VERSION:', mailUser, firstName)
    // this.UserfirstName = firstName;
    return new Promise<any>((resolve, reject) => {
      db.collection('mail').add({ reason:'create account', message:{text:'Bienvenue dans drillight',

      html:"<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html data-editor-version='2' class='sg-campaigns' xmlns='http://www.w3.org/1999/xhtml'> <head> <meta http-equiv='Content-Type' content='text/html; charset=utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1'>"+
      "<!--[if !mso]><!--> <meta http-equiv='X-UA-Compatible' content='IE=Edge'> <!--<![endif]-->"+
      "<!--[if (gte mso 9)|(IE)]><xml><o:OfficeDocumentSettings><o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->"+
      "<!--[if (gte mso 9)|(IE)]> <style type='text/css'>  body {width: 600px;margin: 0 auto;} table {border-collapse: collapse;} table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;} img {-ms-interpolation-mode: bicubic;}</style><![endif]-->"+
      "<style type='text/css'>  body, p, div {font-family: arial,helvetica,sans-serif; font-size: 14px;} body {color: #000000; } body a { color: #1188E6;text-decoration: none;} p { margin: 0; padding: 0; }"+
      "table.wrapper { width:100% !important; table-layout: fixed; -webkit-font-smoothing: antialiased;-webkit-text-size-adjust: 100%; -moz-text-size-adjust: 100%; -ms-text-size-adjust: 100%;}"+
      "img.max-width {  max-width: 100% !important; } .img-bottom{ display:block;} .column.of-2 { width: 50%; } .column.of-3 { width: 33.333%;} .column.of-4 {  width: 25%; } ul ul ul ul  { list-style-type: disc !important;}"+
      "ol ol { list-style-type: lower-roman !important; } ol ol ol { list-style-type: lower-latin !important; } ol ol ol ol {  list-style-type: decimal !important; } "+
      "@media screen and (max-width:480px) {.img-bottom{ display:none;} .preheader .rightColumnContent, .footer .rightColumnContent { text-align: left !important; }"+
      ".preheader .rightColumnContent div, .preheader .rightColumnContent span, .footer .rightColumnContent div, .footer .rightColumnContent span {  text-align: left !important; }"+
      ".preheader .rightColumnContent, .preheader .leftColumnContent {  font-size: 80% !important;  padding: 5px 0; } table.wrapper-mobile { width: 100% !important; table-layout: fixed; }"+
      "img.max-width { height: auto !important; max-width: 100% !important;} a.bulletproof-button { display: block !important; width: auto !important; font-size: 80%; padding-left: 0 !important; padding-right: 0 !important;}"+
      ".columns {  width: 100% !important;} .column { display: block !important;  width: 100% !important; padding-left: 0 !important;  padding-right: 0 !important; margin-left: 0 !important; margin-right: 0 !important; } .social-icon-column {  display: inline-block !important; } } </style>"+
      "<!--user entered Head Start--><!--End Head user entered-->"+
      "</head><body><center class='wrapper' data-link-color='#1188E6' data-body-style='font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#060f12;'>"+
      "<div class='webkit'><table cellpadding='0' cellspacing='0' border='0' width='100%' class='wrapper' bgcolor='#060f12'> <tr><td valign='top' bgcolor='#060f12' width='100%'> <table width='100%' role='content-container' class='outer' align='center' cellpadding='0' cellspacing='0' border='0'>"+
      "<tr><td width='100%'><table width='100%' cellpadding='0' cellspacing='0' border='0'><tr><td>"+
      "<!--[if mso]><center><table><tr><td width='600'><![endif]-->"+
      "<table width='100%' cellpadding='0' cellspacing='0' border='0' style='width:100%; max-width:600px;' align='center'><tr><td role='modules-container' style='padding:0px 0px 0px 0px; color:#000000; text-align:left;' bgcolor='#060f12' width='100%' align='left'><table class='module preheader preheader-hide' role='module' data-type='preheader' border='0' cellpadding='0' cellspacing='0' width='100%' style='display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;'>"+
      "<tr><td role='module-content'><p></p></td> </tr></table><table class='wrapper' role='module' data-type='image' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='22bfa796-2854-4f5e-89ca-4fa54a89076d'>"+
      "<tbody><tr><td style='font-size:6px; line-height:10px; padding:6px 0px 0px 0px;' valign='top' align='center'><img class='max-width' border='0' style='display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:65% !important; width:65%; height:auto !important;' width='390' alt='' data-proportionally-constrained='true' data-responsive='true' src='http://cdn.mcauto-images-production.sendgrid.net/56c287cecb58892f/f10171e3-6bf7-49d3-8641-79c8c40dc93a/988x252.png'>"+
      "</td></tr></tbody></table><table class='module' role='module' data-type='text' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='e4ea0789-ded1-4988-b964-5ee2e8dfd9cf' data-mc-module-version='2019-10-22'>"+
      "<tbody><tr><td style='padding:18px 10px 18px 10px; line-height:18px; text-align:inherit; background-color:#101c23;' height='100%' valign='top' bgcolor='#101c23' role='module-content'><div><h5 style='text-align: center; font-family: inherit'><span style='color: #ffffff; font-family: lucida sans unicode,lucida grande,sans-serif'>Bonjour, Nous vous invitons à cliquer sur le bouton suivant pour réinitialiser votre mot de passe et en créer un nouveau.</span></h5>"+
      // "<h5 style='text-align: center; font-family: inherit'><span style='color: #ffffff; font-family: lucida sans unicode,lucida grande,sans-serif'>Veuillez cliquer sur le bouton ci-dessous,&nbsp;</span></h5>"+
      // "<h5 style='text-align: center; font-family: inherit'><span style='color: #ffffff; font-family: lucida sans unicode,lucida grande,sans-serif'>vous serez alors redirigé vers la page souhaitée.</span></h5>
      "<div></div></div></td>"+
      "</tr></tbody></table>"+
      // "<table border='0' cellpadding='0' cellspacing='0' align='center' width='100%' role='module' data-type='columns' style='padding:0px 0px 0px 0px;' bgcolor='#101c23' data-distribution='1,1'>"+
      // "<tbody><tr role='module-content'><td height='100%' valign='top'><table width='290' style='width:290px; border-spacing:0; border-collapse:collapse; margin:0px 10px 0px 0px;' cellpadding='0' cellspacing='0' align='left' border='0' bgcolor='' class='column column-0'>"+
      // "<tbody><tr><td style='padding:0px;margin:0px;border-spacing:0;'><table class='wrapper' role='module' data-type='image' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='73129f5d-6d29-446b-bd49-f66234e54d14'>"+
      // "<tbody><tr><td style='font-size:6px; line-height:10px; padding:0px 0px 0px 0px;' valign='top' align='center'>"+
      
      // "<img class='max-width' border='0' style='display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;' width='290' alt='' data-proportionally-constrained='true' data-responsive='true' src='http://cdn.mcauto-images-production.sendgrid.net/56c287cecb58892f/675e45a5-e17f-4558-bcba-8ba905cbe274/309x521.png'>"+
      // "</td></tr></tbody></table></td></tr></tbody></table><table width='290' style='width:290px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 10px;' cellpadding='0' cellspacing='0' align='left' border='0' bgcolor='' class='column column-1'><tbody>"+
      // "<tr><td style='padding:0px;margin:0px;border-spacing:0;'><table class='wrapper' role='module' data-type='image' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='5c70b468-ccc5-470a-a949-3a217cfe228e'><tbody>"+
      // "<tr><td style='font-size:6px; line-height:10px; padding:34px 0px 0px 0px;' valign='top' align='center'>"+
      
      // "<img class='max-width img-bottom' border='0' style='display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:54% !important; width:54%; height:auto !important;' width='157' alt='' data-proportionally-constrained='true' data-responsive='true' src='http://cdn.mcauto-images-production.sendgrid.net/56c287cecb58892f/c4511848-d938-41d8-b668-fd63aa91beca/190x526.png'>"+
      // "</td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>"+
      
      "<table class='module' role='module' data-type='divider' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='faab146d-1fdd-46fd-82be-bbcfaf7a198a'>"+
      "<tbody><tr><td style='padding:5px 0px 0px 0px;' role='module-content' height='100%' valign='top' bgcolor=''><table border='0' cellpadding='0' cellspacing='0' align='center' width='100%' height='1px' style='line-height:1px; font-size:1px;'>"+
      "<tbody><tr><td style='padding:0px 0px 1px 0px;' bgcolor='#626060'></td></tr></tbody></table></td></tr></tbody></table><table border='0' cellpadding='0' cellspacing='0' class='module' data-role='module-button' data-type='button' role='module' style='table-layout:fixed;' width='100%' data-muid='748c0fb7-35be-41fc-a218-68b078b72572'>"+
      "<tbody><tr><td align='center' bgcolor='#101c23' class='outer-td' style='padding:10px 5px 10px 5px; background-color:#101c23;'><table border='0' cellpadding='0' cellspacing='0' class='wrapper-mobile' style='text-align:center;'><tbody><tr>"+
      "<td align='center' bgcolor='#0d6efd' class='inner-td' style='border-radius:6px; font-size:16px; text-align:center; background-color:inherit;'>"+
      // lien btn 
      "<a href='https://drilllight.web.app/reset?email=' style='background-color:#0d6efd; border:1px solid #0d6efd; border-color:#0d6efd; border-radius:6px; border-width:1px; color:#ffffff; display:inline-block; font-size:14px; font-weight:500; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid; font-family:lucida sans unicode,lucida grande,sans-serif;' target='_blank'>Reinitialiser le mot de passe</a></td></tr></tbody></table></td></tr></tbody>"+
      "</table><table class='module' role='module' data-type='social' align='center' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='832080c8-3457-41fa-9d2a-25a40faeb621'>"+
      "<tbody><tr><td valign='top' style='padding:5px 0px 0px 0px; font-size:6px; line-height:10px;' align='center'><table align='center' style='-webkit-margin-start:auto;-webkit-margin-end:auto;'><tbody></tbody></table></td></tr></tbody>"+
      "</table><table class='module' role='module' data-type='text' border='0' cellpadding='0' cellspacing='0' width='100%' style='table-layout: fixed;' data-muid='281850dd-e4f0-45d6-a8d3-81d43ae29826'><tbody><tr>"+
      "<td style='padding:18px 0px 18px 0px; line-height:22px; text-align:inherit; background-color:#101c23;' height='100%' valign='top' bgcolor='#101c23' role='module-content'><div><div style='font-family: inherit; text-align: center'><span style='color: #ffffff'>Pour vos questions et suggestions, nous vous invitons à nous contacter sur </span><a href='mailto:contact@drilllight.fr?subject=&amp;body='><span style='color: #0048ba'>contact@drilllight.fr</span></a></br>Cordialement, L'équipe Drilllight</div><div style='font-family: inherit; text-align: inherit'><br></div><div></div></div></td></tr></tbody></table></td></tr></table><!--[if mso]></td></tr></table></center><![endif]-->"+
      "</td></tr></table></td></tr></table></td></tr></table></div></center></body></html>",
      
      
      subject:'Réinitialiser votre mot de passe Drilllight'},
      to:'snaimuh@googlemail.com',
      date: new Date().toLocaleDateString('en-GB'),
      dateIso: new Date().toISOString()}).then(
       (r: any) => {
            // localStorage.setItem('id-user-inf', JSON.stringify(r.id));
            // this.idUser = JSON.parse(localStorage.getItem('id-user-inf') || '{}');
            functions.logger.log("NO ERROR : WITH THE SEND MAIL  " )
            console.log('NO ERROR',r);
          },
          (err: any) => {
            console.log('ERROR  : WITH THE SEND MAIL ',err)
          }
        );
    });
 }


const sendEmailthisanUpdate = async (data:any) =>{
  // functions.logger.log("ON VA CREER UN SERVICE MAIL AU TOP  ::::  ",data )
  // functions.logger.log("ON VEUT UN RESET PASSWORD :  ",data.fullName, data )
  // console.log('okokok send mail admin: ADMIN GO NEW VERSION:', mailUser, firstName)
  // this.UserfirstName = firstName;
  return new Promise<any>((resolve, reject) => {
    db.collection('mail').add({ reason:'update account', message:{text:'Bienvenue dans drillight',

    html:"<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head>"+
    "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /><meta name='viewport' content='width=device-width' /><title>Drilllight mail</title><link rel='preconnect' href='https://fonts.googleapis.com'>"+
    "<link href='https://fonts.googleapis.com/css?family=Roboto:400,500,700,900&display=swap' rel='stylesheet'><link href='https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@100;300;400;700&display=swap' rel='stylesheet'><style type='text/css'>"+
    ".over-button{cursor: pointer;}body,#bodyTable,#bodyCell { font-family: 'Roboto', sans-serif;height: 100% !important;margin: 0;padding: 0;width: 100% !important;}table {border-collapse: collapse;}"+
    " img,a { border: 0; outline: none; text-decoration: none;} h1,h2,h3,h4,h5,h6 { font-family: 'Roboto', sans-serif; margin: 0; padding: 0;}p { margin: 1em 0;}table,td {mso-table-lspace: 0pt; mso-table-rspace: 0pt;}img { -ms-interpolation-mode: bicubic;}"+
    "body,table,td, p,a,li,blockquote {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; }.flexibleContainerCell {padding-left: 20px;padding-right: 20px;padding-top: 20px;}body,#bodyTable { background-color: #E5E5E5; }#bodyCell { padding-bottom: 40px; padding-top: 40px;}"+
    ".textContent,.textContentLast { color: #404040;font-size: 17px; line-height: 125%; padding: 20px 25px 0;}.textContentLast{ padding-top: 0px;}.textContent a, .textContentLast a { color: #2C9AB7; text-decoration: underline;}"+
    "@media only screen and (max-width: 576px) {body { min-width: 100% !important; width: 100% !important;}"+
    ".bg-top { background-size: cover !important;}} .text-center {text-align: center;}.w-100 { width: 100%;}.d-block { display: block;"+
    "}td.d-flex.textContentLast:after {clear: both; content: ''; display: block;}.mf-bg { background: radial-gradient(50% 50% at 50% 50%, #424657 0%, #0C0F20 100%);} .mf-logo {display: block;margin: 45px auto 65px; max-width: 265px;}"+
    ".mf-title {display: block; margin-left: 13px;margin-top: 56px;}.position-relative { position: relative;}"+
    ".page-top { background:#12222B; border: 1px solid; border-image-source: radial-gradient(106.72% 284.69% at 100% 100%, #A1EAFB 0%, rgba(255, 255, 255, 0) 51.04%, #A1EAFB 100%); border-radius: 12px;margin-bottom: 55px; width: calc(100% - 120px); margin-left: 60px;margin-right: 60px; }"+
    ".email-title {color: #FDFDFD;font-family: 'Be Vietnam Pro', sans-serif;font-weight: 700;font-size: 36px;line-height: 48px;margin: 50px 0 20px;text-align: center;}"+
    ".email-sub-title {color: rgba(61, 54, 84, .7);font-weight: bold;font-size: 16px;line-height: 24px;text-align: center;}"+
    ".email-content, .email-content p {color: #FDFDFD;font-family: 'Be Vietnam Pro', sans-serif;font-size: 18px;font-weight: 400;line-height: 28px;text-align: center;}"+
    ".email-content button {cursor:pointer;color: #0C0F20;width: 300px;height: 40px;background: #336DC8;border: 1px solid #336DC8;border-radius: 8px; padding: 12px 0;font-family: 'Be Vietnam Pro', sans-serif;font-weight: 600;font-size: 14px;line-height: 16px; margin: 50px auto; text-align: center; }"+
    ".mf-footer {margin-bottom: 50px;}.mf-footer p { color: #5183ff;font-family: lato;font-size: 17px;font-weight: 300;line-height: 1.53;}"+
    ".drill-footer tr td {text-align: center; display: table;margin: 0 auto 65px;}"+
    ".mf-copyrights, .mf-copyrights a { color: #FDFDFD; font-family: 'Be Vietnam Pro', sans-serif; font-size: 17px;font-weight: 300;line-height: 26px;margin-bottom: 30px;text-align: center; }"+
    ".mf-copyrights a {color: #A1EAFB; } .get-app {margin-top: 50px;}.get-app a { background: #67D0BA !important; }"+
    "</style></head>"+
    "<body><center><table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable'>"+
    "<tr><td align='center' valign='top' id='bodyCell'> <table class='position-relative' border='0' cellpadding='0' cellspacing='0' width='800'>"+
    "<tr><td align='center' valign='top'><table class='mf-bg' border='0' cellpadding='0' cellspacing='0' width='100%'><tr>"+
    "<td align='center' valign='top'><table border='0' cellpadding='0' cellspacing='0' class='flexibleContainer'> <tr>"+
    "<td align='center' valign='top' class='flexibleContainerCell'> <table border='0' cellpadding='0' cellspacing='0' width='100%'><tr>"+
    "<td valign='top'><img style='width: 60px;' src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2FProduct%20image.png?alt=media&token=dc198145-d252-4df3-b5cc-0d9013e1cf74' class='mf-logo' alt='Drilllight'></td><td valign='top'> <img style='width: 200px;' src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Flogo.png?alt=media&token=63b77c85-2c42-4b13-8e23-726b1765e178' class='mf-title' alt='Drilllight'> </td></tr></table>"+
    "</td></tr></table><table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' valign='top'><table class='page-top' border='0' cellpadding='0' cellspacing='0' class='flexibleContainer'>"+
    "<tr><td valign='top' class=''><table class='flexibleContainer text-center' align='center' border='0' cellpadding='0' cellspacing='0'><tr><h2 class='email-title'>Bienvenue sur <br> Drilllight !</h2><td></td></tr></table>"+
    "<table align='center' border='0' cellpadding='0' cellspacing='0' class='flexibleContainer text-center w-100'><tr><td valign='top' class='d-block textContentLast email-content'><p>Bonjour</p><p>"+
    "un update viens d'être effectué"+data.fullName+' son ID est  '+data.id+

    "</p><a  style='cursor:pointer;' href='https://drilllight.web.app/password?id="+data.id+
    
    +"><button style='cursor:pointer;'>Continuer sur Drilllight</button></a> </td> </tr> </table> </td> </tr></table>"+
    "<table class='mf-footer w-100' cellpadding='0' cellspacing='0'><tr><td><tr class='mf-copyrights'><td>Pour vos questions et suggestions, nous vous invitons à nous<br>contacter sur <a href='mailto:contact@drilllight.fr'>contact@drilllight.fr</a>"+
    "</td></tr></td></tr></table><table class='drill-footer w-100' cellpadding='0' cellspacing='0'><tr><td class='social-icons'><a href='https://www.facebook.com/drilllight' title='Facebook'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ffacebook.png?alt=media&token=91f5edc6-ae6f-4403-86a7-ac72f036970d' style='margin-right: 30px;' alt='Facebook'></a>"+
    "<a href='https://www.instagram.com/drilllight_fr/' title='Instagram'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Finstagram.png?alt=media&token=a576f53a-91ac-44ba-a701-c1d3b8e918df' style='margin-right: 30px;' alt='Instagram'></a><a href='https://twitter.com/' title='Twitter'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ftwitter.png?alt=media&token=40dae9b3-1c85-4956-bb47-2df12cf37c00' style='margin-right: 30px;' alt='Twitter'></a></td>"+
    "</tr></table></td></tr></table></td></tr></table></td></tr><tr><td align='center' valign='top'></td></tr></table></td></tr></table></center></body></html>",

    subject:'Ceci est un update'},
    to:'snaimuh@googlemail.com',
    date: new Date().toLocaleDateString('en-GB'),
    dateIso: new Date().toISOString()}).then(
     (r: any) => {
          // localStorage.setItem('id-user-inf', JSON.stringify(r.id));
          // this.idUser = JSON.parse(localStorage.getItem('id-user-inf') || '{}');
          functions.logger.log("NO ERROR : WITH THE SEND MAIL  " )
          console.log('NO ERROR',r);
        },
        (err: any) => {
          console.log('ERROR  : WITH THE SEND MAIL ',err)
        }
      );
  });
}

const sendEmailCreate = async (data:any) =>{
  // functions.logger.log("ON VA CREER UN SERVICE MAIL AU TOP  ::::  ",data )
  // functions.logger.log("ON VEUT UN RESET PASSWORD :  ",data.fullName, data )
  // console.log('okokok send mail admin: ADMIN GO NEW VERSION:', mailUser, firstName)
  // this.UserfirstName = firstName;
  return new Promise<any>((resolve, reject) => {
    db.collection('mail').add({ reason:'create account', message:{text:'Bienvenue dans drillight',

    html:"<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head>"+
    "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /><meta name='viewport' content='width=device-width' /><title>Drilllight mail</title><link rel='preconnect' href='https://fonts.googleapis.com'>"+
    "<link href='https://fonts.googleapis.com/css?family=Roboto:400,500,700,900&display=swap' rel='stylesheet'><link href='https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@100;300;400;700&display=swap' rel='stylesheet'><style type='text/css'>"+
    ".over-button{cursor: pointer;}body,#bodyTable,#bodyCell { font-family: 'Roboto', sans-serif;height: 100% !important;margin: 0;padding: 0;width: 100% !important;}table {border-collapse: collapse;}"+
    " img,a { border: 0; outline: none; text-decoration: none;} h1,h2,h3,h4,h5,h6 { font-family: 'Roboto', sans-serif; margin: 0; padding: 0;}p { margin: 1em 0;}table,td {mso-table-lspace: 0pt; mso-table-rspace: 0pt;}img { -ms-interpolation-mode: bicubic;}"+
    "body,table,td, p,a,li,blockquote {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%; }.flexibleContainerCell {padding-left: 20px;padding-right: 20px;padding-top: 20px;}body,#bodyTable { background-color: #E5E5E5; }#bodyCell { padding-bottom: 40px; padding-top: 40px;}"+
    ".textContent,.textContentLast { color: #404040;font-size: 17px; line-height: 125%; padding: 20px 25px 0;}.textContentLast{ padding-top: 0px;}.textContent a, .textContentLast a { color: #2C9AB7; text-decoration: underline;}"+
    "@media only screen and (max-width: 576px) {body { min-width: 100% !important; width: 100% !important;}"+
    ".bg-top { background-size: cover !important;}} .text-center {text-align: center;}.w-100 { width: 100%;}.d-block { display: block;"+
    "}td.d-flex.textContentLast:after {clear: both; content: ''; display: block;}.mf-bg { background: radial-gradient(50% 50% at 50% 50%, #424657 0%, #0C0F20 100%);} .mf-logo {display: block;margin: 45px auto 65px; max-width: 265px;}"+
    ".mf-title {display: block; margin-left: 13px;margin-top: 56px;}.position-relative { position: relative;}"+
    ".page-top { background:#12222B; border: 1px solid; border-image-source: radial-gradient(106.72% 284.69% at 100% 100%, #A1EAFB 0%, rgba(255, 255, 255, 0) 51.04%, #A1EAFB 100%); border-radius: 12px;margin-bottom: 55px; width: calc(100% - 120px); margin-left: 60px;margin-right: 60px; }"+
    ".email-title {color: #FDFDFD;font-family: 'Be Vietnam Pro', sans-serif;font-weight: 700;font-size: 36px;line-height: 48px;margin: 50px 0 20px;text-align: center;}"+
    ".email-sub-title {color: rgba(61, 54, 84, .7);font-weight: bold;font-size: 16px;line-height: 24px;text-align: center;}"+
    ".email-content, .email-content p {color: #FDFDFD;font-family: 'Be Vietnam Pro', sans-serif;font-size: 18px;font-weight: 400;line-height: 28px;text-align: center;}"+
    ".email-content button {cursor:pointer;color: #0C0F20;width: 300px;height: 40px;background: #336DC8;border: 1px solid #336DC8;border-radius: 8px; padding: 12px 0;font-family: 'Be Vietnam Pro', sans-serif;font-weight: 600;font-size: 14px;line-height: 16px; margin: 50px auto; text-align: center; }"+
    ".mf-footer {margin-bottom: 50px;}.mf-footer p { color: #5183ff;font-family: lato;font-size: 17px;font-weight: 300;line-height: 1.53;}"+
    ".drill-footer tr td {text-align: center; display: table;margin: 0 auto 65px;}"+
    ".mf-copyrights, .mf-copyrights a { color: #FDFDFD; font-family: 'Be Vietnam Pro', sans-serif; font-size: 17px;font-weight: 300;line-height: 26px;margin-bottom: 30px;text-align: center; }"+
    ".mf-copyrights a {color: #A1EAFB; } .get-app {margin-top: 50px;}.get-app a { background: #67D0BA !important; }"+
    "</style></head>"+
    "<body><center><table border='0' cellpadding='0' cellspacing='0' height='100%' width='100%' id='bodyTable'>"+
    "<tr><td align='center' valign='top' id='bodyCell'> <table class='position-relative' border='0' cellpadding='0' cellspacing='0' width='800'>"+
    "<tr><td align='center' valign='top'><table class='mf-bg' border='0' cellpadding='0' cellspacing='0' width='100%'><tr>"+
    "<td align='center' valign='top'><table border='0' cellpadding='0' cellspacing='0' class='flexibleContainer'> <tr>"+
    "<td align='center' valign='top' class='flexibleContainerCell'> <table border='0' cellpadding='0' cellspacing='0' width='100%'><tr>"+
    "<td valign='top'><img style='width: 60px;' src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2FProduct%20image.png?alt=media&token=dc198145-d252-4df3-b5cc-0d9013e1cf74' class='mf-logo' alt='Drilllight'></td><td valign='top'> <img style='width: 200px;' src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Flogo.png?alt=media&token=63b77c85-2c42-4b13-8e23-726b1765e178' class='mf-title' alt='Drilllight'> </td></tr></table>"+
    "</td></tr></table><table border='0' cellpadding='0' cellspacing='0' width='100%'><tr><td align='center' valign='top'><table class='page-top' border='0' cellpadding='0' cellspacing='0' class='flexibleContainer'>"+
    "<tr><td valign='top' class=''><table class='flexibleContainer text-center' align='center' border='0' cellpadding='0' cellspacing='0'><tr><h2 class='email-title'>Bienvenue sur <br> Drilllight !</h2><td></td></tr></table>"+
    "<table align='center' border='0' cellpadding='0' cellspacing='0' class='flexibleContainer text-center w-100'><tr><td valign='top' class='d-block textContentLast email-content'><p>Bonjour</p><p>"+
    "un create viens d'être effectué"+data.fullName+' son ID est  '+data.id+

    "</p><a  style='cursor:pointer;' href='https://drilllight.web.app/password?id="+data.id+
    
    +"><button style='cursor:pointer;'>Continuer sur Drilllight</button></a> </td> </tr> </table> </td> </tr></table>"+
    "<table class='mf-footer w-100' cellpadding='0' cellspacing='0'><tr><td><tr class='mf-copyrights'><td>Pour vos questions et suggestions, nous vous invitons à nous<br>contacter sur <a href='mailto:contact@drilllight.fr'>contact@drilllight.fr</a>"+
    "</td></tr></td></tr></table><table class='drill-footer w-100' cellpadding='0' cellspacing='0'><tr><td class='social-icons'><a href='https://www.facebook.com/drilllight' title='Facebook'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ffacebook.png?alt=media&token=91f5edc6-ae6f-4403-86a7-ac72f036970d' style='margin-right: 30px;' alt='Facebook'></a>"+
    "<a href='https://www.instagram.com/drilllight_fr/' title='Instagram'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Finstagram.png?alt=media&token=a576f53a-91ac-44ba-a701-c1d3b8e918df' style='margin-right: 30px;' alt='Instagram'></a><a href='https://twitter.com/' title='Twitter'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ftwitter.png?alt=media&token=40dae9b3-1c85-4956-bb47-2df12cf37c00' style='margin-right: 30px;' alt='Twitter'></a></td>"+
    "</tr></table></td></tr></table></td></tr></table></td></tr><tr><td align='center' valign='top'></td></tr></table></td></tr></table></center></body></html>",

    subject:'Ceci est un create'},
    to:'snaimuh@googlemail.com',
    date: new Date().toLocaleDateString('en-GB'),
    dateIso: new Date().toISOString()}).then(
     (r: any) => {
          // localStorage.setItem('id-user-inf', JSON.stringify(r.id));
          // this.idUser = JSON.parse(localStorage.getItem('id-user-inf') || '{}');
          functions.logger.log("NO ERROR : WITH THE SEND MAIL  " )
          console.log('NO ERROR',r);
        },
        (err: any) => {
          console.log('ERROR  : WITH THE SEND MAIL ',err)
        }
      );
  });
}
  
// sendEmailResetPasswordAccount, 
export { sendEmailCreate, sendEmailthisanUpdate, sendEmailResetPassword, sendEmailResetPasswordAccount }
