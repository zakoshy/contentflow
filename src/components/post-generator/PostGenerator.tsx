
'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generatePostsAction, type FormState } from '@/app/actions';
import { formSchema, type FormSchema } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Linkedin, Instagram, Facebook } from 'lucide-react';
import { PostResults } from './PostResults';
import { SocialIcon } from './SocialIcon';

const platformOptions = [
  { value: 'X', label: 'Twitter', icon: <SocialIcon platform="X" className="h-5 w-5" /> },
  { value: 'LinkedIn', label: 'LinkedIn', icon: <Linkedin className="h-5 w-5" /> },
  { value: 'Instagram', label: 'Instagram', icon: <Instagram className="h-5 w-5" /> },
  { value: 'Facebook', label: 'Facebook', icon: <Facebook className="h-5 w-5" /> },
] as const;

const initialState: FormState = {
  message: '',
};

export function PostGenerator() {
  const [formState, formAction] = useActionState(generatePostsAction, initialState);
  const [isPending, startTransition] = useTransition();
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: '',
      topics: '',
      platform: 'X',
      numberOfPosts: 3,
    },
  });

  useEffect(() => {
    if (formState.message && !isPending) {
      if (formState.error) {
        toast({
          variant: 'destructive',
          title: 'Error generating posts',
          description: formState.message,
        });
      } else {
         setShowResults(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState, isPending]);
  
  const onSubmit = form.handleSubmit((data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });
    startTransition(() => {
      setShowResults(false);
      formAction(formData);
    });
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Create New Posts</CardTitle>
            <CardDescription>Fill in the details below to generate social media posts using AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-8">
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., BlueRide" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="topics"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topics / Keywords</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., eco-friendly transport, boat rides in Kenya" {...field} />
                        </FormControl>
                        <FormDescription>Comma-separated list of topics.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Generate Posts
                  </Button>

                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Social Media Platform</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            {platformOptions.map((option) => (
                              <FormItem key={option.value} className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                                </FormControl>
                                <Label
                                  htmlFor={option.value}
                                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary w-full cursor-pointer"
                                >
                                  {option.icon}
                                  {option.label}
                                </Label>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numberOfPosts"
                    render={({ field: { onChange, value } }) => (
                      <FormItem>
                        <FormLabel>Number of Posts ({value})</FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={5}
                            step={1}
                            value={[value]}
                            onValueChange={(vals) => onChange(vals[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        {isPending ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh] rounded-lg border border-dashed shadow-sm bg-card">
            <div className="text-center space-y-4 p-8">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <h3 className="text-xl font-semibold">Generating your posts...</h3>
              <p className="text-muted-foreground">The AI is working its magic. This may take a moment.</p>
            </div>
          </div>
        ) : (
          <PostResults data={showResults ? formState.data : undefined} />
        )}
      </div>
    </div>
  );
}
