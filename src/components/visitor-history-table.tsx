/**
 * @fileoverview This component displays a table of a specific visitor's visit history.
 * It filters the global visitor data based on the provided visitor name and college.
 */
'use client';

import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getVisitorsFromStore } from '@/lib/data';
import type { Visitor } from '@/lib/types';

/**
 * The main component for the visitor history table.
 * @param {object} props - Component props.
 * @param {string} props.visitorName - The name of the visitor to show history for.
 * @param {string} props.college - The college/office of the visitor.
 */
export function VisitorHistoryTable({
  visitorName,
  college,
}: {
  visitorName: string;
  college: string;
}) {
  // State to hold the filtered visit history for the specific visitor.
  const [visitorHistory, setVisitorHistory] = React.useState<Visitor[]>([]);

  // Effect to load and filter data on mount and when visitor details change.
  React.useEffect(() => {
    const loadData = () => {
      const allVisitors = getVisitorsFromStore();
      // Filter the visitors to find matches for both name and college.
      const history = allVisitors.filter(
        (v) =>
          v.name.toLowerCase() === visitorName.toLowerCase() &&
          v.college === college
      );
      setVisitorHistory(history);
    };

    loadData();
    // Add an event listener to reload data when the window gains focus.
    window.addEventListener('focus', loadData);
    return () => {
      window.removeEventListener('focus', loadData);
    };
  }, [visitorName, college]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visit History</CardTitle>
        <CardDescription>
          A log of your recent visits to the library.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>College Department/Office</TableHead>
              <TableHead className="hidden md:table-cell">Entry Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visitorHistory.length > 0 ? (
              visitorHistory.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell className="font-medium">
                    {visit.entryTime.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{visit.entryTime.toLocaleTimeString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{visit.purpose}</Badge>
                  </TableCell>
                  <TableCell>{visit.college}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {visit.entryType}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No visit history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
