import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {NgForm} from '@angular/forms';
import {FormGroup ,FormControl, Validators} from '@angular/forms';

import {Http} from '@angular/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';

import { GlobalService } from '../global.service';


@Component({
  selector: 'app-backup',
  templateUrl: './backup.component.html',
  styleUrls: ['./backup.component.css']
})
export class BackupComponent implements OnInit {

  constructor(private http:Http, private route:Router, private global:GlobalService, private actroute:ActivatedRoute) {
    this.server = global.getServerBranch();
    for (let i = 0; i < this.server.length; i++) {
      this.list.push({"server":this.server[i].branch,"checked":true});
    }
    for (let i = 0; i < this.server.length; i++) {
        this.serverlist.push({"server":this.server[i].branch});
    }
  }

  server;
  list = [];
  serverlist = [];
  bkRes = [];
  bkResBranch = [];
  bkValBranch = [];
  loading;
  selected='DATABASE';
  bkp;
  popbkdb;
  branchdial;


  ngOnInit() {
    this.bkp = new FormGroup({
      bktype: new FormControl({value:"DATABASE", disabled: false}, []),
      dbbkname: new FormControl('SBTCDB', []),
      path: new FormControl('D:/sqlbackup/sbtcdb.bak', []),
      retaindays: new FormControl(0, []),
      format: new FormControl(false, []),
      init: new FormControl(false, []),
      nounloud: new FormControl(false, []),
      diff: new FormControl(false, []),
      checksum: new FormControl(false, [])
    });
  }

  changed(status, server){
    this.listUpdate(server,status.checked);
  }

  bkexecution(data){
    this.popbkdb = false;
    this.branchdial =true;
    this.loading = true;
    this.backup(0, data.value);
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

  backup(count, data){
    var srv = this.global.getSingleServer(this.serverlist[count].server);
    var val =data;
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


    var param ={'branch':srv.branch,
                'dbname':srv.brDbName,
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
        count++;
        var res = response.json();
        this.bkResBranch.push({'branch': srv.branch, 'status':'success', 'msg':res[0].result});
        this.backupVer(srv.branch,srv.brDbName,val.path, count, data);
        console.log(this.bkResBranch);
      },
      (err)=>{
        this.bkResBranch.push({'branch': srv.branch, 'status':'error', 'msg':"error"});
        if(count != this.serverlist.length){
            this.backup(count, data);
        }else{
          this.loading = false;
        }
      }
    )
  }

  backupVer(server,dbname,path,count, data){
    var param = {'dbName': dbname, 'branch':server, 'path':path};
    this.http.post(this.global.getApiServer()+"bkverify", param).subscribe(
      (response) => {
        var res = response.json();
        var msg = "<p> Backup "+path+"</p>"+"<p>"+res[0].result+"</p>";
        this.bkValBranch.push({'branch':server,'status':'success','msg':msg});
        console.log(this.bkRes);
        if(count != this.serverlist.length){
          this.backup(count, data);
        }else{
          this.loading = false;
        }
      },
      (err) => {
        if(count != this.serverlist.length){
            this.backup(count, data);
        }else{
          this.loading = false;
        }

        var msg =  "<p>Something went wrong!</p>";
        this.bkValBranch.push({'branch':server,'status':'error','msg':msg});
        console.log(this.bkRes);
       }
    )
  }

}
