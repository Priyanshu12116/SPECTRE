/*
 * Password Checker Example
 * Tests string encryption and anti-analysis
 * Recommended level: Maximum (8-10)
 * 
 * This example demonstrates how SPECTRE protects sensitive strings
 * like passwords from static analysis.
 */

#include <stdio.h>
#include <string.h>

int check_password(const char* input) {
    const char* correct_password = "SecretPass123";
    
    if (strcmp(input, correct_password) == 0) {
        return 1;
    }
    return 0;
}

int main() {
    char password[100];
    
    printf("Enter password: ");
    scanf("%s", password);
    
    if (check_password(password)) {
        printf("Access granted!\n");
        printf("Welcome to the secure system.\n");
    } else {
        printf("Access denied!\n");
        printf("Invalid password.\n");
    }
    
    return 0;
}
