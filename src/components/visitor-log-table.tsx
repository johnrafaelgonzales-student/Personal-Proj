'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  FileWarning,
  Eye,
  Ban,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

const PAGE_SIZE = 10;

export function VisitorLogTable() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [data, setData] = React.useState<Visitor[]>([]);

  React.useEffect(() => {
    const loadData = () => setData(getVisitorsFromStore());
    loadData();

    // Reload data when the window gets focus to see new entries from other tabs
    window.addEventListener('focus', loadData);
    return () => {
      window.removeEventListener('focus', loadData);
    };
  }, []);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentData = data.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors</CardTitle>
        <CardDescription>
          A log of all recent visitor entries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead className="hidden md:table-cell">Entry Type</TableHead>
              <TableHead className="hidden md:table-cell">
                Entry Time
              </TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((visitor) => (
                <TableRow key={visitor.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt="Visitor avatar"
                      className="aspect-square rounded-full object-cover"
                      height="40"
                      src={visitor.avatarUrl}
                      width="40"
                      data-ai-hint="person portrait"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{visitor.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{visitor.purpose}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {visitor.entryType}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {visitor.entryTime.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                            <Ban className="mr-2 h-4 w-4" />
                            Block User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  <div className="flex flex-col items-center gap-2">
                    <FileWarning className="h-8 w-8" />
                    No visitors found.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
          <div>
            Showing{' '}
            <strong>
              {Math.min(startIndex + 1, data.length)}-{Math.min(endIndex, data.length)}
            </strong>{' '}
            of <strong>{data.length}</strong> visitors
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
