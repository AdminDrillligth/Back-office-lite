import { Component } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { Router } from '@angular/router';
import { UserHandlerHistoricalService } from '../../services/user-handlers-historical.service';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})

export class HistoryComponent {
  historyData:any = [];
  AccountOfUser:any;
  results : any = [];
  users:any = [];
  constructor(
    private userHandlerHistoricalService:UserHandlerHistoricalService,
    private utilsService: UtilsService,
    private router: Router ){}

    ngOnInit(): void {
      this.AccountOfUser = JSON.parse(localStorage.getItem('account') || '{}');
      console.log('ACCOUNT OF USER :! : ', this.AccountOfUser);
      if(this.AccountOfUser !== undefined){
        this.getResultsList();
      }
      this.utilsService._newhistory.subscribe((history:any) =>{
        console.log('HISTORY : ! ',history)
        this.historyData = history;
      });


    }

    seeDetailOfResult(result:any){
      this.utilsService.sendNewHistoryDetail(result);
      this.router.navigate(['history/history-details']);
    }

    getResultsList(){
      console.log(this.AccountOfUser.id)
      console.log("ACCOUNT OF USER :  !",this.AccountOfUser)
      this.userHandlerHistoricalService.getResultsList(this.AccountOfUser.id).subscribe((resp:any)=>{
        console.log(resp)
        this.results = resp.results;
        // console.log(this.results)
        // console.log(this.results[0].result.kpi.name)
        // console.log(this.results[0].result.infos.startDate)

        this.results.forEach((result:any)=>{
          result.result.infos.time = new Date(result.result.infos.startDate).toLocaleTimeString('fr-FR')
          result.result.infos.date = new Date(result.result.infos.startDate).toLocaleDateString('en-GB')
          // console.log(result.result.infos.date)
        })

  
        let newArray = this.results.sort((a:any,b:any)=>Number(a.result.infos.startDate) - Number(b.result.infos.startDate))
        console.log(newArray);
      });



    }
    

}
