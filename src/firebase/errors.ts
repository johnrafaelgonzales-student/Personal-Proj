/**
 * @fileoverview This file defines custom error types for the application, specifically for Firestore permissions.
 */

/**
 * Defines the context for a Firestore security rule denial.
 * This information is used to create a detailed error message for developers.
 */
export type SecurityRuleContext = {
    path: string;
    operation: 'get' | 'list' | 'create' | 'update' | 'delete';
    requestResourceData?: any;
};

/**
 * A custom error class that is thrown when a Firestore operation is denied by security rules.
 * It formats the security rule context into a human-readable message, which is especially useful
 * in development for debugging security rules.
 */
export class FirestorePermissionError extends Error {
    public readonly context: SecurityRuleContext;

    constructor(context: SecurityRuleContext) {
        const message = `FirestoreError: Missing or insufficient permissions: The following request was denied by Firestore Security Rules:\n${JSON.stringify(context, null, 2)}`;
        super(message);
        this.name = 'FirestorePermissionError';
        this.context = context;
        // This line is to ensure that `instanceof` works correctly.
        Object.setPrototypeOf(this, FirestorePermissionError.prototype);
    }
}
