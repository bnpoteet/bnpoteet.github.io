import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Project } from '../project';
import { ProjectStatus } from '../project-status';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnChanges {
  @Input() projects: Project[] = [];

  @ViewChild(BaseChartDirective) allProjectsChart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) completedProjectsChart: BaseChartDirective | undefined;

  public barChartLegend = true;
  public barChartPlugins = [];

  public completedProjectsData: ChartConfiguration<'bar'>['data'] = {
    labels: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
    datasets: [
      { data: [], label: 'Council Districts' },
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: false,
  };
  
  constructor() { }

  ngOnInit(): void {
    this.updateCharts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateCharts();
  }

  updateCharts() {
    this.completedProjectsData.datasets[0].data = [];
    for (let i = 1; i < 11; i++) {
      var districtProjects = this.projects.filter(project => (Math.floor(project.council_district) == i));
      var unitCount = 0;
      for (const project of districtProjects) {
        unitCount = unitCount + Number(project.total_units);
      }
      this.completedProjectsData.datasets[0].data.push(unitCount);
    } 

    this.completedProjectsChart?.update();
  }
}
