import { Injectable } from '@angular/core';

@Injectable()
export class GlobalService {

  constructor() { }


  servertest = [
    { 'branch':'app-sbtc', 'master':'app-master', 'brDbName':'SBTCDB'},
    { 'branch':'dev', 'master':'dev-master', 'brDbName':'SBTCDB'}
  ];
  serverBranch = [
          // { 'branch':'baha', 'master':'baha-master', 'brDbName':'SBTCDB'},

          { 'branch':'bisha', 'master':'bisha-master', 'msdb':'bisha-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'dawabmi', 'master':'dawabmi-master', 'msdb':'dawabmi-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'ghasem', 'master':'ghasem-master', 'msdb':'ghasem-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'hafrbatin', 'master':'hafrbatin-master', 'msdb':'hafrbatin-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'hail', 'master':'hail-master', 'msdb':'hail-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'hufuf', 'master':'hufuf-master', 'msdb':'hufuf-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'jeddah', 'master':'jeddah-master', 'msdb':'jeddah-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'jizan', 'master':'jizan-master', 'msdb':'jizan-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'jubail', 'master':'jubail-master', 'msdb':'jubail-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'khamis', 'master':'khamis-master', 'msdb':'khamis-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'kharaj', 'master':'kharaj-master', 'msdb':'kharaj-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'khobar', 'master':'khobar-master', 'msdb':'khobar-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'mekkah', 'master':'mekkah-master', 'msdb':'mekkah-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'madinah', 'master':'madinah-master', 'msdb':'madinah-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'najran', 'master':'najran-master', 'msdb':'najran-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'qunfuda', 'master':'qunfuda-master', 'msdb':'qunfuda-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'riyad', 'master':'riyad-master', 'msdb':'riyad-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'skaka', 'master':'skaka-master', 'msdb':'skaka-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'tabuk', 'master':'tabuk-master', 'msdb':'tabuk-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'taif', 'master':'taif-master', 'msdb':'taif-msdb', 'brDbName':'SBTCDB'},
          {'branch':'yanbu', 'master':'yanbu-master', 'msdb':'yanbu-msdb', 'brDbName':'SBTCDB'},

          { 'branch':'app-sbtc', 'master':'app-master', 'msdb':'app-msdb', 'brDbName':'SBTCDB'},
          { 'branch':'dev', 'master':'dev-master', 'msdb':'dev-msdb', 'brDbName':'SBTCDB'}
        ];

  localData = undefined;

  getServerBranch() {
    return this.serverBranch;
  }
  getAppServer(){
    return { 'branch':'app', 'master':'app-master', 'brDbName':'wazarandba'};
  }
  getHOServer(){
    return  { 'branch':'ho', 'master':'ho-master', 'brDbName':'SBTCDB'};
  }
  getservertest(){
    return this.servertest;
  }
  getApiServer(){
    return "http://localhost:31618/api/";
  }
  getSingleServer(brnc){
    for (let i = 0; i < this.serverBranch.length; i++) {
      if(this.serverBranch[i].branch == brnc){
        return this.serverBranch[i];
      }
    }

  }

}
