import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { DataService } from '../data.service';
import { Project } from '../project';
import { Statistics } from '../statistics';
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
  displayedColumns: string[] = ['totalUnits', 'totalAffordableUnits', 'projectCount', 'inProgressUnits', 'inProgressProjects'];
  vmuProjects: Project[] = [];
  universityProjects: Project[] = [];
  downtownProjects: Project[] = [];
  raineyProjects: Project[] = [];
  transitProjects: Project[] = [];
  auProjects: Project[] = [];
  riversideProjects: Project[] = [];

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
    this.dataService.getHousingData().subscribe(data => {
      const dataWithoutDuplicates = [...new Map(data.map(v => [v.project_id, v])).values()];

      this.auProjects = dataWithoutDuplicates.filter(project => project.affordability_unlocked === 'Yes');
      this.parseProgramData(this.auProjects);

      this.dataSource.data = this.statistics;
    });
  }

  private parseProgramData(programData: Project[]): void {
    var constructedUnits = 0;
    var constructedAffordableUnits = 0;
    var feeInLieu = 0;
    var inProgress = programData.filter(project => !project.development_status?.startsWith('Project Compl') && !project.development_status?.startsWith('Affordability'));
    var completed = programData.filter(project => project.development_status?.startsWith('Project Compl') || project.development_status?.startsWith('Affordability'));

    completed.forEach(project => {
      if (Number(project.total_units)) {
        constructedUnits = constructedUnits + Number(project.total_units);
      }
      if (Number(project.affordable_units))
      {
        constructedAffordableUnits = constructedAffordableUnits + Number(project.affordable_units);
      }
      if (Number(project.calculated_fee_in_lieu)) {
        feeInLieu = feeInLieu + Number(project.calculated_fee_in_lieu);
      }
    });

    var inProgressUnits: number = 0;
    inProgress.forEach(project => {
      if (Number(project.total_units)) {
        inProgressUnits = inProgressUnits + Number(project.total_units);
      }
    });

    var inProgress = programData.filter(project => !project.development_status?.startsWith('Project Compl') && !project.development_status?.startsWith('Affordability'));

    this.statistics.push({
      constructedProjects: completed.length,
      constructedUnits: constructedUnits,
      constructedAffordableUnits: constructedAffordableUnits,
      inProgressProjects: inProgress.length,
      inProgressUnits: inProgressUnits,
    });
  }
}
