package uk.co.lrnk.squash;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.kubek2k.springockito.annotations.ReplaceWithMock;
import org.kubek2k.springockito.annotations.SpringockitoContextLoader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import uk.co.lrnk.squash.domain.Day;

import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.when;

/**
 * User: Laurie
 * Date: 27/11/13
 */

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(
        loader = SpringockitoContextLoader.class, 
        locations = {
                "classpath:uk/co/lrnk/squash/squash-test.xml",
                "classpath:spring/lrnk/squash.xml"}
)
public class SquashControllerTest {

    SimpleDateFormat df = new SimpleDateFormat("dd-MM-yyyy");

    @Autowired
    SquashController squashController;

    @ReplaceWithMock
    @Autowired
    SquashCalendar squashCalendar;

    @Test
    public void testGetCourtAvailability() throws Exception {

        // given
        when(squashCalendar.getDatesInForeseeableFuture())
                .thenReturn(Arrays.asList(
                        df.parse("01-01-2013"), // this was a Tuesday if I recall
                        df.parse("02-01-2013"),
                        df.parse("03-01-2013")));

        // when
        List<Day> availabilityDays = squashController.getCourtAvailability();

        // then
        assertEquals("Tuesday",availabilityDays.get(0).getName());
        assertEquals("Wednesday",availabilityDays.get(1).getName());
        assertEquals("Thursday",availabilityDays.get(2).getName());
        
        assertEquals(df.parse("01-01-2013"),availabilityDays.get(0).getDate());
        assertEquals(df.parse("02-01-2013"),availabilityDays.get(1).getDate());
        assertEquals(df.parse("03-01-2013"),availabilityDays.get(2).getDate());
        

    }
}
