/**
 * @fileoverview This component provides a dialog form for admins to manually log a visitor entry.
 * It includes fields for the visitor's email, purpose of visit, and college/department.
 */
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addVisitorToStore, colleges, offices } from '@/lib/data';

// Zod schema for form validation.
const formSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email.' })
    // Ensures the email is an institutional one.
    .refine((email) => email.endsWith('@neu.edu.ph'), {
      message: 'Please use an institutional @neu.edu.ph email.',
    }),
  purpose: z.enum(['Research', 'Study', 'Borrow/Return', 'Event', 'Other']),
  college: z.string({ required_error: 'Please select a college/office.' }),
});

/**
 * Converts an email like "juan.delacruz@neu.edu.ph" to "Delacruz, Juan".
 * @param {string} email The visitor's email address.
 * @returns {string} The formatted name.
 */
const emailToName = (email: string): string => {
  if (!email.includes('@')) return email;
  const emailUser = email.split('@')[0];
  const nameParts = emailUser
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
  if (nameParts.length > 1) {
    const lastName = nameParts.pop();
    return `${lastName}, ${nameParts.join(' ')}`;
  }
  return nameParts[0] || '';
};

/**
 * The main component for the manual entry form, wrapped in a dialog.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The trigger element for the dialog.
 */
export function ManualEntryForm({ children }: { children: React.ReactNode }) {
  // State to control the dialog's open/closed status.
  const [open, setOpen] = React.useState(false);
  // State to handle the submission loading indicator.
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  // React Hook Form setup.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      purpose: 'Study',
      college: undefined,
    },
  });

  /**
   * Handles the form submission.
   * @param {z.infer<typeof formSchema>} values - The validated form values.
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // Derives the name from the email.
    const derivedName = emailToName(values.email);
    // Adds the new visitor entry to the local storage "database".
    addVisitorToStore({
      name: derivedName,
      purpose: values.purpose,
      college: values.college,
    });

    // Simulate network delay.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setOpen(false);
    form.reset();
    toast({
      title: 'Success!',
      description: `Visitor "${derivedName}" from ${values.college} has been logged successfully.`,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manual Visitor Entry</DialogTitle>
          <DialogDescription>
            Log a new visitor entry. The current date and time will be
            automatically recorded.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            {/* Email Input Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visitor Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., juan.delacruz@neu.edu.ph"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Purpose of Visit Select Field */}
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose of Visit</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Research">Research</SelectItem>
                        <SelectItem value="Study">Study</SelectItem>
                        <SelectItem value="Borrow/Return">
                          Borrow/Return
                        </SelectItem>
                        <SelectItem value="Event">Event</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* College/Office Select Field */}
            <FormField
              control={form.control}
              name="college"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>College Department/Office</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a department/office" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Colleges</SelectLabel>
                          {colleges.map((college) => (
                            <SelectItem key={college} value={college}>
                              {college}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                        {Object.entries(offices).map(([group, officeList]) => (
                          <SelectGroup key={group}>
                            <SelectLabel>{group}</SelectLabel>
                            {officeList.map((office) => (
                              <SelectItem key={office} value={office}>
                                {office}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>Logging...</span>
                  </>
                ) : (
                  'Log Entry'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
