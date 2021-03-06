import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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

export class QueryComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['project_name', 'total_units', 'total_affordable_units', 'address', 'status'];
  footerColumns: string[] = ['project_name', 'total_units', 'total_affordable_units'];
  dataSource = new MatTableDataSource<Project>();
  affordabilityPrograms = Object.values(AffordabilityProgram);
  selectedProgram = AffordabilityProgram.All;
  totalUnitCount: number = 0;
  affordableUnitCount: number = 0;
  startDate: string = '';
  endDate: string = '';
  includePipeline = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
      this.dataSource.data = this.dataService.filterHousingData(data, filter);
      this.updateUnitTotals();
    });
  }

  updateUnitTotals(): void {
    var totalUnitCount: number = 0;
    var affordableUnitCount: number = 0;

    this.dataSource.filteredData.forEach(project => {
      if (Number(project.total_units)) {
        totalUnitCount = totalUnitCount + Number(project.total_units);
      }
      if (Number(project.total_affordable_units))
      {
        affordableUnitCount = affordableUnitCount + Number(project.total_affordable_units);
      }
    });
    this.totalUnitCount = totalUnitCount;
    this.affordableUnitCount = affordableUnitCount;
  }

  getMapLink(address: string): string {
    if (address) {
      var baseUrl = 'https://www.google.com/maps/search/?api=1&query=';
      var encodedAddress = address.replace(/\s/g, '+');
      return baseUrl + encodedAddress + '+austin+tx';
    } else {
      return '';
    }

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.updateUnitTotals();
  }

  removeNumberFromStatus(status: string): string {
    return status;
    if (status) {
      return status.substring(3);
    } else {
      return '';
    }
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