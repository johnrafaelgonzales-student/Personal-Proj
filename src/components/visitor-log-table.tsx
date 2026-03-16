/**
 * @fileoverview This component renders a paginated table of all visitor logs for the admin.
 * It includes functionality to view visitor details and to block/unblock visitors.
 */
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
  CheckCircle,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getVisitorsFromStore,
  toggleVisitorBlockStatus,
  colleges,
  offices,
} from '@/lib/data';
import type { Visitor } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const PAGE_SIZE = 10;
const staffDepartments = Object.values(offices).flat();

/**
 * The main component for the admin's visitor log table.
 */
export function VisitorLogTable() {
  // State for managing pagination.
  const [currentPage, setCurrentPage] = React.useState(1);
  // State to hold all visitor data.
  const [data, setData] = React.useState<Visitor[]>([]);
  const { toast } = useToast();
  // State to hold the visitor currently being viewed in the details dialog.
  const [selectedVisitor, setSelectedVisitor] = React.useState<Visitor | null>(
    null
  );

  // State for filters
  const [purposeFilter, setPurposeFilter] = React.useState('all');
  const [userTypeFilter, setUserTypeFilter] = React.useState('all');

  // Effect to load data from local storage on mount and on window focus.
  React.useEffect(() => {
    const loadData = () => setData(getVisitorsFromStore());
    loadData();

    window.addEventListener('focus', loadData);
    return () => {
      window.removeEventListener('focus', loadData);
    };
  }, []);

  const purposes = React.useMemo(() => {
    const allPurposes = data.map((visitor) => visitor.purpose);
    return [...new Set(allPurposes)].sort();
  }, [data]);

  // Reset page to 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [purposeFilter, userTypeFilter]);

  const filteredData = React.useMemo(() => {
    return data.filter((visitor) => {
      const purposeMatch =
        purposeFilter === 'all' || visitor.purpose === purposeFilter;

      const isStudent = colleges.includes(visitor.college);
      const isStaff = staffDepartments.includes(visitor.college);

      const userTypeMatch =
        userTypeFilter === 'all' ||
        (userTypeFilter === 'student' && isStudent) ||
        (userTypeFilter === 'staff' && isStaff);

      return purposeMatch && userTypeMatch;
    });
  }, [data, purposeFilter, userTypeFilter]);

  // Pagination calculations.
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentData = filteredData.slice(startIndex, endIndex);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  /**
   * Handles the action of blocking or unblocking a visitor.
   * @param {string} visitorId - The ID of the visitor.
   * @param {string} visitorName - The name of the visitor.
   * @param {boolean} isBlocked - The current blocked status.
   */
  const handleToggleBlock = (
    visitorId: string,
    visitorName: string,
    isBlocked: boolean
  ) => {
    // Calls the utility function to update the visitor's status in local storage.
    const updatedVisitors = toggleVisitorBlockStatus(visitorId);
    setData(updatedVisitors); // Refresh the local state to re-render the table.
    toast({
      title: `Visitor ${isBlocked ? 'Unblocked' : 'Blocked'}`,
      description: `${visitorName} has been ${
        isBlocked ? 'unblocked' : 'blocked'
      }.`,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <CardTitle>Visitors</CardTitle>
              <CardDescription>
                A log of all recent visitor entries.
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={purposeFilter} onValueChange={setPurposeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Purposes</SelectItem>
                  {purposes.map((purpose) => (
                    <SelectItem key={purpose} value={purpose}>
                      {purpose}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All User Types</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="staff">Staff/Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
                <TableHead className="hidden md:table-cell">
                  College/Office
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Entry Type
                </TableHead>
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
                  <TableRow
                    key={visitor.id}
                    className={visitor.blocked ? 'bg-destructive/10' : ''}
                  >
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
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {visitor.name}
                        {visitor.blocked && (
                          <Badge variant="destructive">Blocked</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{visitor.purpose}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {visitor.college}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {visitor.entryType}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {visitor.entryTime.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {/* Dropdown menu for actions */}
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
                          <DropdownMenuItem
                            onClick={() => setSelectedVisitor(visitor)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleBlock(
                                visitor.id,
                                visitor.name,
                                !!visitor.blocked
                              )
                            }
                            className={
                              !visitor.blocked
                                ? 'text-destructive focus:bg-destructive/10 focus:text-destructive'
                                : 'focus:text-primary'
                            }
                          >
                            {visitor.blocked ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Unblock User</span>
                              </>
                            ) : (
                              <>
                                <Ban className="mr-2 h-4 w-4" />
                                <span>Block User</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
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
          {/* Pagination controls */}
          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <div>
              Showing{' '}
              <strong>
                {Math.min(startIndex + 1, filteredData.length)}-
                {Math.min(endIndex, filteredData.length)}
              </strong>{' '}
              of <strong>{filteredData.length}</strong> visitors
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
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next</span>
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      {/* Dialog for viewing visitor details */}
      <Dialog
        open={!!selectedVisitor}
        onOpenChange={(isOpen) => !isOpen && setSelectedVisitor(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedVisitor?.name}</DialogTitle>
            <DialogDescription>
              Details for the visitor entry.
            </DialogDescription>
          </DialogHeader>
          {selectedVisitor && (
            <div className="grid gap-2 py-4 text-sm">
              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <p className="font-medium text-muted-foreground">Purpose</p>
                <p>{selectedVisitor.purpose}</p>
              </div>
              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <p className="font-medium text-muted-foreground">
                  College/Office
                </p>
                <p>{selectedVisitor.college}</p>
              </div>
              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <p className="font-medium text-muted-foreground">
                  Entry Time
                </p>
                <p>{selectedVisitor.entryTime.toLocaleString()}</p>
              </div>
              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <p className="font-medium text-muted-foreground">
                  Entry Type
                </p>
                <p>{selectedVisitor.entryType}</p>
              </div>
              <div className="grid grid-cols-[120px_1fr] items-center gap-4">
                <p className="font-medium text-muted-foreground">Status</p>
                <p>
                  {selectedVisitor.blocked ? (
                    <Badge variant="destructive">Blocked</Badge>
                  ) : (
                    <Badge variant="secondary">Active</Badge>
                  )}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelectedVisitor(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
