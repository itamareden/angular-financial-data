import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';

@Injectable()
export class ChartsService {
        
    highest;
    lowest;
    chartRange;

  constructor(private utils: UtilsService) { }
    
    createBarChart(dataSeries:any[], chartProperties:any, prop:string) :any{

        if(this.checkChartProperties(dataSeries,chartProperties)){
            let highest = this.calculateHighestPointInChart(dataSeries, chartProperties, prop);
            let lowest = this.calculateLowestPointInChart(dataSeries, chartProperties, prop);
            let chartRange=this.calculateHighestLowestDiff(highest, lowest);
            this.calculateXAxisProportions(chartProperties, highest, lowest);
            this.calculateAssetBarProportions(dataSeries, chartProperties, chartRange, prop);
            this.setDADP(chartProperties);
        
            return [dataSeries, chartProperties];
        }
    }
    
    
    createNormalizedBarChart(dataSeries:any[], chartProperties:any) :any{

        if(this.checkChartProperties(dataSeries,chartProperties)){
            let assets = dataSeries;
            let barWidth=chartProperties.totalBarsWidth/assets.length;
            let totalSpaceWidth = 100-chartProperties.totalBarsWidth;
            let spaceBetweenBars=totalSpaceWidth/(assets.length+1);    // space in %
            let lastBarLeft=0;
            this.calculateXAxisProportions(chartProperties);
            this.setDADP(chartProperties);
            
            for(let i=0; i<assets.length; i++){
                assets[i].width=barWidth; 
                i==0 ? assets[i].left=spaceBetweenBars : assets[i].left=lastBarLeft+barWidth+spaceBetweenBars;
                lastBarLeft=assets[i].left;
                assets[i].height = chartProperties.totalBarsHeight;          // height
                assets[i].top=chartProperties.xAxisTop-assets[i].height;     // top
                assets[i].returnTop=assets[i].top-20;                        // return top
            }
        
            return [dataSeries, chartProperties];
        }
    }
    
    
    createLineChart(dataSeries:any[], chartProperties:any, prop:string, isShowName:boolean) :any{
        let highest, lowest, chartRange;
        if(this.checkChartProperties(dataSeries,chartProperties)){
            this.highest = highest = this.calculateHighestPointInChart(dataSeries, chartProperties, prop);
            this.lowest = lowest = this.calculateLowestPointInChart(dataSeries, chartProperties, prop);
            this.chartRange= chartRange = this.calculateHighestLowestDiff(highest, lowest);
            this.calculateXAxisProportions(chartProperties, highest, lowest);
            this.calculateInternalAxis(chartProperties,highest,lowest);
            this.calculateLineProportions(dataSeries, chartProperties, highest, lowest, prop);
            this.setDADP(chartProperties);
            if(isShowName) this.calculateAssetNameWidthAndLeft(dataSeries);
            
            return [dataSeries, chartProperties];
        }
    }
    
    checkChartProperties(dataSeries:any[],chartProperties:any):boolean{
        
        if(dataSeries==undefined || dataSeries.length==0){
            console.log('failed to generate chart => issue with dataSeries array');
            return false;   
        }else if(chartProperties==undefined || chartProperties.totalChartHeight==undefined || chartProperties.totalChartHeight<=0){
            console.log('failed to generate chart => issue with chartProperties');
            return false;   
        }else if(chartProperties.type==undefined){
            console.log('failed to generate chart => chart type is missing');
        }else{
            if(!chartProperties.totalBarsWidth || chartProperties.totalBarsWidth>100)  chartProperties.totalBarsWidth=84;
            if(!chartProperties.topMargin ||chartProperties.topMargin<0)  chartProperties.topMargin=30;          // default size..
            if(!chartProperties.bottomMargin || chartProperties.bottomMargin<0)  chartProperties.bottomMargin=30;    // default size..
            chartProperties.totalBarsHeight=chartProperties.totalChartHeight-chartProperties.topMargin-chartProperties.bottomMargin-1;

            return true;
        }
        
    }
    
    
    
    calculateHighestLowestDiff(highest, lowest):number{
        
        let difference=highest-lowest;
        return difference;
    }
    
    calculateBestDataInArr(dataSeries:any[], prop):number{
        
        let best=dataSeries[0][prop];     

        for(let i=0; i<dataSeries.length; i++){ 
            if(dataSeries[i][prop]>best) best=dataSeries[i][prop];
        }
        return best;
    }
    
    calculateHighestPointInChart(dataSeries:any[], chartProperties:any, prop):number{
        
        let highest=dataSeries[0][prop];     
        for(let i=0; i<dataSeries.length; i++){ 
            if(dataSeries[i][prop]>highest) highest=dataSeries[i][prop];
        }
        
        if(chartProperties.type=='Bar Chart' && highest<0) return 0;
        
        if(chartProperties.type=='Line Chart'){
            if(chartProperties.DADP != undefined && chartProperties.roundTarget != undefined){
                let cleanNumber = this.roundNumberToSpecificDecimalPlaces(highest, chartProperties.DADP);
                highest = this.roundUpNumberBasedOnTarget(cleanNumber, chartProperties.roundTarget);
            }
        }
        
        return highest;
    }
    
    
    calculateLowestPointInChart(dataSeries:any[], chartProperties:any, prop):number{
        
        let lowest=dataSeries[0][prop];     
        for(let i=0; i<dataSeries.length; i++){ 
            if(dataSeries[i][prop]<lowest) lowest=dataSeries[i][prop];
        }
        
        if(chartProperties.type=='Bar Chart' && lowest>0) return 0;
        
        if(chartProperties.type=='Line Chart'){
            if(chartProperties.lowestIsZero) return 0;
            if(chartProperties.DADP != undefined && chartProperties.roundTarget != undefined){
                let cleanNumber = this.roundNumberToSpecificDecimalPlaces(lowest, chartProperties.DADP);
                lowest = this.roundDownNumberBasedOnTarget(cleanNumber, chartProperties.roundTarget);
            }
        }
        
        return lowest;
    }
    
    
    calculateXAxisProportions(chartProperties: any, highest?: number, lowest?: number){ 
    
        if(highest != undefined && lowest != undefined){
            this.calculateXAxisTop(chartProperties, highest, lowest);
        }
        else{
            this.calculateXAxisTop(chartProperties);   
        }
        this.calculateXAxisLeftAndWidth(chartProperties);
    }
    
    calculateXAxisLeftAndWidth(chartProperties){
        
        let chartWidth = chartProperties.totalChartWidth;
        if(chartWidth > 450){
            chartProperties.xAxisWidth = chartWidth + 40;
            chartProperties.xAxisLeft =-37;
        }
        else if(chartWidth > 400){
            chartProperties.xAxisWidth = chartWidth + 25;
            chartProperties.xAxisLeft =-22;
        }
        else if(chartWidth > 260){
            chartProperties.xAxisWidth = chartWidth + 18;
            chartProperties.xAxisLeft =-15;
        }
    }
    
    calculateXAxisTop(chartProperties: any, highest?: number, lowest?: number){
        
        let xAxisTop;
        let chartRange=this.calculateHighestLowestDiff(highest, lowest);    // total range, from highest point to lowest point
        
        if(chartProperties.type=='Bar Chart'){
            if(chartProperties.normalized){
                xAxisTop = chartProperties.topMargin+chartProperties.totalBarsHeight;
            }
            else{
                if(highest<0){
                    xAxisTop=chartProperties.bottomMargin;    
                }
                else if(lowest>0){    
                    xAxisTop=chartProperties.topMargin+chartProperties.totalBarsHeight;     
                }
                else{
                    xAxisTop=chartProperties.topMargin+highest/(highest-lowest)*chartProperties.totalBarsHeight;     
                }
            }
        }
        else if(chartProperties.type=='Line Chart'){
            xAxisTop=chartProperties.topMargin+chartProperties.totalBarsHeight; // for now it's at the lowest
        }
        chartProperties.xAxisTop = xAxisTop;
    }
    
    
    calculateAssetBarProportions(assets:any[], chartProperties:any, difference:number,  prop){
        
        let barWidth=chartProperties.totalBarsWidth/assets.length;
        let totalSpaceWidth = 100-chartProperties.totalBarsWidth;
        let spaceBetweenBars=totalSpaceWidth/(assets.length+1);    // space in %
        let lastBarLeft=0;
        
        for(let i=0; i<assets.length; i++){ 
            
            // calculate width and left , regardless if net change is positive or negative
            assets[i].width=barWidth; 
            i==0 ? assets[i].left=spaceBetweenBars : assets[i].left=lastBarLeft+barWidth+spaceBetweenBars;
            lastBarLeft=assets[i].left;
            
            if(assets[i][prop]>=0){       // >=...
               assets[i].height=(assets[i][prop]/difference)*chartProperties.totalBarsHeight;  // height
               assets[i].top=chartProperties.xAxisTop-assets[i].height;                                   // top
               assets[i].returnTop=assets[i].top-20;                                           // return top
            }else{
               assets[i].height=(-assets[i][prop]/difference)*chartProperties.totalBarsHeight;  // height
               assets[i].top=chartProperties.xAxisTop+1;                                                   // top
               assets[i].returnTop=assets[i].top+assets[i].height+5;                           // return top
            }
        }
        
    }
    
    
    calculateLineProportions(dataSeries:any[], chartProperties:any, highest: number, lowest: number,  prop){
        
        // the dataSeries array usually represents days, minutes,hours but can also represent different maturities like
        // in the interest rate component.
        
        let chartRange=this.calculateHighestLowestDiff(highest, lowest);
        let distanceBetweenLines=100/dataSeries.length;   // the charts consists of multiple line, each line is from one period to another  
        chartProperties.svg ? chartProperties.polylinePoints='' : null;
        
        for(let i=0; i<dataSeries.length; i++){ 
        
            let nextDataTop
            let thisDataTop;
            
            dataSeries[i].height=2;    // height => can change to whatever number we want. numbers are in %.
            i==0 ? dataSeries[i].left=0.5*distanceBetweenLines : dataSeries[i].left=(i+0.5)*distanceBetweenLines; // left
            dataSeries[i].top = thisDataTop = chartProperties.topMargin+chartProperties.totalBarsHeight*(highest-dataSeries[i][prop])/chartRange;  // top
            
            if(chartProperties.svg){
                chartProperties.polylinePoints+=' '+dataSeries[i].left*chartProperties.totalChartWidth/100+','+dataSeries[i].top;
                if(chartProperties.circleXY){
                    chartProperties.circleXY[i]=[]; // declare array for circle coordinates. must declare before assign...
                    chartProperties.circleXY[i][0]=dataSeries[i].left*chartProperties.totalChartWidth/100;  // X coordinate
                    chartProperties.circleXY[i][1]=dataSeries[i].top;   // Y coordinate
                }
            }
            
            if(i==dataSeries.length-1) break;
            
            nextDataTop = chartProperties.topMargin+chartProperties.totalBarsHeight*(highest-dataSeries[i+1][prop])/chartRange;
            let verticalLine=nextDataTop-thisDataTop;
            let horizontalLine=distanceBetweenLines*chartProperties.totalChartWidth/100;
            let hypotenuse=Math.pow((Math.pow(verticalLine, 2)+Math.pow(horizontalLine, 2)), 0.5);  // the Pythagorean theorem
            
            dataSeries[i].width=100*(hypotenuse/chartProperties.totalChartWidth+0.001);    // width
            dataSeries[i].degrees=Math.atan(verticalLine/horizontalLine)*(180 / Math.PI);  // degrees
        }
    }
    
    
    calculateAssetNameWidthAndLeft(assets:any[]){  
    // calculate the width and the left of the name of each asset in the chart...
        
        let barWidth=100/assets.length;
        let lastBarLeft=0;
        
        for(let i=0; i<assets.length; i++){ 
            
            assets[i].nameWidth=barWidth; 
            i==0 ? assets[i].nameLeft=0 : assets[i].nameLeft=lastBarLeft+barWidth;
            lastBarLeft=assets[i].nameLeft;
        }
        
    }
    
    
    calculateInternalAxis(chartProperties: any, highest: number, lowest: number){
        
        let internalAxisWidth = chartProperties.totalChartWidth;    // set the width of each internal axis to chart width...
        let interval;
        let numOfAxis;
        let chartRange=this.calculateHighestLowestDiff(highest, lowest);    // total range, from highest point to lowest point
        let axisRange;  // range from highest axis to lowest axis
        if(this.utils.calculateModuloSafely(chartRange,chartProperties.roundTarget*5)==0 || this.utils.calculateModuloSafely(chartRange,chartProperties.roundTarget*4)==0){ // for example: 2.4%(0.1*4)=0
            if(this.utils.calculateModuloSafely(chartRange,chartProperties.roundTarget*5)==0){
                interval=(chartRange/5);
                numOfAxis=5;
            }else{
                interval=(chartRange/4);
                numOfAxis=4;
            }
        }else if((chartRange-chartProperties.roundTarget)%(chartProperties.roundTarget*5)==0 || (chartRange-chartProperties.roundTarget)%(chartProperties.roundTarget*4)==0){
            axisRange=chartRange-chartProperties.roundTarget;
            if((chartRange-chartProperties.roundTarget)%(chartProperties.roundTarget*5)==0){
                interval=(axisRange/5);
                numOfAxis=5;
            }else{
                interval=(axisRange/4);
                numOfAxis=4;
            }
        }else{
            interval=(chartRange/5);
            numOfAxis=5;
        }
        
        let internalAxises = [];
        let internalAxis=lowest;   // first internal
        for(let i=0; i<numOfAxis; i++){
            let internalAxisProp={value:null, top:null, width:internalAxisWidth};
            internalAxis+=interval;
            internalAxisProp.value = this.roundNumberToSpecificDecimalPlaces(internalAxis, chartProperties.DADP);
            internalAxisProp.top = chartProperties.topMargin+chartProperties.totalBarsHeight*((highest-internalAxisProp.value)/chartRange);
            internalAxises.push(internalAxisProp);
        }
        chartProperties.internalAxises=internalAxises;
        
    }
    
    
    adjustGridLines(event, element, chartProperties){
        if(!chartProperties.gridLineActive) return;
        let rect = element.getBoundingClientRect();
        let actualChartHeight = chartProperties.totalChartHeight - chartProperties.topMargin - chartProperties.bottomMargin;
        
        chartProperties.horizontalGridLineTop = event.clientY - rect.top;
        chartProperties.verticalGridLineLeft = event.clientX - rect.left;
        chartProperties.YAxisOrientationTop = chartProperties.horizontalGridLineTop-10;
        chartProperties.YAxisOrientation = this.highest - this.chartRange*((chartProperties.horizontalGridLineTop - chartProperties.topMargin)/actualChartHeight);
        chartProperties.isShowGridLines = true;                  
    }
    
    hideGridLines(chartProperties){
        if(!chartProperties.gridLineActive) return;
        chartProperties.isShowGridLines = false;   
    }
    
    
    setDADP(chartProperties){   // digits after decimal point...
        if(chartProperties.DADP == undefined) chartProperties.DADP = 2;
    }
    
    
    
    
    
    roundDownNumberBasedOnTarget(num:number, target:number){
        
        let counter=0;
        while(!this.utils.isInteger(num)){
            num*=10;
            target*=10;
            counter++;
        }
        num = (num - num%target)/Math.pow(10, counter);
        
        return num;
    }
    
    roundUpNumberBasedOnTarget(num:number, target:number){
        num = this.roundDownNumberBasedOnTarget(num, target);
        num+=target;
        
        return num;
    }
    
    
    roundNumberToSpecificDecimalPlaces(num:number, digitsAfterDecimalPoint:number){
        let multiplier = Math.pow(10, digitsAfterDecimalPoint);
        num = Math.round(num * multiplier) / multiplier;
        return num;
    }
    
    

}
