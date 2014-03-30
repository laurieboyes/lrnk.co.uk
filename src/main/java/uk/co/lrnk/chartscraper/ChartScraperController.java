package uk.co.lrnk.chartscraper;

import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.supercsv.cellprocessor.FmtBool;
import org.supercsv.cellprocessor.FmtDate;
import org.supercsv.cellprocessor.Optional;
import org.supercsv.cellprocessor.constraint.LMinMax;
import org.supercsv.cellprocessor.constraint.UniqueHashCode;
import org.supercsv.cellprocessor.ift.CellProcessor;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import javax.servlet.http.HttpServletResponse;
import javax.swing.text.Position;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
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
    public ModelAndView getCurrentSinglesChart() throws IOException {

        List<ChartEntry> chartEntries = chartScraper.getChartEntries();

        return new ModelAndView("chart-scraper", "chartEntries", chartEntries);
    }

    @RequestMapping(value = "/singles-chart.csv", method = RequestMethod.GET, produces = "text/csv")
    @ResponseBody
    public void getCurrentSinglesChartCsv(HttpServletResponse response) throws IOException {

        String dateString = new SimpleDateFormat("yyyy-MM-dd_HHmm").format(new Date());
        String fileName = dateString + "_chart.csv";
        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
        
        chartScraper.writeCSV(chartScraper.getChartEntries(), response.getWriter());        
    }


}
