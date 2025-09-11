'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generatePostsAction, type FormState } from '@/app/actions';
import { formSchema, type FormSchema } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';
import { PostResults } from './PostResults';

const platformOptions = [
  { value: 'Twitter', label: 'Twitter', icon: <Twitter className="h-5 w-5" /> },
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
      platform: 'Twitter',
      numberOfPosts: 3,
      likes: undefined,
      comments: undefined,
      shares: undefined,
      clicks: undefined,
      impressions: undefined,
      date_posted: undefined,
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
              <form onSubmit={onSubmit} className="space-y-6">
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

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>
                      <FormLabel>Optional: Add Analytics</FormLabel>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <FormField control={form.control} name="likes" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Likes</FormLabel>
                          <FormControl><Input type="number" placeholder="120" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="comments" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Comments</FormLabel>
                          <FormControl><Input type="number" placeholder="15" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="shares" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shares</FormLabel>
                          <FormControl><Input type="number" placeholder="8" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="clicks" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Clicks</FormLabel>
                          <FormControl><Input type="number" placeholder="40" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="impressions" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Impressions / Reach</FormLabel>
                          <FormControl><Input type="number" placeholder="2000" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="date_posted" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date Posted</FormLabel>
                          <FormControl><Input type="date" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isPending}>
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Posts
                </Button>
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
