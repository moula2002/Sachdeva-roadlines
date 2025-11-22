package com.sachdeva.roadlines;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@CrossOrigin("http://localhost:5173")
public class RoadlinesApplication {

	public static void main(String[] args) {
		SpringApplication.run(RoadlinesApplication.class, args);
	}

}
