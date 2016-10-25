package me.loki2302.app;

import me.loki2302.spring.advanced.EnableTransactionLogging;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * @undocumented
 */
@EnableTransactionLogging
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
