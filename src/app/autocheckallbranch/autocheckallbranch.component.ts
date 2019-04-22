import { Component, OnInit , ViewChild} from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import {NgForm} from '@angular/forms';
import {MatPaginator, MatTableDataSource, MatSort} from '@angular/material';
import { DecimalPipe } from '@angular/common';

import {Http} from '@angular/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';

import { GlobalService } from '../global.service';
import { CollectdataService } from '../collectdata.service';

@Component({
  selector: 'app-autocheckallbranch',
  templateUrl: './autocheckallbranch.component.html',
  styleUrls: ['./autocheckallbranch.component.css']
})
export class AutocheckallbranchComponent implements OnInit {

  constructor(private global:GlobalService, private collectdata:CollectdataService, private route:Router, private actroute:ActivatedRoute, private http:Http) {
    this.server = global.getServerBranch();
    for (let i = 0; i < this.server.length; i++) {
      this.list.push({"server":this.server[i].branch,"checked":true});
    }
    for (let i = 0; i < this.server.length; i++) {
        this.serverlist.push({"server":this.server[i].branch});
    }
  }

  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['date', 'message'];
  dataSource = new MatTableDataSource();

  listProcColumns = ['spid', 'kpid','blocked','cmd','logintime','loginname','status'];
  listProc = new MatTableDataSource();

  listBlockByColumns = ['spid', 'blkby','REQID','lastBatch','DBName','ProgramName','hostname','CPUtime','status'];
  tabBlockBy = new MatTableDataSource();

  tabSerAgntFailList = ['date', 'stepID','name','stepName','message','status'];
  tabSerAgntFail = new MatTableDataSource();

  server;
  list = [];
  serverlist = [];

  listSevice = [];
  listUpdateStats = [];
  listDiskSpace;
  listRows = [];
  listLog = [];
  listCheckDB =[];
  listKill =[];
  listServerAgent;
  listLogFailed;
  listUserProces ;
  listBps;
  listCheckBlockBy=[];
  detlist=[];
  listAllresult =[];

  loading;
  loadingStatus;
  StatusBranch;
  counter;
  killConfirm = false;
  dialRes = false;
  shrinkConfirm =false;
  checkdbres = "not checked";
  ckDisable = false;
  kl;
  msgdialtitle;
  mshdialcont;
  msgDial = false;

  ngOnInit() {
  }

  showDetails(item){
    this.detlist=undefined;
    this.detlist=[];
    this.detlist.push(item);
    this.dataSource = new MatTableDataSource(item.logFailed);
    this.dataSource.sort = this.sort;
    this.listProc = new MatTableDataSource(item.listProces);
    this.listProc.sort = this.sort;
    this.tabBlockBy = new MatTableDataSource(item.blockBy);
    this.tabBlockBy.sort = this.sort;
    this.tabSerAgntFail = new MatTableDataSource(item.serverAgent);
    this.tabSerAgntFail.sort = this.sort;
  }

  changed(status, server){
    this.listUpdate(server,status.checked);
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
  filterListProc(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.listProc.filter = filterValue;
  }
  filterBlBy(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.tabBlockBy.filter = filterValue;
  }

  checking(){
    this.listAllresult =undefined;
    this.listAllresult =[];
    this.ckDisable = true;
    this.loading = true;
    this.startCheckLoop(0);
  }

  kill(item, branch){
    var params = this.global.getSingleServer(branch);
    var param = {'dbName': params.brDbName ,'branch':params.master, 'spid':item.value.spidkill};
    this.http.post(this.global.getApiServer()+"killSpid", param).subscribe(
      (response) => {
        var res  = response.json()[0];
        this.msgDial = true;
        this.msgdialtitle = "Kill SPID Result";
        this.mshdialcont = "Success Kill SPID :"+item.value.spidkill;
      },
      (err) =>{
        console.log('Something went wrong!');
      }
    )
  }


  // function
 listUpdate(server, checked){
    var del = this.searchList(server);
    if(checked){
      this.serverlist.push({"server":server});
    }else{
      this.serverlist.splice(del, 1);
    }
  }

  searchList(branch){
    var d = -1;
    for (let i = 0; i < this.serverlist.length; i++) {
      if(this.serverlist[i].server == branch){
        d = i;
      }
    }
    return d;
  }

  startCheckLoop(count){
    this.listSevice = undefined;
    this.listCheckDB = undefined;
    this.listUpdateStats = undefined;
    this.listRows = undefined;
    this.listLog = undefined;
    this.listServerAgent = undefined;
    this.listLogFailed = undefined;
    this.listUserProces = undefined;
    this.listCheckBlockBy = undefined;
    this.listSevice = [];
    this.listCheckDB = [];
    this.listUpdateStats = [];
    this.listRows =[];
    this.listLog =[];
    this.listCheckBlockBy = [];


    this.updateStats(count);
  }

  updateStats(count){
    var param = this.global.getSingleServer(this.serverlist[count].server);

    this.StatusBranch = param.branch;
    this.loadingStatus = "Updating Statistics";

    this.http.post(this.global.getApiServer()+"updateStats", param).subscribe(
      (response) => {
        var res  = response.json()[0];
        this.listUpdateStats.push(res);
        this.checkservice(count);
      },
      (err) => {
        console.log('Something went wrong!');
        this.startCheckLoop(count++);
      }
    )
  }

  checkservice(count){
    var param = this.global.getSingleServer(this.serverlist[count].server);

    this.StatusBranch = param.branch;
    this.loadingStatus = "Checking Server Service";

    this.http.post(this.global.getApiServer()+"checkService", param).subscribe(
      (response) => {
        var res  = response.json()[0];
        this.listSevice.push(res);
        this.checkDB(count);
      },
      (err) => {
        console.log('Something went wrong!');
        this.startCheckLoop(count++);
      }
    )
  }

  checkDB(count){
    this.loadingStatus = "Checking Database (CHECKDB)";
    var params = this.global.getSingleServer(this.serverlist[count].server);
    var param = {'dbName': params.brDbName ,'branch':params.branch};

    this.http.post(this.global.getApiServer()+"checkdb", param).subscribe(
      (response) => {
        var res  = response.json()[0];
        var ms = res.msg;
        var char = 171 + params.brDbName.length;
        var res = ms.substr(ms.length - char);
        if(res == "CHECKDB found 0 allocation errors and 0 consistency errors in database '"+params.brDbName+"'. <br>DBCC execution completed. If DBCC printed error messages, contact your system administrator."){
          res = "Good";
        }else{
          res = "Has Error";
        }

        this.listCheckDB.push({
          'result':res,
          'msg':ms
        })

        this.checkDriveSpace(count);

      },
      (err)=>{
        console.log('Something went wrong!');
        this.startCheckLoop(count++);
      }
    )
  }

  checkDriveSpace(count){
    var params = this.global.getSingleServer(this.serverlist[count].server);
    var param = {'dbName': params.brDbName ,'branch':params.master};
    this.loadingStatus = "Checking Harddisk Space Drive";

    this.http.post(this.global.getApiServer()+"phisic", param).subscribe(
        response => {
          var dataRL = response.json();
          this.listDiskSpace= dataRL;
          this.checkDatabase(count);
        },
        err => {
           console.log('Something went wrong!');
           this.startCheckLoop(count++);
         }
      )
  }

    checkDatabase(count){
      this.loadingStatus = "Checking ROWS & LOGS";
      var params = this.global.getSingleServer(this.serverlist[count].server);
      var param = {'dbName': params.brDbName ,'branch':params.branch};

      this.http.post(this.global.getApiServer()+"branchmonitor", param).subscribe(
          response => {
            var dataRL = response.json();
            var log;
            this.listRows=undefined;
            this.listRows=[];
            this.listLog=undefined;
            this.listLog=[];

            for (let i = 0; i < dataRL.length; i++) {
              if(dataRL[i].type=="ROWS"){
                this.listRows.push({"type":dataRL[i].type, 'fileUsed':dataRL[i].fileSize, 'driveFree':dataRL[i].driveSpacePercentage});
              }else if(dataRL[i].type=="LOG"){
                this.listLog.push({"type":dataRL[i].type, 'fileUsed':dataRL[i].fileSize, 'driveFree':dataRL[i].driveSpacePercentage});
                log = parseInt(dataRL[i].fileSize);
              }
            }
            if(log > 800){
              this.counter = count;
              this.loading = false;
              this.shrinkConfirm = true;
            }else{
              this.checkServerAgent(count);
            }

          },
          err => {
            console.log('Something went wrong!');
            this.startCheckLoop(count++);
           }
        )
    }

    srinkConfrm(bool){
      if(bool){
        this.shrink('log');
      }else{
        this.checkServerAgent(this.counter);
      }
    }

    shrink(type){
      this.loadingStatus = "Shrinking LOGS";

      var count = this.counter;
      var params = this.global.getSingleServer(this.serverlist[count].server);
      var param = {'dbName': params.brDbName ,'branch':params.branch};
      // this.counter;
      if(type == 'log'){
        this.http.post(this.global.getApiServer()+"shrinklog", param).subscribe(
          (response) => {
            this.checkDatabase(count);
          },
          (err) =>{
            console.log('Something went wrong!');
            this.startCheckLoop(count++);
          }
        )
      }
    }

    checkServerAgent(count){
      this.loadingStatus = "Collect Server Agent Failed Data";

      var param = this.global.getSingleServer(this.serverlist[count].server);

      this.http.post(this.global.getApiServer()+"checkSrvAgent", param).subscribe(
        (response) => {
          var res  = response.json();
          this.listServerAgent = res;
          this.checkLogFailed(count);
        },
        (err) =>{
          console.log('Something went wrong!');
          this.startCheckLoop(count++);
        }
      )
    }

    checkLogFailed(count){
      this.loadingStatus = "Collect LOG Failed Data";

      var param = this.global.getSingleServer(this.serverlist[count].server);

      this.http.post(this.global.getApiServer()+"errLog", param).subscribe(
        (response) => {
          var res  = response.json();
          this.listLogFailed = res;

          this.userConnected(count);

        },
        (err) =>{
          console.log('Something went wrong!');
          this.startCheckLoop(count++);
        }
      )
    }

    userConnected(count){
      this.loadingStatus = "Collect Databases Conected With";
      var param = this.global.getSingleServer(this.serverlist[count].server);

      this.http.post(this.global.getApiServer()+"processConnected", param).subscribe(
        (response) => {
          var res  = response.json();
          this.listUserProces=res;
          this.bps(count);

        },
        (err) =>{
          console.log('Something went wrong!');
          this.startCheckLoop(count++);
        }
      )
    }


    bps(count){
      this.loadingStatus = "Get BPS in New 30 Second";

      var param = this.global.getSingleServer(this.serverlist[count].server);

      this.http.post(this.global.getApiServer()+"batch", param).subscribe(
        (response) => {
          var res  = response.json();
          this.listBps= res;
          this.checkBlockBy(count);
        },
        (err) =>{
          console.log('Something went wrong!');
          this.startCheckLoop(count++);
        }
      )
    }

    checkBlockBy(count){
      this.listKill = undefined;
      this.listKill=[];
      this.listCheckBlockBy = undefined;
      this.listCheckBlockBy = [];
      this.loadingStatus = "Check Something Block Process";

      var param = this.global.getSingleServer(this.serverlist[count].server);

      this.http.post(this.global.getApiServer()+"checkBlockBy", param).subscribe(
        (response) => {
          var res  = response.json();
          this.listCheckBlockBy = res;
          for (let i = 0; i < res.length; i++) {
              if(res[i].blkby != "  ."){
                this.counter = count;
                this.killConfirm = true;
                this.loading = false;
                var d = parseInt(res[i].blkby);
                this.listKill.push({'spid':d});
              }
          }

          if(this.listKill.length == 0){
            this.endLoop(count);
          }

        },
        (err) =>{
          console.log('Something went wrong!');
          this.startCheckLoop(count++);
        }
      )
    }

    killConfrm(bool){
      if(bool){
        this.killSpid(this.counter, 0 );
      }else{
        this.endLoop(this.counter);
      }
    }

    killSpid(count, thcount){
      var spid = this.listKill[thcount].spid;
      var params = this.global.getSingleServer(this.serverlist[count].server);
      var param = {'dbName': params.brDbName ,'branch':params.master, 'spid':spid};

      this.http.post(this.global.getApiServer()+"killSpid", param).subscribe(
        (response) => {
          thcount++;
          var res  = response.json()[0].msg;
          if(thcount == this.listKill.length){
            this.checkBlockBy(count);
          }else{
            this.killSpid(count,thcount);
          }
        },
        (err) =>{
          console.log('Something went wrong!');
          this.startCheckLoop(count++);
        }
      )
    }

    endLoop(count){
      var params = this.global.getSingleServer(this.serverlist[count].server);

      this.listAllresult.push({
          'server':params.branch,
          'checkService':this.listSevice,
          'diskSpace':this.listDiskSpace,
          'checkDB':this.listCheckDB,
          'updateStats':this.listUpdateStats,
          'rows':this.listRows,
          'logs':this.listLog,
          'serverAgent':this.listServerAgent,
          'logFailed':this.listLogFailed,
          'listProces':this.listUserProces,
          'bps':this.listBps,
          'blockBy':this.listCheckBlockBy
      });

      console.log(this.listAllresult);
      count ++;
      if(count == this.serverlist.length){
        this.loading = false;
        this.ckDisable = false;
        this.dialRes = true;
      }else{
        this.startCheckLoop(count);
      }
    }


}
