package com.workshop.copilot.utils;

import java.util.*;

/**
 * String helper utility - needs refactoring
 * Last updated: 2018-11-22
 */
public class StringHelper {
    
    // Poor variable names
    private static String temp;
    private static Map<String, String> cache = new HashMap<>();
    
    // Method with too many parameters
    public static String processString(String input, boolean trim, boolean toLowerCase, 
                                     boolean removeSpaces, boolean removeNumbers, 
                                     boolean removePunctuation, String replacement) {
        if (input == null) return null;
        
        String result = input;
        if (trim) result = result.trim();
        if (toLowerCase) result = result.toLowerCase();
        if (removeSpaces) result = result.replace(" ", replacement);
        if (removeNumbers) result = result.replaceAll("[0-9]", replacement);
        if (removePunctuation) result = result.replaceAll("[^a-zA-Z0-9\\s]", replacement);
        
        return result;
    }
    
    // Duplicate validation logic
    public static boolean isValidEmail(String email) {
        if (email == null || email.isEmpty()) return false;
        if (!email.contains("@")) return false;
        if (!email.contains(".")) return false;
        return true; // Poor validation
    }
    
    public static boolean isValidEmailAddress(String emailAddress) {
        if (emailAddress == null || emailAddress.trim().isEmpty()) return false;
        if (!emailAddress.contains("@")) return false;
        if (!emailAddress.contains(".")) return false;
        return true; // Duplicate logic
    }
}