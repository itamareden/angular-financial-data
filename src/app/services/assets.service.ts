import { Injectable } from '@angular/core';
import { Asset } from '../asset';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


const ASSETS : Asset[] = [
        { "id":1, "symbol":"IBM", "name":"Ibm", "nameToShow":"IBM", "type":"Stock" },
        { "id":2, "symbol":"INTC", "name":"Intel", "nameToShow":"Intel", "type":"Stock" },
        { "id":3, "symbol":"AAPL", "name":"Apple", "nameToShow":"Apple", "type":"Stock" },
        { "id":4, "symbol":"AMZN", "name":"Amazon", "nameToShow":"Amazon", "type":"Stock" },
        { "id":5, "symbol":"^XAGUSD", "name":"Silver", "nameToShow":"Silver", "type":"Commodity" },
        { "id":6, "symbol":"^XAUUSD", "name":"Gold", "nameToShow":"Gold", "type":"Commodity" },
        { "id":7, "symbol":"HGH18", "name":"Copper", "nameToShow":"Copper", "type":"Commodity", "digitsAfterDecimalPoint":3 },
        { "id":8, "symbol":"CLH18", "name":"Crude oil", "nameToShow":"Crude oil", "type":"Commodity" },
        { "id":9, "symbol":"NQH18", "name":"Nasdaq 100 future", "nameToShow":"Nasdaq 100", "type":"Future" },
        { "id":10, "symbol":"EBAY", "name":"Ebay", "nameToShow":"Ebay", "type":"Stock" },
        { "id":11, "symbol":"SPY", "name":"S&p 500 spdr", "nameToShow":"S&P 500 SPDR", "type":"ETF" },
        { "id":12, "symbol":"^USDCAD", "name":"Usd/cad", "nameToShow":"USD/CAD", "type":"Currency", "digitsAfterDecimalPoint":4 },
        { "id":13, "symbol":"NLH18", "name":"Nikkei 225 future", "nameToShow":"Nikkei 225", "type":"Future" },
        { "id":14, "symbol":"QQQ", "name":"Nasdaq 100 etf", "nameToShow":"Nasdaq 100", "type":"ETF" },
        { "id":15, "symbol":"^EURUSD", "name":"Eur/usd", "nameToShow":"EUR/USD", "type":"Currency", "digitsAfterDecimalPoint":4 },
        { "id":16, "symbol":"^USDJPY", "name":"Usd/jpy", "nameToShow":"USD/JPY", "type":"Currency" },
        { "id":17, "symbol":"FB", "name":"Facebook", "nameToShow":"Facebook", "type":"Stock" },
        { "id":18, "symbol":"UVH18", "name":"Ftse 100 future", "nameToShow":"FTSE 100", "type":"Future" },
        { "id":19, "symbol":"YMH18", "name":"Dow jones future", "nameToShow":"Dow Jones", "type":"Future" },
        { "id":20, "symbol":"^AUDUSD", "name":"Aud/usd", "nameToShow":"AUD/USD", "type":"Currency", "digitsAfterDecimalPoint":4 },
        { "id":21, "symbol":"ESH18", "name":"S&p 500 future", "nameToShow":"S&P 500", "type":"Future" },
        { "id":22, "symbol":"XBI", "name":"S&p biotech spdr", "nameToShow":"S&P Biotech SPDR", "type":"ETF" },
        { "id":23, "symbol":"GOOG", "name":"Google", "nameToShow":"Google", "type":"Stock" },
        { "id":24, "symbol":"TSLA", "name":"Tesla", "nameToShow":"Tesla", "type":"Stock" },
        { "id":25, "symbol":"NFLX", "name":"Netflix", "nameToShow":"Netflix", "type":"Stock" },
        { "id":26, "symbol":"V", "name":"Visa", "nameToShow":"Visa", "type":"Stock" },
        { "id":27, "symbol":"BAC", "name":"Bank of america", "nameToShow":"Bank of America", "type":"Stock" },
        { "id":28, "symbol":"MCD", "name":"Mcdonalds", "nameToShow":"McDonald's", "type":"Stock" },
        { "id":29, "symbol":"MSFT", "name":"Microsoft", "nameToShow":"Microsoft", "type":"Stock" },
        { "id":30, "symbol":"JPM", "name":"Jpmorgan chase", "nameToShow":"JPMorgan Chase", "type":"Stock" },
        { "id":31, "symbol":"GS", "name":"Goldman sachs", "nameToShow":"Goldman Sachs", "type":"Stock" },
        { "id":32, "symbol":"HPQ", "name":"Hp", "nameToShow":"HP", "type":"Stock" },
        { "id":33, "symbol":"^USDZAR", "name":"Usd/zar", "nameToShow":"USD/ZAR", "type":"Currency","digitsAfterDecimalPoint":4 },
        { "id":34, "symbol":"^GBPUSD", "name":"Gbp/usd", "nameToShow":"GBP/USD", "type":"Currency","digitsAfterDecimalPoint":4 },
        { "id":35, "symbol":"HYG", "name":"Ishares iboxx high Yield", "nameToShow":"IShares iBoxx $ High Yield", "type":"ETF" },
        { "id":36, "symbol":"^EURJPY", "name":"Eur/jpy", "nameToShow":"EUR/JPY", "type":"Currency" },
        { "id":37, "symbol":"^GBPJPY", "name":"Gbp/jpy", "nameToShow":"GBP/JPY", "type":"Currency" },
        { "id":38, "symbol":"^USDILS", "name":"Usd/ils", "nameToShow":"USD/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":39, "symbol":"MS", "name":"Morgan stanley", "nameToShow":"Morgan Stanley", "type":"Stock"  },
        { "id":40, "symbol":"KO", "name":"Coca-cola", "nameToShow":"Coca-Cola", "type":"Stock"  },
        { "id":41, "symbol":"^EURILS", "name":"Eur/ils", "nameToShow":"EUR/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":42, "symbol":"BA", "name":"Boeing", "nameToShow":"Boeing", "type":"Stock"  },
        { "id":43, "symbol":"TWTR", "name":"Twitter", "nameToShow":"Twitter", "type":"Stock"  },
        { "id":44, "symbol":"TWX", "name":"Time warner", "nameToShow":"Time Warner", "type":"Stock"  },
        { "id":45, "symbol":"GRPN", "name":"Groupon", "nameToShow":"Groupon", "type":"Stock"  },
        { "id":46, "symbol":"C", "name":"Citigroup", "nameToShow":"Citigroup", "type":"Stock"  },
        { "id":47, "symbol":"TRH18", "name":"Iron ore 62%", "nameToShow":"Iron ore 62%", "type":"Commodity" },
        { "id":48, "symbol":"^USDMXN", "name":"Usd/mxn", "nameToShow":"USD/MXN", "type":"Currency"  },
        { "id":49, "symbol":"^USDTRY", "name":"Usd/try", "nameToShow":"USD/TRY", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":50, "symbol":"^USDBRL", "name":"Usd/brl", "nameToShow":"USD/BRL", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":51, "symbol":"^USDPLN", "name":"Usd/pln", "nameToShow":"USD/PLN", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":52, "symbol":"TLT", "name":"Treasury 20+ year bond", "nameToShow":"Treasury 20+ Year Bond", "type":"ETF"  },
        { "id":53, "symbol":"XLF", "name":"Financials spdr", "nameToShow":"Financials SPDR", "type":"ETF"  },
        { "id":54, "symbol":"TEVA", "name":"Teva", "nameToShow":"Teva", "type":"Stock"  },
        { "id":55, "symbol":"QAH18", "name":"Brent oil", "nameToShow":"Brent Oil", "type":"Commodity" },
        { "id":56, "symbol":"IYT", "name":"Dow jones Transportation etf", "nameToShow":"Dow Jones Transportation", "type":"ETF"  },
        { "id":57, "symbol":"IMIB.LS", "name":"Ftse mib etf", "nameToShow":"FTSE MIB", "type":"ETF"  },
        { "id":58, "symbol":"WMT", "name":"Walmart", "nameToShow":"Walmart", "type":"Stock"  },
        { "id":59, "symbol":"JCP", "name":"J.c.penny", "nameToShow":"J.C.Penny", "type":"Stock"  },
        { "id":60, "symbol":"WFC", "name":"Wells fargo", "nameToShow":"Wells Fargo", "type":"Stock"  },
        { "id":61, "symbol":"DPZ", "name":"Domino's pizza", "nameToShow":"Domino's Pizza", "type":"Stock"  },
        { "id":62, "symbol":"SBUX", "name":"Starbucks", "nameToShow":"Starbucks", "type":"Stock"  },
        { "id":63, "symbol":"XOM", "name":"Exxon mobil", "nameToShow":"Exxon Mobil", "type":"Stock"  },
        { "id":64, "symbol":"JNJ", "name":"Johnson & johnson", "nameToShow":"Johnson & Johnson", "type":"Stock"  },
        { "id":65, "symbol":"CAT", "name":"Caterpillar", "nameToShow":"Caterpillar", "type":"Stock"  },
        { "id":66, "symbol":"^GBPILS", "name":"Gbp/ils", "nameToShow":"GBP/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":67, "symbol":"^EURAUD", "name":"Eur/aud", "nameToShow":"EUR/AUD", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":68, "symbol":"^AUDNZD", "name":"Aud/nzd", "nameToShow":"AUD/NZD", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":69, "symbol":"^AUDILS", "name":"Aud/ils", "nameToShow":"AUD/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":70, "symbol":"^EURGBP", "name":"Eur/gbp", "nameToShow":"EUR/GBP", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":70, "symbol":"^NZDUSD", "name":"Nzd/usd", "nameToShow":"NZD/USD", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":71, "symbol":"GE", "name":"General electric", "nameToShow":"General Electric", "type":"Stock"  },
        { "id":72, "symbol":"AXP", "name":"American express", "nameToShow":"American Express", "type":"Stock"  },
        { "id":73, "symbol":"PG", "name":"Procter & gamble", "nameToShow":"Procter & Gamble", "type":"Stock"  },
        { "id":74, "symbol":"^USDHUF", "name":"Usd/huf", "nameToShow":"USD/HUF", "type":"Currency"  },
        { "id":75, "symbol":"^EURHUF", "name":"Eur/huf", "nameToShow":"EUR/HUF", "type":"Currency"  },
        { "id":76, "symbol":"^EURPLN", "name":"Eur/pln", "nameToShow":"EUR/PLN", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":77, "symbol":"^EURCHF", "name":"Eur/chf", "nameToShow":"EUR/CHF", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":78, "symbol":"^AUDJPY", "name":"Aud/jpy", "nameToShow":"AUD/JPY", "type":"Currency"  },
        { "id":79, "symbol":"^NZDJPY", "name":"Nzd/jpy", "nameToShow":"NZD/JPY", "type":"Currency"  },
        { "id":80, "symbol":"^USDSEK", "name":"Usd/sek", "nameToShow":"USD/SEK", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":81, "symbol":"^USDNOK", "name":"Usd/nok", "nameToShow":"USD/NOK", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":82, "symbol":"^USDRUB", "name":"Usd/rub", "nameToShow":"USD/RUB", "type":"Currency"  },
        { "id":83, "symbol":"^XPTUSD", "name":"Platinum", "nameToShow":"Platinum", "type":"Commodity" },
        { "id":84, "symbol":"^XPDUSD", "name":"Palladium", "nameToShow":"Palladium", "type":"Commodity" },
        { "id":85, "symbol":"NGF18", "name":"Natural gas", "nameToShow":"Natural Gas", "type":"Commodity", "digitsAfterDecimalPoint":3 },
        { "id":86, "symbol":"^USDCNH", "name":"Usd/cnh", "nameToShow":"USD/CNH", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":87, "symbol":"^USDCHF", "name":"Usd/chf", "nameToShow":"USD/CHF", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":88, "symbol":"^USDHKD", "name":"Usd/hkd", "nameToShow":"USD/HKD", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":89, "symbol":"^XAUEUR", "name":"Gold in eur", "nameToShow":"Gold in EUR", "type":"Commodity" },
        { "id":90, "symbol":"AA", "name":"Alcoa", "nameToShow":"Alcoa", "type":"Stock"  },
        { "id":91, "symbol":"FDX", "name":"Fedex", "nameToShow":"FedEx", "type":"Stock"  },
        { "id":92, "symbol":"UPS", "name":"Ups", "nameToShow":"UPS", "type":"Stock"  },
        { "id":93, "symbol":"ZWH18", "name":"Wheat", "nameToShow":"Wheat", "type":"Commodity"  },
        { "id":93, "symbol":"ZCH18", "name":"Corn", "nameToShow":"Corn", "type":"Commodity"  },
        { "id":94, "symbol":"HOG", "name":"Harley-davidson", "nameToShow":"Harley-Davidson", "type":"Stock" },
        { "id":95, "symbol":"KMB", "name":"Kimberly clark", "nameToShow":"Kimberly Clark", "type":"Stock" },
        { "id":96, "symbol":"CSCO", "name":"Cisco", "nameToShow":"Cisco", "type":"Stock" },
        { "id":96, "symbol":"DIS", "name":"Walt disney", "nameToShow":"Walt Disney", "type":"Stock" },
        { "id":97, "symbol":"T", "name":"At&t", "nameToShow":"AT&T", "type":"Stock" },
        { "id":98, "symbol":"MMM", "name":"3m", "nameToShow":"3M", "type":"Stock" },
        { "id":99, "symbol":"BABA", "name":"Alibaba", "nameToShow":"Alibaba", "type":"Stock" },
        { "id":100, "symbol":"M", "name":"Macy's", "nameToShow":"Macy's", "type":"Stock" },
        { "id":101, "symbol":"F", "name":"Ford", "nameToShow":"Ford", "type":"Stock" },
        { "id":102, "symbol":"PYPL", "name":"Paypal", "nameToShow":"PayPal", "type":"Stock" },
        { "id":103, "symbol":"VZ", "name":"Verizon", "nameToShow":"Verizon", "type":"Stock" },
        { "id":104, "symbol":"ADBE", "name":"Adobe", "nameToShow":"Adobe", "type":"Stock" },
        { "id":105, "symbol":"BRK.A", "name":"Berkshire hath", "nameToShow":"Berkshire Hath", "type":"Stock"  },
        { "id":106, "symbol":"ORCL", "name":"Oracle", "nameToShow":"Oracle", "type":"Stock" },
        { "id":107, "symbol":"YUM", "name":"Yum! brands", "nameToShow":"Yum! Brands", "type":"Stock" },
        { "id":108, "symbol":"ZNGA", "name":"Zynga", "nameToShow":"Zynga", "type":"Stock"  },
        { "id":109, "symbol":"PCLN", "name":"Priceline group", "nameToShow":"Priceline Group", "type":"Stock"  },
        { "id":110, "symbol":"HD", "name":"Home depot", "nameToShow":"Home Depot", "type":"Stock"  }, 
        { "id":111, "symbol":"UTX", "name":"United technologies", "nameToShow":"United Technologies", "type":"Stock"  },
        { "id":112, "symbol":"CVX", "name":"Chevron", "nameToShow":"Chevron", "type":"Stock"  },
        { "id":113, "symbol":"PFE", "name":"Pfizer", "nameToShow":"Pfizer", "type":"Stock"  },
        { "id":114, "symbol":"MRK", "name":"Merck", "nameToShow":"Merck", "type":"Stock"  }, 
        { "id":115, "symbol":"NKE", "name":"Nike", "nameToShow":"Nike", "type":"Stock"  },
        { "id":116, "symbol":"UNH", "name":"UnitedHealth", "nameToShow":"UnitedHealth", "type":"Stock"  },
        { "id":117, "symbol":"AKAM", "name":"Akamai", "nameToShow":"Akamai", "type":"Stock"  },
        { "id":118, "symbol":"AAL", "name":"American airlines", "nameToShow":"American Airlines", "type":"Stock"  },
        { "id":119, "symbol":"AVGO", "name":"Broadcom", "nameToShow":"Broadcom", "type":"Stock"  },
        { "id":120, "symbol":"AMAT", "name":"Applied Materials", "nameToShow":"Applied Materials", "type":"Stock"  },
        { "id":121, "symbol":"BIDU", "name":"Baidu", "nameToShow":"Baidu", "type":"Stock"  },
        { "id":122, "symbol":"CA", "name":"Ca", "nameToShow":"Ca", "type":"Stock"  },
        { "id":123, "symbol":"CHKP", "name":"Check point", "nameToShow":"Check Point", "type":"Stock"  },
        { "id":124, "symbol":"EA", "name":"Electronic arts", "nameToShow":"Electronic Arts", "type":"Stock"  },
        { "id":125, "symbol":"EXPE", "name":"Expedia", "nameToShow":"Expedia", "type":"Stock"  },
        { "id":126, "symbol":"KHC", "name":"Kraft heinz", "nameToShow":"Kraft Heinz", "type":"Stock"  },
        { "id":127, "symbol":"MAR", "name":"Marriott", "nameToShow":"Marriott", "type":"Stock"  },
        { "id":128, "symbol":"QCOM", "name":"Qualcomm", "nameToShow":"Qualcomm", "type":"Stock"  },
        { "id":129, "symbol":"SYMC", "name":"Symantec", "nameToShow":"Symantec", "type":"Stock"  }, 
        { "id":130, "symbol":"TXN", "name":"Texas instruments", "nameToShow":"Texas Instruments", "type":"Stock"  },
        { "id":131, "symbol":"VIAB", "name":"Viacom", "nameToShow":"Viacom", "type":"Stock"  },
        { "id":132, "symbol":"VOD", "name":"Vodafone", "nameToShow":"Vodafone", "type":"Stock"  },
        { "id":133, "symbol":"WYNN", "name":"Wynn resorts", "nameToShow":"Wynn Resorts", "type":"Stock"  },
        { "id":134, "symbol":"DLTR", "name":"Dollar tree", "nameToShow":"Dollar Tree", "type":"Stock"  },
        { "id":135, "symbol":"SNAP", "name":"Snap", "nameToShow":"Snap", "type":"Stock"  },
        { "id":136, "symbol":"^NZDILS", "name":"Nzd/ils", "nameToShow":"NZD/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":137, "symbol":"^CADILS", "name":"Cad/ils", "nameToShow":"CAD/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":138, "symbol":"^CHFILS", "name":"Chf/ils", "nameToShow":"CHF/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":139, "symbol":"^JPYILS", "name":"Jpy/ils", "nameToShow":"JPY/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":140, "symbol":"^BRLILS", "name":"Brl/ils", "nameToShow":"BRL/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":141, "symbol":"^MXNILS", "name":"Mxn/ils", "nameToShow":"MXN/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":142, "symbol":"^CNHILS", "name":"Cnh/ils", "nameToShow":"CNH/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":143, "symbol":"^TRYILS", "name":"Try/ils", "nameToShow":"TRY/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":144, "symbol":"^ZARILS", "name":"Zar/ils", "nameToShow":"ZAR/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":145, "symbol":"^PLNILS", "name":"Pln/ils", "nameToShow":"PLN/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":146, "symbol":"^SEKILS", "name":"Sek/ils", "nameToShow":"SEK/ILS", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":147, "symbol":"XRX", "name":"Xerox", "nameToShow":"Xerox", "type":"Stock"  },
        { "id":148, "symbol":"AMD", "name":"Amd", "nameToShow":"AMD", "type":"Stock"  },
        { "id":149, "symbol":"AIG", "name":"Aig", "nameToShow":"AIG", "type":"Stock"  },
        { "id":150, "symbol":"MO", "name":"Altria", "nameToShow":"Altria", "type":"Stock"  },
        { "id":151, "symbol":"TRIP", "name":"Tripadvisor", "nameToShow":"Tripadvisor", "type":"Stock"  },
        { "id":152, "symbol":"CCL", "name":"Carnival", "nameToShow":"Carnival", "type":"Stock"  },
        { "id":153, "symbol":"CL", "name":"Colgate", "nameToShow":"Colgate", "type":"Stock"  },
        { "id":154, "symbol":"CTXS", "name":"Citrix", "nameToShow":"Citrix", "type":"Stock"  },
        { "id":155, "symbol":"GD", "name":"General dynamics", "nameToShow":"General Dynamics", "type":"Stock"  },
        { "id":156, "symbol":"DAL", "name":"Delta airlines", "nameToShow":"Delta Airlines", "type":"Stock"  },
        { "id":157, "symbol":"GPS", "name":"Gap", "nameToShow":"Gap", "type":"Stock"  },
        { "id":158, "symbol":"HSY", "name":"Hershey", "nameToShow":"Hershey", "type":"Stock"  },
        { "id":159, "symbol":"INTU", "name":"Intuit", "nameToShow":"Intuit", "type":"Stock"  },
        { "id":160, "symbol":"K", "name":"Kellogg", "nameToShow":"Kellogg", "type":"Stock"  },
        { "id":161, "symbol":"^USDKRW", "name":"Usd/krw", "nameToShow":"USD/KRW", "type":"Currency", "digitsAfterDecimalPoint":2  },
        { "id":162, "symbol":"GEH18", "name":"Eurodollar 03/18", "nameToShow":"Eurodollar 03/18", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":163, "symbol":"GEM18", "name":"Eurodollar 06/18", "nameToShow":"Eurodollar 06/18", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":164, "symbol":"GEU18", "name":"Eurodollar 09/18", "nameToShow":"Eurodollar 09/18", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":165, "symbol":"GEZ18", "name":"Eurodollar 12/18", "nameToShow":"Eurodollar 12/18", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":166, "symbol":"GEH19", "name":"Eurodollar 03/19", "nameToShow":"Eurodollar 03/19", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":167, "symbol":"GEM19", "name":"Eurodollar 06/19", "nameToShow":"Eurodollar 06/19", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":168, "symbol":"GEU19", "name":"Eurodollar 09/19", "nameToShow":"Eurodollar 09/19", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":169, "symbol":"GEZ19", "name":"Eurodollar 12/19", "nameToShow":"Eurodollar 12/19", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":170, "symbol":"GEH20", "name":"Eurodollar 03/20", "nameToShow":"Eurodollar 03/20", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":171, "symbol":"GEM20", "name":"Eurodollar 06/20", "nameToShow":"Eurodollar 06/20", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":172, "symbol":"GEU20", "name":"Eurodollar 09/20", "nameToShow":"Eurodollar 09/20", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":173, "symbol":"GEZ20", "name":"Eurodollar 12/20", "nameToShow":"Eurodollar 12/20", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":174, "symbol":"FEH18", "name":"Euribor 03/18", "nameToShow":"Euribor 03/18", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":175, "symbol":"FEM18", "name":"Euribor 06/18", "nameToShow":"Euribor 06/18", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":176, "symbol":"FEU18", "name":"Euribor 09/18", "nameToShow":"Euribor 09/18", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":177, "symbol":"FEZ18", "name":"Euribor 12/18", "nameToShow":"Euribor 12/18", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":178, "symbol":"FEH19", "name":"Euribor 03/19", "nameToShow":"Euribor 03/19", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":179, "symbol":"FEM19", "name":"Euribor 06/19", "nameToShow":"Euribor 06/19", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":180, "symbol":"FEU19", "name":"Euribor 09/19", "nameToShow":"Euribor 09/19", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":181, "symbol":"FEZ19", "name":"Euribor 12/19", "nameToShow":"Euribor 12/19", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":182, "symbol":"FEH20", "name":"Euribor 03/20", "nameToShow":"Euribor 03/20", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":183, "symbol":"FEM20", "name":"Euribor 06/20", "nameToShow":"Euribor 06/20", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":184, "symbol":"FEU20", "name":"Euribor 09/20", "nameToShow":"Euribor 09/20", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":185, "symbol":"FEZ20", "name":"Euribor 12/20", "nameToShow":"Euribor 12/20", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":186, "symbol":"ZQH18", "name":"Fed funds 03/18", "nameToShow":"Fed Funds 03/18", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":187, "symbol":"ZQM18", "name":"Fed funds 06/18", "nameToShow":"Fed Funds 06/18", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":188, "symbol":"ZQU18", "name":"Fed funds 09/18", "nameToShow":"Fed Funds 09/18", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":189, "symbol":"ZQZ18", "name":"Fed funds 12/18", "nameToShow":"Fed Funds 12/18", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":190, "symbol":"ZQH19", "name":"Fed funds 03/19", "nameToShow":"Fed Funds 03/19", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":191, "symbol":"ZQM19", "name":"Fed funds 06/19", "nameToShow":"Fed Funds 06/19", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":192, "symbol":"ZQU19", "name":"Fed funds 09/19", "nameToShow":"Fed Funds 09/19", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":193, "symbol":"ZQZ19", "name":"Fed funds 12/19", "nameToShow":"Fed Funds 12/19", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":194, "symbol":"ZQH20", "name":"Fed funds 03/20", "nameToShow":"Fed Funds 03/20", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":195, "symbol":"ZQM20", "name":"Fed funds 06/20", "nameToShow":"Fed Funds 06/20", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":196, "symbol":"ZQU20", "name":"Fed funds 09/20", "nameToShow":"Fed Funds 09/20", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":197, "symbol":"ZQZ20", "name":"Fed funds 12/20", "nameToShow":"Fed Funds 12/20", "type":"Future", "digitsAfterDecimalPoint":4  },
        { "id":198, "symbol":"IWM", "name":"Russell 2000 ishares", "nameToShow":"Russell 2000 Ishares", "type":"ETF" },
        
    ];


@Injectable()
export class AssetsService {

     
  constructor(private http : Http) { }
    
    
    getAllAssets(): Promise<Asset[]>{
            return Promise.resolve(ASSETS);
        }
    
    
    getAsset(symbol: string): Promise<Asset> {
    return this.getAllAssets()
               .then(assets => assets.find(asset => asset.symbol === symbol));
        }
    
    
    getAllAssetsByType(assetType:string): Promise<Asset[]>{
        let counter=0;       
        let filteredAssetsByType = ASSETS.filter(asset=>{
                                                            if(asset.type == assetType){
                                                                    counter++; 
                                                                    return asset;   
                                                                  }
                                                        });
        console.log(counter); 
        return Promise.resolve(filteredAssetsByType);
        
        }
    
    
    
    
    
    

}

