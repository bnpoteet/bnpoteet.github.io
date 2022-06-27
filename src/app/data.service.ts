import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Project } from './project';
import { AffordabilityProgram } from './affordability-program';
import { Filter } from './Filter';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl: string = 
    'https://data.austintexas.gov/resource/x5p7-qyuv.json' +
    '?$$app_token=XnQQN0xB4sYYLXsIOzt6WFG6I' +
    '&$limit=5000';

  constructor(private http: HttpClient) { }

  getHousingData(selectedProgram: AffordabilityProgram): Observable<Project[]> {
    var url = this.baseUrl;
    if (selectedProgram != AffordabilityProgram.All) {
      var program = Object.entries(AffordabilityProgram).find(([, value]) => value === selectedProgram);
      if (program != undefined)
      {
        url = url + '&' + program[0] + '=Yes';
      }
    }
    return this.http.get<Project[]>(url);
  }

  filterHousingData(projects: Project[], filter: Filter): Project[] {
    const dataWithoutDuplicates = [...new Map(projects.map(v => [v.austin_housing_inventory_id, v])).values()];
    var filteredProjects = dataWithoutDuplicates;
    if (filter.statuses.length > 0) {
      filteredProjects = filteredProjects.filter(project => project.status && filter.statuses.includes(project.status));
    }
    return filteredProjects;
  }
}
