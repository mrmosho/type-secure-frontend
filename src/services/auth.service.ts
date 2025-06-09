import { supabase } from '@/lib/supabase';

export const authService = {
  async register(name: string, email: string, password: string) {
    console.log('Auth Service: Starting registration...', { email, name });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      console.error('Auth Service: Registration error', error);
      throw error;
    }

    console.log('Auth Service: Registration successful', data);

    if (data.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            full_name: name,
            email: email
          }
        ]);

      if (profileError) {
        console.error('Auth Service: Profile creation error', profileError);
        throw profileError;
      }
    }

    return data;
  }
};