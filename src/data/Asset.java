package data;

public class Asset {

	
	private Integer id;
	private String symbol;
	private String name;
	private String nameToShow;
	private String type;
	private Integer decimal;
	
	
	public Asset(int id,String symbol, String name, String nameToShow, String type,Integer decimal) {
		this.id = id;
		this.symbol=symbol;
		this.name = name;
		this.nameToShow = nameToShow;
		this.type = type;
		this.decimal=decimal;
	}
	
	public Asset(int id,String symbol, String name, String nameToShow, String type) {
		this.id = id;
		this.symbol=symbol;
		this.name = name;
		this.nameToShow = nameToShow;
		this.type = type;
	}


	

	public Integer getId() {
		return id;
	}


	public void setId(int id) {
		this.id = id;
	}
	
	
	public String getSymbol() {
		return symbol;
	}


	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}
	
	public String getNameToShow() {
		return nameToShow;
	}


	public void setNameToShow(String nameToShow) {
		this.nameToShow = nameToShow;
	}
	
	public String getType() {
		return type;
	}


	public void setType(String type) {
		this.type = type;
	}
	
	public Integer getDecimal() {
		return decimal;
	}


	public void setDecimal(Integer decimal) {
		this.decimal = decimal;
	}
	



	@Override
	public String toString() {
		return "{\"name\":\""+name+"\",\"id\":\""+id+"\",\"type\":\""+type+"\"}";
		
	}
	
	
	
	
	
}
