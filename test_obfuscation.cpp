#include <iostream>
#include <string>
#include <vector>

using namespace std;

class Calculator {
private:
    int result;
    
public:
    Calculator() : result(0) {}
    
    int add(int a, int b) {
        result = a + b;
        return result;
    }
    
    int multiply(int a, int b) {
        result = a * b;
        return result;
    }
    
    void display() {
        cout << "Result: " << result << endl;
    }
};

int main() {
    cout << "=== SPECTRE C++ Obfuscation Test ===" << endl;
    
    Calculator calc;
    
    int sum = calc.add(15, 25);
    cout << "Addition: 15 + 25 = " << sum << endl;
    
    int product = calc.multiply(5, 8);
    cout << "Multiplication: 5 * 8 = " << product << endl;
    
    calc.display();
    
    // Test with vector
    vector<int> numbers = {1, 2, 3, 4, 5};
    int total = 0;
    for(int num : numbers) {
        total += num;
    }
    cout << "Vector sum: " << total << endl;
    
    cout << "C++ Obfuscation test successful!" << endl;
    
    return 0;
}
