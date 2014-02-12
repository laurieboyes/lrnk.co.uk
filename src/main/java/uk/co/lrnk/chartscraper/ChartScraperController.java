package uk.co.lrnk.chartscraper;

import org.jsoup.Jsoup;
import org.jsoup.select.Elements;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * User: Laurie
 * Date: 12/02/14
 */
@Controller
public class ChartScraperController {


    @Qualifier("chartScraper")
    @Autowired
    private ChartScraper chartScraper;

    @RequestMapping(value = "/singles-chart", method = RequestMethod.GET)
    public ModelAndView getCurrentSinglesChartCsv() throws IOException {
        
        List<ChartEntry> chartEntries = chartScraper.getChartEntries();
        
        return new ModelAndView("chart-scraper","chartEntries", chartEntries);
    }
    


}
