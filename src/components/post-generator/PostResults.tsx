'use client';

import type { GenerateSocialMediaPostsOutput } from '@/ai/flows/generate-social-media-posts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, Lightbulb, BotMessageSquare, BarChart, CheckCircle2, Award } from 'lucide-react';
import Image from 'next/image';
import { SocialIcon } from './SocialIcon';
import React from 'react';

interface PostResultsProps {
  data?: GenerateSocialMediaPostsOutput;
}

export function PostResults({ data }: PostResultsProps) {
    const [imageSeeds, setImageSeeds] = React.useState<number[]>([]);

    React.useEffect(() => {
        if(data?.posts) {
            setImageSeeds(data.posts.map(() => Math.random()));
        }
    }, [data]);

  if (!data) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] rounded-lg border border-dashed shadow-sm bg-card">
            <div className="text-center space-y-4 p-8">
                <BotMessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold">Your generated posts will appear here</h3>
                <p className="text-muted-foreground">Fill out the form on the left to start generating content.</p>
            </div>
      </div>
    );
  }

  const handleDownload = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `contentflow-ai-output-${data.organization}.json`;
    link.click();
  };
  
  const getHint = (idea: string) => idea.split(' ').slice(0, 2).join(' ');

  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <SocialIcon platform={data.platform as any} />
                    Generated Posts for {data.organization}
                </CardTitle>
                <CardDescription>
                    Here are the {data.posts.length} posts generated for {data.platform}.
                </CardDescription>
            </div>
            <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download JSON
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.posts.map((post, index) => (
          <Card key={index} className="overflow-hidden shadow-md transition-shadow hover:shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-2 p-6 flex flex-col">
                <p className="text-foreground mb-4 whitespace-pre-wrap flex-grow">{post.text}</p>
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="relative aspect-video md:aspect-auto bg-muted">
                <Image
                  src={`https://picsum.photos/seed/${imageSeeds[index] || index}/600/400`}
                  alt={post.image_idea}
                  fill
                  className="object-cover"
                  data-ai-hint={getHint(post.image_idea)}
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
                  <div className="flex items-start gap-2 text-primary-foreground/90">
                    <Lightbulb className="h-5 w-5 shrink-0 mt-0.5 text-yellow-300" />
                    <p className="text-sm font-medium">{post.image_idea}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
