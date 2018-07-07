import { Component, OnInit, ViewChild, ElementRef, Input, ChangeDetectorRef, HostListener, OnChanges, SimpleChanges } from '@angular/core';
import { ChartsService } from '../services/Charts.service';
import { WindowService } from '../services/window.service';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
        
    @ViewChild('chart') chart: ElementRef;
    @Input() chartProperties: any;
    @Input() chartData: [any];
    @Input() changeDetector: number;
    hasHeight=false;
    screenSize = '';
    DADP;
    
    constructor(private charts: ChartsService, private cd: ChangeDetectorRef, private windowService: WindowService) { }

    ngOnInit() {
        if(this.chartProperties) this.chartProperties.type = 'Bar Chart'    // just making sure
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
        this.chartProperties.totalChartHeight=this.chart.nativeElement.offsetHeight;
        this.chartProperties.totalChartWidth=this.chart.nativeElement.offsetWidth;
        if(this.chartProperties.normalized) this.charts.createNormalizedBarChart(this.chartData, this.chartProperties);
        else this.charts.createBarChart(this.chartData, this.chartProperties, 'dataToShow');
    }
    
    
    @HostListener('window:resize', ['$event'])
    onResize(event) {
       
        let windowWidth = event.target.innerWidth;
        
        // though 700px is not mobile, it works. when the condition was 400 it didn't work, maybe because it takes time to render, 
        // maybe not...
        if(windowWidth <= 700){ 
            if(this.screenSize == 'desktop'){
                this.chartProperties.totalChartHeight=this.chart.nativeElement.offsetHeight;
                this.createChart();
                this.screenSize = 'mobile';
            }
        }
        else if(this.screenSize == 'mobile'){
            this.chartProperties.totalChartHeight=this.chart.nativeElement.offsetHeight;
            this.createChart();
            this.screenSize = 'desktop'
        }
    }
    

}
