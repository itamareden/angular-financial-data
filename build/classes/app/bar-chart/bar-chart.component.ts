import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { ChartsService } from '../services/Charts.service';
import { WindowService } from '../services/window.service';
import { BarChartConfig } from '../classes/bar-chart-config';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
        
    @ViewChild('chart') chart: ElementRef;
    @Input() chartConfig: BarChartConfig;
    @Input() chartData: [any];  // change to ChartData[]
    @Input() changeDetector: number;
    hasHeight=false;
    screenSize = '';
    hoveredBar = -1;
    DADP;
    
    constructor(private charts: ChartsService, private cd: ChangeDetectorRef, private windowService: WindowService) { }

    ngOnInit() {}
    
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
        if(changes["changeDetector"] && !changes["changeDetector"]["firstChange"]){
            console.log(changes["changeDetector"])
            this.createChart();   // if there was a changes in the detector, create the chart again
        }
    }
    
    
    createChart(){
        this.chartConfig.totalChartHeight=this.chart.nativeElement.offsetHeight;
        this.chartConfig.totalChartWidth=this.chart.nativeElement.offsetWidth;
        this.charts.createBarChart(this.chartData, this.chartConfig);
        console.log(this.chartData)
    }
        
    showTooltip(index){
        this.hoveredBar = index;
    }
    
    hideTooltip(){
        this.hoveredBar = -1;
    }
        
    isShowTooltip(i,j){ 
        return !!(this.chartConfig.isEnableTooltip && i == this.hoveredBar && j == 0);
    }
    
    calcTooltipDistance(){
        let tooltipLeft = 0;
        if(this.chartData[0].width && this.chartConfig.totalChartWidth){
            tooltipLeft = this.chartData[0].width + 15;    // bar width plus extra..
        }
        return tooltipLeft + "px";
    }
    
    setDirection(index){
        if(index != this.chartData.length -1) return "left";
        else return "right";
    }
    
    setClass(index){
        if(index != this.chartData.length -1) return "left-triangle";
        else return "right-triangle";
    }
    
    
    @HostListener('window:resize', ['$event'])
    onResize(event) {
       
        let windowWidth = event.target.innerWidth;
        
        // though 700px is not mobile, it works. when the condition was 400 it didn't work, maybe because it takes time to render, 
        // maybe not...
        if(windowWidth <= 700){ 
            if(this.screenSize == 'desktop'){
                this.chartConfig.totalChartHeight = this.chart.nativeElement.offsetHeight;
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
    

}
