/**
 * @fileoverview This file contains mock data and data-handling utility functions for the application.
 * In a real-world scenario, this would be replaced with API calls to a backend service.
 * For this prototype, it uses localStorage to simulate a persistent database.
 */
import type { Visitor, VisitorPurpose, EntryType } from './types';

// Mock data for generating random visitor entries.
const firstNames = ['Aria', 'Leo', 'Zoe', 'Kai', 'Mia', 'Eli', 'Noa', 'Ian', 'Eva', 'Jax'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
export const colleges = [
  'College of Accountancy',
  'College of Agriculture',
  'College of Arts and Sciences',
  'College of Business Administration',
  'College of Communication',
  'College of Informatics and Computing Studies',
  'College of Criminology',
  'College of Education',
  'College of Engineering and Architecture',
  'College of Medical Technology',
  'College of Midwifery',
  'College of Music',
  'College of Nursing',
  'College of Physical Therapy',
  'College of Respiratory Therapy',
  'School of International Relations',
];

export const offices = {
  "Executive / Administration Offices": ["Office of the President", "Office of the Vice President for Academic Affairs", "Office of the Vice President for Administration", "Office of the Vice President for Finance", "Legal Affairs Office"],
  "Academic Administration": ["Registrar / Records and Registration Management Office (RRMO)", "Admissions Office", "Research and Development Office", "Center for Continuing Professional Development (CCPD)", "Quality Assurance Office", "Curriculum Development Office"],
  "Student Services Offices": ["Office of Student Development (OSD)", "Guidance and Counseling Office", "University Clinic / Health Services Office", "Scholarship and Financial Assistance Office", "Student Affairs Office"],
  "Financial Offices": ["Accounting Office", "Cashier’s Office", "Budget Office", "Auditing Office"],
  "Human Resource & Administration": ["Human Resource Management Office (HRMO)", "General Services Office", "Procurement / Supply Office", "Property and Facilities Management Office", "Records Management Office"],
  "Technology & Information Offices": ["Computer Services Department (CSD)", "Management Information Systems Office", "Data Privacy Office"],
  "Academic Resource Offices": ["Library Department", "University Clinic / Health Services Office", "Testing and Evaluation Center", "Research Center", "Laboratory Services Office", "Publications and Media Office"],
  "Other Institutional Offices": ["Integrated School Office (K–12 administration)", "Graduate School Office", "International Affairs / External Relations Office", "Alumni Affairs Office", "Community Extension Services Office", "Public Affairs / Public Relations Office"]
};

const allDepartments = [...colleges, ...Object.values(offices).flat()];
const purposes: VisitorPurpose[] = ['Research', 'Study', 'Borrow/Return', 'Event', 'Other'];
const entryTypes: EntryType[] = ['manual', 'rfid', 'email'];

const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Generates a random date within the last 90 days.
const getRandomDate = (): Date => {
  const now = new Date();
  const aMonthAgo = new Date();
  aMonthAgo.setDate(now.getDate() - 90);
  const start = aMonthAgo.getTime();
  const end = now.getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime);
};

/**
 * Generates a specified number of mock visitor records.
 * @param {number} count - The number of mock visitors to generate.
 * @returns {Visitor[]} An array of mock visitor objects.
 */
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
      college: getRandomElement(allDepartments),
      blocked: false,
    });
  }
  return visitors.sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime());
};

// A pre-generated list of mock visitors.
export const mockVisitors = generateMockVisitors(150);

// Mock data for a logged-in user.
export const mockUser = {
    name: 'Iglesia, Kim',
    email: 'kim.iglesia@neu.edu.ph',
    avatarUrl: 'https://picsum.photos/seed/librarian/100/100',
};

const VISITORS_STORAGE_KEY = 'libflow-visitors';

/**
 * Retrieves visitor data from localStorage. If no data is found, it initializes
 * localStorage with the mock data.
 * @returns {Visitor[]} The array of visitor objects.
 */
export const getVisitorsFromStore = (): Visitor[] => {
  if (typeof window === 'undefined') {
    return mockVisitors; // Return mock data during server-side rendering
  }
  try {
    const storedVisitors = window.localStorage.getItem(VISITORS_STORAGE_KEY);
    if (storedVisitors) {
      const parsed = JSON.parse(storedVisitors) as any[];
      // Convert date strings back to Date objects.
      const visitors = parsed.map(v => ({ ...v, entryTime: new Date(v.entryTime) }));
      return visitors.sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime());
    } else {
      // Initialize localStorage if it's empty.
      window.localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(mockVisitors));
      return mockVisitors;
    }
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return mockVisitors;
  }
};

/**
 * Adds a new visitor entry to localStorage.
 * @param {object} visitorData - The data for the new visitor.
 */
export const addVisitorToStore = (visitorData: { name: string; purpose: VisitorPurpose; college: string; }) => {
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
            college: visitorData.college,
            blocked: false,
        };
        const updatedVisitors = [newVisitor, ...currentVisitors];
        window.localStorage.setItem(VISITORS_STORAGE_KEY, JSON.stringify(updatedVisitors));
    } catch (error) {
        console.error("Error writing to localStorage", error);
    }
};

/**
 * Toggles the 'blocked' status of a visitor in localStorage.
 * @param {string} visitorId - The ID of the visitor to update.
 * @returns {Visitor[]} The updated list of visitors.
 */
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
