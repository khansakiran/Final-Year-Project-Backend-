#include <stdio.h>

int main() {
    int arr[100]; // Assuming a maximum array size of 100
    int length;

    printf("");
    scanf("%d", &length);

    printf("Enter %d elements:\n", length);
    for (int i = 0; i < length; i++) {
        scanf("%d", &arr[i]);
    }

    // Displaying elements of original array
    // Sort the array in ascending order
    for (int i = 0; i < length; i++) {
        for (int j = i + 1; j < length; j++) {
            if (arr[i] > arr[j]) {
                int temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
            }
        }
    }

    printf("\n");

    // Displaying elements of array after sorting
    printf("");
    for (int i = 0; i < length; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}
