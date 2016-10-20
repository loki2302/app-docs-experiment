package me.loki2302.webdriver;

import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.logging.LogType;
import org.openqa.selenium.logging.LoggingPreferences;
import org.openqa.selenium.remote.CapabilityType;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;
import java.util.logging.Level;

@Configuration
public class WebDriverConfiguration {
    @Bean(destroyMethod = "quit")
    public WebDriver webDriver() {
        LoggingPreferences loggingPreferences = new LoggingPreferences();
        loggingPreferences.enable(LogType.BROWSER, Level.ALL);

        DesiredCapabilities desiredCapabilities = DesiredCapabilities.chrome();
        desiredCapabilities.setCapability(CapabilityType.LOGGING_PREFS, loggingPreferences);

        ChromeDriver chromeDriver = new ChromeDriver(desiredCapabilities);
        chromeDriver.manage().timeouts().setScriptTimeout(5, TimeUnit.SECONDS);
        chromeDriver.manage().window().setSize(new Dimension(1366, 768));

        return chromeDriver;
    }

    @Bean
    public WebDriverUtils webDriverUtils() {
        return new WebDriverUtils();
    }
}