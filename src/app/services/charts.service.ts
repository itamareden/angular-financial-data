import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { ChartConfig } from '../classes/chart-config';
import { BarChartConfig } from '../classes/bar-chart-config';
import { ChartData } from '../classes/chart-data';

@Injectable()
export class ChartsService {
        
    highest;
    lowest;
    chartRange;

  constructor(private utils: UtilsService) { }
    
    createBarChart(dataSeries: ChartData[], chartConfig: BarChartConfig): void{
        if(this.checkChartProperties(dataSeries,chartConfig)){
            this.clearBarChartDataObj(dataSeries);
            this.calculateDataSumForEachBar(dataSeries);
            let highest = this.calculateHighestPointInBarChart(dataSeries, chartConfig);
            let lowest = this.calculateLowestPointInBarChart(dataSeries, chartConfig);
            let chartRange = this.calculateHighestLowestDiff(highest, lowest);
            this.calculateXAxisProportions(chartConfig, highest, lowest);
            this.calculateDataNameTop(chartConfig, highest, lowest);
            this.calculateEachBarProportions(dataSeries, chartConfig, chartRange);
            this.setBarColors(dataSeries, chartConfig.colorMultiplier);
            this.setBarData(dataSeries, chartConfig);
            this.calculateXAxisMiniGrids(dataSeries, chartConfig);
            if(chartConfig.isEnableTooltip){
                this.setPatternToTooltipData(dataSeries, chartConfig);
            }
        }
    }
    
    checkChartProperties(dataSeries: ChartData[],chartConfig: ChartConfig): boolean{
            chartConfig.bodyHeight = chartConfig.totalChartHeight - chartConfig.topMargin - chartConfig.bottomMargin - 1;
            return true;    
    }
    
    clearBarChartDataObj(dataSeries: ChartData[]){
        dataSeries.forEach(function(dataObj){
            if(dataObj.top && dataObj.top.length > 0) dataObj.top = [];
            if(dataObj.height && dataObj.height.length > 0) dataObj.height = [];
        });
    }
    
    calculateDataSumForEachBar(dataSeries: ChartData[]){
        let sum = 0;
        for(let i=0; i<dataSeries.length; i++){
            let bar = dataSeries[i].dataArr;
            for(let j=0; j<bar.length; j++){
                sum += bar[j];
            }
            dataSeries[i].totalDataSum = sum;
            sum = 0;
        }
    }
    
    calculateHighestLowestDiff(highest, lowest): number{
        let difference=highest-lowest;
        return difference;
    }
    
    calculateHighestPointInBarChart(dataSeries: ChartData[], chartConfig: BarChartConfig):number{
        let highest=dataSeries[0].totalDataSum;     
        for(let i=0; i<dataSeries.length; i++){ 
            if(dataSeries[i].totalDataSum > highest) highest=dataSeries[i].totalDataSum;
        }
        if(highest < 0) return 0;
        else return highest;
    }
    
    calculateLowestPointInBarChart(dataSeries: ChartData[], chartConfig: BarChartConfig):number{
        let lowest = dataSeries[0].totalDataSum;     
        for(let i=0; i<dataSeries.length; i++){ 
            if(dataSeries[i].totalDataSum < lowest) lowest = dataSeries[i].totalDataSum;
        }
        if(lowest > 0) return 0;
        else return lowest;
    }
    
    calculateDataNameTop(chartConfig: BarChartConfig, highest: number, lowest: number){
        if(chartConfig.xAxisTop == null){
            this.calculateXAxisTop(chartConfig, highest, lowest);
            return this.calculateDataNameTop(chartConfig, highest, lowest);
        }
        if(lowest >= 0){    // then all data is positive...
            chartConfig.dataNameTop = chartConfig.xAxisTop + 5;  
        }
        else if(highest <= 0){   // then all data is negative...
            chartConfig.dataNameTop = chartConfig.xAxisTop - 5;
        }
        else{
            chartConfig.dataNameTop = -30;
        }
    }
    
    calculateEachBarProportions(chartData: ChartData[], chartConfig: BarChartConfig, difference:number){
        // we use Math.floor for barWidth and spaceBetweenBars to overcome javascript's inability to deal with 
        // floating number properly. Also all of the properties in chartData (left, width, etc.) are in PX 
        let barWidthInPerc = chartConfig.totalBarsWidth / chartData.length;
        let barWidth = Math.floor(chartConfig.totalChartWidth * barWidthInPerc / 100); 
        let totalSpaceWidth = 100 - chartConfig.totalBarsWidth; // space in %
        let spaceBetweenBars = Math.floor(chartConfig.totalChartWidth * totalSpaceWidth / (chartData.length + 1) / 100);     
        let lastBarLeft = 0;
        for(let i=0; i<chartData.length; i++){ 
            chartData[i].width = barWidth;
            if(i != 0){
                chartData[i].left = lastBarLeft + barWidth + spaceBetweenBars
            }
            else{
                chartData[i].left = spaceBetweenBars
            } 
            lastBarLeft = chartData[i].left;
            let dataArr = chartData[i].dataArr;
            let barHeight = (chartData[i].totalDataSum / difference) * chartConfig.bodyHeight;
            let barTop = chartData[i].totalDataSum >= 0 ? chartConfig.xAxisTop - barHeight : chartConfig.xAxisTop +1; // check if positive or negative
            let lastSubBarTop = 0;
            for(let j=0; j<dataArr.length; j++){
                if(/*dataArr[j] >= 0*/ chartData[i].totalDataSum >= 0){ // deals with a positive or 0 bar
                    chartData[i].height.push((dataArr[j] / chartData[i].totalDataSum) * barHeight);
                    if(j != 0){
                        chartData[i].top.push(lastSubBarTop + chartData[i].height[j-1]);
                    }
                    else{
                        chartData[i].top.push(barTop);
                        if(chartConfig.isShowBarData) chartData[i].barDataTop = chartData[i].top[0] - 20;
                    }
                }
                else{
                    let lastItemIndex = dataArr.length -1;
                    chartData[i].height.push((-dataArr[j] / chartData[i].totalDataSum) * barHeight);
                    if(j == 0){
                        chartData[i].top.push(chartConfig.xAxisTop + 1);
                    }
                    else{
                        chartData[i].top.push(lastSubBarTop + chartData[i].height[j-1]);
                    }
                    if(chartConfig.isShowBarData && j == lastItemIndex) chartData[i].barDataTop = chartData[i].top[j] + chartData[i].height[j] + 5;
                }
                lastSubBarTop = chartData[i].top[j];
            }
        }
    }
    
    setBarColors(dataSeries: ChartData[], multiplier){
        // check if colors obj is alredy defined (means we've been here before...)
        if(dataSeries[0]['colors'] && dataSeries[0]['colors'] instanceof Array && typeof dataSeries[0]['colors'][0] == 'object') return;
        if(typeof multiplier != "number" || multiplier < 0) multiplier = 1;
        for(let bar of dataSeries){
            let tempColors = [];
            for(let subBarColor of bar.colors){
                let subBarColorsObj = {color1:null,color2:null};
                // check if it's a valid color first
                if(subBarColor && typeof subBarColor == "string" && subBarColor[0] == "#"){
                    /* we want the brightest part to be the farthest from the x axis. so we set the colors based on the the 
                    sign of the bar (positive or negative) */
                    if(bar.totalDataSum > 0){   
                        subBarColorsObj.color1 = this.utils.brightenColor(subBarColor,multiplier);
                        subBarColorsObj.color2 = subBarColor;
                    }
                    else{
                        subBarColorsObj.color1 = subBarColor;
                        subBarColorsObj.color2 = this.utils.brightenColor(subBarColor,multiplier);
                    }
                }
                else{
                    subBarColorsObj.color1 = subBarColor;
                    subBarColorsObj.color2 = subBarColor;
                }
                tempColors.push(subBarColorsObj);
            }
            bar.colors = tempColors;
        }
    }
    
    calculateXAxisProportions(chartConfig: BarChartConfig, highest?: number, lowest?: number){ 
    
        if(highest != undefined && lowest != undefined){
            this.calculateXAxisTop(chartConfig, highest, lowest);
        }
        else{
            this.calculateXAxisTop(chartConfig);   
        }
        this.calculateXAxisLeftAndWidth(chartConfig);
    }
    
    calculateXAxisLeftAndWidth(chartConfig: BarChartConfig){
        
        let chartWidth = chartConfig.totalChartWidth;
        if(chartWidth > 450){
            chartConfig.xAxisWidth = chartWidth + 40;
            chartConfig.xAxisLeft =-37;
        }
        else if(chartWidth > 400){
            chartConfig.xAxisWidth = chartWidth + 25;
            chartConfig.xAxisLeft =-22;
        }
        else if(chartWidth > 260){
            chartConfig.xAxisWidth = chartWidth + 18;
            chartConfig.xAxisLeft =-15;
        }
    }
    
    calculateXAxisTop(chartConfig: BarChartConfig, highest?: number, lowest?: number){
        let xAxisTop;
        let chartRange=this.calculateHighestLowestDiff(highest, lowest);    // total range, from highest point to lowest point
        if(true){
            if(highest < 0){
                xAxisTop = chartConfig.bottomMargin;    
            }
            else if(lowest > 0){    
                xAxisTop = chartConfig.topMargin + chartConfig.bodyHeight;     
            }
            else{
                xAxisTop = chartConfig.topMargin + highest/(highest-lowest) * chartConfig.bodyHeight;     
            }
        }
//        else if(chartConfig.type == 'Line Chart'){
//            xAxisTop = chartConfig.topMargin + chartConfig.bodyHeight; // for now it's at the lowest
//        }
        chartConfig.xAxisTop = xAxisTop;
    }
    
    setBarData(chartData: any, chartConfig: BarChartConfig){
        if(chartConfig.barDataPattern){
            chartData.forEach(function(bar){
                bar.barData = bar.totalDataSum.toString().replace(chartConfig.barDataPattern[0], chartConfig.barDataPattern[1]);
            })
        }
        else{
            chartData.forEach(function(bar){
                bar.barData = bar.totalDataSum;
            })
        }
    }
    
    calculateXAxisMiniGrids(dataSeries: ChartData[], chartConfig: BarChartConfig){
        if(chartConfig.totalChartWidth){
            let barWidth = chartConfig.totalChartWidth * chartConfig.totalBarsWidth / 100 / dataSeries.length; 
            let spaceBetweenEachBar = (chartConfig.totalChartWidth - (barWidth * dataSeries.length)) / (dataSeries.length + 1);
            let spaceFromLastBar = (spaceBetweenEachBar - 1)/2  // we take into account the width of the mini grid - 1px.
            let miniGridLeftArr = [];
            dataSeries.forEach(function(bar){
                let endOfBarLeft = bar.left + bar.width;
                let miniGridLeft = endOfBarLeft + spaceFromLastBar;
                miniGridLeftArr.push(miniGridLeft);
            });
            chartConfig.miniGridLeftArr = miniGridLeftArr;
        }
    }
    
    setPatternToTooltipData(dataSeries: ChartData[], chartConfig: BarChartConfig){
        dataSeries.forEach(function(dataObj){
            let patternedDataArr: string[] = [];
            dataObj.dataArr.forEach(function(data:number){
                patternedDataArr.push(data.toString().replace(chartConfig.barDataPattern[0], chartConfig.barDataPattern[1]));
            })
            dataObj.patternedDataArr = patternedDataArr;
        })
        console.log(dataSeries);
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    createLineChart(dataSeries:any[], chartConfig:any, prop:string, isShowName:boolean) :any{
        
    }
    
    createNormalizedBarChart(dataSeries:any[], chartConfig:any) :any{
        
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    /*
    createNormalizedBarChart(dataSeries:any[], chartConfig:any) :any{

        if(this.checkChartProperties(dataSeries,chartConfig)){
            let assets = dataSeries;
            let barWidth=chartConfig.totalBarsWidth/assets.length;
            let totalSpaceWidth = 100-chartConfig.totalBarsWidth;
            let spaceBetweenBars=totalSpaceWidth/(assets.length+1);    // space in %
            let lastBarLeft=0;
            this.calculateXAxisProportions(chartConfig);
            this.setDADP(chartConfig);
            
            for(let i=0; i<assets.length; i++){
                assets[i].width=barWidth; 
                i==0 ? assets[i].left=spaceBetweenBars : assets[i].left=lastBarLeft+barWidth+spaceBetweenBars;
                lastBarLeft=assets[i].left;
                assets[i].height = chartConfig.totalBarsHeight;          // height
                assets[i].top=chartConfig.xAxisTop-assets[i].height;     // top
                assets[i].barDataTop=assets[i].top-20;                        // return top
            }
        
            return [dataSeries, chartConfig];
        }
    }
    
    
    createLineChart(dataSeries:any[], chartConfig:any, prop:string, isShowName:boolean) :any{
        let highest, lowest, chartRange;
        if(this.checkChartProperties(dataSeries,chartConfig)){
            this.highest = highest = this.calculateHighestPointInChart(dataSeries, chartConfig, prop);
            this.lowest = lowest = this.calculateLowestPointInChart(dataSeries, chartConfig, prop);
            this.chartRange= chartRange = this.calculateHighestLowestDiff(highest, lowest);
            this.calculateXAxisProportions(chartConfig, highest, lowest);
            this.calculateInternalAxis(chartConfig,highest,lowest);
            this.calculateLineProportions(dataSeries, chartConfig, highest, lowest, prop);
            this.setDADP(chartConfig);
            if(isShowName) this.calculateAssetNameWidthAndLeft(dataSeries);
            
            return [dataSeries, chartConfig];
        }
    }
    
    checkChartProperties(dataSeries:any[],chartConfig:any):boolean{
        
        if(dataSeries==undefined || dataSeries.length==0){
            console.log('failed to generate chart => issue with dataSeries array');
            return false;   
        }else if(chartConfig==undefined || chartConfig.totalChartHeight==undefined || chartConfig.totalChartHeight<=0){
            console.log('failed to generate chart => issue with chartConfig');
            return false;   
        }else if(chartConfig.type==undefined){
            console.log('failed to generate chart => chart type is missing');
        }else{
            if(!chartConfig.totalBarsWidth || chartConfig.totalBarsWidth>100)  chartConfig.totalBarsWidth=84;
            if(!chartConfig.topMargin ||chartConfig.topMargin<0)  chartConfig.topMargin=30;          // default size..
            if(!chartConfig.bottomMargin || chartConfig.bottomMargin<0)  chartConfig.bottomMargin=30;    // default size..
//            chartConfig.totalBarsHeight=chartConfig.totalChartHeight-chartConfig.topMargin-chartConfig.bottomMargin-1;
            chartConfig.bodyHeight = chartConfig.totalChartHeight - chartConfig.topMargin - chartConfig.bottomMargin - 1;
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
    
    calculateHighestPointInChart(dataSeries:any[], chartConfig:any, prop):number{
        
        let highest=dataSeries[0][prop];     
        for(let i=0; i<dataSeries.length; i++){ 
            if(dataSeries[i][prop]>highest) highest=dataSeries[i][prop];
        }
        
        if(chartConfig.type=='Bar Chart' && highest<0) return 0;
        
        if(chartConfig.type=='Line Chart'){
            if(chartConfig.DADP != undefined && chartConfig.roundTarget != undefined){
                let cleanNumber = this.roundNumberToSpecificDecimalPlaces(highest, chartConfig.DADP);
                highest = this.roundUpNumberBasedOnTarget(cleanNumber, chartConfig.roundTarget);
            }
        }
        
        return highest;
    }
    
    
    calculateLowestPointInChart(dataSeries:any[], chartConfig:any, prop):number{
        
        let lowest=dataSeries[0][prop];     
        for(let i=0; i<dataSeries.length; i++){ 
            if(dataSeries[i][prop]<lowest) lowest=dataSeries[i][prop];
        }
        
        if(chartConfig.type=='Bar Chart' && lowest>0) return 0;
        
        if(chartConfig.type=='Line Chart'){
            if(chartConfig.lowestIsZero) return 0;
            if(chartConfig.DADP != undefined && chartConfig.roundTarget != undefined){
                let cleanNumber = this.roundNumberToSpecificDecimalPlaces(lowest, chartConfig.DADP);
                lowest = this.roundDownNumberBasedOnTarget(cleanNumber, chartConfig.roundTarget);
            }
        }
        
        return lowest;
    }
    
    
    calculateXAxisProportions(chartConfig: any, highest?: number, lowest?: number){ 
    
        if(highest != undefined && lowest != undefined){
            this.calculateXAxisTop(chartConfig, highest, lowest);
        }
        else{
            this.calculateXAxisTop(chartConfig);   
        }
        this.calculateXAxisLeftAndWidth(chartConfig);
    }
    
    calculateXAxisLeftAndWidth(chartConfig){
        
        let chartWidth = chartConfig.totalChartWidth;
        if(chartWidth > 450){
            chartConfig.xAxisWidth = chartWidth + 40;
            chartConfig.xAxisLeft =-37;
        }
        else if(chartWidth > 400){
            chartConfig.xAxisWidth = chartWidth + 25;
            chartConfig.xAxisLeft =-22;
        }
        else if(chartWidth > 260){
            chartConfig.xAxisWidth = chartWidth + 18;
            chartConfig.xAxisLeft =-15;
        }
    }
    
    calculateXAxisTop22222222(chartConfig: any, highest?: number, lowest?: number){
        
        let xAxisTop;
        let chartRange=this.calculateHighestLowestDiff(highest, lowest);    // total range, from highest point to lowest point
        
        if(chartConfig.type=='Bar Chart'){
            if(chartConfig.normalized){
                xAxisTop = chartConfig.topMargin+chartConfig.totalBarsHeight;
            }
            else{
                if(highest<0){
                    xAxisTop=chartConfig.bottomMargin;    
                }
                else if(lowest>0){    
                    xAxisTop=chartConfig.topMargin+chartConfig.totalBarsHeight;     
                }
                else{
                    xAxisTop=chartConfig.topMargin+highest/(highest-lowest)*chartConfig.totalBarsHeight;     
                }
            }
        }
        else if(chartConfig.type=='Line Chart'){
            xAxisTop=chartConfig.topMargin+chartConfig.totalBarsHeight; // for now it's at the lowest
        }
        chartConfig.xAxisTop = xAxisTop;
    }
    
    
    calculateAssetBarProportions(assets:any[], chartConfig:any, difference:number,  prop){
        
        let barWidth=chartConfig.totalBarsWidth/assets.length;
        let totalSpaceWidth = 100-chartConfig.totalBarsWidth;
        let spaceBetweenBars=totalSpaceWidth/(assets.length+1);    // space in %
        let lastBarLeft=0;
        
        for(let i=0; i<assets.length; i++){ 
            
            // calculate width and left , regardless if net change is positive or negative
            assets[i].width=barWidth; 
            i==0 ? assets[i].left=spaceBetweenBars : assets[i].left=lastBarLeft+barWidth+spaceBetweenBars;
            lastBarLeft=assets[i].left;
            
            if(assets[i][prop]>=0){       // >=...
               assets[i].height=(assets[i][prop]/difference)*chartConfig.totalBarsHeight;  // height
               assets[i].top=chartConfig.xAxisTop-assets[i].height;                                   // top
               assets[i].barDataTop=assets[i].top-20;                                           // return top
            }else{
               assets[i].height=(-assets[i][prop]/difference)*chartConfig.totalBarsHeight;  // height
               assets[i].top=chartConfig.xAxisTop+1;                                                   // top
               assets[i].barDataTop=assets[i].top+assets[i].height+5;                           // return top
            }
        }
        
    }
    
    
    calculateLineProportions(dataSeries:any[], chartConfig:any, highest: number, lowest: number,  prop){
        
        // the dataSeries array usually represents days, minutes,hours but can also represent different maturities like
        // in the interest rate component.
        
        let chartRange=this.calculateHighestLowestDiff(highest, lowest);
        let distanceBetweenLines=100/dataSeries.length;   // the charts consists of multiple line, each line is from one period to another  
        chartConfig.svg ? chartConfig.polylinePoints='' : null;
        
        for(let i=0; i<dataSeries.length; i++){ 
        
            let nextDataTop
            let thisDataTop;
            
            dataSeries[i].height=2;    // height => can change to whatever number we want. numbers are in %.
            i==0 ? dataSeries[i].left=0.5*distanceBetweenLines : dataSeries[i].left=(i+0.5)*distanceBetweenLines; // left
            dataSeries[i].top = thisDataTop = chartConfig.topMargin+chartConfig.totalBarsHeight*(highest-dataSeries[i][prop])/chartRange;  // top
            
            if(chartConfig.svg){
                chartConfig.polylinePoints+=' '+dataSeries[i].left*chartConfig.totalChartWidth/100+','+dataSeries[i].top;
                if(chartConfig.circleXY){
                    chartConfig.circleXY[i]=[]; // declare array for circle coordinates. must declare before assign...
                    chartConfig.circleXY[i][0]=dataSeries[i].left*chartConfig.totalChartWidth/100;  // X coordinate
                    chartConfig.circleXY[i][1]=dataSeries[i].top;   // Y coordinate
                }
            }
            
            if(i==dataSeries.length-1) break;
            
            nextDataTop = chartConfig.topMargin+chartConfig.totalBarsHeight*(highest-dataSeries[i+1][prop])/chartRange;
            let verticalLine=nextDataTop-thisDataTop;
            let horizontalLine=distanceBetweenLines*chartConfig.totalChartWidth/100;
            let hypotenuse=Math.pow((Math.pow(verticalLine, 2)+Math.pow(horizontalLine, 2)), 0.5);  // the Pythagorean theorem
            
            dataSeries[i].width=100*(hypotenuse/chartConfig.totalChartWidth+0.001);    // width
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
    
    
    calculateInternalAxis(chartConfig: any, highest: number, lowest: number){
        
        let internalAxisWidth = chartConfig.totalChartWidth;    // set the width of each internal axis to chart width...
        let interval;
        let numOfAxis;
        let chartRange=this.calculateHighestLowestDiff(highest, lowest);    // total range, from highest point to lowest point
        let axisRange;  // range from highest axis to lowest axis
        if(this.utils.calculateModuloSafely(chartRange,chartConfig.roundTarget*5)==0 || this.utils.calculateModuloSafely(chartRange,chartConfig.roundTarget*4)==0){ // for example: 2.4%(0.1*4)=0
            if(this.utils.calculateModuloSafely(chartRange,chartConfig.roundTarget*5)==0){
                interval=(chartRange/5);
                numOfAxis=5;
            }else{
                interval=(chartRange/4);
                numOfAxis=4;
            }
        }else if((chartRange-chartConfig.roundTarget)%(chartConfig.roundTarget*5)==0 || (chartRange-chartConfig.roundTarget)%(chartConfig.roundTarget*4)==0){
            axisRange=chartRange-chartConfig.roundTarget;
            if((chartRange-chartConfig.roundTarget)%(chartConfig.roundTarget*5)==0){
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
            internalAxisProp.value = this.roundNumberToSpecificDecimalPlaces(internalAxis, chartConfig.DADP);
            internalAxisProp.top = chartConfig.topMargin+chartConfig.totalBarsHeight*((highest-internalAxisProp.value)/chartRange);
            internalAxises.push(internalAxisProp);
        }
        chartConfig.internalAxises=internalAxises;
        
    }
    
    
    adjustGridLines(event, element, chartConfig){
        if(!chartConfig.gridLineActive) return;
        let rect = element.getBoundingClientRect();
        let actualChartHeight = chartConfig.totalChartHeight - chartConfig.topMargin - chartConfig.bottomMargin;
        
        chartConfig.horizontalGridLineTop = event.clientY - rect.top;
        chartConfig.verticalGridLineLeft = event.clientX - rect.left;
        chartConfig.YAxisOrientationTop = chartConfig.horizontalGridLineTop-10;
        chartConfig.YAxisOrientation = this.highest - this.chartRange*((chartConfig.horizontalGridLineTop - chartConfig.topMargin)/actualChartHeight);
        chartConfig.isShowGridLines = true;                  
    }
    
    hideGridLines(chartConfig){
        if(!chartConfig.gridLineActive) return;
        chartConfig.isShowGridLines = false;   
    }
    
    
    setDADP(chartConfig){   // digits after decimal point...
        if(chartConfig.DADP == undefined) chartConfig.DADP = 2;
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
    
    */

}
