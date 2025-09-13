
'use client';

import type { GenerateSocialMediaPostsOutput } from '@/ai/flows/generate-social-media-posts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Download, Lightbulb, BotMessageSquare, Send, Loader2, Upload, Replace } from 'lucide-react';
import Image from 'next/image';
import { SocialIcon } from './SocialIcon';
import React, { useState } from 'react';
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

const ImageUploader = ({ imageIdea, index }: { imageIdea: string; index: number }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const uniqueId = `file-upload-${index}`;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative bg-muted min-h-[200px] flex items-center justify-center p-4 group">
      {imagePreview ? (
        <>
          <Image
            src={imagePreview}
            alt="Uploaded image preview"
            fill
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <label htmlFor={uniqueId} className="cursor-pointer">
              <Button asChild variant="secondary">
                <div>
                  <Replace className="mr-2 h-4 w-4" />
                  Change Image
                </div>
              </Button>
              <input id={uniqueId} name={uniqueId} type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
        </>
      ) : (
        <div className="text-center">
          <label htmlFor={uniqueId} className="cursor-pointer">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Lightbulb className="h-8 w-8" />
              <span className="font-semibold">AI Image Idea:</span>
              <p className="text-sm text-center mb-2">&quot;{imageIdea}&quot;</p>
              <Button asChild variant="outline">
                <div>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </div>
              </Button>
            </div>
            <input id={uniqueId} name={uniqueId} type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
          </label>
        </div>
      )}
    </div>
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
                <ImageUploader imageIdea={post.image_idea} index={index} />
              </div>
            </Card>
          )
        })}
      </CardContent>
    </Card>
  );
}
