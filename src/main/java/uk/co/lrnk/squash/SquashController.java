package uk.co.lrnk.squash;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import uk.co.lrnk.squash.domain.Day;
import uk.co.lrnk.squash.domain.Session;
import uk.co.lrnk.squash.domain.VenueDay;

import java.util.Arrays;
import java.util.List;

/**
 * User: Laurie
 * Date: 25/11/13
 */
@Controller("/squash")
public class SquashController {

    @RequestMapping(method = RequestMethod.GET)
    @ResponseBody
    public List<Day> getCourtAvailability() {
        Day monday = new Day();
        
        VenueDay brixtonMonday = new VenueDay();
        
        Session session1 = new Session();
        session1.setAvailabilityKnown(true);
        session1.setAvailableSlots(2);
        session1.setTime("20:00 - 20:40");
        
        brixtonMonday.setSessions(Arrays.asList(session1));
        
        monday.setName("Monday");
        monday.setVenues(Arrays.asList(brixtonMonday));
        
        return Arrays.asList(monday);
    }
    
}
