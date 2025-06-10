import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, BarChart } from "@/components/ui/charts";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface DashboardData {
  totalScans: number;
  sensitiveDetections: number;
  totalFiles: number;
  recentScans: Array<{
    date: string;
    type: string;
    is_sensitive: boolean;
  }>;
  detectionsByType: {
    type: string;
    count: number;
  }[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const [detections, files] = await Promise.all([
        supabase
          .from('detections')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('files')
          .select('*')
          .eq('user_id', user.id)
      ]);

      if (detections.error) throw detections.error;
      if (files.error) throw files.error;

      // Process the data
      const detectionsByType = detections.data.reduce((acc: any, curr) => {
        curr.detected_types.forEach((type: string) => {
          acc[type] = (acc[type] || 0) + 1;
        });
        return acc;
      }, {});

      setData({
        totalScans: detections.data.length,
        sensitiveDetections: detections.data.filter(d => d.is_sensitive).length,
        totalFiles: files.data.length,
        recentScans: detections.data
          .slice(-10)
          .map(scan => ({
            date: new Date(scan.processed_at).toLocaleDateString(),
            type: scan.detected_types[0] || 'None',
            is_sensitive: scan.is_sensitive
          })),
        detectionsByType: Object.entries(detectionsByType).map(([type, count]) => ({
          type,
          count: count as number
        }))
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-semibold mb-2">No Data Available</h2>
        <p className="text-muted-foreground">
          Start scanning documents to see your analytics here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalScans}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sensitive Detections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-red-500">
              {data.sensitiveDetections}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Files Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalFiles}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={data.recentScans}
              xField="date"
              yField="is_sensitive"
              height={300}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detections by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={data.detectionsByType}
              xField="type"
              yField="count"
              height={300}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
