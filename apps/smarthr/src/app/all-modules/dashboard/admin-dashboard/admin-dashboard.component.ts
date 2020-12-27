import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  public chartData;
  public chartOptions;
  public lineData;
  public lineOption;
  public barColors = {
    a: '#FF9900',
    b: '#08e4ec',
  };
  public lineColors = {
    a: '#FF9900',
    b: '#08e4ec',
  };

  constructor() { }

  ngOnInit() {
    this.chartOptions = {
      xkey: 'y',
      ykeys: ['b', 'a'],
      labels: ['Previous Employees', 'New Employees'],
      barColors: [this.barColors.a, this.barColors.b],
    };

    this.chartData = [
      { y: '2006', a: 100, b: 90 },
      { y: '2007', a: 75, b: 65 },
      { y: '2008', a: 50, b: 40 },
      { y: '2009', a: 75, b: 65 },
      { y: '2010', a: 50, b: 40 },
      { y: '2011', a: 75, b: 65 },
      { y: '2012', a: 100, b: 90 },
    ];

    this.lineOption = {
      xkey: 'm',
      ykeys: ['a'],
      labels: ['Salary in Lacs'],
      resize: true,
      lineColors: [this.lineColors.a, this.lineColors.b],
      parseTime: false
    };

    this.lineData = [
      { m: 'Jan', a: 50 },
      { m: 'Feb', a: 75 },
      { m: 'Mar', a: 70 },
      { m: 'Apr', a: 72 },
      { m: 'May', a: 80 },
      { m: 'Jun', a: 75 },
      { m: 'Jul', a: 72 },
      { m: 'Aug', a: 82 },
      { m: 'Sep', a: 85 },
    ];
  }
}
