import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Settings {
  sensitivity: number;
  enabledTypes: string[];
  autoEncrypt: boolean;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>({
    sensitivity: 0.5,
    enabledTypes: ['email', 'phone', 'credit_card', 'ssn'],
    autoEncrypt: false
  });

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data && !error) {
      setSettings(data);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const updatedSettings = { ...settings, ...newSettings };
    
    const { error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        ...updatedSettings
      });

    if (error) throw error;
    setSettings(updatedSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};