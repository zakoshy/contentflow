
'use client';

import type { GenerateSocialMediaPostsOutput } from '@/ai/flows/generate-social-media-posts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, Lightbulb, BotMessageSquare, Send, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { SocialIcon } from './SocialIcon';
import React from 'react';
import { useActionState, useTransition } from 'react';
import { sendToBuffer, type SendToBufferState } from '@/app/buffer-actions';
import { useToast } from '@/hooks/use-toast';

interface PostResultsProps {
  data?: GenerateSocialMediaPostsOutput;
}

const SendToBufferButton = ({ postText }: { postText: string }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSend = async () => {
    const formData = new FormData();
    formData.append('text', postText);
    
    startTransition(async () => {
      const result = await sendToBuffer({ message: '' }, formData);
      toast({
        title: result.error ? 'Error' : 'Success',
        description: result.message,
        variant: result.error ? 'destructive' : 'default',
      });
    });
  };

  return (
    <Button variant="outline" size="sm" className="mt-auto w-fit" onClick={handleSend} disabled={isPending}>
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      Send to Buffer
    </Button>
  );
};

export function PostResults({ data }: PostResultsProps) {
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
  
  const getHint = (idea: string) => {
    return idea.split(' ').slice(0, 2).join(' ');
  }

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
        {data.posts.map((post, index) => {
          const imageHint = getHint(post.image_idea);
          const imageSeed = imageHint.split(' ')[0] || 'post';
          const imageUrl = `https://picsum.photos/seed/${imageSeed}-${index}/600/400`;
          return (
            <Card key={index} className="overflow-hidden shadow-md transition-shadow hover:shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="md:col-span-2 p-6 flex flex-col">
                  <p className="text-foreground mb-4 whitespace-pre-wrap flex-grow">{post.text}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <SendToBufferButton postText={post.text} />
                </div>
                <div className="relative bg-muted min-h-[200px]">
                  <Image
                    src={imageUrl}
                    alt={post.image_idea}
                    width={600}
                    height={400}
                    className="object-cover w-full h-full"
                    data-ai-hint={imageHint}
                  />
                </div>
              </div>
            </Card>
          )
        })}
      </CardContent>
    </Card>
  );
}
