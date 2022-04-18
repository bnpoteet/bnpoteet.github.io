import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Project } from './project';
import { AffordabilityProgram } from './affordability-program';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl: string = 'https://data.austintexas.gov/resource/x5p7-qyuv.json?';

  constructor(private http: HttpClient) { }

  getHousingData(selectedProgram: AffordabilityProgram): Observable<Project[]> {
    var url = this.baseUrl;
    if (selectedProgram != AffordabilityProgram.All) {
      var program = Object.entries(AffordabilityProgram).find(([, value]) => value === selectedProgram);
      if (program != undefined)
      {
        url = url + program[0] + '=Yes&';
      }
    }
    console.log(url);
    return this.http.get<Project[]>(url);
  }
}
