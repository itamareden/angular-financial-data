import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {DateValidatorDirective} from '../directives/date-validator.directive';
import {DateObject} from '../classes/date-object';
import {DateInMatrix} from '../classes/date-in-matrix';
import { DatesService } from '../services/dates.service';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'calendar-table',
  templateUrl: './calendar-table.component.html',
  styleUrls: ['./calendar-table.component.css'],
//  directives:['DateValidatorDirective'],
})
export class CalendarTableComponent implements OnInit {
        
    @Input() calendarConfig: CalendarConfig;
    mainContainerWidth: number;
    leftFrameMonthName: string;
    leftFrameYear: number;
    leftFrameMatrix: DateInMatrix[][];
    rightFrameMonthName: string;
    rightFrameYear: number;
    rightFrameMatrix: DateInMatrix[][];
    activeColor: string;
    monthInit: number; 
    yearInit: number;
    chosenDates = {startDate: null, endDate: null};
    inputStartDate: string ="";
    inputEndDate: string ="";
    startDateInputBorderColor: string;
    endDateInputBorderColor: string;
    defaultInputBorderColor = "1px solid #c4bebe";
    
   @Output()  onXButtonClick = new EventEmitter();
   @Output()  onApplyButtonClick = new EventEmitter();

  constructor(private dates: DatesService) { }

  ngOnInit() {
      if( !this.calendarConfig || !(this.calendarConfig instanceof CalendarConfig)){
          this.closeCalendar();
          return;
      }
      
      this.mainContainerWidth = this.calendarConfig.isCustomDates ? 703 : 522;
      let date = new Date();
      let currentYear = date.getFullYear();
      let currentMonth = date.getMonth() + 1;
      this.setCalendar(currentMonth, currentYear);
  }
    
    
    calculateMonthMatrix(month:number, year:number):DateInMatrix[][]{
        let monthMatrix = [];
        let numberOfdaysInMonth = this.dates.getNumberOfDaysInMonth(month, year);
        let currentDayInMonth = 1;
        let currentDayInWeek = this.dates.calculateDate(1, month, year);
        let monthFinished = false;
        while(!monthFinished){
            let fullWeekArr = [];
            let weekFinished = false;
            while(!weekFinished && !monthFinished){
                let dayInWeek = this.dates.getDayAsWord(currentDayInWeek);
                let dateInMatrixObj = new DateInMatrix(currentDayInMonth, month, year, dayInWeek, false, false);
                if(this.isDayActive(dateInMatrixObj)){
                    dateInMatrixObj.isActive = true;                    
                }
                fullWeekArr.push(dateInMatrixObj);
                if(currentDayInWeek == 0 /* i.e. Saturday*/) weekFinished = true;
                currentDayInWeek = (currentDayInWeek + 1) % 7;
                currentDayInMonth++;
                if(currentDayInMonth > numberOfdaysInMonth) monthFinished =true;
            }
            monthMatrix.push(fullWeekArr);
        }
        this.fillMonthMatrix(monthMatrix, month, year);
        return monthMatrix;
    }
    
    fillMonthMatrix(monthMatrix:DateInMatrix[][], month:number, year:number):DateInMatrix[][]{
        let firstWeek = monthMatrix[0];
        let lastWeek = monthMatrix[monthMatrix.length-1];
        if(firstWeek.length < 7){
            let currentDayInWeek = 7 - firstWeek.length;
            let currentDayInLastMonth = month == 1 ? 31 : this.dates.getNumberOfDaysInMonth(--month, year);
            for(let i=currentDayInWeek; i>0; i--){
                let dayInWeek = this.dates.getDayAsWord(currentDayInWeek);
                let dateInMatrixObj = new DateInMatrix(currentDayInLastMonth, month, year, dayInWeek, false, false);
                firstWeek.splice(0, 0, dateInMatrixObj);
                currentDayInWeek--;
                currentDayInLastMonth--;
            }
        }
        if(lastWeek.length < 7){
            let currentDayInWeek = lastWeek.length + 1;
            let currentDayInNextMonth = 1;
            for(let i=currentDayInWeek; i<=7; i++){
                let dayInWeek = this.dates.getDayAsWord(currentDayInWeek);
                let dateInMatrixObj = new DateInMatrix(currentDayInNextMonth, month, year, dayInWeek, false, false);
                lastWeek.push(dateInMatrixObj);
                currentDayInWeek = (currentDayInWeek + 1) % 7;
                currentDayInNextMonth++;
            }
        }
        return monthMatrix;
    }
    
    setCalendar(month:number, year:number){
        if(month > 13 || month < 0 || month == NaN) return;
        if(month == 0){
            month = 12;
            year--;    
        }
        else if(month == 13){
            month = 1;    
            year++;
        }
        this.monthInit = month;
        this.yearInit = year;
        let leftFrameMonth;
        let rightFrameMonth;
        if(this.calendarConfig.currentMonthSide != 'right'){
            leftFrameMonth = month;
            rightFrameMonth = (month +1) % 12;
            this.leftFrameMonthName = this.dates.getMonthName(leftFrameMonth);
            this.rightFrameMonthName = this.dates.getMonthName(rightFrameMonth);
            this.leftFrameYear = year;
            this.rightFrameYear = month == 12 ? year + 1 : year;
        }
        else{
            rightFrameMonth = month;
            leftFrameMonth = month != 1 ? month - 1 : 12;
            this.leftFrameMonthName = this.dates.getMonthName(leftFrameMonth);
            this.rightFrameMonthName = this.dates.getMonthName(rightFrameMonth);
            this.rightFrameYear = year;
            this.leftFrameYear = month != 1 ? year : year -1;
        }
        this.leftFrameMatrix = this.calculateMonthMatrix(leftFrameMonth,this.leftFrameYear);
        this.rightFrameMatrix = this.calculateMonthMatrix(rightFrameMonth,this.rightFrameYear);
        this.markChosenDaysInMatrix(this.chosenDates.startDate, this.chosenDates.endDate);
    }
    
    
    getDateObjFromMonthMatrix(dateObj: DateObject){
        let relevantMonthMatrix = null;
        /*  we use matrix[3][1] because it is somewhat the middle of the month and so the date is definitely from the 
            relevant month and not an inactive date from previous/next month  */
        if(this.leftFrameMatrix[3][1]["month"] == dateObj["month"] && this.leftFrameMatrix[3][1]["year"] == dateObj["year"]){
            relevantMonthMatrix = this.leftFrameMatrix;
        }
        else if(this.rightFrameMatrix[3][1]["month"] == dateObj["month"] && this.rightFrameMatrix[3][1]["year"] == dateObj["year"]){
            relevantMonthMatrix = this.rightFrameMatrix;
        }
        if(relevantMonthMatrix){
            let dateObjPositionInMatrix;
            if(relevantMonthMatrix[0][0]["day"] == 1){
                /*  if the 1st of the month is sunday then we don't need to take into account the days of the prior month, 
                which is what we do in the "else" part  */
                dateObjPositionInMatrix = dateObj["day"] - 1;
            }
            else{
                let priorMonth = dateObj["month"] - 1 > 0 ? dateObj["month"] - 1 : 12; 
                let priorMonthNumberOfDays = this.dates.getNumberOfDaysInMonth(priorMonth, dateObj["year"]);
                dateObjPositionInMatrix = (priorMonthNumberOfDays - relevantMonthMatrix[0][0]["day"]) + dateObj["day"];
            }
            let firstArrIndex = (dateObjPositionInMatrix - (dateObjPositionInMatrix % 7)) / 7;
            let secondArrIndex = dateObjPositionInMatrix % 7;
            return relevantMonthMatrix[firstArrIndex][secondArrIndex];
        }
        else{
            return null;    
        }
    }

    closeCalendar(): void {
         this.onXButtonClick.emit({
             value: true
         });
    }
    
    sendDatesToParent(): void {
         this.onApplyButtonClick.emit({
             value: this.chosenDates
         });
        this.closeCalendar();
    }
    
    setDateClass(date: DateInMatrix):string{
        if(date == undefined) return null;
        else if(date.isChosen) return "chosen-day";
        else if(date.isActive) return "active-day";
        else return "inactive-day";
    }
    
    checkStartDate(e){
        let newState = e.value.newState; 
        if(newState == 'error' || newState == 'partialValid' || newState == 'callbackInvalid'){
            if(newState == 'partialValid'){
                this.startDateInputBorderColor = this.defaultInputBorderColor;
            }
            else{
                this.startDateInputBorderColor = "1px solid red";
                if(newState == 'callbackInvalid'){
                    let dateObj = this.dates.convertStringToDateObj(this.inputStartDate);
                    this.setCalendar(dateObj.month, dateObj.year); 
                }
            }
            this.chosenDates.startDate = null;
            this.unmarkChosenDays(this.chosenDates.endDate);    // unmark all dates except endDate (if it's not null)
        }
        else if(newState == 'valid'){
            this.chosenDates.startDate = this.dates.convertStringToDateObj(this.inputStartDate);
            this.startDateInputBorderColor = this.defaultInputBorderColor;
            this.alignChosenDates();
            if(this.calendarConfig.currentMonthSide == "left"){
                this.setCalendar(this.chosenDates.startDate.month, this.chosenDates.startDate.year);    
            }
            else{
                /* so that the start date will be on the left side  */
                this.setCalendar(this.chosenDates.startDate.month + 1, this.chosenDates.startDate.year);
            }
            this.markChosenDaysInMatrix(this.chosenDates.startDate, this.chosenDates.endDate);
        }
    }

    checkEndDate(e){
        let newState = e.value.newState; 
        if(newState == 'error' || newState == 'partialValid' || newState == 'callbackInvalid'){
            if(newState == 'partialValid'){
                this.endDateInputBorderColor = this.defaultInputBorderColor;
            }
            else{
                this.endDateInputBorderColor = "1px solid red";
                if(newState == 'callbackInvalid'){
                    let dateObj = this.dates.convertStringToDateObj(this.inputEndDate);
                    this.setCalendar(dateObj.month, dateObj.year); 
                }
            }
            this.chosenDates.endDate = null;
            this.unmarkChosenDays(this.chosenDates.startDate);    // unmark all dates except endDate (if it's not null)
        }
        else if(newState == 'valid'){
            this.chosenDates.endDate = this.dates.convertStringToDateObj(this.inputEndDate);
            this.endDateInputBorderColor = this.defaultInputBorderColor;
            this.alignChosenDates();
            if(this.calendarConfig.currentMonthSide == "right"){
                this.setCalendar(this.chosenDates.endDate.month, this.chosenDates.endDate.year);    
            }
            else{
                /* so that the end date will be on the right side  */
                this.setCalendar(this.chosenDates.endDate.month - 1, this.chosenDates.endDate.year);
            }
            this.markChosenDaysInMatrix(this.chosenDates.startDate, this.chosenDates.endDate);
        }
    }
    
    
    manageChoosingDates(dateObj: DateInMatrix){
        /* if we already chose a start date, this click will process the endDate. if there's already an endDate => override it */
        if(this.chosenDates.startDate){ 
            if(this.chosenDates.endDate){
                this.chosenDates.endDate.day = dateObj.day;
                this.chosenDates.endDate.month = dateObj.month;
                this.chosenDates.endDate.year = dateObj.year;
            }
            else{
                this.chosenDates.endDate = new DateObject(dateObj.day, dateObj.month, dateObj.year);                
            }    
            this.inputEndDate = this.dates.convertDateObjToString(this.chosenDates.endDate);
            this.alignChosenDates();
            this.markChosenDaysInMatrix(this.chosenDates.startDate, this.chosenDates.endDate);
        }
        else{
            this.chosenDates.startDate = new DateObject(dateObj.day, dateObj.month, dateObj.year);
            if(this.chosenDates.endDate){
                /*  if there's already an endDate, act accordingly */
                this.alignChosenDates();
                this.markChosenDaysInMatrix(this.chosenDates.startDate, this.chosenDates.endDate);
            }
            else{
                /*  if there isn't already an endDate, just mark this dateObj */
                dateObj.isChosen = true;
            }
            if(this.calendarConfig.isCustomDates){
                this.inputStartDate = this.dates.convertDateObjToString(this.chosenDates.startDate);
                this.startDateInputBorderColor = this.defaultInputBorderColor;
            }
        }
    }
    
    markChosenDaysInMatrix(startDate: DateInMatrix, endDate: DateInMatrix){
        if(startDate && endDate){
            for(let i=0; i<2; i++){
                let Month = i == 0 ? this.leftFrameMatrix : this.rightFrameMatrix;
                for(let week of Month){
                   for(let day of week){
                       let date = day;
                       if(date.isActive && this.dates.isDateLaterThan(date, startDate) && 
                          this.dates.isDatePriorTo(date, endDate)){
                            date.isChosen = true;                   
                       }
                       else{
                            date.isChosen = false;    
                       }
                   }
                }
            }
        }
        else if(startDate || endDate){
            let relevantDateObj = startDate ? startDate : endDate;
            let newDateObj = this.getDateObjFromMonthMatrix(relevantDateObj);
            newDateObj && newDateObj.isActive ? newDateObj.isChosen = true : null;
        }
    }
    
    
    unmarkChosenDays(dateToIgnore?: DateObject){  
        /*  after this function gets called, there can only be one (at most) date still mark as chosen. that is the role of 
            dateToIgnore argument      */
        for(let i=0; i<2; i++){
            let Month = i == 0 ? this.leftFrameMatrix : this.rightFrameMatrix;
            for(let week of Month){
               for(let day of week){
                   let date = day;
                   if(date.isChosen && !this.dates.isDatesEqual(date, dateToIgnore)){
                        date.isChosen = false;                   
                   }
               }
            }
        }
    }
    
    alignChosenDates(){
        if(this.dates.isDateLaterThan(this.chosenDates.startDate, this.chosenDates.endDate)){
            let tempDateObj = this.chosenDates.endDate;
            this.chosenDates.endDate = this.chosenDates.startDate;
            this.chosenDates.startDate = tempDateObj;
            this.inputStartDate = this.dates.convertDateObjToString(this.chosenDates.startDate);
            this.inputEndDate = this.dates.convertDateObjToString(this.chosenDates.endDate);
        }    
    }
    
    isDayActive(dateObj: DateObject){
        if(!this.calendarConfig.inactiveDays || (!this.calendarConfig.inactiveDays.priorTo && !this.calendarConfig.inactiveDays.laterThan)){
            return true;    
        } 
        let priorToDate = this.calendarConfig.inactiveDays.priorTo;
        let laterThanDate = this.calendarConfig.inactiveDays.laterThan;
        if(priorToDate && laterThanDate){
            if(this.dates.isDatePriorTo(laterThanDate, priorToDate)){
                return !(this.dates.isDatePriorTo(dateObj, priorToDate) && this.dates.isDateLaterThan(dateObj, laterThanDate));
            }
            else{
                return !(this.dates.isDatePriorTo(dateObj, priorToDate) || this.dates.isDateLaterThan(dateObj, laterThanDate));
            }
        }
        else if(priorToDate){
            return !this.dates.isDatePriorTo(dateObj, priorToDate);
        }
        else if(laterThanDate){
            return !this.dates.isDateLaterThan(dateObj, laterThanDate);
        }
        return true;    
    }
    
    
    isDisableApplyButton(){
        /*  enable: if both are defined or if one is defined and the other is empty. otherwise disable... */
        return !((this.chosenDates.startDate && this.chosenDates.endDate) ||    
                 (this.chosenDates.startDate && this.inputEndDate.length == 0) ||  
                 (this.chosenDates.endDate && this.inputStartDate.length == 0));
    }
    
    setApplyButtonColor(){
        if(this.isDisableApplyButton()) return "white";
        else return this.calendarConfig.color;  
    }
    
    isDisableClearButton(){
        return !(this.chosenDates.startDate || this.chosenDates.endDate || this.inputStartDate.length > 0 || this.inputEndDate.length > 0);   
    }
    
    setClearButtonColor(){
        if(this.isDisableClearButton()) return "white";
        else return this.calendarConfig.color;    
    }
    
    clearChosenDates(){
        this.chosenDates.startDate = null;
        this.chosenDates.endDate = null;
        this.inputStartDate = "";
        this.inputEndDate = "";
        this.unmarkChosenDays();
        this.startDateInputBorderColor = this.endDateInputBorderColor = this.defaultInputBorderColor;    
    }
    
    
}


/*   class to use for configuring this component   */
export class CalendarConfig {
    private _color: string;
    private _brightenedColor: string;
    private _currentMonthSide: string;
    private _inactiveDays = {laterThan: null, priorTo: null};
    private _isCustomDates: boolean;
    private _isDateValidCallback: Function;
    private _utils = new UtilsService();
     
    constructor(color: string, monthSide: string, inactiveDays: any, isCustomDays: boolean, callback: Function){
        this._color = color ? color : '#299b8e';
        this._brightenedColor = this._utils.brightenColor(this.color, 1.2);
        this._currentMonthSide = monthSide == 'left' ? 'left' : 'right';
        this._isCustomDates = isCustomDays;
        this._isDateValidCallback = callback;
        if(inactiveDays){
            if(inactiveDays.laterThan && inactiveDays.laterThan instanceof DateObject){
                this._inactiveDays.laterThan = inactiveDays.laterThan;
            }
            if(inactiveDays.priorTo && inactiveDays.priorTo instanceof DateObject){
                this._inactiveDays.priorTo = inactiveDays.priorTo;
            }
        } 
    }
    
    get color(): string{
        return this._color;    
    }
    
    get brightenedColor(): string{
        return this._brightenedColor;    
    }
    
    get currentMonthSide(): string{
        return this._currentMonthSide;    
    }
    
    get inactiveDays(): any{
        return this._inactiveDays;    
    }
    
    get isCustomDates(): boolean{
        return this._isCustomDates;    
    }
    
    get isDateValidCallback(): Function{
        return this._isDateValidCallback;    
    }

}
