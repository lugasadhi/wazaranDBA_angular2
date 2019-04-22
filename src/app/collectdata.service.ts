import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/map';

import { GlobalService } from './global.service';


@Injectable()
export class CollectdataService {

  constructor(private http:Http, private global:GlobalService) { }

}
