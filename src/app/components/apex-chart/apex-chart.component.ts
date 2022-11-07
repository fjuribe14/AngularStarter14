import { Component, Input, OnInit } from '@angular/core';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexYAxis,
  ApexAnnotations,
  ApexDataLabels,
  ApexStroke,
  ApexLegend,
  ApexFill,
  ApexTooltip,
  ApexPlotOptions,
  ApexResponsive,
  ApexGrid,
  ApexStates,
  ApexTheme,
} from 'ng-apexcharts';

@Component({
  selector: 'app-apex-chart',
  templateUrl: './apex-chart.component.html',
})
export class ApexChartComponent implements OnInit {
  @Input() public options: ChartOptions;
  constructor() {}

  ngOnInit(): void {}
}

export type ChartOptions = {
  chart: ApexChart;
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  xaxis: ApexXAxis;
  title?: ApexTitleSubtitle;
  yaxis?: ApexYAxis | ApexYAxis[];
  annotations?: ApexAnnotations;
  colors?: string[];
  dataLabels?: ApexDataLabels;
  stroke?: ApexStroke;
  labels?: string[];
  legend?: ApexLegend;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  plotOptions?: ApexPlotOptions;
  responsive?: ApexResponsive[];
  grid?: ApexGrid;
  states?: ApexStates;
  subtitle?: ApexTitleSubtitle;
  theme?: ApexTheme;
};
