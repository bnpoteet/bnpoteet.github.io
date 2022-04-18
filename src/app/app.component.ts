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
  displayedColumns: string[] = ['project_name', 'address', 'total_units', 'total_affordable_units', 'status'];
  dataSource = new MatTableDataSource<Project>();
  affordabilityPrograms = Object.values(AffordabilityProgram);
  selectedProgram = AffordabilityProgram.All;
  totalUnitCount: number = 0;
  affordableUnitCount: number = 0;
  graph = {
    data: [{
      values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      labels: ['District 1', 'District 2', 'District 3', 'District 4', 'District 5', 'District 6', 'District 7', 'District 8', 'District 9', 'District 10'],
      type: 'pie',
      sort: false
    }],
    layout: {width: 600, height: 400, title: 'Affordable Units By District'}
};

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
      this.dataSource.data = data;
      var totalUnitCount: number = 0;
      var affordableUnitCount: number = 0;
      var unitsByDistrict: number[] = [];

      for (var i = 1; i < 10; i++) {
        unitsByDistrict.push(0);
      }
      console.log(unitsByDistrict);
      data.forEach(project => {
        if (Number(project.total_units)) {
          totalUnitCount = totalUnitCount + Number(project.total_units);
        }
        if (Number(project.total_affordable_units))
        {
          affordableUnitCount = affordableUnitCount + Number(project.total_affordable_units);
          if (Number(project.council_district))
          {
            var district = Number(project.council_district);
            unitsByDistrict[district - 1] = unitsByDistrict[district - 1] + Number(project.total_affordable_units);
          }
        }
        this.graph.data[0].values = unitsByDistrict;
      });
      this.totalUnitCount = totalUnitCount;
      this.affordableUnitCount = affordableUnitCount;
    });
  }

  getMapLink(address: string): string {
    var baseUrl = 'https://www.google.com/maps/search/?api=1&query=';
    var encodedAddress = address.replace(/\s/g, '+');
    return baseUrl + encodedAddress + '+austin+tx';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
