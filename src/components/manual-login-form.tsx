/**
 * @fileoverview This component renders the form for manual admin login.
 * It includes fields for email and password, and validates the credentials upon submission.
 */
'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

// Zod schema for admin login validation.
const adminSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

/**
 * The main component for the manual admin login form.
 */
export function ManualLoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  // Initialize React Hook Form with the admin schema.
  const form = useForm<z.infer<typeof adminSchema>>({
    resolver: zodResolver(adminSchema),
    defaultValues: { email: '', password: '' },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  /**
   * Handles form submission for admins.
   * @param {z.infer<typeof adminSchema>} values - The validated form values.
   */
  async function onSubmit(values: z.infer<typeof adminSchema>) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
    setIsSubmitting(false);

    // Hardcoded credentials for the admin.
    if (
      values.email === 'jcesperanza@neu.edu.ph' &&
      values.password === 'adminsisir123'
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
  }

  return (
    <Card className="w-full max-w-md bg-background/80 backdrop-blur-md text-foreground">
      <CardHeader>
        <CardTitle className="text-center text-2xl capitalize">Admin Login</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Please enter your credentials.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Log In'}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => router.push('/login?role=admin')}>
                &lt;-- Back
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
