import { Injectable } from '@angular/core';
import {DateObject} from '../classes/date-object';

@Injectable()
export class DatesService {

  constructor() { }
    
    
    getDayAsWord(day:number):string{
        switch (day) {
            case 1:
                return "Sunday";
            case 2:
                return "Monday";
            case 3:
                return "Tuesday";
            case 4:
                return "Wednesday";
            case 5:
                return "Thursday";
            case 6:
                return "Friday";
            case 0:
                return "Saturday";
        }
    }
    
    getMonthName(month:number):string{
        switch (month) {
            case 1:
                return "January";
            case 2:
                return "February";
            case 3:
                return "March";
            case 4:
                return "April";
            case 5:
                return "May";
            case 6:
                return "June";
            case 7:
                return "July";
            case 8:
                return "August";
            case 9:
                return "September";
            case 10:
                return "October";
            case 11:
                return "November";
            case 12:
                return "December";
        }
    }
    
    isLeapYear(year:number):boolean{
        if(year % 4 != 0) return false;
        else if(year % 100 != 0) return true;
        else if(year % 400 != 0) return false;
        else return true;
    }
    
    getNumberOfDaysInMonth(month:number, year?:number):number{
        switch (month) {
            case 1:
                return 31;
            case 2:
                if(year && this.isLeapYear(year)) return 29;
                else return 28;
            case 3:
                return 31;
            case 4:
                return 30;
            case 5:
                return 31;
            case 6:
                return 30;
            case 7:
                return 31;
            case 8:
                return 31;
            case 9:
                return 30;
            case 10:
                return 31;
            case 11:
                return 30;
            case 12:
                return 31;
        }
    }
    
    getMonthCode(month:number):number{
        switch (month) {
            case 1:
                return 1;
            case 2:
                return 4;
            case 3:
                return 4;
            case 4:
                return 0;
            case 5:
                return 2;
            case 6:
                return 5;
            case 7:
                return 0;
            case 8:
                return 3;
            case 9:
                return 6;
            case 10:
                return 1;
            case 11:
                return 4;
            case 12:
                return 6;
        }
    }
    
    /* if the year is a leap year then this functions return the code that takes it into account, therefore if the date is before February
       then we need to subtract 1 from the year code */
    calculateYearCode(year:number):number{    
        let codeWithoutLeap = year -1;     // subtract 1 because in the first year the code was 0 so 1-1=0.
        let leapYears = Math.floor(year / 4) + Math.floor(year / 400) - Math.floor(year / 100);
        return (codeWithoutLeap + leapYears) % 7;
    }
    
    calculateDate(day:number, month:number, year:number):number{
        let monthCode = this.getMonthCode(month);
        let yearCode = this.calculateYearCode(year);
        if(this.isLeapYear(year) && month < 3){
            yearCode--;    
        }
        let result = (day + monthCode + yearCode) % 7;
        return result;
    }
    
    getMaxDaysInMonth(month: number, year?: number) :number{
        let maxDayValue;
        let monthsWith31Days = [1,3,5,7,8,10,12];
        let monthsWith30Days = [4,6,9,11];
        if(typeof year == 'number' && month == 2){
            if(this.isLeapYear(year)) maxDayValue = 29;  
            else maxDayValue = 28;  
        }
        else{
            maxDayValue = monthsWith31Days.indexOf(month) > -1 ? 31 : monthsWith30Days.indexOf(month) > -1 ? 30 : 29;    
        }
        return maxDayValue;
    }
    
    convertStringToDateObj(dateStr: string, dateObj?: DateObject) : DateObject{
        if(/[0-3][0-9]\/[0-1][0-9]\/\d{4}/.test(dateStr)){
            let day = Number(dateStr.substring(0,2));
            let month = Number(dateStr.substring(3,5));
            let year = Number(dateStr.substring(6,10));
            if(dateObj){
                dateObj.day = day;
                dateObj.month = month;
                dateObj.year = year;    
            }
            else{
                dateObj = new DateObject(day, month, year);
            }
            return dateObj;
        }
        else{
            return null;    
        }
    }
    
    convertDateObjToString(dateObj: DateObject): string{
        if(dateObj == null) return "";
        let day = dateObj.day >= 10 ? dateObj.day : "0" + dateObj.day;
        let month = dateObj.month >= 10 ? dateObj.month : "0" + dateObj.month;
        return  day + "/" + month + "/" + dateObj.year;
    }
    
    isDatesEqual(firstDate: DateObject, secondDate: DateObject){
        if(firstDate && secondDate){
            if(firstDate.year == secondDate.year && firstDate.month == secondDate.month && firstDate.day == secondDate.day){
                return true;
            }
            return false;
        }
        return false;
    }
    
    isDateLaterThan(firstDate: DateObject, secondDate: DateObject){
        if(firstDate && secondDate){
            if(firstDate.year > secondDate.year){
                return true;
            }
            else if(firstDate.year < secondDate.year){
                return false;
            }
            else if(firstDate.month > secondDate.month){
                return true;
            }  
            else if(firstDate.month < secondDate.month){
                return false;
            } 
            else if(firstDate.day >= secondDate.day){
                return true;
            } 
            return false;
        }
        return false;
    }
    
    isDatePriorTo(firstDate: DateObject, secondDate: DateObject){
        if(firstDate && secondDate){
            if(firstDate.year < secondDate.year){
                return true;
            }
            else if(firstDate.year > secondDate.year){
                return false;
            }
            else if(firstDate.month < secondDate.month){
                return true;
            }  
            else if(firstDate.month > secondDate.month){
                return false;
            } 
            else if(firstDate.day <= secondDate.day){
                return true;
            } 
            return false;
        }
        return false;
    }
    
    

}
