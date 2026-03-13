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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addVisitorToStore } from '@/lib/data';

const adminSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

const visitorSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  purpose: z.enum(['Research', 'Study', 'Borrow/Return', 'Event', 'Other']),
});

export function ManualLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const role = searchParams.get('role');
  const is_admin = role === 'admin';

  const formSchema = is_admin ? adminSchema : visitorSchema;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: is_admin ? { email: '', password: '' } : { name: '', purpose: 'Study' },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);

    if (is_admin) {
      const adminValues = values as z.infer<typeof adminSchema>;
      if (
        adminValues.email === 'johnrafael.gonzales@neu.edu.ph' &&
        adminValues.password === 'Akobossdto23'
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
      const visitorValues = values as z.infer<typeof visitorSchema>;
      console.log('Visitor entry:', visitorValues);

      // Add visitor to our "database"
      addVisitorToStore(visitorValues);

      toast({
        title: 'Entry Logged!',
        description: `Welcome, ${visitorValues.name}. Your visit has been recorded.`,
      });
      router.push(`/visitor-dashboard?name=${encodeURIComponent(visitorValues.name)}`);
    }
  }

  return (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader>
        <CardTitle className="text-center text-2xl capitalize">Manual {role} Entry</CardTitle>
        <CardDescription className="text-center text-gray-300">
          {is_admin ? 'Please enter your credentials.' : 'Please enter your details.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {is_admin ? (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="admin@example.com" {...field} className="bg-white/20 border-white/30 placeholder:text-gray-400" />
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
                        <Input type="password" placeholder="********" {...field} className="bg-white/20 border-white/30 placeholder:text-gray-400"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., John Doe" {...field} className="bg-white/20 border-white/30 placeholder:text-gray-400" />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white/20 border-white/30">
                            <SelectValue placeholder="Select a purpose" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Research">Research</SelectItem>
                          <SelectItem value="Study">Study</SelectItem>
                          <SelectItem value="Borrow/Return">Borrow/Return</SelectItem>
                          <SelectItem value="Event">Event</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
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
            <Button type="button" variant="ghost" className="w-full hover:bg-white/20" onClick={() => router.back()}>
                Cancel
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
