import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SearchAssetComponent } from '../search-asset/search-asset.component';
import { AssetsMenuModalComponent } from '../assets-menu-modal/assets-menu-modal.component';
import { AssetsService } from '../services/assets.service';
import { AssetDataService } from '../services/asset-data.service';
import { HistoricalReturnService } from '../services/historical-return.service';
import { UtilsService } from '../services/utils.service';

import { Observable } from 'rxjs';

@Component({
    selector: 'relative-performance-2',
    templateUrl: './relative-performance-2.component.html',
    styleUrls: ['./relative-performance-2.component.css']
})
export class RelativePerformance2Component implements OnInit {

    @ViewChild(SearchAssetComponent) assetNameInput: SearchAssetComponent;
    @ViewChild('dateInput') dateInput: ElementRef;
    @ViewChild(AssetsMenuModalComponent) assetsMenu: AssetsMenuModalComponent;

    chartData = [{ name: null, symbol: "SPY", dataToShow: null, color1: '#f9f189', color2: '#f7ec5b', left: null, top: null, width: null, height: null, returnTop: null },
        { name: null, symbol: "QQQ", dataToShow: null, color1: '#aff986', color2: '#96f762', left: null, top: null, width: null, height: null, returnTop: null },
        { name: null, symbol: "IYT", dataToShow: null, color1: '#8ff7c8', color2: '#66f4b4', left: null, top: null, width: null, height: null, returnTop: null },
        { name: null, symbol: "XBI", dataToShow: null, color1: '#d1f6fc', color2: '#61e3f9', left: null, top: null, width: null, height: null, returnTop: null },
        { name: null, symbol: "XLF", dataToShow: null, color1: '#66d9ff', color2: '#0099cc', left: null, top: null, width: null, height: null, returnTop: null },
        { name: null, symbol: "IWM", dataToShow: null, color1: '#00cccc', color2: '#008080', left: null, top: null, width: null, height: null, returnTop: null },
        { name: null, symbol: "FB", dataToShow: null, color1: '#c5c8f7', color2: '#5d65f7', left: null, top: null, width: null, height: null, returnTop: null },
        { name: null, symbol: "TLT", dataToShow: null, color1: '#e1abf4', color2: '#cf59f9', left: null, top: null, width: null, height: null, returnTop: null },
        { name: null, symbol: "HYG", dataToShow: null, color1: '#f9aaa7', color2: '#fc605a', left: null, top: null, width: null, height: null, returnTop: null },
    ];

    chartProperties = {
        type: 'Bar Chart',
        totalBarsWidth: 90,
        totalChartHeight: null,
        totalChartWidth: null,
        topMargin: 40,
        bottomMargin: 30,
        xAxisTop: null,
        normalized: false,
    }

    assetsSymbolsList = [];
    assetsList = [];
    observable: Observable<object[]>;
    finishedParsingLiveData = false;
    finishedParsingHistoricData = false;
    alreadyCalculated = false;
    alreadyGotSelectedAssets = false;
    isShowChart = false;
    features = ['Return','Distance from High','Distance from Low', 'Normalized Distance']
    durations = ['Day', 'Week', 'Month', '3 Months', 'Year'];  
    activeDuration = '';
    activeFeature = '';
    change = 0;
    isShowModal = false;


    constructor(private assetsService: AssetsService, private assetDataService: AssetDataService, private utils: UtilsService,
        private historicalReturnService: HistoricalReturnService) { }

    ngOnInit() {
    }

    generateAssetsObjects(assetsSymbolsList) {
        for (let i = 0; i < assetsSymbolsList.length; i++) {
            let assetData = {
                symbol: assetsSymbolsList[i],
                customDate: this.dateInput.nativeElement.value,
                lastPrice: null,
                high: null,
                low: null,
                dayData: {},
                weekData: {},
                monthData: {},
                threeMonthsData: {},
                yearData: {},
                customDateData: {},
            }
            this.assetsList.push(assetData);
        }
    }

    adjustForCustomDate(dateChosen) {
        let day = dateChosen.substring(8, 10);
        let month = dateChosen.substring(5, 7);
        let year = dateChosen.substring(0, 4);
        let customDateToShow = day + '/' + month + '/' + year;
        this.durations.splice(0, 0, customDateToShow);
    }

    initializeChartData(chartData: any[], assetsSymbolsList: any[]) {
        let loopIterations = chartData.length;
        for (let i = 0; i < loopIterations; i++) {
            if (assetsSymbolsList[i]) {
                if (true) chartData[i]['name'] = assetsSymbolsList[i];
//                else chartData[i]['name'] = this.assetsService.getAssetNameToShow(assetsSymbolsList[i]);
            }
            else chartData.pop();
        }
    }

    calculate() {
        if (!this.alreadyCalculated) {
            this.alreadyCalculated = true;
            this.generateAssetsObjects(this.assetsSymbolsList);
            if (this.dateInput.nativeElement.value) this.adjustForCustomDate(this.dateInput.nativeElement.value);
            this.initializeChartData(this.chartData, this.assetsSymbolsList);
            this.getLiveData(this.assetsSymbolsList);
            this.getHistoricData(this.assetsSymbolsList);
            setTimeout(function() {
                this.utils.doOnlyWhen(function() {
                    this.activeDuration = this.durations[0];
                    this.activeFeature = this.features[0];
                    let adjustedDuration = this.adjustActiveDuration(this.activeDuration);
                    let adjustedFeature = this.adjustActiveFeature(this.activeFeature);
                    this.updateChartData(adjustedDuration,adjustedFeature);
                    this.isShowChart = true;
                }.bind(this),
                    this.checkIfAllDataArrived.bind(this), 40, 800, function() {
                        console.log("Error: the data didn't arrive in full");
                    }
                );
            }.bind(this), 1000);
        }
    }


    getLiveData(assetsSymbolsList) {
        this.observable = this.assetDataService.getMultipleAssetsData(assetsSymbolsList, 'relative-performance', ['twelveMnthPct','fiftyTwoWkLow','fiftyTwoWkHigh']);
        this.observable.subscribe(assetsData => {
            this.parseLiveData(assetsData);
        });
    }

    parseLiveData(assetsData) {
        for (let i = 0; i < assetsData.length; i++) {
            this.assetsList[i]['lastPrice'] = assetsData[i]['lastPrice'];
            this.assetsList[i]['low'] = assetsData[i]['low'];
            this.assetsList[i]['high'] = assetsData[i]['high'];
            this.assetsList[i]['dayData']['return'] = assetsData[i]['dayReturn'];
            this.assetsList[i]['dayData']['distanceFromHigh'] = 100*(assetsData[i]['lastPrice']/assetsData[i]['high']-1);
            this.assetsList[i]['dayData']['distanceFromLow'] = 100*(assetsData[i]['lastPrice']/assetsData[i]['low']-1);
            this.assetsList[i]['dayData']['normalizedDistance'] = 100*(assetsData[i]['lastPrice'] - assetsData[i]['low'])/(assetsData[i]['high'] - assetsData[i]['low']);
            this.assetsList[i]['yearData']['return'] = assetsData[i]['yearReturn'];
            this.assetsList[i]['yearData']['distanceFromHigh'] = 100*(assetsData[i]['lastPrice']/assetsData[i]['fiftyTwoWkHigh']-1);
            this.assetsList[i]['yearData']['distanceFromLow'] = 100*(assetsData[i]['lastPrice']/assetsData[i]['fiftyTwoWkLow']-1);
            this.assetsList[i]['yearData']['normalizedDistance'] = 100*(assetsData[i]['lastPrice'] - assetsData[i]['fiftyTwoWkLow'])/(assetsData[i]['fiftyTwoWkHigh'] - assetsData[i]['fiftyTwoWkLow']);
        }
        this.finishedParsingLiveData = true;
    }

    getHistoricData(assetsSymbolsList) {
        this.assetDataService.getHistoricalDataForMultipleAssets(assetsSymbolsList).then(assetsData => {
            this.utils.doOnlyWhen(function() {
                this.parseHistoricData(assetsData);
            }.bind(this),
                function() {
                    return !!this.finishedParsingLiveData;
                }.bind(this),
                6, 1000);
        });

    }

    parseHistoricData(assetsData: [any]) {
        for (let i = 0; i < assetsData.length; i++) {
            let assetHistoricArr = assetsData[i];
            this.historicalReturnService.getAssetHistoricDataForWeeks(1, assetHistoricArr).then(candlesticks => {   // one week.
                this.setHistoricalReturnForPeriod(this.assetsList[i],candlesticks,'weekData');
                this.setHistoricalDistanceFromHighForPeriod(this.assetsList[i],candlesticks,'weekData');
                this.setHistoricalDistanceFromLowForPeriod(this.assetsList[i],candlesticks,'weekData');
                this.setHistoricalNormalizedDistanceForPeriod(this.assetsList[i],candlesticks,'weekData');
            });
            this.historicalReturnService.getAssetHistoricDataForMonths(1, assetHistoricArr).then(candlesticks => {   // one month.
                this.setHistoricalReturnForPeriod(this.assetsList[i],candlesticks,'monthData');
                this.setHistoricalDistanceFromHighForPeriod(this.assetsList[i],candlesticks,'monthData');
                this.setHistoricalDistanceFromLowForPeriod(this.assetsList[i],candlesticks,'monthData');
                this.setHistoricalNormalizedDistanceForPeriod(this.assetsList[i],candlesticks,'monthData');
            });
            this.historicalReturnService.getAssetHistoricDataForMonths(3, assetHistoricArr).then(candlesticks => {   // 3 months.
                this.setHistoricalReturnForPeriod(this.assetsList[i],candlesticks,'threeMonthsData');
                this.setHistoricalDistanceFromHighForPeriod(this.assetsList[i],candlesticks,'threeMonthsData');
                this.setHistoricalDistanceFromLowForPeriod(this.assetsList[i],candlesticks,'threeMonthsData');
                this.setHistoricalNormalizedDistanceForPeriod(this.assetsList[i],candlesticks,'threeMonthsData');
            });
            let customDate = this.assetsList[i]['customDate'];
            if (customDate) {
                this.historicalReturnService.getAssetHistoricDataForSpecificDate(customDate, assetHistoricArr).then(candlesticks => {
                    this.setHistoricalReturnForPeriod(this.assetsList[i],candlesticks,'customDateData');
                    this.setHistoricalDistanceFromHighForPeriod(this.assetsList[i],candlesticks,'customDateData');
                    this.setHistoricalDistanceFromLowForPeriod(this.assetsList[i],candlesticks,'customDateData');
                    this.setHistoricalNormalizedDistanceForPeriod(this.assetsList[i],candlesticks,'customDateData');
                });
            }
        }
        this.finishedParsingHistoricData = true;
    }
    
    setHistoricalReturnForPeriod(asset,candlesticks,duration){
        asset[duration]['return'] = this.historicalReturnService.calculateReturnForPeriod(candlesticks, asset['lastPrice'], 'close');
    }
    
    setHistoricalDistanceFromHighForPeriod(asset,candlesticks,duration){
        let highestPrice = this.historicalReturnService.calculateHighestPriceForPeriod(candlesticks);
        if(highestPrice < asset['high']) highestPrice = asset['high'];
        let distanceFromHigh = this.historicalReturnService.calculateReturnForPeriod(candlesticks, asset['lastPrice'], 'close', highestPrice);
        asset[duration]['distanceFromHigh'] = distanceFromHigh;
    }

    setHistoricalDistanceFromLowForPeriod(asset,candlesticks,duration){
        let lowestPrice = this.historicalReturnService.calculateLowestPriceForPeriod(candlesticks);
        if(lowestPrice > asset['low']) lowestPrice = asset['low'];
        let distanceFromHigh = this.historicalReturnService.calculateReturnForPeriod(candlesticks, asset['lastPrice'], 'close', lowestPrice);
        asset[duration]['distanceFromLow'] = distanceFromHigh;
    }
    
    setHistoricalNormalizedDistanceForPeriod(asset,candlesticks,duration){
        let lastPrice = asset['lastPrice'];
        let lowestPrice = lastPrice / (1+ asset[duration]['distanceFromLow']/100);
        let highestPrice = lastPrice / (1+ asset[duration]['distanceFromHigh']/100);
        let normalizedDistance = 100 * (lastPrice - lowestPrice) / (highestPrice - lowestPrice);
        asset[duration]['normalizedDistance'] = normalizedDistance;
    }

    updateChartData(duration,feature) {
        for (let i = 0; i < this.chartData.length; i++) {
            this.chartData[i]['dataToShow'] = this.assetsList[i][duration][feature];
        }
    }


    checkIfAllDataArrived() {
        return !!(this.finishedParsingLiveData && this.finishedParsingHistoricData);
    }

    changeDuration(e) {
        this.activeDuration = e.target.innerHTML;
        let adjustedDuration = this.adjustActiveDuration(this.activeDuration);
        let adjustedFeature = this.adjustActiveFeature(this.activeFeature);
        this.updateChartData(adjustedDuration,adjustedFeature);
        this.change++;  // we must change the value of this input so that bar-chart will be updated
    }
    
    changeFeature(e) {
        this.activeFeature = e.target.innerHTML;
        let adjustedFeature = this.adjustActiveFeature(this.activeFeature);
        let adjustedDuration = this.adjustActiveDuration(this.activeDuration);
        this.updateChartData(adjustedDuration,adjustedFeature);
        if(this.activeFeature == 'Normalized Distance') this.chartProperties.normalized = true;
        else this.chartProperties.normalized = false;
        this.change++;  // we must change the value of this input so that bar-chart will be updated
    }
    
    adjustActiveDuration(activeDuration:string):string{
        if(activeDuration[2] == '/'){   // meaning date structure
            return 'customDateData';
        }
        else if(activeDuration == '3 Months'){   
            return 'threeMonthsData';
        }
        else{
            return activeDuration.toLowerCase() + 'Data';
        }
    }
    
    adjustActiveFeature(activeFeature:string):string{
        let adjustedFeature = this.utils.toCamelCase(activeFeature);
        return adjustedFeature;
    }

    openModal(){
        if(!this.assetsMenu.isShowModal) this.assetsMenu.isShowModal = true;  
    }
    
    getSelectedAssets(event) {
        if(this.alreadyGotSelectedAssets) return;
        let selectedAssets = event.value;
        for(let i=0; i<selectedAssets.length; i++){
            let assetName = selectedAssets[i]['assetData']['name'];
            if(assetName == 'Stock Indexes' || assetName == 'FAANG' || assetName == 'Currencies'){  // for custom stuff...
                let symbolsAsArr = selectedAssets[i]['assetData']['symbol'].split(","); // convert the string to an array of symbols
                this.assetsSymbolsList = symbolsAsArr;
                break;
            }
            let assetSymbol = selectedAssets[i]['assetData']['symbol'];
            this.assetsSymbolsList.push(assetSymbol);
        }
        this.alreadyGotSelectedAssets = true;
    }

}
