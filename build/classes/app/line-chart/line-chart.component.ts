import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { ChartsService } from '../services/Charts.service';
import { WindowService } from '../services/window.service';

@Component({
  selector: 'line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit {
        
    @ViewChild('chart') chart: ElementRef;
    @Input() chartConfig: any;
    @Input() chartData: [any];
    @Input() changeDetector: number;
    hasHeight=false;
    screenSize = '';
    DADP;
    
    constructor(public charts: ChartsService, private cd: ChangeDetectorRef, private windowService: WindowService) { }

    ngOnInit() {
        if(this.chartConfig) this.chartConfig.type = 'Line Chart'    // just making sure
    }
    
    ngAfterViewChecked() {
        if(this.chart && !this.hasHeight){
            this.hasHeight=true;
            this.createChart();
            this.cd.detectChanges();
            
            let windowWidth=this.windowService.getNativeWindow().innerWidth;
            windowWidth <= 400 ? this.screenSize = 'mobile' : this.screenSize = 'desktop';
        }
    }
    
    ngOnChanges(changes: SimpleChanges) {
        this.createChart();
    }
    
    
    createChart(){
        this.chartConfig.totalChartHeight=this.chart.nativeElement.offsetHeight;
        this.chartConfig.totalChartWidth=this.chart.nativeElement.offsetWidth;
        this.charts.createLineChart(this.chartData, this.chartConfig, 'dataToShow', true);
    }
    
    
    @HostListener('window:resize', ['$event'])
    onResize(event) {
       
        let windowWidth = event.target.innerWidth;
        
        // though 700px is not mobile, it works. when the condition was 400 it didn't work, maybe because it takes time to render, 
        // maybe not...
        if(windowWidth <= 700){ 
            if(this.screenSize == 'desktop'){
                this.chartConfig.totalChartHeight=this.chart.nativeElement.offsetHeight;
                this.createChart();
                this.screenSize = 'mobile';
            }
        }
        else if(this.screenSize == 'mobile'){
            this.chartConfig.totalChartHeight=this.chart.nativeElement.offsetHeight;
            this.createChart();
            this.screenSize = 'desktop'
        }
    }
    
    forNow(){
        console.log('boom bolenat sab kisat!');   
    }

}
        
