import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

interface ScanRecord {
  id: string;
  created_at: string;
  input_text: string;
  is_sensitive: boolean;
  confidence: number;
  detected_types: string[];
}

export function ScanHistory() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadScanHistory();
  }, []);

  const loadScanHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('detections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setScans(data);
    } catch (error) {
      console.error('Failed to load scan history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (scans.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No scans found. Start by scanning some text or files.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Input</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>Types</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scans.map((scan) => (
            <TableRow key={scan.id}>
              <TableCell>
                {new Date(scan.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                {scan.input_text}
              </TableCell>
              <TableCell>
                <Badge variant={scan.is_sensitive ? "destructive" : "default"}>
                  {scan.is_sensitive ? "Sensitive" : "Safe"}
                </Badge>
              </TableCell>
              <TableCell>{Math.round(scan.confidence * 100)}%</TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {scan.detected_types.map((type) => (
                    <Badge key={type} variant="outline">
                      {type}
                    </Badge>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}