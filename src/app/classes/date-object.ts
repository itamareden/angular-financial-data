export class DateObject {
    
    private _day: number;
    private _month: number;
    private _year: number;
    
    constructor(day: number, month: number, year: number){
        this._day = day;
        this._month = month;
        this._year = year;    
    }
    
    get day(): number{
        return this._day;    
    }
    
    set day(newDay: number){
        this._day = newDay;    
    }
    
    get month(): number{
        return this._month;    
    }
    
    set month(newMonth: number){
        this._month = newMonth;    
    }
    
    get year(): number{
        return this._year;    
    }
    
    set year(newYear: number){
        this._year = newYear;    
    }
}
