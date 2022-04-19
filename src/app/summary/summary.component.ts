import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { DataService } from '../data.service';
import { Project } from '../project';
import { Statistics } from '../statistics';
import { AffordabilityProgram } from '../affordability-program';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})

export class SummaryComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<Statistics>();
  statistics: Statistics[] = [];
  displayedColumns: string[] = ['affordabilityProgram', 'totalUnits', 'totalAffordableUnits', 'projectCount'];
  vmuProjects: Project[] = [];
  universityProjects: Project[] = [];
  downtownProjects: Project[] = [];
  raineyProjects: Project[] = [];
  transitProjects: Project[] = [];
  auProjects: Project[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit() {
    // TODO: fix sorting
    this.dataSource.sort = this.sort;
  }

  private getData(): void {
    this.dataService.getHousingData(AffordabilityProgram.All).subscribe(data => {
      const dataWithoutDuplicates = [...new Map(data.map(v => [v.austin_housing_inventory_id, v])).values()];

      this.vmuProjects = dataWithoutDuplicates.filter(project => project.vertical_mixed_use === 'Yes');
      this.parseProgramData(this.vmuProjects, AffordabilityProgram.vertical_mixed_use);

      this.auProjects = dataWithoutDuplicates.filter(project => project.affordability_unlocked === 'Yes');
      this.parseProgramData(this.auProjects, AffordabilityProgram.affordability_unlocked);
      
      this.downtownProjects = dataWithoutDuplicates.filter(project => project.downtown_density_bonus === 'Yes');
      this.parseProgramData(this.downtownProjects, AffordabilityProgram.downtown_density_bonus);
      
      this.raineyProjects = dataWithoutDuplicates.filter(project => project.rainey_density_bonus === 'Yes');
      this.parseProgramData(this.raineyProjects, AffordabilityProgram.rainey_density_bonus);

      this.transitProjects = dataWithoutDuplicates.filter(project => project.transit_oriented_development === 'Yes');
      this.parseProgramData(this.transitProjects, AffordabilityProgram.transit_oriented_development);

      this.universityProjects = dataWithoutDuplicates.filter(project => project.university_neighborhood_overla === 'Yes');
      this.parseProgramData(this.universityProjects, AffordabilityProgram.university_neighborhood_overla);

      this.dataSource.data = this.statistics;
    });
  }

  private parseProgramData(programData: Project[], program: AffordabilityProgram): void {
    var totalUnitCount: number = 0;
    var affordableUnitCount: number = 0;

    programData.forEach(project => {
      if (Number(project.total_units)) {
        totalUnitCount = totalUnitCount + Number(project.total_units);
      }
      if (Number(project.total_affordable_units))
      {
        affordableUnitCount = affordableUnitCount + Number(project.total_affordable_units);
      }
    });

    this.statistics.push({
      program: program,
      projectCount: programData.length,
      unitCount: totalUnitCount,
      affordableUnitCount: affordableUnitCount
    });
  }
}
