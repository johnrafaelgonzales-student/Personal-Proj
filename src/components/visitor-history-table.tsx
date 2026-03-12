'use client';

import * as React from 'react';
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
import { Badge } from '@/components/ui/badge';
import { mockVisitors } from '@/lib/data';
import { FileWarning } from 'lucide-react';

// For demonstration, we'll show the history for the first mock user.
// In a real app, this would be the currently logged-in user.
const userToDisplay = mockVisitors[0];
const userHistory = mockVisitors.filter(visitor => visitor.name === userToDisplay.name);

export function VisitorHistoryTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Recent Visits</CardTitle>
        <CardDescription>A log of your recent library entries.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Purpose</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userHistory.length > 0 ? (
              userHistory.slice(0, 5).map((visit) => { // Show up to 5 most recent visits
                return (
                    <TableRow key={visit.id}>
                    <TableCell>{visit.entryTime.toLocaleString()}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{visit.purpose}</Badge>
                    </TableCell>
                    </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="h-24 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FileWarning className="h-8 w-8" />
                    No recent visits found.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
