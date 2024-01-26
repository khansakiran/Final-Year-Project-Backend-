#include <stdio.h>

int main() {
    int i, j, rows;

    // Get the number of rows from the user
    printf("");
    scanf("%d", &rows);

    // Print the upper part of the diamond
    for (i = 1; i <= rows; i++) {
        // Print spaces
        for (j = 1; j <= rows - i; j++) {
            printf(" ");
        }

        // Print stars
        for (j = 1; j <= 2 * i - 1; j++) {
            printf("*");
        }

        // Move to the next line
        printf("\n");
    }

    // Print the lower part of the diamond
    for (i = rows - 1; i >= 1; i--) {
        // Print spaces
        for (j = 1; j <= rows - i; j++) {
            printf(" ");
        }

        // Print stars
        for (j = 1; j <= 2 * i - 1; j++) {
            printf("*");
        }

        // Move to the next line
        printf("\n");
    }

    return 0;
}
