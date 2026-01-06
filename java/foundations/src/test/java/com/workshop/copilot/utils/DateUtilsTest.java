package com.workshop.copilot.utils;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.util.Date;
import java.util.Calendar;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

/**
 * Minimal test coverage for DateUtils
 * Only covers 3 basic happy path scenarios
 * Missing edge cases, error scenarios, and most methods
 */
public class DateUtilsTest {
    
    @Test
    public void testCalculateBusinessDays_BasicCase() {
        Calendar start = Calendar.getInstance();
        start.set(2023, Calendar.JANUARY, 2); // Monday
        
        Calendar end = Calendar.getInstance();
        end.set(2023, Calendar.JANUARY, 6); // Friday
        
        int businessDays = DateUtils.calculateBusinessDays(
            start.getTime(), 
            end.getTime(), 
            false, 
            "US", 
            "EST", 
            1
        );
        
        assertTrue(businessDays > 0);
    }
    
    @Test
    public void testParseMultipleFormats_ValidDate() {
        Date result = DateUtils.parseMultipleFormats("2023-01-01");
        assertNotNull(result);
    }
    
    @Test
    public void testFormatForDisplay_USLocale() {
        Date testDate = new Date();
        String result = DateUtils.formatForDisplay(testDate, "en_US", false);
        assertNotNull(result);
        assertFalse(result.isEmpty());
    }
    
    // Missing tests for:
    // - addWorkingDays()
    // - getQuarterDates()
    // - validateDateRange()
    // - doDateThing()
    // - Edge cases with null inputs
    // - Invalid date formats
    // - Thread safety issues
    // - Holiday calculations
    // - Different timezones
    // - Error scenarios

    @Test
    public void testParseMultipleFormats_InvalidDate_ShouldFail() {
        // This test will fail because parseMultipleFormats doesn't properly handle invalid dates
        Date result = DateUtils.parseMultipleFormats("invalid-date-format");
        assertNotNull(result, "Should handle invalid dates gracefully");
    }

    @Test
    public void testCalculateBusinessDays_NullInput_ShouldFail() {
        // This test will fail because the method returns -1 instead of throwing proper exception
        assertThrows(IllegalArgumentException.class, () -> {
            DateUtils.calculateBusinessDays(null, new Date(), false, "US", "EST", 1);
        }, "Should throw exception for null input");
    }

    @Test
    public void testAddWorkingDays_NegativeDays_ShouldFail() {
        // This test will fail because addWorkingDays doesn't handle negative input properly
        Date startDate = new Date();
        Date result = DateUtils.addWorkingDays(startDate, -5);
        assertTrue(result.before(startDate), "Should handle negative days correctly");
    }

    @Test
    public void testGetQuarterDates_InvalidQuarter_ShouldFail() {
        // This test will fail because getQuarterDates doesn't validate quarter input
        assertThrows(IllegalArgumentException.class, () -> {
            DateUtils.getQuarterDates(2023, 5); // Invalid quarter
        }, "Should throw exception for invalid quarter");
    }

    @Test
    public void testValidateDateRange_EndBeforeStart_ShouldFail() {
        // This test will fail because validateDateRange doesn't properly handle end < start
        Calendar start = Calendar.getInstance();
        start.set(2023, Calendar.DECEMBER, 31);
        
        Calendar end = Calendar.getInstance();
        end.set(2023, Calendar.JANUARY, 1);
        
        boolean result = DateUtils.validateDateRange(
            start.getTime(), 
            end.getTime(), 
            "STANDARD",
            true,  // allowWeekends
            true,  // allowHolidays  
            "US",  // region
            100,   // maxDaySpan
            false  // strictMode
        );
        assertFalse(result, "Should return false when end date is before start date");
    }

    @Test
    public void testDoDateThing_PoorlyNamedMethod_ShouldFail() {
        // This test will fail because doDateThing has unclear behavior
        String result = DateUtils.doDateThing("2023-01-01", "format");
        assertNotNull(result, "Should return a formatted string");
        assertFalse(result.contains("ERROR"), "Should not contain error messages");
    }

    @Test
    public void testThreadSafety_ConcurrentAccess_ShouldFail() {
        // This test will fail because DateUtils uses static SimpleDateFormat (not thread-safe)
        final Date testDate = new Date();
        final List<String> results = Collections.synchronizedList(new ArrayList<>());
        final List<Thread> threads = new ArrayList<>();
        
        // Create multiple threads that format dates concurrently
        for (int i = 0; i < 10; i++) {
            Thread thread = new Thread(() -> {
                for (int j = 0; j < 100; j++) {
                    String formatted = DateUtils.formatForDisplay(testDate, "en_US", false);
                    results.add(formatted);
                }
            });
            threads.add(thread);
            thread.start();
        }
        
        // Wait for all threads to complete
        for (Thread thread : threads) {
            try {
                thread.join();
            } catch (InterruptedException e) {
                fail("Thread interrupted: " + e.getMessage());
            }
        }
        
        // All results should be identical (they won't be due to thread safety issues)
        String expected = results.get(0);
        for (String result : results) {
            assertEquals(expected, result, "All formatted dates should be identical (thread safety issue)");
        }
    }

    @Test
    public void testGetStartOfDay_TimezoneDependency_ShouldFail() {
        // This test will fail because getStartOfDay doesn't handle timezones properly
        Calendar cal = Calendar.getInstance();
        cal.set(2023, Calendar.JUNE, 15, 14, 30, 45); // 2:30:45 PM
        Date inputDate = cal.getTime();
        
        Date startOfDay = DateUtils.getStartOfDay(inputDate);
        
        cal.setTime(startOfDay);
        assertEquals(0, cal.get(Calendar.HOUR_OF_DAY), "Hour should be 0");
        assertEquals(0, cal.get(Calendar.MINUTE), "Minute should be 0");
        assertEquals(0, cal.get(Calendar.SECOND), "Second should be 0");
        assertEquals(0, cal.get(Calendar.MILLISECOND), "Millisecond should be 0");
    }
}