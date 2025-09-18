'use client';

import type { GenerateSocialMediaPostsOutput } from '@/ai/flows/generate-social-media-posts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, BotMessageSquare, Send, Loader2, Image as ImageIcon, Upload } from 'lucide-react';
import { SocialIcon } from './SocialIcon';
import React, { useState, useTransition, useRef } from 'react';
import { sendToBuffer } from '@/app/buffer-actions';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { uploadImage } from '@/app/cloudinary-actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

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

const ImageUploader = ({ onImageReady }: { onImageReady: (imageUrl: string | null) => void }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isUploading, startUploading] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const dataUrl = loadEvent.target?.result as string;
        
        startUploading(async () => {
          try {
            const result = await uploadImage(dataUrl);
            if (result.error || !result.url) {
              throw new Error(result.message);
            }
            setImage(result.url);
            onImageReady(result.url);
            toast({
              title: 'Success',
              description: 'Image uploaded to Cloudinary.',
            });
          } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during upload.';
            toast({
              variant: 'destructive',
              title: 'Upload Failed',
              description: errorMessage,
            });
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadImage = () => {
    if (image) {
      const link = document.createElement('a');
      link.href = image;
      link.download = `contentflow-ai-image-${Date.now()}.png`;
      link.target = '_blank';
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
        disabled={isUploading}
      />
      {isUploading ? (
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="font-semibold">Uploading...</span>
        </div>
      ) : image ? (
        <div className="w-full h-full relative group aspect-video">
          <Image src={image} alt="Uploaded image" fill objectFit="cover" />
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
            <span className="font-semibold">Upload an Image</span>
          </div>
          <Button variant="secondary" onClick={handleUploadClick}>
            <Upload className="mr-2 h-4 w-4" />
            Upload from Media
          </Button>
        </div>
      )}
    </div>
  );
};

export function PostResults({ data }: PostResultsProps) {
  const [images, setImages] = useState<Record<string, string | null>>({});

  const handleImageReady = (postIdentifier: string, imageUrl: string | null) => {
    setImages(prev => ({...prev, [postIdentifier]: imageUrl}));
  };

  if (!data || !data.posts || data.posts.length === 0) {
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
    link.download = `contentflow-ai-output.json`;
    link.click();
  };
  
  const defaultActiveItems = data.posts.map(post => post.post_id);

  return (
    <Card className="animate-in fade-in duration-500">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              Generated Content for {data.organization}
            </CardTitle>
            <CardDescription>
              Here are the posts generated for the selected platforms.
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download JSON
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="multiple" defaultValue={defaultActiveItems} className="w-full space-y-4">
          {data.posts.map((postConcept, conceptIndex) => (
            <AccordionItem value={postConcept.post_id} key={postConcept.post_id}>
              <AccordionTrigger className='p-4 bg-muted rounded-md'>
                <div className='flex items-center gap-2 text-lg font-semibold'>
                  Post Concept {conceptIndex + 1}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4 space-y-4">
                <Tabs defaultValue={Object.keys(postConcept.platform_posts)[0]} className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    {Object.keys(postConcept.platform_posts).map(platform => (
                      <TabsTrigger key={platform} value={platform} className="flex items-center gap-2">
                        <SocialIcon platform={platform as any} />
                        {platform}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {Object.entries(postConcept.platform_posts).map(([platform, post]) => {
                    const postIdentifier = `${postConcept.post_id}-${platform}`;
                    return (
                    <TabsContent key={platform} value={platform}>
                      <Card className="overflow-hidden shadow-md transition-shadow hover:shadow-lg mt-2">
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
                            <SendToSocialMediaButton postText={post.text} imageUrl={images[postIdentifier] ?? undefined} />
                          </div>
                          <ImageUploader 
                              onImageReady={(imageUrl) => handleImageReady(postIdentifier, imageUrl)}
                          />
                        </div>
                      </Card>
                    </TabsContent>
                    )
                  })}
                </Tabs>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
