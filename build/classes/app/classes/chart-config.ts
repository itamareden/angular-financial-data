export class ChartConfig {
    
    private _totalBarsWidth: number;  // width of each bar in %
    private _totalChartHeight: number;
    private _totalChartWidth: number;
    private _bodyHeight: number;   
    private _topMargin: number;        // a small space from the top of the chart to the bars area..
    private _bottomMargin: number;
    private _xAxisTop: number;
    private _xAxisWidth: number;
    private _xAxisLeft: number;
    
    constructor(totalBarsWidth: number, topMargin: number, bottomMargin: number){
        this._totalBarsWidth = totalBarsWidth <= 100 ? totalBarsWidth : 84;
        this._topMargin = topMargin >= 0 ? topMargin : 30;
        this._bottomMargin = bottomMargin >= 0 ? bottomMargin : 30;
//        this._bodyHeight = this._totalChartHeight - this._topMargin - this._bottomMargin - 1;
    }
    
    
    get totalBarsWidth(): number{
        return this._totalBarsWidth;    
    }
    
    get totalChartHeight(): number{
        return this._totalChartHeight;    
    }
    
    set totalChartHeight(totalChartHeight: number){
        this._totalChartHeight = totalChartHeight;
    }
    
    get totalChartWidth(): number{
        return this._totalChartWidth;    
    }
    
    set totalChartWidth(totalChartWidth: number){
        this._totalChartWidth = totalChartWidth;
    }
    
    get bodyHeight(): number{
        return this._bodyHeight;    
    }
    
    set bodyHeight(bodyHeight: number){
        this._bodyHeight = bodyHeight;
    }
    
    get topMargin(): number{
        return this._topMargin;    
    }
    
    get bottomMargin(): number{
        return this._bottomMargin;    
    }
    
    get xAxisTop(): number{
        return this._xAxisTop;    
    }
    
    set xAxisTop(xAxisTop: number){
        this._xAxisTop = xAxisTop;
    }
    
    get xAxisWidth(): number{
        return this._xAxisWidth;    
    }
    
    set xAxisWidth(xAxisWidth: number){
        this._xAxisWidth = xAxisWidth;
    }
    
    get xAxisLeft(): number{
        return this._xAxisLeft;    
    }
    
    set xAxisLeft(xAxisLeft: number){
        this._xAxisLeft = xAxisLeft;
    }
    
}
