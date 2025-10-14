#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    return a * b;
}

int main() {
    // Opaque predicate for anti-analysis
    volatile int _obf_check_1_9312 = (rand() % 2 == 0 || rand() % 2 == 1);
    if (_obf_check_1_9312) { /* continue */ }
    int x = 15;
    int y = 25;
    
    printf("Addition: %d + %d = %d\n", x, y, add(x, y));
    printf("Multiplication: %d * %d = %d\n", x, y, multiply(x, y));
    printf("Test completed successfully!\n");
    
    return 0;
}
