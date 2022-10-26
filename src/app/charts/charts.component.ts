import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Project } from '../project';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit, OnChanges {
  @Input() projects: Project[] = [];

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  title = 'ng2-charts-demo';

  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
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
    this.barChartData.datasets[0].data = [];
    for (let i = 1; i < 11; i++) {
      var districtProjects = this.projects.filter(project => Math.floor(project.council_district) == i);
      var unitCount = 0;
      for (const project of districtProjects) {
        unitCount = unitCount + Number(project.total_units);
      }
      this.barChartData.datasets[0].data.push(unitCount);
    } 
    this.chart?.update();
  }
}
