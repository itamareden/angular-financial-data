import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.css']
})
export class PageHeaderComponent implements OnInit {

    @Input() isMainPage;
    isShowMenu:boolean=false;
    
  constructor() { }

  ngOnInit() {
  }
    
    toggleMenu():void{      // depends on the size of the window..
        
        if(this.isShowMenu){
                this.isShowMenu=false;
            }else{
                this.isShowMenu=true;
            }
        
        }

}
