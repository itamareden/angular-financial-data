import {DateObject} from './date-object';


export class DateInMatrix extends DateObject {
    
    private _dayInWeek: string;
    private _isActive: boolean;
    private _isChosen: boolean;
    
    constructor(day: number, month: number, year: number, dayInWeek: string, isActive: boolean, isChosen: boolean){
        super(day, month, year);
        this._dayInWeek = dayInWeek; 
        this._isActive = isActive;
        this._isChosen = isChosen;  
    }
    
    get dayInWeek(): string{
        return this._dayInWeek;    
    }
    
    set dayInWeek(newDayInWeek: string){
        this._dayInWeek = newDayInWeek;    
    }
    
    get isActive(): boolean{
        return this._isActive;    
    }
    
    set isActive(newIsActive: boolean){
        this._isActive = newIsActive;    
    }
    
    get isChosen(): boolean{
        return this._isChosen;    
    }
    
    set isChosen(newIsChosen: boolean){
        this._isChosen = newIsChosen;    
    }
}
