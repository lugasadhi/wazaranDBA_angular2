import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';



// angular material
import {CdkTableModule} from '@angular/cdk/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import 'hammerjs';

//service
import { GlobalService } from './global.service';
import { CollectdataService } from './collectdata.service';

//ngchart
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DbDetailComponent } from './db-detail/db-detail.component';
import { SpinerComponent } from './spiner/spiner.component';
import { CheckdbComponent } from './checkdb/checkdb.component';
import { BackupComponent } from './backup/backup.component';
import { ShrinkComponent } from './shrink/shrink.component';
import { UserComponent } from './user/user.component';
import { MenuComponent } from './menu/menu.component';
import { TrackingComponent } from './tracking/tracking.component';
import { WazclosingComponent } from './wazclosing/wazclosing.component';
import { TrackingBranchComponent } from './tracking-branch/tracking-branch.component';
import { AutocheckallbranchComponent } from './autocheckallbranch/autocheckallbranch.component';
import { SettingComponent } from './setting/setting.component';
import { LogComponent } from './log/log.component';
import { BlockProccessComponent } from './block-proccess/block-proccess.component';
import { BpsComponent } from './bps/bps.component';
import { ProcessBlockedComponent } from './process-blocked/process-blocked.component';



const appRoutes: Routes = [
  { path: 'login',
    data: { title: 'login' },
   component: LoginComponent },

   { path: 'dashboard',
     data: { title: 'dashboard' },
    component: DashboardComponent },
   { path: 'database/:branch',
     data: { title: ':branch' },
     component: DbDetailComponent },
   { path: 'checkdb',
     data: { title: 'checkdb' },
     component: CheckdbComponent },
   { path: 'backup',
     data: { title: 'checkdb' },
     component: BackupComponent },
   { path: 'shrink/:type',
     data: { title: 'checkdb' },
     component: ShrinkComponent },
   { path: 'user',
     data: { title: 'checkdb' },
     component: UserComponent },
   { path: 'tracking',
     data: { title: 'tracking' },
     component: TrackingComponent },
   { path: 'wazaran/closing',
     data: { title: 'closing' },
     component: WazclosingComponent },
   { path: 'autocheck',
     data: { title: 'autocheck' },
     component: AutocheckallbranchComponent },
   { path: 'setting',
     data: { title: 'setting' },
     component: SettingComponent },
   { path: 'log',
     data: { title: 'log' },
     component: LogComponent },
   { path: 'processBlocked',
     data: { title: 'processBlocked' },
     component: BlockProccessComponent },
   { path: '',
     redirectTo: '/dashboard',
     pathMatch: 'full'
   }
];



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    DbDetailComponent,
    SpinerComponent,
    CheckdbComponent,
    BackupComponent,
    ShrinkComponent,
    UserComponent,
    MenuComponent,
    TrackingComponent,
    WazclosingComponent,
    TrackingBranchComponent,
    AutocheckallbranchComponent,
    SettingComponent,
    LogComponent,
    BlockProccessComponent,
    BpsComponent,
    ProcessBlockedComponent
  ],
  imports: [
    ChartsModule,

    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    HttpModule,


    // angular material
    CdkTableModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,


    RouterModule.forRoot(
      appRoutes,
      { useHash: false }
    )
  ],
  providers: [
    GlobalService,
    CollectdataService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
