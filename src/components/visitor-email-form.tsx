/**
 * @fileoverview This component provides a form for the first step of visitor manual entry,
 * requiring the user to input their institutional email address.
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

// Zod schema to validate the institutional email format.
const formSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email.' })
    .refine((email) => email.endsWith('@neu.edu.ph'), {
      message: 'Please use your institutional @neu.edu.ph email.',
    }),
});

/**
 * The main component for the visitor email entry form.
 */
export function VisitorEmailForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '' },
  });

  /**
   * Handles form submission. On success, it redirects to the next step
   * of the form, passing the email as a query parameter.
   * @param {z.infer<typeof formSchema>} values - The validated form values.
   */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate validation
    setIsSubmitting(false);
    router.push(`/visitor-details-entry?email=${encodeURIComponent(values.email)}`);
  }

  return (
    <Card className="w-full max-w-md bg-background/80 backdrop-blur-md text-foreground">
      <CardHeader>
        <CardTitle className="text-center text-2xl">Visitor Entry</CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Please enter your institutional email to proceed.
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
            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Next'}
            </Button>
            <Button type="button" variant="ghost" className="w-full" onClick={() => router.push('/login?role=visitor')}>
              &lt;-- Back
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
