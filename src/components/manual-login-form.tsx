/**
 * @fileoverview This component renders the form for manual login.
 * It dynamically changes its fields and validation based on whether the user
 * is an 'admin' or a 'visitor', determined by a URL query parameter.
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
import { useToast } from '@/hooks/use-toast';
import { addVisitorToStore, colleges, offices } from '@/lib/data';

// Zod schema for admin login validation.
const adminSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

// Zod schema for visitor login validation.
const visitorSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'Please enter a valid email.' })
      // Custom validation to ensure it's an institutional email.
      .refine((email) => email.endsWith('@neu.edu.ph'), {
        message: 'Please use your institutional @neu.edu.ph email.',
      }),
    purpose: z.enum(['Research', 'Study', 'Borrow/Return', 'Event', 'Other']),
    otherPurpose: z.string().optional(),
    college: z.string({ required_error: 'Please select a college/office.' }),
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
 * The main component for the manual login form.
 */
export function ManualLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const role = searchParams.get('role');
  const is_admin = role === 'admin';

  // Select the appropriate validation schema based on the user's role.
  const formSchema = is_admin ? adminSchema : visitorSchema;

  // Initialize React Hook Form with the correct schema and default values.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: is_admin
      ? { email: '', password: '' }
      : {
          email: '',
          purpose: 'Study',
          college: undefined,
          otherPurpose: '',
        },
  });

  const purposeValue = form.watch('purpose');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  /**
   * Handles form submission for both admins and visitors.
   * @param {z.infer<typeof formSchema>} values - The validated form values.
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
    setIsSubmitting(false);

    if (is_admin) {
      // Admin login logic
      const adminValues = values as z.infer<typeof adminSchema>;
      // Hardcoded credentials for the admin.
      if (
        adminValues.email === 'jcesperanza@neu.edu.ph' &&
        adminValues.password === 'adminsisir123'
      ) {
        console.log('Admin login successful:', values);
        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid Credentials',
          description: 'Please check your email and password.',
        });
      }
    } else {
      // Visitor login logic
      const visitorValues = values as z.infer<typeof visitorSchema>;
      console.log('Visitor entry:', visitorValues);

      // Helper function to convert email to a formatted name.
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
      
      const derivedName = emailToName(visitorValues.email);
      const finalPurpose =
        visitorValues.purpose === 'Other'
          ? visitorValues.otherPurpose!
          : visitorValues.purpose;

      // Add the new visitor to the local storage "database".
      addVisitorToStore({ 
        name: derivedName, 
        purpose: finalPurpose, 
        college: visitorValues.college 
      });

      toast({
        title: 'Entry Logged!',
        description: `Welcome, ${derivedName}. Your visit has been recorded.`,
      });
      // Redirect to the visitor dashboard, passing the name and college in the URL.
      router.push(`/visitor-dashboard?name=${encodeURIComponent(derivedName)}&college=${encodeURIComponent(visitorValues.college)}`);
    }
  }

  return (
    <Card className="w-full max-w-md bg-background/80 backdrop-blur-md text-foreground">
      <CardHeader>
        <CardTitle className="text-center text-2xl capitalize">Manual {role} Entry</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          {is_admin ? 'Please enter your credentials.' : 'Please enter your details.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {is_admin ? (
              // Admin-specific form fields
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              // Visitor-specific form fields
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Institutional Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="juan.delacruz@neu.edu.ph"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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

                <FormField
                  control={form.control}
                  name="college"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>College Department/Office</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your department/office" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Colleges</SelectLabel>
                            {colleges.map((college) => (
                              <SelectItem key={college} value={college}>
                                {college}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                          {Object.entries(offices).map(
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
                />
              </>
            )}
            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
              {isSubmitting ? <Loader2 className="animate-spin" /> : is_admin ? 'Log In' : 'Log Visit'}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => router.push('/')}>
                Cancel
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
