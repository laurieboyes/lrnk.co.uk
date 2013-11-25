package uk.co.lrnk.squash.domain;

/**
 * User: Laurie
 * Date: 25/11/13
 */
public class Session {
    
    String time;
    boolean availabilityKnown;
    int availableSlots;

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public boolean isAvailabilityKnown() {
        return availabilityKnown;
    }

    public void setAvailabilityKnown(boolean availabilityKnown) {
        this.availabilityKnown = availabilityKnown;
    }

    public int getAvailableSlots() {
        return availableSlots;
    }

    public void setAvailableSlots(int availableSlots) {
        this.availableSlots = availableSlots;
    }
}
