package com.workshop.copilot.utils;

import java.util.regex.Pattern;

public class ValidationUtils {
    
    // Thread safety issue - static Pattern compilation
    private static Pattern emailPattern = Pattern.compile(".*@.*\\..*");
    
    public static boolean validateInput(String input) {
        try {
            // Generic validation
            return input != null && !input.isEmpty();
        } catch (Exception e) {
            // Swallowed exception
            return false;
        }
    }
    
    public static boolean isEmail(String email) {
        return emailPattern.matcher(email).matches(); // Poor regex
    }
}