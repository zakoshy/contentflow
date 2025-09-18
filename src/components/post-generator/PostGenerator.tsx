
'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generatePostsAction, type FormState } from '@/app/actions';
import { formSchema, type FormSchema } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Linkedin, Instagram, Facebook } from 'lucide-react';
import { PostResults } from './PostResults';
import { SocialIcon } from './SocialIcon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '../ui/checkbox';

const platformOptions = [
  { value: 'X', label: 'Twitter', icon: <SocialIcon platform="X" className="h-5 w-5" /> },
  { value: 'LinkedIn', label: 'LinkedIn', icon: <Linkedin className="h-5 w-5" /> },
  { value: 'Instagram', label: 'Instagram', icon: <Instagram className="h-5 w-5" /> },
  { value: 'Facebook', label: 'Facebook', icon: <Facebook className="h-5 w-5" /> },
  { value: 'TikTok', label: 'TikTok', icon: <SocialIcon platform="TikTok" className="h-5 w-5" /> },
] as const;

export function PostGenerator() {
  const [formState, setFormState] = useState<FormState>({ message: '' });
  const [isPending, setIsPending] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: '',
      topics: '',
      platforms: ['X'],
      numberOfPosts: 3,
      tone: 'Casual',
      language: 'English',
    },
  });

  const onSubmit = async (data: FormSchema) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'platforms' && Array.isArray(value)) {
        value.forEach(platform => formData.append('platforms', platform));
      } else if (value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });

    setIsPending(true);
    setShowResults(false);
    const result = await generatePostsAction(formState, formData);
    setFormState(result);
    setIsPending(false);
  };
  
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Company Name" {...field} />
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
                        <Textarea placeholder="e.g., AI, Machine Learning, SaaS" {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated list of topics.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="platforms"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Social Media Platforms</FormLabel>
                        <FormDescription>
                          Select one or more platforms to generate posts for.
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {platformOptions.map((option) => (
                        <FormField
                          key={option.value}
                          control={form.control}
                          name="platforms"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={option.value}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.value)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value ?? []), option.value])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== option.value
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal flex items-center gap-2 cursor-pointer">
                                  {option.icon} {option.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tone" />
                            </Trigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Casual">Casual</SelectItem>
                            <SelectItem value="Official">Official</SelectItem>
                            <SelectItem value="Fun">Fun</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a language" />
                            </Trigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Swahili">Swahili</SelectItem>
                            <SelectItem value="Sheng">Sheng</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="numberOfPosts"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Number of Posts (per platform) ({value})</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[value ?? 3]}
                          onValueChange={(vals) => onChange(vals[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isPending}>
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
