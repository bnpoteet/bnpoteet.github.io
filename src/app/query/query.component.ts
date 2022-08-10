import { Component, OnInit } from '@angular/core';

import { DataService } from '../data.service';
import { Project } from '../project';
import { AffordabilityProgram } from '../affordability-program';
import { Filter } from '../filter';
import { ProjectStatus } from '../project-status';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})

export class QueryComponent implements OnInit {
  affordabilityPrograms = Object.values(AffordabilityProgram);
  selectedProgram = AffordabilityProgram.All;
  totalUnitCount: number = 0;
  affordableUnitCount: number = 0;
  startDate: string = '';
  endDate: string = '';
  includePipeline = true;
  projects: Project[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getData();
  }

  onFilterChanged() {
    this.getData();
  }

  getData(): void {
    this.dataService.getHousingData(this.selectedProgram).subscribe(data => {
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
      if (this.startDate) {
        filter.startDate = this.formatDate(this.startDate);
      }
      if (this.endDate) {
        filter.endDate = this.formatDate(this.endDate);
      }
      this.projects = this.dataService.filterHousingData(data, filter);
    });
  }
  
  onStartDateChanged(date: string) {
    this.startDate = date;
  }

  onEndDateChanged(date: string) {
    this.endDate = date;
  }

  onIncludePipeline(includePipeline: boolean) {
    this.includePipeline = includePipeline;
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