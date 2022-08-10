import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Project } from '../project';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() projects: Project[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Project>();
  totalUnitCount: number = 0;
  affordableUnitCount: number = 0;
  displayedColumns: string[] = ['project_name', 'total_units', 'total_affordable_units', 'address', 'status'];
  footerColumns: string[] = ['project_name', 'total_units', 'total_affordable_units'];

  constructor() { }

  ngOnInit(): void {
    this.updateProjects();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    this.updateProjects();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  updateProjects() {
    this.dataSource.data = this.projects;
    this.updateUnitTotals();
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.updateUnitTotals();
  }
}
