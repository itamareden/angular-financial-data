package data;

import java.util.ArrayList;

public class MarketData {
	
	static ArrayList<CandleStick> assetMarketData = new ArrayList<CandleStick>();
	
	
	public static void createMarketData(){
		
		assetMarketData.add(new CandleStick ("Copper",1,"01/01/2017",2.65,2.61,2.67,2.66,10000));
		assetMarketData.add(new CandleStick ("Copper",2,"02/01/2017",2.54,2.47,2.55,2.48,10000));
		assetMarketData.add(new CandleStick ("Copper",3,"03/01/2017",2.41,2.23,2.41,2.23,10000));
		assetMarketData.add(new CandleStick ("Copper",4,"04/01/2017",2.42,2.41,2.45,2.43,10000));
		assetMarketData.add(new CandleStick ("Vix",5,"05/01/2017",10.0,9.66,13.6,11.22,20000));
		assetMarketData.add(new CandleStick ("Vix",6,"06/01/2017",11.62,10.05,13.22,12.12,20000));
		assetMarketData.add(new CandleStick ("Vix",7,"07/01/2017",13.66,13.66,22.13,21.01,20000));
		assetMarketData.add(new CandleStick ("Vix",8,"08/01/2017",18.14,14.55,20.20,18.00,20000));
		assetMarketData.add(new CandleStick ("Nasdaq 100",9,"09/01/2017",5678.12,5670.1,5715.6,5700.4,20000));
		assetMarketData.add(new CandleStick ("Nasdaq 100",10,"10/01/2017",5705.12,5700.00,5758.45,5743.3,20000));
		assetMarketData.add(new CandleStick ("Nasdaq 100",11,"11/01/2017",5701.12,5680.3,5705.32,5690.9,20000));
		assetMarketData.add(new CandleStick ("Nasdaq 100",12,"12/01/2017",5650.1,5300.4,5650.1,5402.1,20000));
		assetMarketData.add(new CandleStick ("Gold",13,"13/01/2017",1287.2,1286.2,1301.8,1299.00,20000));
		assetMarketData.add(new CandleStick ("Gold",14,"14/01/2017",1300.3,1298.7,1313.8,1310.9,20000));
		assetMarketData.add(new CandleStick ("Gold",15,"15/01/2017",1324.9,1324.9,1366.8,1362.54,20000));
		assetMarketData.add(new CandleStick ("Gold",16,"16/01/2017",1399.8,1376.8,1399.9,1381.7,20000));
	}
	
	
	
	public static int countAssetIterationInList(String assetName){
		
		createMarketData();
		
		int numOfIteration=0;
		
		for (int i = 0; i < assetMarketData.size(); i++) {
			
			if(assetMarketData.get(i).getName().equals(assetName)){
				numOfIteration++;
			}
			
		}
		
		
		return numOfIteration;
		
	}
	
	
	
	public static CandleStick[] getCandlesArr(String assetName){
		
		int arraySize=countAssetIterationInList(assetName);
		
		CandleStick [] marketDataArr = new CandleStick [arraySize];
		
		int arrayCounter=0;
		
		for (int i = 0; i < assetMarketData.size(); i++) {
			
			
			
			if(assetMarketData.get(i).getName().equals(assetName)){
				marketDataArr[arrayCounter]=assetMarketData.get(i);
				arrayCounter++;
			}
			
			
		}
		
		
		return marketDataArr;
		
	}
	
	

}
