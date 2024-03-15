import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { DatePipe } from '@angular/common';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { AngularFirestore , AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class storageServiceMail {
  UserfirstName:any = '';
  user:any;
  maDate = new Date();
  idUser:any;
  html :any= "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Strict//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd'><html xmlns='http://www.w3.org/1999/xhtml'><head>"+
              "<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' /><meta name='viewport' content='width=device-width' /><title>Drilllight mail</title><link rel='preconnect' href='https://fonts.googleapis.com'>"+
              "<link href='https://fonts.googleapis.com/css?family=Roboto:400,500,700,900&display=swap' rel='stylesheet'><link href='https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@100;300;400;700&display=swap' rel='stylesheet'><style type='text/css'>"+
              "body,#bodyTable,#bodyCell { font-family: 'Roboto', sans-serif;height: 100% !important;margin: 0;padding: 0;width: 100% !important;}table {border-collapse: collapse;}"+
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
              ".email-content button {color: #0C0F20;width: 300px;height: 40px;background: #A1EAFB;border: 1px solid #A1EAFB;border-radius: 8px; padding: 12px 0;font-family: 'Be Vietnam Pro', sans-serif;font-weight: 600;font-size: 14px;line-height: 16px; margin: 50px auto; text-align: center; }"+
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
              "<tr><td valign='top' class=''><table class='flexibleContainer text-center' align='center' border='0' cellpadding='0' cellspacing='0'><tr><h2 class='email-title'>Titre du mail<br>À changer</h2><td></td></tr></table>"+
              "<table align='center' border='0' cellpadding='0' cellspacing='0' class='flexibleContainer text-center w-100'><tr><td valign='top' class='d-block textContentLast email-content'><p>Bonjour"+this.UserfirstName+"</p><p>"+
              "Nous sommes très heureux de vous accueillir sur Drilllight !<br>Nous vous invitons désormais à compléter et finaliser votre profil afin de démarrer l\'aventure Drilllight !<br>Des questions ?<br>N\'hésitez pas à nous contacter par mail à contact@drilllight.com pour quoi que ce soit et nous nous ferons un plaisir de revenir vers vous très rapidement.<br>À bientôt !<br>Sportivement, l’équipe Drilllight"+

              "</p>< style='cursor:pointer;'  button >Continuer sur Drilllight</> </td> </tr> </table> </td> </tr></table>"+
              "<table class='mf-footer w-100' cellpadding='0' cellspacing='0'><tr><td><tr class='mf-copyrights'><td>Pour vos questions et suggestions, nous vous invitons à nous<br>contacter sur <a href='mailto:contact@drilllight.fr'>contact@drilllight.fr</a>"+
              "</td></tr></td></tr></table><table class='drill-footer w-100' cellpadding='0' cellspacing='0'><tr><td class='social-icons'><a href='https://www.facebook.com/' title='Facebook'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ffacebook.png?alt=media&token=91f5edc6-ae6f-4403-86a7-ac72f036970d' style='margin-right: 30px;' alt='Facebook'></a>"+
              "<a href='https://www.instagram.com/' title='Instagram'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Finstagram.png?alt=media&token=a576f53a-91ac-44ba-a701-c1d3b8e918df' style='margin-right: 30px;' alt='Instagram'></a><a href='https://twitter.com/' title='Twitter'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ftwitter.png?alt=media&token=40dae9b3-1c85-4956-bb47-2df12cf37c00' style='margin-right: 30px;' alt='Twitter'></a></td>"+
              "</tr></table></td></tr></table></td></tr></table></td></tr><tr><td align='center' valign='top'></td></tr></table></td></tr></table></center></body></html>"


  constructor(
    private httpClient:HttpClient,
    private datePipe: DatePipe,
    private storage: AngularFireStorage,
    private db: AngularFirestore,
    ) {
      this.user = JSON.parse(localStorage.getItem('users') || '{}');

    }


    addMailAdmin(mailUser:any, firstName:any) {

      console.log('okokok send mail admin: ADMIN GO NEW VERSION:', mailUser, firstName)
      this.UserfirstName = firstName;
      return new Promise<any>((resolve, reject) => {
        this.db.collection('mail').add({ reason:'create admin', message:{text:'Bienvenue dans drillight',

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
        "<table align='center' border='0' cellpadding='0' cellspacing='0' class='flexibleContainer text-center w-100'><tr><td valign='top' class='d-block textContentLast email-content'><p>Bonjour "+firstName+"</p><p>"+
        "Nous sommes très heureux de vous accueillir en tant qu'administrateur sur Drilllight !<br>Nous vous invitons désormais à compléter et finaliser votre profil afin de démarrer l\'aventure Drilllight !<br>Des questions ?<br>N\'hésitez pas à nous contacter par mail à contact@drilllight.com pour quoi que ce soit et nous nous ferons un plaisir de revenir vers vous très rapidement.<br>À bientôt !<br>Sportivement, l’équipe Drilllight"+

        "</p><a  style='cursor:pointer;' href='https://drilllight.web.app/password?email="+mailUser+"'><button style='cursor:pointer;'>Continuer sur Drilllight</button></a> </td> </tr> </table> </td> </tr></table>"+
        "<table class='mf-footer w-100' cellpadding='0' cellspacing='0'><tr><td><tr class='mf-copyrights'><td>Pour vos questions et suggestions, nous vous invitons à nous<br>contacter sur <a href='mailto:contact@drilllight.fr'>contact@drilllight.fr</a>"+
        "</td></tr></td></tr></table><table class='drill-footer w-100' cellpadding='0' cellspacing='0'><tr><td class='social-icons'><a href='https://www.facebook.com/' title='Facebook'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ffacebook.png?alt=media&token=91f5edc6-ae6f-4403-86a7-ac72f036970d' style='margin-right: 30px;' alt='Facebook'></a>"+
        "<a href='https://www.instagram.com/' title='Instagram'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Finstagram.png?alt=media&token=a576f53a-91ac-44ba-a701-c1d3b8e918df' style='margin-right: 30px;' alt='Instagram'></a><a href='https://twitter.com/' title='Twitter'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ftwitter.png?alt=media&token=40dae9b3-1c85-4956-bb47-2df12cf37c00' style='margin-right: 30px;' alt='Twitter'></a></td>"+
        "</tr></table></td></tr></table></td></tr></table></td></tr><tr><td align='center' valign='top'></td></tr></table></td></tr></table></center></body></html>",

        subject:'Lien d\'inscription'},
        to:mailUser,
        date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
        dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')}).then(
         (r: any) => {
              // localStorage.setItem('id-user-inf', JSON.stringify(r.id));
              // this.idUser = JSON.parse(localStorage.getItem('id-user-inf') || '{}');
              console.log('NO ERROR',r);
            },
            (err: any) => {
              console.log('ERROR',err)
            }
          );
      });
    }

    addMailCustomer(mailUser:any, firstName:any) {

      console.log('okokok send mail customeur:', mailUser, firstName)
      this.UserfirstName = firstName;
      return new Promise<any>((resolve, reject) => {
        this.db.collection('mail').add({ reason:'create club', message:{text:'Bienvenue dans drillight',

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
        "<table align='center' border='0' cellpadding='0' cellspacing='0' class='flexibleContainer text-center w-100'><tr><td valign='top' class='d-block textContentLast email-content'><p>Bonjour "+firstName+"</p><p>"+
        "Nous sommes très heureux de vous accueillir sur Drilllight !<br>Nous vous invitons désormais à compléter et finaliser votre profil afin de démarrer l\'aventure Drilllight !<br>Des questions ?<br>N\'hésitez pas à nous contacter par mail à contact@drilllight.com pour quoi que ce soit et nous nous ferons un plaisir de revenir vers vous très rapidement.<br>À bientôt !<br>Sportivement, l’équipe Drilllight"+

        "</p><a  style='cursor:pointer;' href='https://drilllight.web.app/password?email="+mailUser+"'><button style='cursor:pointer;'>Continuer sur Drilllight</button></a> </td> </tr> </table> </td> </tr></table>"+
        "<table class='mf-footer w-100' cellpadding='0' cellspacing='0'><tr><td><tr class='mf-copyrights'><td>Pour vos questions et suggestions, nous vous invitons à nous<br>contacter sur <a href='mailto:contact@drilllight.fr'>contact@drilllight.fr</a>"+
        "</td></tr></td></tr></table><table class='drill-footer w-100' cellpadding='0' cellspacing='0'><tr><td class='social-icons'><a href='https://www.facebook.com/' title='Facebook'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ffacebook.png?alt=media&token=91f5edc6-ae6f-4403-86a7-ac72f036970d' style='margin-right: 30px;' alt='Facebook'></a>"+
        "<a href='https://www.instagram.com/' title='Instagram'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Finstagram.png?alt=media&token=a576f53a-91ac-44ba-a701-c1d3b8e918df' style='margin-right: 30px;' alt='Instagram'></a><a href='https://twitter.com/' title='Twitter'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ftwitter.png?alt=media&token=40dae9b3-1c85-4956-bb47-2df12cf37c00' style='margin-right: 30px;' alt='Twitter'></a></td>"+
        "</tr></table></td></tr></table></td></tr></table></td></tr><tr><td align='center' valign='top'></td></tr></table></td></tr></table></center></body></html>",

        subject:'Lien d\'inscription'},
        to:mailUser,
        date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
        dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')}).then(
         (r: any) => {
              // localStorage.setItem('id-user-inf', JSON.stringify(r.id));
              // this.idUser = JSON.parse(localStorage.getItem('id-user-inf') || '{}');
              console.log(r);
            },
            (err: any) => {
              console.log(err)
            }
          );
      });
    }

    addMailTrained(mailUser:any, firstName:any) {
      console.log('oikokok send mail trained: :', mailUser, firstName)
      return new Promise<any>((resolve, reject) => {
        this.db.collection('mail').add({reason:'create staff',  message:{text:'Bienvenue dans drillight',
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
        ".email-content button {color: #0C0F20;width: 300px;height: 40px;background: #A1EAFB;border: 1px solid #A1EAFB;border-radius: 8px; padding: 12px 0;font-family: 'Be Vietnam Pro', sans-serif;font-weight: 600;font-size: 14px;line-height: 16px; margin: 50px auto; text-align: center; }"+
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
        "<table align='center' border='0' cellpadding='0' cellspacing='0' class='flexibleContainer text-center w-100'><tr><td valign='top' class='d-block textContentLast email-content'><p>Bonjour "+firstName+"</p><p>"+
        "Nous sommes très heureux de vous accueillir sur Drilllight !<br>Nous vous invitons désormais à compléter et finaliser votre profil afin de démarrer l\'aventure Drilllight !<br>Des questions ?<br>N\'hésitez pas à nous contacter par mail à contact@drilllight.com pour quoi que ce soit et nous nous ferons un plaisir de revenir vers vous très rapidement.<br><br>À bientôt !<br>Sportivement,<br> l’équipe Drilllight"+
        "</p><a style='cursor:pointer;' class='over-button' href='https://drilllight.web.app/password?email="+mailUser+"'><button style='cursor:pointer;'>Continuer sur Drilllight</button></a> </td> </tr> </table> </td> </tr></table>"+
        "<table class='mf-footer w-100' cellpadding='0' cellspacing='0'><tr><td><tr class='mf-copyrights'><td>Pour vos questions et suggestions, nous vous invitons à nous<br>contacter sur <a href='mailto:contact@drilllight.fr'>contact@drilllight.fr</a>"+
        "</td></tr></td></tr></table><table class='drill-footer w-100' cellpadding='0' cellspacing='0'><tr><td class='social-icons'><a href='https://www.facebook.com/' title='Facebook'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ffacebook.png?alt=media&token=91f5edc6-ae6f-4403-86a7-ac72f036970d' style='margin-right: 30px;' alt='Facebook'></a>"+
        "<a href='https://www.instagram.com/' title='Instagram'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Finstagram.png?alt=media&token=a576f53a-91ac-44ba-a701-c1d3b8e918df' style='margin-right: 30px;' alt='Instagram'></a><a href='https://twitter.com/' title='Twitter'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ftwitter.png?alt=media&token=40dae9b3-1c85-4956-bb47-2df12cf37c00' style='margin-right: 30px;' alt='Twitter'></a></td>"+
        "</tr></table></td></tr></table></td></tr></table></td></tr><tr><td align='center' valign='top'></td></tr></table></td></tr></table></center></body></html>",


        subject:'Lien d\'inscription'},
        to:mailUser,
        date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
        dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')}).then(

        // this.db.collection('mail').add({  usermail: this.user, date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'), dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')}).then(
            (r: any) => {
              // localStorage.setItem('id-user-inf', JSON.stringify(r.id));
              // this.idUser = JSON.parse(localStorage.getItem('id-user-inf') || '{}');
              console.log(r);
            },
            (err: any) => {
              console.log(err)
            }
          );
      });
    }

    addMailplayer(mailUser:any, firstName:any) {
      console.log('oikokok send mail player: :', mailUser, firstName)
      return new Promise<any>((resolve, reject) => {
        this.db.collection('mail').add({ reason:'create user', message:{text:'Bienvenue dans drillight',
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
        ".email-content button {color: #0C0F20;width: 300px;height: 40px;background: #A1EAFB;border: 1px solid #A1EAFB;border-radius: 8px; padding: 12px 0;font-family: 'Be Vietnam Pro', sans-serif;font-weight: 600;font-size: 14px;line-height: 16px; margin: 50px auto; text-align: center; }"+
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
        "<table align='center' border='0' cellpadding='0' cellspacing='0' class='flexibleContainer text-center w-100'><tr><td valign='top' class='d-block textContentLast email-content'><p>Bonjour "+firstName+"</p><p>"+
        "Nous sommes très heureux de vous accueillir sur Drilllight !<br>Nous vous invitons désormais à compléter et finaliser votre profil afin de démarrer l\'aventure Drilllight !<br>Des questions ?<br>N\'hésitez pas à nous contacter par mail à contact@drilllight.com pour quoi que ce soit et nous nous ferons un plaisir de revenir vers vous très rapidement.<br><br>À bientôt !<br>Sportivement,<br> l’équipe Drilllight"+
        "</p><a style='cursor:pointer;' class='over-button' href='https://drilllight.web.app/password?email="+mailUser+"'><button style='cursor:pointer;'>Continuer sur Drilllight</button></a> </td> </tr> </table> </td> </tr></table>"+
        "<table class='mf-footer w-100' cellpadding='0' cellspacing='0'><tr><td><tr class='mf-copyrights'><td>Pour vos questions et suggestions, nous vous invitons à nous<br>contacter sur <a href='mailto:contact@drilllight.fr'>contact@drilllight.fr</a>"+
        "</td></tr></td></tr></table><table class='drill-footer w-100' cellpadding='0' cellspacing='0'><tr><td class='social-icons'><a href='https://www.facebook.com/' title='Facebook'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ffacebook.png?alt=media&token=91f5edc6-ae6f-4403-86a7-ac72f036970d' style='margin-right: 30px;' alt='Facebook'></a>"+
        "<a href='https://www.instagram.com/' title='Instagram'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Finstagram.png?alt=media&token=a576f53a-91ac-44ba-a701-c1d3b8e918df' style='margin-right: 30px;' alt='Instagram'></a><a href='https://twitter.com/' title='Twitter'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ftwitter.png?alt=media&token=40dae9b3-1c85-4956-bb47-2df12cf37c00' style='margin-right: 30px;' alt='Twitter'></a></td>"+
        "</tr></table></td></tr></table></td></tr></table></td></tr><tr><td align='center' valign='top'></td></tr></table></td></tr></table></center></body></html>",


        subject:'Lien d\'inscription'},
        to:mailUser,
        date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
        dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')}).then(
            (r: any) => {
              console.log(r);
            },
            (err: any) => {
              console.log(err)
            }
          );
      });
    }

    addMailVideoplayer(mailUser:any, firstName:any) {
      console.log('oikokok send mail')

      return new Promise<any>((resolve, reject) => {
        this.db.collection('mail').add({ reason:'video tag user', message:{
          text:'Bienvenue dans drillight',
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
          ".email-content button {color: #0C0F20;width: 300px;height: 40px;background: #A1EAFB;border: 1px solid #A1EAFB;border-radius: 8px; padding: 12px 0;font-family: 'Be Vietnam Pro', sans-serif;font-weight: 600;font-size: 14px;line-height: 16px; margin: 50px auto; text-align: center; }"+
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
          "<table align='center' border='0' cellpadding='0' cellspacing='0' class='flexibleContainer text-center w-100'><tr><td valign='top' class='d-block textContentLast email-content'><p>Bonjour "+firstName+"</p><p>"+
          "Vous êtes notifié(e) par l'un de vos coachs sur une vidéo de vos derniers entraînements ou matchs. Visionnez l'extrait en question !<br>Des questions ?<br>N\'hésitez pas à nous contacter par mail à contact@drilllight.com pour quoi que ce soit et nous nous ferons un plaisir de revenir vers vous très rapidement.<br><br>À bientôt !<br>Sportivement,<br> l’équipe Drilllight"+
          "</p><button class='over-button'>Voir la vidéo</button> </td> </tr> </table> </td> </tr></table>"+
          "<table class='mf-footer w-100' cellpadding='0' cellspacing='0'><tr><td><tr class='mf-copyrights'><td>Pour vos questions et suggestions, nous vous invitons à nous<br>contacter sur <a href='mailto:contact@drilllight.fr'>contact@drilllight.fr</a>"+
          "</td></tr></td></tr></table><table class='drill-footer w-100' cellpadding='0' cellspacing='0'><tr><td class='social-icons'><a href='https://www.facebook.com/' title='Facebook'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ffacebook.png?alt=media&token=91f5edc6-ae6f-4403-86a7-ac72f036970d' style='margin-right: 30px;' alt='Facebook'></a>"+
          "<a href='https://www.instagram.com/' title='Instagram'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Finstagram.png?alt=media&token=a576f53a-91ac-44ba-a701-c1d3b8e918df' style='margin-right: 30px;' alt='Instagram'></a><a href='https://twitter.com/' title='Twitter'><img src='https://firebasestorage.googleapis.com/v0/b/drilllight.appspot.com/o/IMG_MAIL%2Ftwitter.png?alt=media&token=40dae9b3-1c85-4956-bb47-2df12cf37c00' style='margin-right: 30px;' alt='Twitter'></a></td>"+
          "</tr></table></td></tr></table></td></tr></table></td></tr><tr><td align='center' valign='top'></td></tr></table></td></tr></table></center></body></html>",


          subject:'Vous avez été notifié(e) sur un moment clé !'},
          to:mailUser,
          date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'),
          dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')}).then(
         // this.db.collection('mail').add({  usermail: this.user, date: this.datePipe.transform(this.maDate, 'dd/MM/yyyy'), dateIso: this.datePipe.transform(this.maDate, 'yyyy-MM-ddTHH:mm:ss.SSS')}).then(
            (r: any) => {
              // localStorage.setItem('id-user-inf', JSON.stringify(r.id));
              // this.idUser = JSON.parse(localStorage.getItem('id-user-inf') || '{}');
              console.log(r);
            },
            (err: any) => {
              console.log(err)
            }
          );
      });
    }


}
