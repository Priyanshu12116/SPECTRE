#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

int main() {
    int x = 15;
    int y = 25;
    
    printf("Addition: %d + %d = %d\n", x, y, add(x, y));
    printf("Multiplication: %d * %d = %d\n", x, y, multiply(x, y));
    printf("Test completed successfully!\n");
    
    return 0;
}
