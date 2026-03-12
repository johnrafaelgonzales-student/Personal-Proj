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
      blocked: false,
    });
  }
  return visitors.sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime());
};

export const mockVisitors = generateMockVisitors(150);

export const mockUser = {
    name: 'Iglesia, Kim',
    email: 'kim.iglesia@neu.edu.ph',
    avatarUrl: 'https://picsum.photos/seed/librarian/100/100',
};


const VISITORS_STORAGE_KEY = 'libflow-visitors';

export const getVisitorsFromStore = (): Visitor[] => {
  if (typeof window === 'undefined') {
    return mockVisitors;
  }
  try {
    const storedVisitors = window.localStorage.getItem(VISITORS_STORAGE_KEY);
    if (storedVisitors) {
      const parsed = JSON.parse(storedVisitors) as any[];
      const visitors = parsed.map(v => ({ ...v, entryTime: new Date(v.entryTime) }));
      return visitors.sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime());
    } else {
      window.localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(mockVisitors));
      return mockVisitors;
    }
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return mockVisitors;
  }
};

export const addVisitorToStore = (visitorData: { name: string; purpose: VisitorPurpose }) => {
    if (typeof window === 'undefined') return;
    try {
        const currentVisitors = getVisitorsFromStore();
        const newVisitor: Visitor = {
            id: `vis-${Date.now()}`,
            name: visitorData.name,
            purpose: visitorData.purpose,
            entryTime: new Date(),
            entryType: 'manual',
            avatarUrl: `https://picsum.photos/seed/${encodeURIComponent(visitorData.name)}/100/100`,
            college: getRandomElement(colleges),
            blocked: false,
        };
        const updatedVisitors = [newVisitor, ...currentVisitors];
        window.localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(updatedVisitors));
    } catch (error) {
        console.error("Error writing to localStorage", error);
    }
};

export const toggleVisitorBlockStatus = (visitorId: string): Visitor[] => {
    if (typeof window === 'undefined') return [];
    try {
        const currentVisitors = getVisitorsFromStore();
        const updatedVisitors = currentVisitors.map(visitor => {
            if (visitor.id === visitorId) {
                return { ...visitor, blocked: !visitor.blocked };
            }
            return visitor;
        });
        window.localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(updatedVisitors));
        return updatedVisitors;
    } catch (error) {
        console.error("Error updating localStorage", error);
        return getVisitorsFromStore();
    }
};
