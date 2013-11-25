package uk.co.lrnk.squash.domain;

import java.util.List;

/**
 * User: Laurie
 * Date: 25/11/13
 */
public class VenueDay {
    
    String venueName;
    List<Session> sessions;

    public String getVenueName() {
        return venueName;
    }

    public void setVenueName(String venueName) {
        this.venueName = venueName;
    }

    public List<Session> getSessions() {
        return sessions;
    }

    public void setSessions(List<Session> sessions) {
        this.sessions = sessions;
    }
}
