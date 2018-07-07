import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'x-icon',
  templateUrl: './x-icon.component.html',
  styleUrls: ['./x-icon.component.css']
})
export class XIconComponent implements OnInit {
        
    @Input() squareBackground;
    @Input() xBackground;
    @Input() borderColor;

    constructor() { }

    ngOnInit() {
        if(!this.squareBackground) this.squareBackground = 'red'
        if(!this.xBackground) this.xBackground = 'white'
    }

}
