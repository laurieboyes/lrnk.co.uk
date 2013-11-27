package uk.co.lrnk.squash;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import uk.co.lrnk.squash.domain.Day;
import uk.co.lrnk.squash.domain.Session;
import uk.co.lrnk.squash.domain.VenueDay;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

/**
 * User: Laurie
 * Date: 25/11/13
 */
@Controller()
public class SquashController {


    @Autowired
    SquashCalendar squashCalendar;
    
    @Autowired
    List<VenueDay> allTypicalWeekdays;

    @RequestMapping(value = "/squash-data", method = RequestMethod.GET)
    @ResponseBody
    public List<Day> getCourtAvailability() {
                
        List<Day> days = new ArrayList<Day>();
        
        for(Date date : squashCalendar.getDatesInForeseeableFuture()) {
            Day day = new Day();
            day.setDate(date);
            day.setName(new DateTime(date).toString(DateTimeFormat.forPattern("EEEE")));
            
            day.setVenues(allTypicalWeekdays);
            
            days.add(day);                                   
        }
        
        return days;
    }
    
}
