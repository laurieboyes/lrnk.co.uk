package uk.co.lrnk.squash.domain;

import java.util.Date;
import java.util.List;

/**
 * User: Laurie
 * Date: 25/11/13
 */
public class Day {
    
    String name;
    Date date;
    List<VenueDay> venues;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public List<VenueDay> getVenues() {
        return venues;
    }

    public void setVenues(List<VenueDay> venues) {
        this.venues = venues;
    }
}
