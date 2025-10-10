/*
 * Simple Calculator Example
 * Tests variable obfuscation and constant encoding
 * Recommended level: Balanced (4-7)
 */

#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int subtract(int a, int b) {
    return a - b;
}

int multiply(int a, int b) {
    return a * b;
}

int main() {
    int num1 = 50;
    int num2 = 25;
    
    printf("Calculator Demo\n");
    printf("===============\n");
    printf("%d + %d = %d\n", num1, num2, add(num1, num2));
    printf("%d - %d = %d\n", num1, num2, subtract(num1, num2));
    printf("%d * %d = %d\n", num1, num2, multiply(num1, num2));
    
    return 0;
}
