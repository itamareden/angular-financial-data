import { Component, OnInit, Input } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'arrow-icon',
  templateUrl: './arrow-icon.component.html',
  styleUrls: ['./arrow-icon.component.css']
})
export class ArrowIconComponent implements OnInit {

    @Input() arrowColor;
    @Input() direction;
    safeTransform;
    
    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit() {
        if(!this.arrowColor) this.arrowColor='black'
        this.convertDirectionToDegrees();
    }
    
    convertDirectionToDegrees(){
        if(this.direction=='up') this.safeTransform=this.sanitizer.bypassSecurityTrustStyle('rotate(0deg)');
        else if(this.direction=='down') this.safeTransform=this.sanitizer.bypassSecurityTrustStyle('rotate(180deg)');
        else if(this.direction=='left') this.safeTransform=this.sanitizer.bypassSecurityTrustStyle('rotate(270deg)');
        else this.safeTransform=this.sanitizer.bypassSecurityTrustStyle('rotate(90deg)');
    }
    
}
