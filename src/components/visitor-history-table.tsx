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
import { mockVisitors } from '@/lib/data';
import type { Visitor } from '@/lib/types';

// Let's take a slice of the data to represent a single visitor's history
const visitorHistory: Visitor[] = mockVisitors.slice(0, 8);

export function VisitorHistoryTable() {
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
                  <TableCell className="hidden md:table-cell">
                    {visit.entryType}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
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
