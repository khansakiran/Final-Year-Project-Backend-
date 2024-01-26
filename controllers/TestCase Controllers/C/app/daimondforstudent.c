#include <stdio.h>

int main() {
    int n, space, i, j;
    printf("");
    scanf("%d", &n);

    // Upper part of the diamond
    for (i = 1; i <= n; i++) {
        // Print spaces
        for (space = 1; space <= n - i; space++) {
            printf(" ");
        }
        // Print asterisks
        for (j = 1; j <= 2 * i - 1; j++) {
            printf("*");
        }
        printf("\n");
    }

    // Lower part of the diamond
    for (i = n - 1; i >= 1; i--) {
        // Print spaces
        for (space = 1; space <= n - i; space++) {
            printf(" ");
        }
        // Print asterisks
        for (j = 1; j <= 2 * i - 1; j+=2) {
            printf("*");
        }
        printf("\n");
    }

    return 0;
}
