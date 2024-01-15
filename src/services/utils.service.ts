import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private templateTheme: BehaviorSubject<any>;
  private moderationMode: BehaviorSubject<any>;
  private seeAsAdmin: BehaviorSubject<any>;
  private accountsForPods: BehaviorSubject<any>;
  private EconesList:BehaviorSubject<any>;
  private dataOfUserAccount: BehaviorSubject<any>;
  private newUpdateOfCustomer: BehaviorSubject<any>;
  private newAccount: BehaviorSubject<any>;
  private historyData : BehaviorSubject<any>;
  private historyDataDetail: BehaviorSubject<any>;
  private seeNavigationMenu: BehaviorSubject<any>;
  private getThedataOfAccount: BehaviorSubject<any>;
  constructor() {
    this.templateTheme = new BehaviorSubject(null);
    this.moderationMode = new BehaviorSubject(null);
    this.seeAsAdmin = new BehaviorSubject(null);
    this.accountsForPods = new BehaviorSubject(null);
    this.EconesList = new BehaviorSubject(null);
    this.dataOfUserAccount = new BehaviorSubject(null);
    this.newUpdateOfCustomer = new BehaviorSubject(null);
    this.newAccount = new BehaviorSubject(null);
    this.historyData = new BehaviorSubject(null);
    this.historyDataDetail =  new BehaviorSubject(null);
    this.seeNavigationMenu =  new BehaviorSubject(false);
    this.getThedataOfAccount = new BehaviorSubject(null);
  }

  get _templateOptions() {
    return this.templateTheme.asObservable();
  }

  changeThemeTemplate(options: any) {
    console.log(options)
    this.templateTheme.next(options);
  }
  
  get _seeNavigation() {
    return this.seeNavigationMenu.asObservable();
  }

  howToSeeNavigation(seeNav: any) {
    console.log(seeNav)
    this.seeNavigationMenu.next(seeNav);
  }


  get _getModerateOption() {
    return this.moderationMode.asObservable();
  }

  changeModerateOption(options: any) {
    console.log('OPTION MODERATION : ! ',options)
    this.moderationMode.next(options);
  }


  // See AS ADMIN
  get _seeAsAdmin() {
    return this.seeAsAdmin.asObservable();
  }

  sendSeeAsAdmin(asAdmin: any) {
    console.log('VOIR EN TANT QUE ADMIN : ! ',asAdmin)
    this.seeAsAdmin.next(asAdmin);
  }
  //

  get _dataOfAccountsAndPods(){
    return this.accountsForPods.asObservable();
  }

  sendAdminToEcone(accounts:any){
    console.log('ACCOUNTS FOR PODS : ! ',accounts)
    this.accountsForPods.next(accounts);
  }

  get _dataOfEconesSend(){
    return this.EconesList.asObservable();
  }

  seeEconesList(econes:any){
    console.log('ACCOUNTS FOR PODS : ! ',econes)
    this.EconesList.next(econes);
  }

  get _dataOfUserAccounts(){
    return this.dataOfUserAccount.asObservable();
  }

  sendUserAccountData(accounts:any){
    console.log('ACCOUNT OF USER : ! ',accounts)
    this.dataOfUserAccount.next(accounts);
  }

  get _newDataOCustomerAccounts(){
    return this.newUpdateOfCustomer.asObservable();
  }

  sendNewDataOfCustomer(update:any){
    console.log('ACCOUNT OF Customer DATA TRUE ?? : ! ',update)
    this.newUpdateOfCustomer.next(update);
  }

  get _newaccount(){
    return this.newAccount.asObservable();
  }

  sendRequestGetnewAccount(update:any){
    console.log('ACCOUNT OF Customer DATA TRUE ?? : ! ',update)
    this.newAccount.next(update);
  }

  get _newhistory(){
    return this.historyData.asObservable();
  }

  sendNewHistory(history:any){
    console.log('HISTORY DATA TRUE ?? : ! ',history)
    this.historyData.next(history);
  }

  get _newhistoryDetail(){
    return this.historyDataDetail.asObservable();
  }

  sendNewHistoryDetail(historyDetail:any){
    console.log('HISTORY DATA Detail TRUE ?? : ! ',historyDetail)
    this.historyDataDetail.next(historyDetail);
  }


  get _dataOfAccountDetails(){
    return this.getThedataOfAccount.asObservable();
  }

  newAccountDetails(getThedata:any){
    console.log(' Detail TRUE ?? : ! ',getThedata)
    this.getThedataOfAccount.next(getThedata);
  }

}

