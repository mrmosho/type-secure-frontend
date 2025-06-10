import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { DashboardStats } from '@/types/detection';

export function useStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const [detections, recentScans] = await Promise.all([
        supabase
          .from('detections')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('detections')
          .select('*')
          .eq('user_id', user.id)
          .order('processed_at', { ascending: false })
          .limit(5)
      ]);

      if (detections.error || recentScans.error) throw detections.error || recentScans.error;

      const stats: DashboardStats = {
        total_scans: detections.data.length,
        sensitive_detected: detections.data.filter(d => d.is_sensitive).length,
        detection_types_count: detections.data.reduce((acc, curr) => {
          curr.detected_types.forEach(type => {
            acc[type] = (acc[type] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>),
        recent_detections: recentScans.data
      };

      setStats(stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { stats, isLoading, refresh: loadStats };
}