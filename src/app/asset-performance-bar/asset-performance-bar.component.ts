import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'asset-performance-bar',
  templateUrl: './asset-performance-bar.component.html',
  styleUrls: ['./asset-performance-bar.component.css']
})
export class AssetPerformanceBarComponent implements OnInit {

    
    @Input() sessionLow:string;
    @Input() sessionHigh:string;
    @Input() sessionLowReturn:string;
    @Input() sessionHighReturn:string;
    @Input() greenWidth:string;
    @Input() redWidth:string;
    @Input() totalWidth:string;
    @Input() openPriceLeft:string;
    @Input() lastPriceLeft:string;
    
  constructor() { }

  ngOnInit() {
  }

}
