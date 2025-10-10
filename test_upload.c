// Simple test file for SPECTRE
int add(int a, int b) {
    return a + b;
}

int multiply(int a, int b) {
    int result = 0;
    for (int i = 0; i < b; i++) {
        result = add(result, a);
    }
    return result;
}

int main() {
    int x = add(5, 3);
    int y = multiply(x, 2);
    return y;
}
