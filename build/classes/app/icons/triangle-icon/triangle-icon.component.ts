import { Component, OnInit, Input } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'triangle-icon',
  templateUrl: './triangle-icon.component.html',
  styleUrls: ['./triangle-icon.component.css']
})
export class TriangleIconComponent implements OnInit {

    @Input() triangleColor;
    @Input() direction;
    safeTransform;
    borderWidth;
    borderColor;
    
    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit() {
        // set default values...
        if(!this.triangleColor) this.triangleColor = 'black'
        if(!this.direction) this.direction = 'up';
        this.setBorderWidthAndColor();
    }
    
    generateSafeTransform(){   // must use the DomSanitizer here otherwise [style.transform] won't work
        let degrees = 90;
        this.safeTransform = this.sanitizer.bypassSecurityTrustStyle('rotate('+degrees+'deg)');
        return this.safeTransform;
    }
    
    setBorderWidthAndColor(){
        switch(this.direction){
            case 'up' : 
                this.borderWidth = '0 2em 3em 2em'; 
                this.borderColor = 'transparent transparent ' + this.triangleColor + ' transparent';
                break;
            case 'right' : 
                this.borderWidth = '2em 0 2em 3em'; 
                this.borderColor = 'transparent transparent transparent ' + this.triangleColor;
                break;
            case 'down' : 
                this.borderWidth = '3em 2em 0 2em'; 
                this.borderColor = this.triangleColor + ' transparent transparent transparent ';
                break;
            case 'left' : 
                this.borderWidth = '2em 3em 2em 0'; 
                this.borderColor = 'transparent ' + this.triangleColor + ' transparent transparent';
                break;
            default : 
                this.direction = "up";
                return this.setBorderWidthAndColor();
        }
        
    }

}