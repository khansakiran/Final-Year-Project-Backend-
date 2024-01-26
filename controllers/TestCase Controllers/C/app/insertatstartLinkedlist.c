#include <stdio.h>
#include <stdlib.h>

// Define a node structure for the linked list
struct Node {
    int data;
    struct Node* next;
};

// Function to insert a new node at the beginning of the linked list
void insertAtStart(struct Node** headRef, int newData) {
    // Allocate memory for a new node
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));

    // Check if memory allocation was successful
    if (newNode == NULL) {
        printf("");
        return;
    }

    // Assign data to the new node
    newNode->data = newData;

    // Set the next of the new node as the current head
    newNode->next = *headRef;

    // Move the head to point to the new node
    *headRef = newNode;
}

// Function to print the linked list
void printList(struct Node* node) {
    while (node != NULL) {
        printf("%d -> ", node->data);
        node = node->next;
    }
    // printf("");
}

int main() {
    // Creating a linked list 3->4->5->NULL
    struct Node* head = NULL;

    // Creating nodes 5, 4, and 3
    insertAtStart(&head, 5);
    insertAtStart(&head, 4);
    insertAtStart(&head, 3);

    // Print the original linked list

    int num;

    printf("");
    scanf("%d", &num);

    // Insert the number at the beginning
    insertAtStart(&head, num);

    // Print the updated linked list
    printList(head);

    return 0;
}
