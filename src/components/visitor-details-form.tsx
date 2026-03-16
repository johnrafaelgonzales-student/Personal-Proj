/**
 * @fileoverview This component renders the second step of the visitor manual entry form,
 * where users provide their full name, role, purpose of visit, and department/office.
 */
'use client';
import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from '@/hooks/use-toast';
import { addVisitorToStore, colleges, offices } from '@/lib/data';

// Zod schema for form validation.
const formSchema = z
  .object({
    fullName: z.string().min(1, { message: 'Full name is required.' }),
    userType: z.enum(['student', 'teacher'], {
      required_error: 'You need to select a user type.',
    }),
    purpose: z.enum(['Research', 'Study', 'Borrow/Return', 'Event', 'Other']),
    otherPurpose: z.string().optional(),
    collegeOrOffice: z.string({ required_error: 'Please select a department/office.' }),
  })
  .refine(
    (data) => {
      if (data.purpose === 'Other') {
        return !!data.otherPurpose && data.otherPurpose.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Please specify the purpose.',
      path: ['otherPurpose'],
    }
  );

/**
 * Converts an email like "juan.delacruz@neu.edu.ph" to "Delacruz, Juan".
 * @param {string} email The visitor's email address.
 * @returns {string} The formatted name.
 */
const emailToName = (email: string): string => {
  if (!email.includes('@')) return email;
  const emailUser = email.split('@')[0];
  const nameParts = emailUser.split('.').map(
    part => part.charAt(0).toUpperCase() + part.slice(1)
  );
  if (nameParts.length > 1) {
    const lastName = nameParts.pop();
    return `${lastName}, ${nameParts.join(' ')}`;
  }
  return nameParts[0] || '';
};

/**
 * The main component for the visitor details form.
 */
export function VisitorDetailsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const email = searchParams.get('email') || '';
  const prefilledName = React.useMemo(() => emailToName(email), [email]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: prefilledName,
      userType: undefined,
      purpose: 'Study',
      collegeOrOffice: undefined,
      otherPurpose: '',
    },
  });

  const purposeValue = form.watch('purpose');
  const userTypeValue = form.watch('userType');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    form.setValue('fullName', prefilledName);
  }, [prefilledName, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    const finalPurpose =
      values.purpose === 'Other'
        ? values.otherPurpose!
        : values.purpose;

    addVisitorToStore({ 
      name: values.fullName, 
      purpose: finalPurpose, 
      college: values.collegeOrOffice 
    });

    toast({
      title: 'Entry Logged!',
      description: `Welcome, ${values.fullName}. Your visit has been recorded.`,
    });
    router.push(`/visitor-dashboard?name=${encodeURIComponent(values.fullName)}&college=${encodeURIComponent(values.collegeOrOffice)}`);
  }

  return (
    <Card className="w-full max-w-md bg-background/80 backdrop-blur-md text-foreground">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Visitor Details</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Please complete your details to log your visit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Dela Cruz, Juan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>I am a...</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="student" />
                        </FormControl>
                        <FormLabel className="font-normal">Student</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="teacher" />
                        </FormControl>
                        <FormLabel className="font-normal">Teacher/Employee</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {userTypeValue && <FormField
              control={form.control}
              name="collegeOrOffice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{userTypeValue === 'student' ? 'College Department' : 'Office'}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={`Select your ${userTypeValue === 'student' ? 'department' : 'office'}`} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {userTypeValue === 'student' && <SelectGroup>
                        <SelectLabel>Colleges</SelectLabel>
                        {colleges.map((college) => (
                          <SelectItem key={college} value={college}>
                            {college}
                          </SelectItem>
                        ))}
                      </SelectGroup>}
                      {userTypeValue === 'teacher' && Object.entries(offices).map(
                        ([group, officeList]) => (
                          <SelectGroup key={group}>
                            <SelectLabel>{group}</SelectLabel>
                            {officeList.map((office) => (
                              <SelectItem key={office} value={office}>
                                {office}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />}

            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose of Visit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a purpose" />
                      </SelectTrigger>
                    </FormControl>
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
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {purposeValue === 'Other' && (
              <FormField
                control={form.control}
                name="otherPurpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Please specify purpose</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Attend Seminar"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Log Visit'}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => router.push('/visitor-email-entry')}>
                &lt;-- Back
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
