'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generatePostsAction, type FormState } from '@/app/actions';
import { formSchema, type FormSchema } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { PostResults } from './PostResults';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SocialIcon } from './SocialIcon';
import { Badge } from '../ui/badge';

const initialFormState: FormState = { message: '' };
const allPlatforms = ['X', 'LinkedIn', 'Instagram', 'Facebook', 'TikTok'] as const;

export function PostGenerator() {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [isPending, startTransition] = useTransition();
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: '',
      topics: '',
      numberOfPosts: 3,
      tone: 'Official',
      language: 'English',
    },
  });

  const onSubmit = (data: FormSchema) => {
    const formData = new FormData();

    // Append required fields
    formData.append('organizationName', data.organizationName);
    formData.append('topics', data.topics);
    formData.append('numberOfPosts', String(data.numberOfPosts));
    formData.append('tone', data.tone);
    formData.append('language', data.language);

    // Append all platforms (since checkboxes are gone)
    allPlatforms.forEach((platform) => {
      formData.append('platforms', platform);
    });

    startTransition(async () => {
      setShowResults(false);
      // ✅ Pass only the formData to the server action
      const result = await generatePostsAction(formData);
      setFormState(result);
    });
  };

  useEffect(() => {
    if (formState.message && !isPending) {
      if (formState.error) {
        toast({
          variant: 'destructive',
          title: 'Error generating posts',
          description: formState.message,
        });
      } else if (formState.data) {
        setShowResults(true);
      }
    }
  }, [formState, isPending, toast]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <Card className="sticky top-24">
          <CardHeader>
            <CardTitle>Create New Posts</CardTitle>
            <CardDescription>
              Fill in the details below to generate social media posts using AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Company name */}
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

                {/* Topics */}
                <FormField
                  control={form.control}
                  name="topics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topics / Keywords</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., AI, Machine Learning, SaaS" {...field} />
                      </FormControl>
                      <FormDescription>
                        Describe the content you want to generate.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tone + Language */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Official">Official</SelectItem>
                            <SelectItem value="Casual">Casual</SelectItem>
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
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

                {/* Number of posts */}
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
                          value={[value ?? 3]}
                          onValueChange={(vals) => onChange(vals[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Platforms preview (no checkbox functionality) */}
                <div className="space-y-4">
                  <FormLabel>Platforms</FormLabel>
                  <FormDescription>
                    Content will be generated for all platforms.
                  </FormDescription>
                  <div className="flex flex-wrap gap-4">
                    {allPlatforms.map((platform) => (
                      <Badge
                        key={platform}
                        variant="outline"
                        className="flex items-center gap-2 py-1 px-3"
                      >
                        <SocialIcon platform={platform} className="h-4 w-4" />
                        <span>{platform}</span>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Generate Posts
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Right side: Results */}
      <div className="lg:col-span-2">
        {isPending ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[60vh] rounded-lg border border-dashed shadow-sm bg-card">
            <div className="text-center space-y-4 p-8">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <h3 className="text-xl font-semibold">Generating your posts...</h3>
              <p className="text-muted-foreground">
                The AI is generating content. This may take a moment.
              </p>
            </div>
          </div>
        ) : (
          <PostResults data={showResults ? formState.data : undefined} />
        )}
      </div>
    </div>
  );
}
