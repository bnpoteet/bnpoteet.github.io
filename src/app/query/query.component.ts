import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { Project } from '../project';
import { Filter } from '../filter';
import { ProjectStatus } from '../project-status';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})

export class QueryComponent implements OnInit {
  totalUnitCount: number = 0;
  affordableUnitCount: number = 0;
  includePipeline = true;
  projects: Project[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getData();
  }

  onFilterChanged(includePipeline: boolean) {
    this.includePipeline = includePipeline;
    this.getData();
  }

  getData(): void {
    this.dataService.getHousingData().subscribe(data => {
      var filter: Filter = { 
        statuses: [],
        startDate: '',
        endDate: ''
      }
      if (!this.includePipeline) {
        filter.statuses.push(
          ProjectStatus.ProjectCompleted, 
          ProjectStatus.AffordabilityExpired);
      }
      this.projects = this.dataService.filterHousingData(data, filter);
    });
  }
}