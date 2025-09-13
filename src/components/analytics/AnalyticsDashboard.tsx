'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BotMessageSquare } from 'lucide-react';

export function AnalyticsDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Post Analytics</CardTitle>
        <CardDescription>
          Your post performance data from Zapier will be displayed here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-full min-h-[50vh] rounded-lg border border-dashed shadow-sm bg-card">
          <div className="text-center space-y-4 p-8">
            <BotMessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold">Waiting for Analytics Data</h3>
            <p className="text-muted-foreground">
              Configure your Zapier workflow to send a POST request to this app's API endpoint.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
