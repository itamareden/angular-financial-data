import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Component({
  selector: 'market-headlines',
  templateUrl: './market-headlines.component.html',
  styleUrls: ['./market-headlines.component.css']
})
export class MarketHeadlinesComponent implements OnInit {
        
    observable: Observable<any>;
    zerohedgeArticles = [];
    bloombergCurrencies = [];
    bloombergCommodities = [];
    bloombergFixedIncome = [];
    bloombergTopicsArr = [this.bloombergCurrencies, this.bloombergCommodities, this.bloombergFixedIncome];
    bloombergTopicNames = ['Currencies','Commodities','Fixed Income'];
    isZerohedge = true;
    isBloomberg = false;

    constructor(private http : Http) { }

    ngOnInit() {
        this.getSiteHeadlines('https://www.zerohedge.com/',this.mapZerohedge, this.zerohedgeArticles);
        this.getSiteHeadlines('https://www.bloomberg.com/markets/currencies',this.mapBloombergHeadlines, this.bloombergCurrencies);
        this.getSiteHeadlines('https://www.bloomberg.com/markets/commodities',this.mapBloombergHeadlines, this.bloombergCommodities);
        this.getSiteHeadlines('https://www.bloomberg.com/markets/rates-bonds',this.mapBloombergHeadlines, this.bloombergFixedIncome);
    }
    
    getSiteHeadlines(URL, callback, articlesContainer){
        let urlForProxy='https://cors-anywhere.herokuapp.com/';   // for overcoming CORS issues
        let observable: Observable<any> = this.http.get(urlForProxy+URL).map(callback);
        observable.subscribe(articlesList => {
            articlesList.forEach(function(article){articlesContainer.push(article)});
        });
    }
    
    
    mapZerohedge(Response){
        let baseURL = 'https://www.zerohedge.com';
        let articlesList = [];
        let rawHTML = Response['_body'];
        let HTMLBodyAsString = rawHTML.match(/<body[^>]*>(([\S\s]?)(?!<\/body>))*\W*<\/body>/g)[0];
        let domContainer = document.createElement('div');
        domContainer.innerHTML = HTMLBodyAsString.trim()      // trim() => remove whitespace from both sides of a string
        let articlessArr = domContainer.querySelectorAll('#block-zerohedge-content article[role="article"]');
        for(let i=0; i<articlessArr.length; i++){
            let articleContainer = articlessArr[i];
            let headlineElm = <HTMLElement> articleContainer.querySelector('.teaser-title span');
            let headline = headlineElm ? headlineElm.innerText : null;
            if(headline.toLowerCase().indexOf('frontrunning') == 0) continue;   // because the daily frontrunning is built different.
            let a = articleContainer.querySelector('.teaser-title a');
            let aHref = a ? (baseURL + a.getAttribute('href')) : null;
            let teaserElm = <HTMLElement> articleContainer.querySelector('.teaser-text p');
            let teaser = teaserElm ? teaserElm.innerText : null; 
            let teaserImg = articleContainer.querySelector('.teaser-image img');
            let teaserImgSrc = teaserImg ? ( baseURL + teaserImg.getAttribute('src').trim()) : null;
            let publishDateElm = <HTMLElement> articleContainer.querySelector('footer li.extras__created');
            let publishDate = publishDateElm ? publishDateElm.innerText : null;
            let article = {
                headline: headline,
                aHref: aHref,
                teaser: teaser,
                teaserImgSrc: teaserImgSrc,
                publishDate: publishDate,
            }
            articlesList.push(article); 
        }
        return articlesList;
    }
    
    mapBloombergHeadlines(Response){
        let articlesList = [];
        let rawHTML = Response['_body'];
        let HTMLBodyAsString = rawHTML.match(/<body[^>]*>(([\S\s]?)(?!<\/body>))*\W*<\/body>/g)[0];
        let domContainer = document.createElement('div');
        domContainer.innerHTML = HTMLBodyAsString.trim()      // trim() => remove whitespace from both sides of a string
        let articlessArr = domContainer.querySelectorAll('.section-front__side-bar-news .news-story');
        for(let i=0; i<articlessArr.length; i++){
            let articleContainer = articlessArr[i];
            let headlineElm = <HTMLElement> articleContainer.querySelector('.news-story__headline a');
            let headline = headlineElm ? headlineElm.innerText : null;
            let a = articleContainer.querySelector('.news-story__headline a');
            let aHref = a ? a.getAttribute('href') : null;
            let publishDateElm = <HTMLElement> articleContainer.querySelector('.news-story .news-story__published-at');
            let publishDate = publishDateElm ? publishDateElm.innerText : null;
            let article = {
                headline: headline,
                aHref: aHref,
                publishDate: publishDate,
            }
            articlesList.push(article); 
        }
        return articlesList;
    }
    
    
    switchProvider(event){
        let provider = event.target.innerHTML;
        if(provider.toLowerCase() == 'bloomberg'){
            this.isBloomberg = true;
            this.isZerohedge = false;
        }
        else if(provider.toLowerCase() == 'zerohedge'){
            this.isZerohedge = true;
            this.isBloomberg = false;
        }
    }
    

}
