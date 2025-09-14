'use client';

import type { GenerateSocialMediaPostsOutput } from '@/ai/flows/generate-social-media-posts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, BotMessageSquare, Send, Loader2, Image as ImageIcon, Wand2, Upload } from 'lucide-react';
import { SocialIcon } from './SocialIcon';
import React, { useState, useTransition, useRef } from 'react';
import { sendToBuffer } from '@/app/buffer-actions';
import { useToast } from '@/hooks/use-toast';
import { generateImage } from '@/ai/flows/generate-image';
import Image from 'next/image';

interface PostResultsProps {
  data?: GenerateSocialMediaPostsOutput;
}

const SendToSocialMediaButton = ({ postText, imageUrl }: { postText: string; imageUrl?: string }) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleSend = async () => {
    const formData = new FormData();
    formData.append('text', postText);
    if (imageUrl) {
      formData.append('imageUrl', imageUrl);
    }

    startTransition(async () => {
      const result = await sendToBuffer(formData);
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
      Send to Social Media
    </Button>
  );
};

const ImageDisplay = ({ imageIdea, postText, onImageReady }: { imageIdea: string; postText: string, onImageReady: (imageUrl: string | null) => void }) => {
  const [isGenerating, startAIGeneration] = useTransition();
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateImage = () => {
    startAIGeneration(async () => {
      setError(null);
      try {
        const result = await generateImage({
          prompt: `A social media image for a post about "${postText}". Image idea: ${imageIdea}`,
        });
        if (result.imageUrl) {
          setImage(result.imageUrl);
          onImageReady(result.imageUrl);
        } else {
          throw new Error('Image generation failed to produce an image.');
        }
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Image Generation Failed',
          description: errorMessage,
        });
      }
    });
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target?.result as string;
        setImage(dataUrl);
        onImageReady(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadImage = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = `contentflow-ai-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  const handleRemoveImage = () => {
    setImage(null);
    onImageReady(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  return (
    <div className="relative bg-muted min-h-[200px] flex items-center justify-center p-4">
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/gif"
        className="sr-only"
      />
      {isGenerating ? (
        <div className="text-center space-y-2">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Generating image...</p>
        </div>
      ) : image ? (
        <div className="w-full h-full relative group aspect-video">
          <Image src={image} alt="Generated or uploaded image" layout="fill" objectFit="cover" />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="outline" size="sm" onClick={handleDownloadImage}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
             <Button variant="destructive" size="sm" onClick={handleRemoveImage}>
              Change
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
            <span className="font-semibold">AI Image Idea:</span>
            <p className="text-sm text-center mb-2">&quot;{imageIdea}&quot;</p>
          </div>
          <div className='flex gap-2'>
            <Button onClick={handleGenerateImage} disabled={isGenerating}>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate
            </Button>
             <Button variant="secondary" onClick={handleUploadClick}>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </Button>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
};

export function PostResults({ data }: PostResultsProps) {
  const [images, setImages] = useState<Record<number, string | null>>({});

  const handleImageReady = (index: number, imageUrl: string | null) => {
    setImages(prev => ({...prev, [index]: imageUrl}));
  };

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
                  <SendToSocialMediaButton postText={post.text} imageUrl={images[index] ?? undefined} />
                </div>
                <ImageDisplay 
                    imageIdea={post.image_idea} 
                    postText={post.text}
                    onImageReady={(imageUrl) => handleImageReady(index, imageUrl)}
                />
              </div>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
