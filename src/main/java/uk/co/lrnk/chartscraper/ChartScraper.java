package uk.co.lrnk.chartscraper;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;
import org.supercsv.io.CsvBeanWriter;
import org.supercsv.io.ICsvBeanWriter;
import org.supercsv.prefs.CsvPreference;

import java.io.IOException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;

/**
 * User: Laurie
 * Date: 12/02/14
 */
@Component
public class ChartScraper {
    
    public List<ChartEntry> getChartEntries() throws IOException {

        List<ChartEntry> entryList = new ArrayList<ChartEntry>();

        Elements EntryTrs = Jsoup.connect("http://www.officialcharts.com/singles-chart/").get().getElementsByClass("entry");

        for(Element entryElement : EntryTrs) {
            ChartEntry entry = new ChartEntry();

            entry.setPosition(entryElement.getElementsByClass("currentposition").get(0).text());
            entry.setLastWeek(entryElement.getElementsByClass("lastposition").get(0).text());
            entry.setWeeks(entryElement.getElementsByClass("weeks").get(0).text());

            entry.setArtist(entryElement.getElementsByClass("infoHolder").get(0).getElementsByTag("h4").text());
            entry.setTitle(entryElement.getElementsByClass("infoHolder").get(0).getElementsByTag("h3").text());

            try{
                entry.setChangeThisWeek("" + (Integer.parseInt(entry.getPosition()) - Integer.parseInt(entry.getLastWeek())));    
            } catch (NumberFormatException e) {
                entry.setChangeThisWeek("NEW");
            }
                        
            entryList.add(entry);

        }
        
        return entryList;
    }
    
    public void writeCSV(List<ChartEntry> chartEntries, Writer writer) throws IOException {
        ICsvBeanWriter beanWriter = null;
        try {
            beanWriter = new CsvBeanWriter(writer, CsvPreference.STANDARD_PREFERENCE);
            beanWriter.writeHeader("Position", "Last Week", "Weeks", "Artist", "Title", "Change This Week");

            for (ChartEntry chartEntry : chartEntries) {
                beanWriter.write(chartEntry, "position", "lastWeek", "weeks", "artist", "title", "changeThisWeek");
            }

        } finally {
            if (beanWriter != null) {
                beanWriter.close();
            }
        }
        
    }
}
