import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { DataService } from './data.service';
import { Project } from './project';
import { AffordabilityProgram } from './affordability-program';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['project_name', 'total_units', 'total_affordable_units', 'address', 'status'];
  footerColumns: string[] = ['project_name', 'total_units', 'total_affordable_units'];
  dataSource = new MatTableDataSource<Project>();
  affordabilityPrograms = Object.values(AffordabilityProgram);
  selectedProgram = AffordabilityProgram.All;
  totalUnitCount: number = 0;
  affordableUnitCount: number = 0;
  startDate: string = '';
  endDate: string = '';

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
    this.dataService.getHousingData(this.selectedProgram, this.startDate, this.endDate).subscribe(data => {
      const dataWithoutDuplicates = [...new Map(data.map(v => [v.austin_housing_inventory_id, v])).values()]
      this.dataSource.data = dataWithoutDuplicates;
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
    if (status) {
      return status.substring(3);
    } else {
      return '';
    }
  }
  
  startDateChanged(date: string) {
    this.startDate = date;
  }

  endDateChanged(date: string) {
    this.endDate = date;
  }
}
