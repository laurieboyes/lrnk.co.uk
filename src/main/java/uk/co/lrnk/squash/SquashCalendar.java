package uk.co.lrnk.squash;

import org.joda.time.DateTime;
import org.joda.time.DateTimeConstants;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static uk.co.lrnk.util.DateUtils.getCurrentDate;

/**
 * User: Laurie
 * Date: 26/11/13
 */
@Service
public class SquashCalendar {


    public List<Date> getDatesInForeseeableFuture() {

        List<Date> dates = new ArrayList<Date>();


        DateTime today = new DateTime(getCurrentDate());
        DateTime day = new DateTime(getCurrentDate()).withTimeAtStartOfDay();

        
        while(dayBeforeNextFriday(today, day)) {            
            
            if(day.getDayOfWeek() != DateTimeConstants.SATURDAY && day.getDayOfWeek() != DateTimeConstants.SUNDAY){
                dates.add(day.toDate());
            }
            
            day = day.plusDays(1);
            
        }

        return dates;
    }
    
    private boolean dayBeforeNextFriday(DateTime today, DateTime day) {
        return !(day.isAfter(today.plusDays(5)) && day.getDayOfWeek() == DateTimeConstants.SATURDAY);
    }

}
