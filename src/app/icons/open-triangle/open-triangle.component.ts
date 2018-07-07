import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'open-triangle',
  templateUrl: './open-triangle.component.html',
  styleUrls: ['./open-triangle.component.css']
})
export class OpenTriangleComponent implements OnInit {

    @Input() outerTriangleColor;
    @Input() innerTriangleColor;
    
  constructor() { }

  ngOnInit() {
      // set default values...
      if(!this.outerTriangleColor) this.outerTriangleColor='black'
      if(!this.innerTriangleColor) this.innerTriangleColor='white'
  }

}
