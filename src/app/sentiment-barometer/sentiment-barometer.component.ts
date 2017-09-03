import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Candlestick } from '../Candlestick';
import { AssetDataService } from '../services/asset-data.service';
import { MarketSentimentService } from '../services/market-sentiment.service';

import { Observable } from 'rxjs';


@Component({
  selector: 'sentiment-barometer',
  templateUrl: './sentiment-barometer.component.html',
  styleUrls: ['./sentiment-barometer.component.css']
})
export class SentimentBarometerComponent implements OnInit, OnDestroy {
        
    @Input() header:string;
    @Input() elementId:number;  // the number of the element. if we have 5 <sentiment-barometer> elements, each will have an id between 0-4
    @Input() scaleType:string;
    barometerIconsArr=["Super Bearish","","Bearish","","","Neutral","","","Bullish","","Super Bullish" ];
    result;
    interval;
    

    
  constructor(private assetDataService: AssetDataService, private marketSentimentService: MarketSentimentService) { }

    ngOnInit() {
      
        if(this.scaleType=="number"){
                                
                                this.result=this.marketSentimentService.calculateMarketRisk();
                                this.createBarometerWithNumbersScale(this.elementId);
            
            }else if(this.scaleType=="word"){
            
                                    this.result=this.marketSentimentService.calculateMarketSentiment();
                                    this.createBarometerWithWordsScale(this.elementId);
            
            }
        
        setTimeout(()=>{this.activateBarometer(this.result,this.elementId);},2000);
        
  }
    
    
    
    activateBarometer(relativeScore,elementId):void{
    
     let adjustedRelativeScore=270+1.8*relativeScore;
     let angle=270;
     this.interval = setInterval(rotate, 27.77);
     let elementArr=document.getElementsByClassName("axisCircle");
        
     function rotate(){
         
         if(angle<adjustedRelativeScore){ 
         
                elementArr[elementId].setAttribute("style",`transform:rotate(${angle.toString()}deg); position:absolute; top:108px; left:108px; width:24px; 
                                                    height:24px; border-radius:12px; background:white; z-index:1; transform-origin: 50% 50%;`);
                angle++;
             
         }else{
             
                 elementArr[elementId].setAttribute("style",`transform:rotate(${adjustedRelativeScore.toString()}deg); position:absolute; top:108px; left:108px; 
                                                    width:24px; height:24px; border-radius:12px; background:white; z-index:1; transform-origin: 50% 50%;`);
                 
                 clearInterval(this.interval); 
         
             }
     }
     
 }
    
    
    createBarometerWithNumbersScale(elementId:number){
    
    let radius=120;
    let degree=180;
    let adjustedDegree=450-degree;
    let x=-2;
    let y=radius;

        let htmlContent=`<div style=' margin:5px auto; width:240px; height:140px; border-bottom:1px solid black; overflow-y:hidden; overflow-x:hidden;'>
                  <div style='height:240px; width:240px; border-radius:120px; background:linear-gradient(to right,#36db73,#db3b18); position:relative;
                   margin:0px auto; text-align:center; border:1px solid black;' >`;
        
        for(let i=0; i<51; i++){
            
        if(i%5==0){
            
               if(i<31){ // 10-60 in the scale
                          htmlContent+=`<div style='position:absolute; width:2px; height:24px; background:black; transform-origin:top; top:${y}px; 
                                left:${x}px; transform:rotate(${adjustedDegree}deg);'><div style='color:black; margin-left:-5px; margin-top:25px;
                                transform:rotate(${degree-90}deg); font-size:12px; font-weight:bold;'>${2*i}</div></div>`;
                }else if(i<36){  // 70 in the scale
                              htmlContent+=`<div style='position:absolute; width:2px; height:24px; background:black; transform-origin:top; top:${y}px; 
                                    left:${x}px; transform:rotate(${adjustedDegree}deg);'><div style='color:black; margin-left:-5px; margin-top:27px; 
                                    transform:rotate(${degree-89}deg); font-size:12px; font-weight:bold;'>${2*i}</div></div>`;
                   }else if(i<46) { // 80-90 in the scale
                                htmlContent+=`<div style='position:absolute; width:2px; height:24px; background:black; transform-origin:top; top:${y}px; 
                                      left:${x}px; transform:rotate(${adjustedDegree}deg);'><div style='color:black; margin-left:-2px; margin-top:30px; 
                                      transform:rotate(${degree-89}deg); font-size:12px; font-weight:bold;'>${2*i}</div></div>`;
                     }else{     // 100 in the scale
                                    htmlContent+=`<div style='position:absolute; width:2px; height:24px; background:black; transform-origin:top; top:${y}px; 
                                          left:${x}px; transform:rotate(${adjustedDegree}deg);'><div style='color:black; margin-left:3px; margin-top:39px;
                                           transform:rotate(${degree-90}deg); font-size:12px; font-weight:bold;'>${2*i}</div></div>`;
                   }
            
        }else{
                htmlContent+=`<div style='position:absolute; width:1px; height:16px; background:black; transform-origin:top; top:${y}px; left:${x}px;
                      transform:rotate(${adjustedDegree}deg);' ></div>`;
        }
            
        degree-=3.6;
        adjustedDegree=450-degree;
        y= radius-Math.sin(degree * Math.PI / 180)*radius  ;
        x=radius+Math.cos(degree * Math.PI / 180)*radius -1;
        
        }
        
        htmlContent+=`<div class="axisCircle" style='position:absolute; top:108px; left:108px; width:24px; height:24px; border-radius:12px; background:white; 
                z-index:1; transform: rotate(270deg); transform-origin: 50% 50%;'>
               <div id='arrow' style='position:absolute; top:-84px; left:8px; width:8px; height:96px;'>
                      <div style='top:-26px; left:0px; width: 0; height: 0; border-color: transparent transparent white; border-width:26px 4px 26px;  
                       position:absolute; border-style:solid;'></div>
                      <div style='position:absolute; top:26px; left:0px; width:8px; height:70px; background:white;'></div>
               </div>
               </div>
               </div>`

        
            document.getElementsByClassName('wrapperDiv')[elementId].innerHTML=htmlContent;
        
        
}
    
    
    
    
    
    createBarometerWithWordsScale(elementId:number){
    
    let radius=120;
    let degree=180;
    let adjustedDegree=450-degree;
    let x=-2;
    let y=radius;

        let htmlContent=`<div style='margin:5px auto; width:240px; height:140px; border-bottom:1px solid black; overflow-y:hidden; overflow-x:hidden;'>
                  <div style='height:240px; width:240px; border-radius:120px; background:linear-gradient(to right,#db3b18,#36db73); position:relative; 
                   margin:0px auto; text-align:center; border:1px solid black;' >`;
        
        for(let i=0; i<51; i++){
            
            if(i%5==0){
                
                   if(i==0){    // Super Bearish
                                htmlContent+=`<div style='position:absolute; width:2px; height:24px; background:black; transform-origin:top; top:${y}px; 
                                       left:${x}px; transform:rotate(${adjustedDegree}deg);'><div style='color:black; margin-left:1px; margin-top:17px;
                                       transform:rotate(${degree-90}deg); font-size:12px; font-weight:bold;'>${this.barometerIconsArr[i/5]}</div></div>`;
                     }else if(i==10){   // Bearish
                                    htmlContent+=`<div style='position:absolute; width:2px; height:24px; background:black; transform-origin:top; top:${y}px; 
                                           left:${x}px; transform:rotate(${adjustedDegree}deg);'><div style='color:black; margin-left:1px; margin-top:20px; 
                                           transform:rotate(${degree-90}deg); font-size:12px; font-weight:bold;'>${this.barometerIconsArr[i/5]}</div></div>`;
                        }else if(i==25){    // Neutral
                                        htmlContent+=`<div style='position:absolute; width:2px; height:24px; background:black; transform-origin:top; top:${y}px; 
                                               left:${x}px; transform:rotate(${adjustedDegree}deg);'><div style='color:black; margin-left:-18px; margin-top:27px; 
                                               transform:rotate(${degree-90}deg); font-size:12px; font-weight:bold;'>${this.barometerIconsArr[i/5]}</div></div>`;
                            }else if(i==40){    // bullish
                                            htmlContent+=`<div style='position:absolute; width:2px; height:24px; background:black; transform-origin:top; top:${y}px; 
                                                   left:${x}px; transform:rotate(${adjustedDegree}deg);'><div style='color:black; margin-left:-30px; margin-top:40px; 
                                                   transform:rotate(${degree-90}deg); font-size:12px; font-weight:bold;'>${this.barometerIconsArr[i/5]}</div></div>`;
                                 }else{     // super bullish
                                                htmlContent+=`<div style='position:absolute; width:2px; height:24px; background:black; transform-origin:top; top:${y}px; 
                                                       left:${x}px; transform:rotate(${adjustedDegree}deg);'><div style='color:black; margin-left:0px; margin-top:52px; 
                                                       transform:rotate(${degree-90}deg); font-size:12px; font-weight:bold;'>${this.barometerIconsArr[i/5]}</div></div>`;  
                                     }
                
             }else{
            
                  htmlContent+=`<div style='position:absolute; width:1px; height:16px; background:black; transform-origin:top; top:${y}px; left:${x}px;
                  transform:rotate(${adjustedDegree}deg);'></div>`;
             }
            
        degree-=3.6;
        adjustedDegree=450-degree;
        y= radius-Math.sin(degree * Math.PI / 180)*radius  ;
        x=radius+Math.cos(degree * Math.PI / 180)*radius -1;
        
        }
        
        htmlContent+=`<div class="axisCircle" style='position:absolute; top:108px; left:108px; width:24px; height:24px; border-radius:12px; background:white; 
                z-index:1; transform: rotate(270deg); transform-origin: 50% 50%;'>
               <div id='arrow' style='position:absolute; top:-84px; left:8px; width:8px; height:96px;'>
                      <div style='top:-26px; left:0px; width: 0; height: 0; border-color: transparent transparent white; border-width:26px 4px 26px;  
                       position:absolute; border-style:solid;'></div>
                      <div style='position:absolute; top:26px; left:0px; width:8px; height:70px; background:white;'></div>
               </div>
               </div>
               </div>`

        
            document.getElementsByClassName('wrapperDiv')[elementId].innerHTML=htmlContent;
        
        
        
}
    
    
    
    
    ngOnDestroy() {
        
        clearInterval(this.interval);   // prevents the app from crashing if we navigate away while activateBarometer still running
        
     }
    
    
    
}
