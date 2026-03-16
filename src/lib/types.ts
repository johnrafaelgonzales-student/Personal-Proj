/**
 * @fileoverview This file defines the core TypeScript types used throughout the application.
 * Centralizing type definitions helps maintain data consistency and improves code quality.
 */

// Defines the possible purposes for a library visit.
export type VisitorPurpose = string;
// Defines the possible methods of entry.
export type EntryType = 'manual' | 'rfid' | 'email';

/**
 * Defines the main data structure for a single visitor entry.
 */
export type Visitor = {
  id: string; // Unique identifier for the entry
  name: string; // Name of the visitor
  purpose: VisitorPurpose; // Purpose of the visit
  entryTime: Date; // Timestamp of the entry
  entryType: EntryType; // How the entry was logged
  avatarUrl: string; // URL for the visitor's avatar image
  college: string; // The college or office the visitor belongs to
  blocked?: boolean; // Optional flag to indicate if the visitor is blocked
};
