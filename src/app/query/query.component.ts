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
  years: number[] = [];
  selectedStartYear = 0;
  selectedEndYear = 0;
  selectedProgram = AffordabilityProgram.All;
  totalUnitCount: number = 0;
  affordableUnitCount: number = 0;
  startDate: string = '';
  endDate: string = '';
  includePipeline = true;
  projects: Project[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getYears();
    this.getData();
  }

  getYears() {
    for (let i = 1984; i < 2023; i++) {
      this.years.push(i);
    } 
    this.selectedStartYear = this.years[0];
    this.selectedEndYear = this.years[this.years.length - 1];
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
      if (this.selectedStartYear !== 1984) {
        filter.startDate = this.selectedStartYear.toString() + '0101';
      }
      if (this.selectedEndYear !== new Date().getFullYear()) {
        filter.endDate = this.selectedEndYear.toString() + '1231';
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

  private formatDate(year: number): string {
    return year.toString().slice(0) + '0101';
  }
}