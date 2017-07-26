package data;

public class CandleStick {
	
	private String name;
	private Integer id;
	private String startTime;
	private Double open;
	private Double low;
	private Double high;
	private Double close;
	private Integer volume;
	
	
	
	
	public CandleStick(String name, Integer id, String startTime, Double open, Double low, Double high, Double close,
			Integer volume) {
		
		this.name=name;
		this.id = id;
		this.startTime = startTime;
		this.open = open;
		this.low = low;
		this.high = high;
		this.close = close;
		this.volume = volume;
	}


	
	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}
	
	
	public Integer getId() {
		return id;
	}


	public void setId(Integer id) {
		this.id = id;
	}


	public String getStartTime() {
		return startTime;
	}


	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}


	public Double getOpen() {
		return open;
	}


	public void setOpen(Double open) {
		this.open = open;
	}


	public Double getLow() {
		return low;
	}


	public void setLow(Double low) {
		this.low = low;
	}


	public Double getHigh() {
		return high;
	}


	public void setHigh(Double high) {
		this.high = high;
	}


	public Double getClose() {
		return close;
	}


	public void setClose(Double close) {
		this.close = close;
	}


	public Integer getVolume() {
		return volume;
	}


	public void setVolume(Integer volume) {
		this.volume = volume;
	}
	
	
	
	
	

}
