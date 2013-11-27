package uk.co.lrnk.squash;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormatter;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.powermock.core.classloader.annotations.PrepareForTest;
import org.powermock.modules.junit4.PowerMockRunner;
import uk.co.lrnk.util.DateUtils;

import javax.swing.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.powermock.api.mockito.PowerMockito.mockStatic;
import static org.powermock.api.mockito.PowerMockito.when;
import static org.powermock.api.mockito.PowerMockito.whenNew;

/**
 * User: Laurie
 * Date: 26/11/13
 */

@RunWith(PowerMockRunner.class)
@PrepareForTest({DateUtils.class, SquashCalendar.class})
public class SquashCalendarTest {
    
    SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyyy");
    SquashCalendar squashCalendar = new SquashCalendar();

    @Test
    public void testGetDatesInForeseeableFutureMonday() throws Exception {

        // given
        mockStatic(DateUtils.class);
        when(DateUtils.getCurrentDate()).thenReturn(df.parse("18-11-2013")); // this is a monday 

        // when
        List<Date> dates = squashCalendar.getDatesInForeseeableFuture();

        // then
        assertEquals(df.parse("18-11-2013"), dates.get(0)); // monday
        assertEquals(df.parse("19-11-2013"), dates.get(1)); // tuesday
        assertEquals(df.parse("20-11-2013"), dates.get(2)); // wednesday
        assertEquals(df.parse("21-11-2013"), dates.get(3)); // thursday
        assertEquals(df.parse("22-11-2013"), dates.get(4)); // friday

        assertEquals(df.parse("25-11-2013"), dates.get(5)); // next monday
        assertEquals(df.parse("26-11-2013"), dates.get(6)); // next tuesday
        assertEquals(df.parse("27-11-2013"), dates.get(7)); // next wednesday
        assertEquals(df.parse("28-11-2013"), dates.get(8)); // next thursday
        assertEquals(df.parse("29-11-2013"), dates.get(9)); // next friday
        assertEquals(10, dates.size());
    }

    @Test
    public void testGetDatesInForeseeableFutureTuesday() throws Exception {

        // given
        mockStatic(DateUtils.class);
        when(DateUtils.getCurrentDate()).thenReturn(df.parse("19-11-2013")); // this is a tuesday

        // when
        List<Date> dates = squashCalendar.getDatesInForeseeableFuture();

        // then
        assertEquals(df.parse("19-11-2013"), dates.get(0)); // tuesday
        assertEquals(df.parse("20-11-2013"), dates.get(1)); // wednesday
        assertEquals(df.parse("21-11-2013"), dates.get(2)); // thursday
        assertEquals(df.parse("22-11-2013"), dates.get(3)); // friday

        assertEquals(df.parse("25-11-2013"), dates.get(4)); // next monday
        assertEquals(df.parse("26-11-2013"), dates.get(5)); // next tuesday
        assertEquals(df.parse("27-11-2013"), dates.get(6)); // next wednesday
        assertEquals(df.parse("28-11-2013"), dates.get(7)); // next thursday
        assertEquals(df.parse("29-11-2013"), dates.get(8)); // next friday
        assertEquals(9, dates.size());
    }

    @Test
    public void testGetDatesInForeseeableFutureFriday() throws Exception {

        // given
        mockStatic(DateUtils.class);
        when(DateUtils.getCurrentDate()).thenReturn(df.parse("22-11-2013")); // this is a friday

        // when
        List<Date> dates = squashCalendar.getDatesInForeseeableFuture();

        // then
        assertEquals(df.parse("22-11-2013"), dates.get(0)); // friday

        assertEquals(df.parse("25-11-2013"), dates.get(1)); // next monday
        assertEquals(df.parse("26-11-2013"), dates.get(2)); // next tuesday
        assertEquals(df.parse("27-11-2013"), dates.get(3)); // next wednesday
        assertEquals(df.parse("28-11-2013"), dates.get(4)); // next thursday
        assertEquals(df.parse("29-11-2013"), dates.get(5)); // next friday
        assertEquals(6, dates.size());
    }

    @Test
    public void testGetDatesInForeseeableFutureSaturday() throws Exception {

        // given
        mockStatic(DateUtils.class);
        when(DateUtils.getCurrentDate()).thenReturn(df.parse("23-11-2013")); // this is a saturday

        // when
        List<Date> dates = squashCalendar.getDatesInForeseeableFuture();

        // then
        assertEquals(df.parse("25-11-2013"), dates.get(0)); // next monday
        assertEquals(df.parse("26-11-2013"), dates.get(1)); // next tuesday
        assertEquals(df.parse("27-11-2013"), dates.get(2)); // next wednesday
        assertEquals(df.parse("28-11-2013"), dates.get(3)); // next thursday
        assertEquals(df.parse("29-11-2013"), dates.get(4)); // next friday
        assertEquals(5, dates.size());
    }

    @Test
    public void testGetDatesInForeseeableFutureSunday() throws Exception {

        // given
        mockStatic(DateUtils.class);
        when(DateUtils.getCurrentDate()).thenReturn(df.parse("24-11-2013")); // this is a sunday

        // when
        List<Date> dates = squashCalendar.getDatesInForeseeableFuture();

        // then
        assertEquals(df.parse("25-11-2013"), dates.get(0)); // next monday
        assertEquals(df.parse("26-11-2013"), dates.get(1)); // next tuesday
        assertEquals(df.parse("27-11-2013"), dates.get(2)); // next wednesday
        assertEquals(df.parse("28-11-2013"), dates.get(3)); // next thursday
        assertEquals(df.parse("29-11-2013"), dates.get(4)); // next friday
        assertEquals(5, dates.size());
    }
}
