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
        { "id":7, "symbol":"HGQ18", "name":"Copper", "nameToShow":"Copper", "type":"Commodity", "digitsAfterDecimalPoint":3 },
        { "id":8, "symbol":"CLQ18", "name":"Crude oil", "nameToShow":"Crude oil", "type":"Commodity" },
        { "id":9, "symbol":"NQM18", "name":"Nasdaq 100 future", "nameToShow":"Nasdaq 100", "type":"Future" },
        { "id":10, "symbol":"EBAY", "name":"Ebay", "nameToShow":"Ebay", "type":"Stock" },
        { "id":11, "symbol":"SPY", "name":"S&p 500 spdr", "nameToShow":"S&P 500 SPDR", "type":"ETF" },
        { "id":12, "symbol":"^USDCAD", "name":"Usd/cad", "nameToShow":"USD/CAD", "type":"Currency", "digitsAfterDecimalPoint":4 },
        { "id":13, "symbol":"NLM18", "name":"Nikkei 225 future", "nameToShow":"Nikkei 225", "type":"Future" },
        { "id":14, "symbol":"QQQ", "name":"Nasdaq 100 etf", "nameToShow":"Nasdaq 100", "type":"ETF" },
        { "id":15, "symbol":"^EURUSD", "name":"Eur/usd", "nameToShow":"EUR/USD", "type":"Currency", "digitsAfterDecimalPoint":4 },
        { "id":16, "symbol":"^USDJPY", "name":"Usd/jpy", "nameToShow":"USD/JPY", "type":"Currency" },
        { "id":17, "symbol":"FB", "name":"Facebook", "nameToShow":"Facebook", "type":"Stock" },
        { "id":18, "symbol":"UVM18", "name":"Ftse 100 future", "nameToShow":"FTSE 100", "type":"Future" },
        { "id":19, "symbol":"YMM18", "name":"Dow jones future", "nameToShow":"Dow Jones", "type":"Future" },
        { "id":20, "symbol":"^AUDUSD", "name":"Aud/usd", "nameToShow":"AUD/USD", "type":"Currency", "digitsAfterDecimalPoint":4 },
        { "id":21, "symbol":"ESM18", "name":"S&p 500 future", "nameToShow":"S&P 500", "type":"Future" },
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
        { "id":44, "symbol":"WBA", "name":"Walgreens boots", "nameToShow":"Walgreens Boots", "type":"Stock"  },
        { "id":45, "symbol":"GRPN", "name":"Groupon", "nameToShow":"Groupon", "type":"Stock"  },
        { "id":46, "symbol":"C", "name":"Citigroup", "nameToShow":"Citigroup", "type":"Stock"  },
        { "id":47, "symbol":"TRN18", "name":"Iron ore 62%", "nameToShow":"Iron ore 62%", "type":"Commodity" },
        { "id":48, "symbol":"^USDMXN", "name":"Usd/mxn", "nameToShow":"USD/MXN", "type":"Currency"  },
        { "id":49, "symbol":"^USDTRY", "name":"Usd/try", "nameToShow":"USD/TRY", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":50, "symbol":"^USDBRL", "name":"Usd/brl", "nameToShow":"USD/BRL", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":51, "symbol":"^USDPLN", "name":"Usd/pln", "nameToShow":"USD/PLN", "type":"Currency", "digitsAfterDecimalPoint":4  },
        { "id":52, "symbol":"TLT", "name":"Treasury 20+ year bond", "nameToShow":"Treasury 20+ Year Bond", "type":"ETF"  },
        { "id":53, "symbol":"XLF", "name":"Financials spdr", "nameToShow":"Financials SPDR", "type":"ETF"  },
        { "id":54, "symbol":"TEVA", "name":"Teva", "nameToShow":"Teva", "type":"Stock"  },
        { "id":55, "symbol":"QAU18", "name":"Brent oil", "nameToShow":"Brent Oil", "type":"Commodity" },
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
        { "id":93, "symbol":"ZWN18", "name":"Wheat", "nameToShow":"Wheat", "type":"Commodity"  },
        { "id":93, "symbol":"ZCM18", "name":"Corn", "nameToShow":"Corn", "type":"Commodity"  },
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
        { "id":109, "symbol":"BIIB", "name":"biogen", "nameToShow":"Biogen", "type":"Stock"  },
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
        { "id":162, "symbol":"GEH21", "name":"Eurodollar 03/21", "nameToShow":"Eurodollar 03/21", "type":"Future", "digitsAfterDecimalPoint":4  },
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
        { "id":174, "symbol":"FEH21", "name":"Euribor 03/21", "nameToShow":"Euribor 03/21", "type":"Future", "digitsAfterDecimalPoint":4  },
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
        { "id":186, "symbol":"ZQH21", "name":"Fed funds 03/21", "nameToShow":"Fed Funds 03/21", "type":"Future", "digitsAfterDecimalPoint":4  },
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
        { "id":199, "symbol":"GTN", "name":"Gray television", "nameToShow":"Gray Television", "type":"Stock", "hide":true  }, 
        { "id":200, "symbol":"ANF", "name":"Abercrombie & fitch", "nameToShow":"Abercrombie & Fitch", "type":"Stock", "hide":true  },
        { "id":201, "symbol":"ANGO", "name":"Angiodynamics", "nameToShow":"Angiodynamics", "type":"Stock", "hide":true  },
        { "id":202, "symbol":"BDGE", "name":"Bridge Bancorp", "nameToShow":"Bridge Bancorp", "type":"Stock", "hide":true  },
        { "id":203, "symbol":"BEAT", "name":"Biotelemetry", "nameToShow":"Biotelemetry", "type":"Stock", "hide":true  },
        { "id":204, "symbol":"CBRL", "name":"Cracker barrel", "nameToShow":"Cracker Barrel", "type":"Stock", "hide":true  },
        { "id":205, "symbol":"CBTX", "name":"Cbtx", "nameToShow":"Cbtx", "type":"Stock", "hide":true  },
        { "id":206, "symbol":"INVA", "name":"Innoviva", "nameToShow":"Innoviva", "type":"Stock", "hide":true  },
        { "id":208, "symbol":"CRAY", "name":"Cray", "nameToShow":"Cray", "type":"Stock", "hide":true  },
        { "id":209, "symbol":"DENN", "name":"Dennys", "nameToShow":"Dennys", "type":"Stock", "hide":true  },
        { "id":210, "symbol":"DLX", "name":"Deluxe", "nameToShow":"Deluxe", "type":"Stock", "hide":true  },
        { "id":211, "symbol":"ELLI", "name":"Ellie mae", "nameToShow":"Ellie Mae", "type":"Stock", "hide":true  },
        { "id":212, "symbol":"EVI", "name":"Envirostar", "nameToShow":"Envirostar", "type":"Stock", "hide":true  },
        { "id":213, "symbol":"FOE", "name":"Ferro", "nameToShow":"Ferro", "type":"Stock", "hide":true  },
        { "id":214, "symbol":"FRO", "name":"Frontline", "nameToShow":"Frontline", "type":"Stock", "hide":true  },
        { "id":215, "symbol":"GTY", "name":"Getty realty", "nameToShow":"Getty Realty", "type":"Stock", "hide":true  },
        { "id":216, "symbol":"HDNG", "name":"Hardinge", "nameToShow":"Hardinge", "type":"Stock", "hide":true  },
        { "id":217, "symbol":"ICHR", "name":"Ichor", "nameToShow":"Ichor", "type":"Stock", "hide":true  },
        { "id":218, "symbol":"JJSF", "name":"J j snack foods", "nameToShow":"J J Snack Foods", "type":"Stock", "hide":true  },
        { "id":219, "symbol":"KLXI", "name":"Klx", "nameToShow":"Klx", "type":"Stock", "hide":true  },
        { "id":220, "symbol":"KNL", "name":"Knoll", "nameToShow":"Knoll", "type":"Stock", "hide":true  },
        { "id":221, "symbol":"MC", "name":"Moelis", "nameToShow":"Moelis", "type":"Stock", "hide":true  },
        { "id":222, "symbol":"MCS", "name":"Marcus", "nameToShow":"Marcus", "type":"Stock", "hide":true  },
        { "id":223, "symbol":"NANO", "name":"Nanometrics", "nameToShow":"Nanometrics", "type":"Stock", "hide":true  },
        { "id":224, "symbol":"NE", "name":"Noble", "nameToShow":"Noble", "type":"Stock", "hide":true  },
        { "id":225, "symbol":"ODP", "name":"Office depot", "nameToShow":"Office Depot", "type":"Stock", "hide":true  },
        { "id":226, "symbol":"OMCL", "name":"Omnicell", "nameToShow":"Omnicell", "type":"Stock", "hide":true  },
        { "id":227, "symbol":"PGTI", "name":"Pgt", "nameToShow":"Pgt", "type":"Stock", "hide":true  },
        { "id":228, "symbol":"PLT", "name":"Plantronics", "nameToShow":"Plantronics", "type":"Stock", "hide":true  },
        { "id":229, "symbol":"REV", "name":"Revlon", "nameToShow":"Revlon", "type":"Stock", "hide":true  },
        { "id":230, "symbol":"RMBS", "name":"Rambus", "nameToShow":"Rambus", "type":"Stock", "hide":true  },
        { "id":231, "symbol":"SFS", "name":"Smart", "nameToShow":"Smart", "type":"Stock", "hide":true  },
        { "id":232, "symbol":"CAL", "name":"Caleres", "nameToShow":"Caleres", "type":"Stock", "hide":true  },
        { "id":233, "symbol":"SYNT", "name":"Syntel", "nameToShow":"Syntel", "type":"Stock", "hide":true  },
        { "id":234, "symbol":"LDL", "name":"Lydall", "nameToShow":"Lydall", "type":"Stock", "hide":true  },
        { "id":235, "symbol":"TWLO", "name":"Twilio", "nameToShow":"Twilio", "type":"Stock", "hide":true  },
        { "id":236, "symbol":"UFI", "name":"Unifi", "nameToShow":"Unifi", "type":"Stock", "hide":true  },
        { "id":237, "symbol":"WATT", "name":"Energous", "nameToShow":"Energous", "type":"Stock", "hide":true  },
        { "id":238, "symbol":"WINA", "name":"Winmark", "nameToShow":"Winmark", "type":"Stock", "hide":true  },
        { "id":239, "symbol":"KAMN", "name":"Kaman", "nameToShow":"Kaman", "type":"Stock", "hide":true  },
        { "id":240, "symbol":"ZUMZ", "name":"Zumiez", "nameToShow":"Zumiez", "type":"Stock", "hide":true  },
        { "id":241, "symbol":"YEXT", "name":"Yext", "nameToShow":"Yext", "type":"Stock", "hide":true  },
        { "id":242, "symbol":"YELP", "name":"Yelp", "nameToShow":"Yelp", "type":"Stock", "hide":true  },
        { "id":243, "symbol":"FN", "name":"Fabrinet", "nameToShow":"Fabrinet", "type":"Stock", "hide":true  },
        { "id":244, "symbol":"UIS", "name":"Unisys", "nameToShow":"Unisys", "type":"Stock", "hide":true  },
        { "id":245, "symbol":"UNF", "name":"Unifirst", "nameToShow":"Unifirst", "type":"Stock", "hide":true  },
        { "id":246, "symbol":"BKH", "name":"Black hills", "nameToShow":"Black Hills", "type":"Stock", "hide":true  },
        { "id":247, "symbol":"VVI", "name":"Viad", "nameToShow":"Viad", "type":"Stock", "hide":true  },
        { "id":248, "symbol":"TBI", "name":"Trueblue", "nameToShow":"Trueblue", "type":"Stock", "hide":true  },
        { "id":249, "symbol":"TILE", "name":"Interface", "nameToShow":"Interface", "type":"Stock", "hide":true  },
        { "id":250, "symbol":"BLD", "name":"Topbuild", "nameToShow":"Topbuild", "type":"Stock", "hide":true  },
        { "id":251, "symbol":"TROX", "name":"Tronox", "nameToShow":"Tronox", "type":"Stock", "hide":true  },
        { "id":252, "symbol":"SMTC", "name":"Semtech", "nameToShow":"Semtech", "type":"Stock", "hide":true  },
        { "id":253, "symbol":"SPWR", "name":"Sunpower", "nameToShow":"Sunpower", "type":"Stock", "hide":true  },
        { "id":254, "symbol":"RNET", "name":"Rignet", "nameToShow":"Rignet", "type":"Stock", "hide":true  },
        { "id":255, "symbol":"RPXC", "name":"Rpx", "nameToShow":"Rpx", "type":"Stock", "hide":true  },
        { "id":256, "symbol":"SCS", "name":"Steelcase", "nameToShow":"Steelcase", "type":"Stock", "hide":true  },
        { "id":257, "symbol":"PLUS", "name":"Eplus", "nameToShow":"Eplus", "type":"Stock", "hide":true  },
        { "id":258, "symbol":"PRTA", "name":"Prothena", "nameToShow":"Prothena", "type":"Stock", "hide":true  },
        { "id":259, "symbol":"BKE", "name":"Buckle", "nameToShow":"Buckle", "type":"Stock", "hide":true  },
        { "id":260, "symbol":"RGNX", "name":"Regenxbio", "nameToShow":"Regenxbio", "type":"Stock", "hide":true  },
        { "id":261, "symbol":"GPRE", "name":"Green plains", "nameToShow":"Green Plains", "type":"Stock", "hide":true  },
        { "id":262, "symbol":"OMER", "name":"Omeros", "nameToShow":"Omeros", "type":"Stock", "hide":true  },
        { "id":263, "symbol":"CAKE", "name":"Cheesecake fact", "nameToShow":"Cheesecake Fact", "type":"Stock", "hide":true  },
        { "id":264, "symbol":"AZZ", "name":"Azz", "nameToShow":"Azz", "type":"Stock", "hide":true  },
        { "id":265, "symbol":"PLAB", "name":"Photronics", "nameToShow":"Photronics", "type":"Stock", "hide":true  },
        { "id":266, "symbol":"NEO", "name":"Neogenomics", "nameToShow":"Neogenomics", "type":"Stock", "hide":true  },
        { "id":267, "symbol":"NGVT", "name":"Ingevity", "nameToShow":"Ingevity", "type":"Stock", "hide":true  },
        { "id":268, "symbol":"NSP", "name":"Insperity", "nameToShow":"Insperity", "type":"Stock", "hide":true  },
        { "id":269, "symbol":"NVRO", "name":"Nevro", "nameToShow":"Nevro", "type":"Stock", "hide":true  },
        { "id":270, "symbol":"NVTA", "name":"Invitae", "nameToShow":"Invitae", "type":"Stock", "hide":true  },
        { "id":271, "symbol":"OCLR", "name":"Oclaro", "nameToShow":"Oclaro", "type":"Stock", "hide":true  },
        { "id":272, "symbol":"MDP", "name":"Meredith", "nameToShow":"Meredith", "type":"Stock", "hide":true  },
        { "id":273, "symbol":"MED", "name":"Medifast", "nameToShow":"Medifast", "type":"Stock", "hide":true  },
        { "id":274, "symbol":"HOPE", "name":"Hope bancorp", "nameToShow":"Hope Bancorp", "type":"Stock", "hide":true  },
        { "id":275, "symbol":"MTOR", "name":"Meritor", "nameToShow":"Meritor", "type":"Stock", "hide":true  },
        { "id":276, "symbol":"MXL", "name":"Maxlinear", "nameToShow":"Maxlinear", "type":"Stock", "hide":true  },
        { "id":277, "symbol":"KOPN", "name":"Kopin", "nameToShow":"Kopin", "type":"Stock", "hide":true  },
        { "id":278, "symbol":"BDC", "name":"Belden", "nameToShow":"Belden", "type":"Stock", "hide":true  },
        { "id":279, "symbol":"LMNX", "name":"Luminex", "nameToShow":"Luminex", "type":"Stock", "hide":true  },
        { "id":280, "symbol":"MASI", "name":"Masimo", "nameToShow":"Masimo", "type":"Stock", "hide":true  },
        { "id":281, "symbol":"MBI", "name":"MBIA", "nameToShow":"MBIA", "type":"Stock", "hide":true  },
        { "id":282, "symbol":"IMAX", "name":"Imax", "nameToShow":"Imax", "type":"Stock", "hide":true  },
        { "id":283, "symbol":"KBR", "name":"KBR", "nameToShow":"KBR", "type":"Stock", "hide":true  },
        { "id":284, "symbol":"CROX", "name":"Crocs", "nameToShow":"Crocs", "type":"Stock", "hide":true  },
        { "id":285, "symbol":"HTH", "name":"Hilltop holdings", "nameToShow":"Hilltop Holdings", "type":"Stock", "hide":true  },
        { "id":286, "symbol":"GCO", "name":"Genesco", "nameToShow":"Genesco", "type":"Stock", "hide":true  },
        { "id":287, "symbol":"GOGO", "name":"Gogo", "nameToShow":"Gogo", "type":"Stock", "hide":true  },
        { "id":288, "symbol":"FIT", "name":"Fitbit", "nameToShow":"Fitbit", "type":"Stock", "hide":true  },
        { "id":289, "symbol":"EBIX", "name":"Ebix", "nameToShow":"Ebix", "type":"Stock", "hide":true  },
        { "id":290, "symbol":"CULP", "name":"Culp", "nameToShow":"Culp", "type":"Stock", "hide":true  },
        { "id":291, "symbol":"DDS", "name":"Dillard's", "nameToShow":"Dillard's", "type":"Stock", "hide":true  },
        { "id":292, "symbol":"CCF", "name":"Chase", "nameToShow":"Chase", "type":"Stock", "hide":true  },
        { "id":293, "symbol":"BLBD", "name":"Blue bird", "nameToShow":"Blue Bird", "type":"Stock", "hide":true  },
        { "id":294, "symbol":"ATRI", "name":"Atrion", "nameToShow":"Atrion", "type":"Stock", "hide":true  },
        { "id":-1, "symbol":"SPY,QQQ,IYT,XBI,XLF,IWM,TLT,HYG", "name":"Stock Indexes", "nameToShow":"Stock Indexes", "type":"Stock Indexes"  }, /*  just a gimmick    */
        { "id":-2, "symbol":"AAPL,AMZN,FB,GOOG,NFLX", "name":"FAANG", "nameToShow":"FAANG", "type":"FAANG"  }, /*  just a gimmick    */
        { "id":-3, "symbol":"^EURUSD,^USDJPY,^GBPUSD,^AUDUSD,^NZDUSD,^USDCAD,^USDCHF,^USDILS", "name":"Currencies", "nameToShow":"Currencies", "type":"Currencies"  }, /*  just a gimmick    */
        { "id":-4, "symbol":"^XAUUSD,^XAGUSD,HGN18,CLM18,QAN18,ZWN18", "name":"Commodities", "nameToShow":"Commodities", "type":"Commodities"  }, /*  just a gimmick    */
        
    ];  



@Injectable()
export class AssetsService {

     
  constructor(private http : Http) { }
    
    
    getAllAssets(): Promise<Asset[]>{
            return Promise.resolve(ASSETS);
    }
    
    getAllVisibleAssets(): Asset[]{
        let visibleAssets = ASSETS.filter(function(asset){
            return !asset.hide;
        });
        return visibleAssets;
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
    
    getAllVisibleAssetsByType(assetType:string): Promise<Asset[]>{
        let counter=0;       
        let filteredAssetsByType = ASSETS.filter(asset=>{
                                                            if(asset.type == assetType && !asset.hide){
                                                                    counter++; 
                                                                    return asset;   
                                                                  }
                                                        });
        console.log(counter); 
        return Promise.resolve(filteredAssetsByType);
        
    }
    
    getAllInvisibleAssetsByType(assetType:string): Promise<Asset[]>{
        let counter=0;       
        let filteredAssetsByType = ASSETS.filter(asset=>{
                                                            if(asset.type == assetType && asset.hide){
                                                                    counter++; 
                                                                    return asset;   
                                                                  }
                                                        });
        console.log(counter); 
        return Promise.resolve(filteredAssetsByType);
        
    }
    
    getAssetSymbol(assetNameToShow):string{
        if(!assetNameToShow) return;
        let asset:Asset;
        let index=0;
        while(!asset){
           if(ASSETS[index]['nameToShow'] == assetNameToShow) asset = ASSETS[index];
            index++;
        }
        return asset.symbol;
    }
    
    
    getAssetNameToShow(assetSymbol):string{
        if(!assetSymbol) return;
        let asset:Asset;
        let index=0;
        while(!asset){
           if(ASSETS[index]['symbol'] == assetSymbol) asset = ASSETS[index];
            index++;
        }
        return asset.nameToShow;
    }
    

}

