'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BotMessageSquare, Loader2, AlertTriangle, MessageSquare, Heart, Repeat, Share, MousePointerClick, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PostAnalytic {
  text: string;
  likes?: number;
  comments?: number;
  shares?: number;
  clicks?: number;
  impressions?: number;
  date_posted?: string;
  platform?: string;
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<PostAnalytic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data.');
        }
        const data = await response.json();
        setAnalytics(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Post Analytics</CardTitle>
          <CardDescription>Fetching your latest post performance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] rounded-lg border border-dashed shadow-sm bg-card">
            <div className="text-center space-y-4 p-8">
              <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
              <h3 className="text-xl font-semibold">Loading Analytics...</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
        <Card>
        <CardHeader>
          <CardTitle>Post Analytics</CardTitle>
          <CardDescription>There was an error fetching your data.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] rounded-lg border border-dashed shadow-sm bg-destructive/10 text-destructive">
            <div className="text-center space-y-4 p-8">
              <AlertTriangle className="mx-auto h-12 w-12" />
              <h3 className="text-xl font-semibold">An Error Occurred</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (analytics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Post Analytics</CardTitle>
          <CardDescription>Your post performance data from Zapier will be displayed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-full min-h-[50vh] rounded-lg border border-dashed shadow-sm bg-card">
            <div className="text-center space-y-4 p-8">
              <BotMessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="text-xl font-semibold">Waiting for Analytics Data</h3>
              <p className="text-muted-foreground">
                No data has been received yet. Make sure your Zapier workflow is running and sending POST requests to the analytics endpoint.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Analytics</CardTitle>
        <CardDescription>
          Displaying {analytics.length} post(s) with performance data from Zapier.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {analytics.map((post, index) => (
          <Card key={index} className="p-6 shadow-md">
            <p className="text-foreground mb-4 whitespace-pre-wrap"><MessageSquare className="inline-block mr-2 h-5 w-5 text-muted-foreground" />"{post.text}"</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    <div><span className="font-bold">{post.likes ?? 0}</span> <span className="text-muted-foreground">Likes</span></div>
                </div>
                 <div className="flex items-center gap-2">
                    <Repeat className="h-5 w-5 text-green-500" />
                    <div><span className="font-bold">{post.shares ?? 0}</span> <span className="text-muted-foreground">Shares</span></div>
                </div>
                 <div className="flex items-center gap-2">
                    <MousePointerClick className="h-5 w-5 text-blue-500" />
                    <div><span className="font-bold">{post.clicks ?? 0}</span> <span className="text-muted-foreground">Clicks</span></div>
                </div>
                 <div className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-purple-500" />
                    <div><span className="font-bold">{post.impressions ?? 0}</span> <span className="text-muted-foreground">Impressions</span></div>
                </div>
                 <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-yellow-500" />
                    <div><span className="font-bold">{post.comments ?? 0}</span> <span className="text-muted-foreground">Comments</span></div>
                </div>
            </div>
             {post.date_posted && <p className="text-xs text-muted-foreground mt-4">Posted on: {new Date(post.date_posted).toLocaleDateString()}</p>}
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
