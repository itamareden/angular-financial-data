import { Directive, OnInit, ElementRef, HostListener,Input, Output, EventEmitter} from '@angular/core';
import { DatesService } from '../services/dates.service';

@Directive({
  selector: '[dateValidator]',
//  exportAs: "validator"
})
export class DateValidatorDirective implements OnInit {
        
    @Input() callback;
    @Output() onStateChange  = new EventEmitter();
    private elm: HTMLInputElement;
    private isValid = false;
    private isDayMonthCombinationValid = true;
    private isDayValid = true;
    private oldState: string;

    constructor(private elmRef: ElementRef, private dates: DatesService) { 
        this.elm = this.elmRef.nativeElement;  
    }
    
     ngOnInit() {}

    @HostListener("keyup", ["$event.target.value"])
    onKeyup(value) {
        let newState = this.checkState(value);
        if(newState != this.oldState){
            this.oldState = newState;
            this.onStateChange.emit({
                value: {
                    "newState": newState,
                    "element": this.elm
                }    
            })
        }
    }
    
    @HostListener("focus", ["$event.target.value"])
    onFocus(value) {
        this.oldState = this.checkState(value);
    }
    
    checkState(value: string): string{
        let state = "";
        if(!this.isDatePatternValid(value) || !this.isDateCombinationValid(value)){  // only if counter equals 0 it is valid
            state = "error";
        }
        else if(value.length == 10){
            if( !this.callback || (typeof this.callback == "function" && this.callback(value)) ){
                state = "valid";
            }
            else{
                state = "callbackInvalid";
            }
        } 
        else{
            state = "partialValid";    
        }
        return state;
    }
    
    isDatePatternValid(value: string):boolean{
        let match = value.match(/([0-3])?([0-9])?(\/)?([0-1])?([0-9])?(\/)?(\d)?(\d)?(\d)?(\d)?/);
        let inputLength, counter;
        inputLength = counter = match ? match.input.length : null;
        if(!!inputLength){
            for(let i=1; i <= inputLength; i++){
                if(!!match[i]) counter--;
            }    
        }
        return !counter;
    }
    
    isDateCombinationValid(value: string): boolean{
        if(value.length == 10){
            return this.checkDayMonthYearValidity(value);
        }
        else if(value.length > 5){
            return this.isDayMonthCombinationValid;
        } 
        else if(value.length == 5){
            return this.checkDayMonthValidity(value);
        }
        else if(value.length >= 2){
            return this.checkDayValidity(value);
        }
        else return true;
    }
    
    checkDayValidity(value: string){
        let day = Number(value[0] + value[1]);
        if(day > 31 || day == 0){
            this.isDayValid = false;
            return false;                
        }
        this.isDayValid = true;
        return true;
    }
    
    checkDayMonthValidity(value){
        if(this.isDayValid){
            let day = Number(value[0] + value[1]);
            let month = Number(value[3] + value[4]);
            let maxDayValue = this.dates.getMaxDaysInMonth(month);
            if(day > maxDayValue){
                this.isDayMonthCombinationValid = false;
                return false;
            }
            else{
                this.isDayMonthCombinationValid = true;
                return true;    
            }
        }
        this.isDayMonthCombinationValid = false;
        return false;
    }
    
    checkDayMonthYearValidity(value){
        if(this.isDayMonthCombinationValid){
            let day = Number(value[0] + value[1]);
            let month = Number(value[3] + value[4]);
            let year = Number(value[6] + value[7] + value[8] + value[9]);
            let maxDayValue = this.dates.getMaxDaysInMonth(month, year);
            if(day > maxDayValue) return false;
            else return true;
        }
        return false;
    }
    
    
    

}
