#include <stdio.h>

int add(int a, int b) {
    return a + b;
}

int main() {
    int x = 10;
    int y = 20;
    int result = add(x, y);
    
    printf("Testing SPECTRE Obfuscation\n");
    printf("Result: %d + %d = %d\n", x, y, result);
    printf("Obfuscation test successful!\n");
    
    return 0;
}
