export type VisitorPurpose = 'Research' | 'Study' | 'Borrow/Return' | 'Event' | 'Other';
export type EntryType = 'manual' | 'rfid' | 'email';

export type Visitor = {
  id: string;
  name: string;
  purpose: VisitorPurpose;
  entryTime: Date;
  entryType: EntryType;
  avatarUrl: string;
  college: string;
  blocked?: boolean;
};
