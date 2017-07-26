package data;

import java.util.ArrayList;

public class AssetsList {

	
	static ArrayList<Asset> assetList = null;
	
	public static void createAssetList(){
		
		if(assetList==null){
			
			
			assetList = new ArrayList<Asset>();
			
			
			assetList.add(new Asset (1,"IBM","Ibm","IBM","Stock"));
			assetList.add(new Asset (2,"INTC","Intel","Intel","Stock"));
			assetList.add(new Asset (3,"AAPL","Apple","Apple","Stock"));
			assetList.add(new Asset (4,"AMZN","Amazon","Amazon","Stock"));
			assetList.add(new Asset (5,"^XAGUSD","Silver","Silver","Commodity"));
			assetList.add(new Asset (6,"^XAUUSD","Gold","Gold","Commodity"));
			assetList.add(new Asset (7,"HGN17","Copper","Copper","Commodity",3));
			assetList.add(new Asset (8,"CLQ17","Crude oil","Crude Oil","Commodity"));
			assetList.add(new Asset (9,"NQU17","Nasdaq 100","Nasdaq 100","Index"));
			assetList.add(new Asset (10,"DYU17","Dax 30 future","Dax 30 Future","Future/Index"));
			assetList.add(new Asset (11,"VIN17","Vix future","Vix Future","Future/Index"));
			assetList.add(new Asset (12,"MXU17","Cac 30 future","Cac 30 Future","Future/Index"));
			assetList.add(new Asset (13,"NLU17","Nikkei 225 future","Nikkei 225 Future","Future/Index"));
			assetList.add(new Asset (14,"ZNU17","Treasury 10 yr note future","Treasury 10 YR Note Future","Future/Bond"));
			assetList.add(new Asset (15,"^EURUSD","Euro/usd","EUR/USD","Currency",4));
			assetList.add(new Asset (16,"^USDJPY","Usd/jpy","USD/JPY","Currency"));
			assetList.add(new Asset (17,"FB","Facebook","Facebook","Stock"));
			assetList.add(new Asset (18,"XU17","Ftse 100 future","FTSE 100 Future","Future/Index"));
			assetList.add(new Asset (19,"YMU17","Dow jones future","Dow Jones Future","Future/Index"));
			assetList.add(new Asset (20,"^AUDUSD","Aud/usd","AUD/USD","Index",4));
			assetList.add(new Asset (21,"ESU17","S&p 500 future","S&P 500 Future","Future/Index"));
			assetList.add(new Asset (22,"XBI","S&p biotech spdr","S&P Biotech SPDR","ETF/Index"));
			assetList.add(new Asset (23,"GOOG","Google","Google","Stock"));
			assetList.add(new Asset (24,"TSLA","Tesla","Tesla","Stock"));
			assetList.add(new Asset (25,"NFLX","Netflix","Netflix","Stock"));
			assetList.add(new Asset (26,"V","Visa","Visa","Stock"));
			
		}
		
		
	}
	
	


public static Asset[] getAssetsArr(){
	
	createAssetList();
	
	
	Asset [] assetsArr = new Asset [assetList.size()];
	
	
	for (int i = 0; i < assetList.size(); i++) {
		
			assetsArr[i]=assetList.get(i);
		
	}
	
	
	return assetsArr;
	
}
	
	
}
