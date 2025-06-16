
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dagoauznqafmkyezwaqk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZ29hdXpucWFmbWt5ZXp3YXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNjkzMzQsImV4cCI6MjA2Mzc0NTMzNH0.wNIW79XQIEnznwp1c8SHjbvGn0qIB5BBKlZpFLqOcQs';

export const supabase = createClient(supabaseUrl, supabaseKey);
