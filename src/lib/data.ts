import type { Visitor, VisitorPurpose, EntryType } from './types';

const firstNames = ['Aria', 'Leo', 'Zoe', 'Kai', 'Mia', 'Eli', 'Noa', 'Ian', 'Eva', 'Jax'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const colleges = ['College of Engineering', 'College of Science', 'College of Arts', 'Business School', 'Law School', 'Medical School'];
const purposes: VisitorPurpose[] = ['Research', 'Study', 'Borrow/Return', 'Event', 'Other'];
const entryTypes: EntryType[] = ['manual', 'rfid', 'email'];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Function to generate a random date within the last 90 days
const getRandomDate = (): Date => {
  const now = new Date();
  const aMonthAgo = new Date();
  aMonthAgo.setDate(now.getDate() - 90);
  const start = aMonthAgo.getTime();
  const end = now.getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime);
};

export const generateMockVisitors = (count: number): Visitor[] => {
  const visitors: Visitor[] = [];
  for (let i = 0; i < count; i++) {
    const firstName = getRandomElement(firstNames);
    const lastName = getRandomElement(lastNames);
    visitors.push({
      id: `vis-${i + 1}`,
      name: `${firstName} ${lastName}`,
      purpose: getRandomElement(purposes),
      entryTime: getRandomDate(),
      entryType: getRandomElement(entryTypes),
      avatarUrl: `https://picsum.photos/seed/user${(i % 5) + 1}/100/100`,
      college: getRandomElement(colleges),
    });
  }
  return visitors.sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime());
};

export const mockVisitors = generateMockVisitors(150);

export const mockUser = {
    name: 'Jane Doe',
    email: 'jane.doe@neu.edu',
    avatarUrl: 'https://picsum.photos/seed/librarian/100/100',
};
