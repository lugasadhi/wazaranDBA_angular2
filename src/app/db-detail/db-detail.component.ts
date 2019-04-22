import { Component, OnInit , ViewChild} from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import {FormGroup ,FormControl, Validators} from '@angular/forms';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
import { DecimalPipe } from '@angular/common';

import {Http} from '@angular/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';

import { GlobalService } from '../global.service';
import { CollectdataService } from '../collectdata.service';


@Component({
  selector: 'app-db-detail',
  templateUrl: './db-detail.component.html',
  styleUrls: ['./db-detail.component.css']
})
export class DbDetailComponent implements OnInit {

  constructor(private global:GlobalService, private collectdata:CollectdataService, private route:Router, private actroute:ActivatedRoute, private http:Http) {
    this.actroute.params.subscribe(params => {
      this.branch = params['branch'];
      this.brArr = this.global.getSingleServer(this.branch );
   });

   this.paramBranch = {'dbName': this.brArr.brDbName ,'branch':this.brArr.branch};
   this.paramMaster = {'dbName': this.brArr.brDbName ,'branch':this.brArr.master};
   this.dataSource.sort = this.sort;

 }

  loading = false;
  srvstatus;
  dataRL;
  branch;
  brArr;
  data;
  dbGen;
  backupDatabase;
  lastSync;
  responTime;
  row = [];
  log = [];
  cdbdialog;
  paramBranch;
  paramMaster;
  dateCerate;
  dataPhisic;
  dialbkdb;
  dialogMsg;
  cdbmsg;
  checkdbres = "not checking";
  backupdialog;
  shrnkLog;
  bk;bkp;dialVer;
  sld = false;
  dialogTitle;
  logmax;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = ['date', 'name', 'type', 'path', 'recModel','size','time'];
  dataSource = new MatTableDataSource();


 applyFilter(filterValue: string) {
   filterValue = filterValue.trim(); // Remove whitespace
   filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
   this.dataSource.filter = filterValue;
 }


  ngOnInit() {
    var counter = 0;
    this.loading = true;
    this.http.post(this.global.getApiServer()+"branchcekstatus",  this.paramMaster).subscribe(
      response => {
        this.loadEnd(counter++);
        var res = response.json();
        var resp = res[0];
        if(resp == undefined){
          //failed
        }else{
          //success
          var status = resp;
          this.srvstatus = res;

          if(status.status == "ONLINE"){
            var prmbk = {'dbName': this.brArr.brDbName ,'branch':this.brArr.branch, 'many':'100','lastDate':'720'};

            this.http.post(this.global.getApiServer()+"bkmonitor", prmbk).subscribe(
              (response) => {
                this.loadEnd(counter++);
                this.backupDatabase = response.json();
                this.dataSource = new MatTableDataSource(this.backupDatabase);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
              }
            )
          }
        }
      },
      err => {
         console.log('Something went wrong!');
       }
    )

    this.http.post(this.global.getApiServer()+"branchmonitor", this.paramBranch).subscribe(
        response => {
          this.loadEnd(counter++);
          this.dataRL = response.json();
          console.log(this.dataRL);
        },
        err => {
           console.log('Something went wrong!');
         }
      )

    this.http.post(this.global.getApiServer()+"dbGeneral", this.paramMaster).subscribe(
      (response) => {
        this.loadEnd(counter++);
        var res = response.json();
        this.dbGen = res;
      },
      err =>{
        console.log('Something went wrong!');
      }
    )

    this.http.post(this.global.getApiServer()+"phisic", this.paramMaster).subscribe(
      (response) => {
        this.loadEnd(counter++);
        var res = response.json();
        this.dataPhisic = res;
      },
      (err) => {
        console.log('Something went wrong!');
      }
    )

    this.http.post(this.global.getApiServer()+"logsize", this.paramBranch).subscribe(
      (response) => {
        var res = response.json();
        this.logmax = res;
      },
      (err) => {
        console.log('Something went wrong!');
      }
    )

    this.bk = new FormGroup({
      bktype: new FormControl({value:"", disabled: false}, []),
      dbbkname: new FormControl('SBTCDB', []),
      path: new FormControl('D:\\sqlbackup\\sbtcdb.bak', []),
      retaindays: new FormControl(0, []),
      format: new FormControl(false, []),
      init: new FormControl(false, []),
      nounloud: new FormControl(false, []),
      diff: new FormControl(false, []),
      checksum: new FormControl(false, [])
    });
    this.bkp = new FormGroup({
      path: new FormControl({value:"", disabled: false}, []),
      paths: new FormControl({value:"", disabled: false}, []),
    });
  }
  // loadingend
  loadEnd(count){
    if( count == 4){
      this.loading = false;
    }
  }

  // chart
  phisicDataChart(free, total){
    var ss:number[] = [free, total-free];
    return ss;
  }
  phisicLabel(free, total){
    var vfree =  (free/1024/1024/1024).toFixed(2);
    var vuse =  ((total-free)/1024/1024/1024).toFixed(2);
    var ss:string[] = ['Free Space :'+vfree+" GB", 'Used Space :'+vuse+" GB"];
    return ss;
  }
  logDataChart(log, total, free){
    var vlog = parseInt(log)/1000;
    var vtotal = parseInt(total);
    var vfree = parseInt(free);
    var ss:number[] = [vlog, vfree, vtotal-vfree-vlog];
    return ss;
  }
  logLabel(log, total, free){
    var vlog = parseInt(log);
    var vtotal = parseInt(total);
    var vfree = parseInt(free);
    var ss:string[] = ['Log:'+vlog +" MB", 'Free :'+free,'Used :'+(vtotal-vfree-(vlog/1000))+' GB'];
    return ss;
  }
  rowLabel(log, total, free){
    var vlog = parseInt(log);
    var vtotal = parseInt(total);
    var vfree = parseInt(free);
    var ss:string[] = ['Row:'+vlog +" MB", 'Free :'+free,'Used :'+(vtotal-vfree-(vlog/1000))+' GB'];
    return ss;
  }

  // checkDB
  checkdb(){
    this.loading = true;
    this.http.post(this.global.getApiServer()+"checkdb", this.paramBranch).subscribe(
      (response) => {
        this.loading = false;
        this.cdbmsg  = response.json();
        var ms = this.cdbmsg[0].msg;
        var char = 171 + this.brArr.brDbName.length;
        var res = ms.substr(ms.length - char);
        if(res == "CHECKDB found 0 allocation errors and 0 consistency errors in database '"+this.brArr.brDbName+"'. <br>DBCC execution completed. If DBCC printed error messages, contact your system administrator."){
          this.checkdbres = "Good";
        }else{
          this.checkdbres = "Has Error";
        }
      }
    )
  }

  cdbres(){
    var ms = this.cdbmsg[0].msg;
    this.dialogMsg = "<p>"+ms+"</p>";
  }

  shrinking(type){
    if(type=="ROW"){
      // this.logShrink();
    }else if(type == "LOG"){
      this.logShrink();
    }
  }

  logShrink(){
    this.loading = true;
    this.http.post(this.global.getApiServer()+"shrinklog", this.paramBranch).subscribe(
      (response) => {
        this.loading = false;
        this.shrnkLog  = response.json()[0];
        this.cdbdialog = true;
        var cont = '<p class="text-green">Log Shrink Success</p>  <div class="table-overflow-x" > <table class="table table-hover"> <thead> <tr>';
        cont += '<th scope="col">Current Size</th>';
        cont += '<th scope="col">Minimal Size</th>';
        cont += '<th scope="col">Estimation Page</th>';
        cont += '<th scope="col">Used Page</th>';
        cont += '</tr></thead> <tbody> <tr>';
        cont += '<td>'+this.shrnkLog.currentSize+'</td>';
        cont += '<td>'+this.shrnkLog.minSize+'</td>';
        cont += '<td>'+this.shrnkLog.estPage+'</td>';
        cont += '<td>'+this.shrnkLog.usedPage+'</td>';
        cont += '</tr></tbody></table></div>';

        this.dialogMsg =cont;
      }
    )
  }
  backupSubmit(bk){
    this.loading = true;
    this.dialbkdb = false;
    var val =bk.value;
    var df ="";
    var frmt = "";
    var init ="";
    var rd ="";
    var nl="";
    var cks="";

    if(val.diff){
      df = "DIFFERENTIAL,";
    }
    if(val.format){
      frmt = "FORMAT,";
    }else{
      frmt ="";
    }
    if(val.init){
      init = "INIT,";
    }else{
      init ="NOINIT,";
    }
    if(val.retaindays <= 0){
      rd ="";
    }else{
      rd="RETAINDAYS = "+val.retaindays+",";
    }
    if(val.nounloud){
      nl="NOUNLOAD,";
    }else{
      nl="";
    }
    if(val.checksum){
      cks="checksum,";
    }else{
      cks="";
    }
    var param ={'branch':this.paramBranch.branch,
                'dbname':this.paramBranch.dbName,
                'bkname':val.dbbkname,
                'bktype':val.bktype,
                'bkpath':val.path,
                'differential':df,
                'retaindays':rd,
                'format':frmt,
                'init':init,
                'nounloud':nl,
                'checksum':cks};
    this.http.post(this.global.getApiServer()+"backup", param).subscribe(
      (response) => {
        this.loading = false;
        var res = response.json();
        this.backupVer(val.path);

        var prmbk = {'dbName': this.brArr.brDbName ,'branch':this.brArr.branch, 'many':'100','lastDate':'720'};

        this.http.post(this.global.getApiServer()+"bkmonitor", prmbk).subscribe(
          (response) => {
            this.backupDatabase = response.json();
            this.dataSource = new MatTableDataSource(this.backupDatabase);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        )
      }
    )
  }

  chgTyp(ss){
    this.bk.setValue({bktype: ss,dbbkname:'SBTCDB',path:'D:/sqlbackup/sbtcdb.bak',retaindays:0,format:false,init:false,nounloud:false,checksum:false,diff:false});
  }

  bkVer(path){
    var pth;
    if(!this.sld){
      pth = path.value.path;
    }else{
      pth = path.value.paths;
    }
    this.backupVer(pth);
  }

  backupVer(path){
    this.loading = true;
    var param = {'dbName': this.brArr.brDbName ,'branch':this.brArr.branch, 'path':path};
    this.http.post(this.global.getApiServer()+"bkverify", param).subscribe(
      (response) => {
        this.dialVer = false;
        this.loading = false;
        this.cdbdialog = true;
        this.dialogTitle = "Backup & Varification Result"
        var res = response.json();
        this.dialogMsg = "<p> Backup "+path+"</p>"+"<p>"+res[0].result+"</p>";
      },
      (err) => {
        this.dialVer = false;
        this.loading = false;
        this.dialogTitle = "Backup & Varification Result"
        this.dialogMsg = "<p>Something went wrong!</p>";
       }
    )
  }

}
