package data;


import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.ObjectMapper;


@WebServlet("/MarketDataServlet")
public class MarketDataServlet extends HttpServlet {

	
		protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

			
			/*Asset asset1 = new Asset(1,"IBM","Stock");
			  String sendMe="{\"results\":["+asset1.toString()+"]}";*/
			

			/*MarketData.createMarketData();*/
			
			String assetName=request.getParameter("name");
			
			CandleStick candleStickArr[] = MarketData.getCandlesArr(assetName);
			
			ObjectMapper mapper = new ObjectMapper();
			
			String jsonInString = mapper.writeValueAsString(candleStickArr);
			
			
			
			response.addHeader("Access-Control-Allow-Origin", "*");	
			
			response.setContentType("application/json");
			
			PrintWriter out=response.getWriter();
			
			System.out.println(jsonInString.toString());
			
			out.print("{\"results\":"+jsonInString.toString()+"}");
			
			
		}


		protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
			doGet(request, response);
		}

	}
