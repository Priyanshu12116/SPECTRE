// C++ test file for SPECTRE
class Calculator {
private:
    int result;

public:
    Calculator() : result(0) {}
    
    int add(int a, int b) {
        return a + b;
    }
    
    int multiply(int a, int b) {
        result = 0;
        for (int i = 0; i < b; i++) {
            result = add(result, a);
        }
        return result;
    }
    
    int getResult() {
        return result;
    }
};

int main() {
    Calculator calc;
    int x = calc.add(5, 3);
    int y = calc.multiply(x, 2);
    return y;
}
