import { supabase } from '@/lib/supabase';

export interface Scan {
  id: string;
  user_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  scan_type: 'quick' | 'full' | 'custom';
  total_files?: number;
  created_at: string;
  completed_at?: string;
}

export interface Detection {
  id: string;
  scan_id: string;
  user_id: string;
  threat_type: 'malware' | 'ransomware' | 'keylogger' | 'suspicious_behavior';
  severity: 'low' | 'medium' | 'high' | 'critical';
  file_path: string;
  detection_date: string;
  status: 'detected' | 'quarantined' | 'removed' | 'ignored';
}

export const databaseService = {
  // Scans
  async createScan(userId: string, scanType: Scan['scan_type']) {
    const { data, error } = await supabase
      .from('scans')
      .insert({
        user_id: userId,
        status: 'pending',
        scan_type: scanType
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Detections
  async recordDetection(detection: Omit<Detection, 'id' | 'detection_date'>) {
    const { data, error } = await supabase
      .from('detections')
      .insert(detection)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Dashboard Stats
  async getDashboardStats(userId: string) {
    const { data: detections, error: detectionsError } = await supabase
      .from('detections')
      .select('*')
      .eq('user_id', userId);

    if (detectionsError) throw detectionsError;

    const { data: latestScan, error: scanError } = await supabase
      .from('scans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (scanError && scanError.code !== 'PGRST116') throw scanError;

    return {
      totalDetections: detections?.length || 0,
      lastScanStatus: latestScan?.status || 'none',
      protectedFiles: latestScan?.total_files || 0
    };
  }
};