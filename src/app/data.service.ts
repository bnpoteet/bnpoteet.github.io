import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Project } from './project';
import { AffordabilityProgram } from './affordability-program';
import { Filter } from './filter';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl: string = 
    'https://data.austintexas.gov/resource/ifzc-3xz8.json' +
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
    const dataWithoutDuplicates = [...new Map(projects.map(v => [v.project_id, v])).values()];
    var filteredProjects = dataWithoutDuplicates;
    console.log(filteredProjects);
    if (filter.statuses.length > 0) {
      filteredProjects = filteredProjects.filter(project => project.development_status && filter.statuses.includes(project.development_status));
      console.log(filteredProjects);
    }
    if (filter.startDate != '') {
      filteredProjects = filteredProjects.filter(project => project.affordability_start_date > filter.startDate);
      console.log(filteredProjects);
    }
    if (filter.endDate != '') {
      filteredProjects = filteredProjects.filter(project => project.affordability_start_date < filter.endDate);
      console.log(filteredProjects);
    }
    return filteredProjects;
  }
}
