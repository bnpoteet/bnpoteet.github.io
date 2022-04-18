import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Project } from './project';
import { AffordabilityProgram } from './affordability-program';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl: string = 
    'https://data.austintexas.gov/resource/x5p7-qyuv.json' +
    '?$$app_token=XnQQN0xB4sYYLXsIOzt6WFG6I' +
    '&$limit=5000';

  constructor(private http: HttpClient) { }

  getHousingData(selectedProgram: AffordabilityProgram, startDate: string, endDate: string): Observable<Project[]> {
    var url = this.baseUrl;
    if (selectedProgram != AffordabilityProgram.All) {
      var program = Object.entries(AffordabilityProgram).find(([, value]) => value === selectedProgram);
      if (program != undefined)
      {
        url = url + '&' + program[0] + '=Yes';
      }
    }
    if (startDate && endDate)
    {
      var formattedDate = this.formatDate(startDate);
      url = url + '&$where=affordability_start_date>\'' + formattedDate + '\'' +
      'AND affordability_start_date<\'' + formattedDate + '\'';
    }
    return this.http.get<Project[]>(url);
  }

  private formatDate(date: string): string {
    var dateArray = date.split("/");
      var year = dateArray[2];
      var month = dateArray[1];
      var day = dateArray[0];
      if (month.length == 1) month = 0 + month;
      if (day.length == 1) day = 0 + day;
      return year + month + day;
  }
}
