import { Component, OnInit, Pipe, PipeTransform  } from '@angular/core';
import {FormGroup ,FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {Http} from '@angular/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';

import { GlobalService } from '../global.service';
import { CollectdataService } from '../collectdata.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private http:Http, private route:Router, private global:GlobalService) {
    this.server = [];
  }
  server;
  _setIntervalHandler;
  interval = 0;
  lastDataTime;
  loading = true;

   public chartHovered(e:any):void {
     console.log(e);
   }

  ngOnInit() {
    var d = this.global.getServerBranch();
    var ds = 0;
    var sds =  this.getData(0);
  }

  getData(count){
    var ds = 0;
    var status;
    var logStatus;
    var phisic;
    var bklist;
    var logDetail;
    var cnt = 0;
    var mx = 4;

    this._setIntervalHandler = setInterval(() => {
         ds++;
    }, 1);

    var paramMaster = {'dbName': this.global.getServerBranch()[count].brDbName ,'branch':this.global.getServerBranch()[count].master};
    var paramBranch = {'dbName': this.global.getServerBranch()[count].brDbName ,'branch':this.global.getServerBranch()[count].branch};

    this.http.post(this.global.getApiServer()+"branchcekstatus", paramMaster).subscribe(
      response => {
        var res = response.json();
        var resp = res[0];
        clearInterval(this._setIntervalHandler);
        if(resp == undefined){
          //failed
        }else{
          //success
          status = resp;

          if(status.status == "ONLINE"){
            var prmbk =  {'dbName': this.global.getServerBranch()[count].brDbName ,'branch':this.global.getServerBranch()[count].branch,'many':'1','lastDate':'720'};
            this.http.post(this.global.getApiServer()+"bkmonitor", prmbk).subscribe(
                (response) => {
                  var res = response.json();
                  clearInterval(this._setIntervalHandler);
                  bklist = res;

                  cnt++;
                  this.setServer(cnt,mx,count,status,logStatus,phisic,logDetail,ds,bklist);
                }
              )
          }else{
            cnt++;
            bklist =[];
            bklist.push({
                'bkdate' : undefined,
                'bktype' : undefined,
                'dbName' : undefined,
                'firstlsn' : undefined,
                'lastlsn' : undefined,
                'path' : undefined,
                'recModel' : undefined,
                'serverName' : undefined,
                'size' : undefined,
                'time' : undefined
            });
            this.setServer(cnt,mx,count,status,logStatus,phisic,logDetail,ds,bklist);
          }
        }
        cnt++;
        this.setServer(cnt,mx,count,status,logStatus,phisic,logDetail,ds,bklist);

      },
      err => {
         console.log('Something went wrong!');
         this.getData(count+1);

       }
    )

    this.http.post(this.global.getApiServer()+"branchlogmonitor", paramMaster).subscribe(
      response => {
        var res1 = response.json();
        var resp1 = res1[0];
        clearInterval(this._setIntervalHandler);
        if(resp1 == undefined){
          //failed
          logStatus = {"dbName": this.global.getServerBranch()[count].brDbName, "logSize": "", "logSpace": "", "status": "", "maxSize": ""};
        }else{
           logStatus=resp1;
        }
        cnt++;
        this.setServer(cnt,mx,count,status,logStatus,phisic,logDetail,ds,bklist);
      },
      err => {
         console.log('Something went wrong!');
         this.getData(count+1);

       }
    )

    this.http.post(this.global.getApiServer()+"branchmonitor", paramMaster).subscribe(
        response => {
          var res2 = response.json();
          clearInterval(this._setIntervalHandler);
          if(res2[0] == undefined){
            var d = {
              "autoGrowth":undefined,
              "dbName":undefined,
              "drive":undefined,
              "driveSpacePercentage":undefined,
              "driveSpaceVolume":undefined,
              "driveTotalVolume":undefined,
              "fileFree":undefined,
              "fileFreePercentage":undefined,
              "fileName":undefined,
              "fileSize":undefined,
              "fileUsed":undefined,
              "path":undefined,
              "serverName":undefined,
              "type":undefined
            };
            phisic = d;
            logDetail = d;
          }else{
            phisic = res2[0];
            logDetail = res2[1];
          }
          cnt++;
          this.setServer(cnt,mx,count,status,logStatus,phisic,logDetail,ds,bklist);
        },
        err => {
           console.log('Something went wrong!');
           this.getData(count+1);

         }
      )
  }

  setServer(count,max,ct,status,log,phis,logdet,tresp,bklist){
    if(bklist == undefined){
      bklist = [];
    }

    if(count == max){
      var cd = new Date();
      var dt = cd.getDate() + "/"
              + (cd.getMonth()+1)  + "/"
              + cd.getFullYear() + " @ "
              + cd.getHours() + ":"
              + cd.getMinutes() + ":"
              + cd.getSeconds();


      var listing = {"branch":this.global.getServerBranch()[ct].branch,
                        "serverStatus":status,
                        "logStatus":log,
                        "phisicStatus":phis,
                        "logDetailStatus":logdet,
                        "responTime":tresp,
                        "backupList":bklist,
                        "lastSync":dt
                      };

      this.server.push(listing);


      ct++;
      if(ct !=  this.global.getServerBranch().length){
        this.getData(ct)
      }else{
        this.loading = false;
        var currentdate = new Date();
        var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();

        this.lastDataTime = datetime;
      }
      return ct;
    }
  }

}
