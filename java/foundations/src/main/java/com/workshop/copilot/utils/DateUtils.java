package com.workshop.copilot.utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Date utility class - Last updated: 2019-03-15
 * TODO: Migrate to Java 8 Date API someday
 * TODO: Fix thread safety issues
 * TODO: Remove duplicate code
 */
public class DateUtils {
    
    // Thread safety issue - static SimpleDateFormat
    private static SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
    private static SimpleDateFormat format2 = new SimpleDateFormat("MM/dd/yyyy");
    private static SimpleDateFormat format3 = new SimpleDateFormat("dd-MM-yyyy");
    
    // Magic numbers throughout
    private static final long MILLISECONDS_IN_DAY = 86400000;
    private static final int WEEKEND_SATURDAY = 7;
    private static final int WEEKEND_SUNDAY = 1;
    
    // God object with too many responsibilities
    
    /**
     * Calculate business days between two dates
     * @param start start date
     * @param end end date
     * @param includeHolidays whether to include holidays
     * @param countryCode country for holiday calculation
     * @param timeZone timezone
     * @param fiscalYearStart fiscal year start month
     * @return number of business days
     */
    public static int calculateBusinessDays(Date start, Date end, boolean includeHolidays, 
                                          String countryCode, String timeZone, int fiscalYearStart) {
        if (start == null || end == null) {
            return -1; // Poor error handling - should throw exception
        }
        
        int count = 0;
        Calendar cal = Calendar.getInstance();
        cal.setTime(start);
        
        // Complex nested logic - 5+ levels deep
        while (cal.getTime().before(end)) {
            int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
            if (dayOfWeek != Calendar.SATURDAY && dayOfWeek != Calendar.SUNDAY) {
                if (includeHolidays) {
                    if (countryCode.equals("US")) {
                        if (fiscalYearStart == 1) {
                            if (timeZone.equals("EST")) {
                                if (isHoliday(cal.getTime(), "US")) {
                                    // Don't count holidays
                                } else {
                                    count++;
                                }
                            } else if (timeZone.equals("PST")) {
                                if (isHoliday(cal.getTime(), "US_WEST")) {
                                    // Don't count holidays
                                } else {
                                    count++;
                                }
                            } else {
                                count++;
                            }
                        } else if (fiscalYearStart == 4) {
                            count++;
                        } else {
                            count++;
                        }
                    } else if (countryCode.equals("UK")) {
                        if (isHoliday(cal.getTime(), "UK")) {
                            // Don't count holidays
                        } else {
                            count++;
                        }
                    } else {
                        count++;
                    }
                } else {
                    count++;
                }
            }
            cal.add(Calendar.DAY_OF_MONTH, 1);
        }
        
        return count;
    }
    
    // Poor method name
    public static String doDateThing(Object data, String temp) {
        if (data == null) return null; // Returning null instead of Optional
        
        try {
            Date d = (Date) data; // Unsafe casting
            return format.format(d); // Thread safety issue
        } catch (Exception e) {
            // Swallowed exception
            return "";
        }
    }
    
    /**
     * Parse multiple date formats - tries 10+ formats
     * Duplicate logic from other methods
     */
    public static Date parseMultipleFormats(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return null;
        }
        
        // Nested try-catch hell
        try {
            return format.parse(dateStr);
        } catch (ParseException e1) {
            try {
                return format2.parse(dateStr);
            } catch (ParseException e2) {
                try {
                    return format3.parse(dateStr);
                } catch (ParseException e3) {
                    try {
                        SimpleDateFormat f4 = new SimpleDateFormat("yyyy/MM/dd");
                        return f4.parse(dateStr);
                    } catch (ParseException e4) {
                        try {
                            SimpleDateFormat f5 = new SimpleDateFormat("dd.MM.yyyy");
                            return f5.parse(dateStr);
                        } catch (ParseException e5) {
                            try {
                                SimpleDateFormat f6 = new SimpleDateFormat("MM-dd-yyyy");
                                return f6.parse(dateStr);
                            } catch (ParseException e6) {
                                try {
                                    SimpleDateFormat f7 = new SimpleDateFormat("yyyy.MM.dd");
                                    return f7.parse(dateStr);
                                } catch (ParseException e7) {
                                    try {
                                        SimpleDateFormat f8 = new SimpleDateFormat("yyyyMMdd");
                                        return f8.parse(dateStr);
                                    } catch (ParseException e8) {
                                        try {
                                            SimpleDateFormat f9 = new SimpleDateFormat("dd/MM/yyyy");
                                            return f9.parse(dateStr);
                                        } catch (ParseException e9) {
                                            try {
                                                SimpleDateFormat f10 = new SimpleDateFormat("MM/dd/yy");
                                                return f10.parse(dateStr);
                                            } catch (ParseException e10) {
                                                return null; // Silent failure
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    
    /**
     * Add working days - DUPLICATE LOGIC from calculateBusinessDays
     */
    public static Date addWorkingDays(Date startDate, int daysToAdd) {
        if (startDate == null) return null;
        
        Calendar cal = Calendar.getInstance();
        cal.setTime(startDate);
        
        int addedDays = 0;
        while (addedDays < daysToAdd) {
            cal.add(Calendar.DAY_OF_MONTH, 1);
            int dayOfWeek = cal.get(Calendar.DAY_OF_WEEK);
            if (dayOfWeek != Calendar.SATURDAY && dayOfWeek != Calendar.SUNDAY) {
                // Hardcoded holidays - should be configurable
                if (!isHoliday(cal.getTime(), "US")) {
                    addedDays++;
                }
            }
        }
        
        return cal.getTime();
    }
    
    /**
     * Get quarter dates - MASSIVE switch statement
     */
    public static List<Date> getQuarterDates(int year, int quarter) {
        List<Date> dates = new ArrayList<>();
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, year);
        
        // Massive switch statement instead of calculation
        switch (quarter) {
            case 1:
                cal.set(Calendar.MONTH, Calendar.JANUARY);
                cal.set(Calendar.DAY_OF_MONTH, 1);
                dates.add(cal.getTime());
                cal.set(Calendar.MONTH, Calendar.FEBRUARY);
                cal.set(Calendar.DAY_OF_MONTH, 1);
                dates.add(cal.getTime());
                cal.set(Calendar.MONTH, Calendar.MARCH);
                cal.set(Calendar.DAY_OF_MONTH, 1);
                dates.add(cal.getTime());
                cal.set(Calendar.MONTH, Calendar.MARCH);
                cal.set(Calendar.DAY_OF_MONTH, 31);
                dates.add(cal.getTime());
                break;
            case 2:
                cal.set(Calendar.MONTH, Calendar.APRIL);
                cal.set(Calendar.DAY_OF_MONTH, 1);
                dates.add(cal.getTime());
                cal.set(Calendar.MONTH, Calendar.MAY);
                cal.set(Calendar.DAY_OF_MONTH, 1);
                dates.add(cal.getTime());
                cal.set(Calendar.MONTH, Calendar.JUNE);
                cal.set(Calendar.DAY_OF_MONTH, 1);
                dates.add(cal.getTime());
                cal.set(Calendar.MONTH, Calendar.JUNE);
                cal.set(Calendar.DAY_OF_MONTH, 30);
                dates.add(cal.getTime());
                break;
            case 3:
                cal.set(Calendar.MONTH, Calendar.JULY);
                cal.set(Calendar.DAY_OF_MONTH, 1);
                dates.add(cal.getTime());
                cal.set(Calendar.MONTH, Calendar.AUGUST);
                cal.set(Calendar.DAY_OF_MONTH, 1);
                dates.add(cal.getTime());
                cal.set(Calendar.MONTH, Calendar.SEPTEMBER);
                cal.set(Calendar.DAY_OF_MONTH, 1);
                dates.add(cal.getTime());
                cal.set(Calendar.MONTH, Calendar.SEPTEMBER);
                cal.set(Calendar.DAY_OF_MONTH, 30);
                dates.add(cal.getTime());
                break;
            case 4:
                cal.set(Calendar.MONTH, Calendar.OCTOBER);
                cal.set(Calendar.DAY_OF_MONTH, 1);
                dates.add(cal.getTime());
                cal.set(Calendar.MONTH, Calendar.NOVEMBER);
                cal.set(Calendar.DAY_OF_MONTH, 1);
                dates.add(cal.getTime());
                cal.set(Calendar.MONTH, Calendar.DECEMBER);
                cal.set(Calendar.DAY_OF_MONTH, 1);
                dates.add(cal.getTime());
                cal.set(Calendar.MONTH, Calendar.DECEMBER);
                cal.set(Calendar.DAY_OF_MONTH, 31);
                dates.add(cal.getTime());
                break;
            default:
                throw new IllegalArgumentException("Invalid quarter: " + quarter);
        }
        
        return dates;
    }
    
    /**
     * Validate date range - 100+ line method with complex validation
     * Mixed business logic with utility code
     */
    public static boolean validateDateRange(Date startDate, Date endDate, String businessRule, 
                                          boolean allowWeekends, boolean allowHolidays,
                                          String region, int maxDaySpan, boolean strictMode) {
        
        // No input validation
        if (startDate.after(endDate)) {
            return false;
        }
        
        long diffInMillies = Math.abs(endDate.getTime() - startDate.getTime());
        long diffInDays = diffInMillies / MILLISECONDS_IN_DAY;
        
        // Complex business rule validation
        if (businessRule.equals("FISCAL_YEAR")) {
            Calendar startCal = Calendar.getInstance();
            startCal.setTime(startDate);
            Calendar endCal = Calendar.getInstance();
            endCal.setTime(endDate);
            
            if (strictMode) {
                if (region.equals("US")) {
                    if (startCal.get(Calendar.MONTH) < Calendar.OCTOBER) {
                        if (endCal.get(Calendar.MONTH) >= Calendar.OCTOBER) {
                            if (allowWeekends) {
                                if (allowHolidays) {
                                    if (diffInDays <= maxDaySpan) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                } else {
                                    // Check each day for holidays
                                    Calendar checkCal = Calendar.getInstance();
                                    checkCal.setTime(startDate);
                                    while (checkCal.getTime().before(endDate)) {
                                        if (isHoliday(checkCal.getTime(), region)) {
                                            return false;
                                        }
                                        checkCal.add(Calendar.DAY_OF_MONTH, 1);
                                    }
                                    return diffInDays <= maxDaySpan;
                                }
                            } else {
                                // Check for weekends
                                Calendar checkCal = Calendar.getInstance();
                                checkCal.setTime(startDate);
                                while (checkCal.getTime().before(endDate)) {
                                    int dayOfWeek = checkCal.get(Calendar.DAY_OF_WEEK);
                                    if (dayOfWeek == Calendar.SATURDAY || dayOfWeek == Calendar.SUNDAY) {
                                        return false;
                                    }
                                    if (!allowHolidays && isHoliday(checkCal.getTime(), region)) {
                                        return false;
                                    }
                                    checkCal.add(Calendar.DAY_OF_MONTH, 1);
                                }
                                return diffInDays <= maxDaySpan;
                            }
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                } else if (region.equals("UK")) {
                    // Similar complex logic for UK
                    return diffInDays <= maxDaySpan;
                } else {
                    return diffInDays <= maxDaySpan;
                }
            } else {
                return diffInDays <= maxDaySpan;
            }
        } else if (businessRule.equals("CALENDAR_YEAR")) {
            return diffInDays <= 365;
        } else if (businessRule.equals("QUARTER")) {
            return diffInDays <= 90;
        } else {
            return true;
        }
    }
    
    /**
     * Format for display - Regional formatting with hardcoded locales
     */
    public static String formatForDisplay(Date date, String locale, boolean includeTime) {
        if (date == null) return "";
        
        // Hardcoded locale handling
        if (locale.equals("en_US")) {
            if (includeTime) {
                SimpleDateFormat usFormat = new SimpleDateFormat("MM/dd/yyyy hh:mm:ss a");
                return usFormat.format(date);
            } else {
                return format2.format(date); // Thread safety issue
            }
        } else if (locale.equals("en_UK")) {
            if (includeTime) {
                SimpleDateFormat ukFormat = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");
                return ukFormat.format(date);
            } else {
                SimpleDateFormat ukFormat = new SimpleDateFormat("dd/MM/yyyy");
                return ukFormat.format(date);
            }
        } else if (locale.equals("de_DE")) {
            if (includeTime) {
                SimpleDateFormat deFormat = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
                return deFormat.format(date);
            } else {
                SimpleDateFormat deFormat = new SimpleDateFormat("dd.MM.yyyy");
                return deFormat.format(date);
            }
        } else {
            return format.format(date); // Default format
        }
    }
    
    // Private helper with hardcoded holidays
    private static boolean isHoliday(Date date, String region) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        
        int month = cal.get(Calendar.MONTH);
        int day = cal.get(Calendar.DAY_OF_MONTH);
        
        // Hardcoded holidays - should be configurable
        if (region.equals("US") || region.equals("US_WEST")) {
            if (month == Calendar.JANUARY && day == 1) return true; // New Year
            if (month == Calendar.JULY && day == 4) return true; // Independence Day
            if (month == Calendar.DECEMBER && day == 25) return true; // Christmas
            if (month == Calendar.NOVEMBER && day >= 22 && day <= 28 && cal.get(Calendar.DAY_OF_WEEK) == Calendar.THURSDAY) {
                return true; // Thanksgiving (rough approximation)
            }
        } else if (region.equals("UK")) {
            if (month == Calendar.JANUARY && day == 1) return true; // New Year
            if (month == Calendar.DECEMBER && day == 25) return true; // Christmas
            if (month == Calendar.DECEMBER && day == 26) return true; // Boxing Day
        }
        
        return false;
    }
    
    // Additional poorly designed methods
    public static long getDaysBetween(Date d1, Date d2) {
        return Math.abs(d2.getTime() - d1.getTime()) / 86400000; // Magic number
    }
    
    public static boolean isSameDay(Date date1, Date date2) {
        SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMdd");
        return fmt.format(date1).equals(fmt.format(date2));
    }
    
    public static Date getStartOfDay(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }
    
    public static Date getEndOfDay(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        cal.set(Calendar.MILLISECOND, 999);
        return cal.getTime();
    }
    
    // Poor method name and implementation
    public static String convertDateToString(Date date) {
        if (date == null) return null;
        return date.toString(); // Poor formatting
    }
    
    // Method with side effects
    public static void setGlobalDateFormat(String pattern) {
        format = new SimpleDateFormat(pattern); // Modifying static state
    }
}