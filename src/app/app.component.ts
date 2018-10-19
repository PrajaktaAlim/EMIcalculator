import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent
{
  EMICalcForm:FormGroup;
  EMI = 0;
  rate = 0;
  totalPayment = 0;
  totalInterest = 0;

  principalAmtPercent = 0;
  interestPercent = 0;

  chart1: Chart;
  chartData = [];

  constructor(private fb : FormBuilder)
  {
    this.EMICalcForm = fb.group(
      {
      'principal' : [null, Validators.compose([Validators.pattern("[0-9]+"), Validators.required])],
      'interestRate' : [null, Validators.compose([Validators.pattern("[0.0-9.0]+"), Validators.max(15), Validators.required])],
      'months' : [null, Validators.compose([Validators.pattern("[0-9]+"), Validators.min(1), Validators.max(30) , Validators.required])],
      'validate': ''
      }
    )
  }

  CalculateEMI(data)
  {
    this.rate = data.interestRate/12/100;
    this.EMI = data.principal*(this.rate)*( (Math.pow((1 + this.rate), data.months)) / ((Math.pow((1 + this.rate), data.months)) - 1) );
    
    this.totalPayment = this.EMI * data.months;
    this.totalInterest = this.totalPayment - data.principal;

    this.interestPercent = this.totalInterest/this.totalPayment * 100;
    this.principalAmtPercent = (data.principal/this.totalPayment) * 100;

    this.chartData=[];
    this.chartData.push({
      name: 'Principal Loan Amount',
      y: this.principalAmtPercent,
      sliced: true,
      selected: true,
      color: '#0099ff'
    });

    this.chartData.push({
      name: 'Total Interest',
      y: this.interestPercent,
      color: '#6600ff'
    });

    this.DisplayEMIChart();
  }

 DisplayEMIChart() 
 {
   let chart = new Chart({
     chart: {
       plotBackgroundColor: null,
       plotBorderWidth: null,
       plotShadow: false,
       type: 'pie'
   },
   title: {
       text: 'Breakup of Total Payment'
   },
   tooltip: {
    pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>',
    formatter: function(){
        return ('<b>' + this.point.name + '</b>: ' + this.y.toFixed(1) + "%")
    }
   },
   plotOptions: {
       pie: {
           allowPointSelect: true,
           cursor: 'pointer',
           dataLabels: {
            enabled: true,
            format: '{point.percentage:.1f}%',
            distance: -25,
            style: {"color": "white", "fontSize": "12px", "textOutline": "1px", "fontFamily": "'Calibri', 'sans-serif'"}
           },
           showInLegend: true
       }
   },
   series: [{
      // colorByPoint: true,
       data: this.chartData
   }]
   });
   this.chart1 = chart;
 }

}
