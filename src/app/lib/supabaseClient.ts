import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ggtkuawfhxkuffzmsbgn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdndGt1YXdmaHhrdWZmem1zYmduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NjY4OTEsImV4cCI6MjA0OTM0Mjg5MX0.61W441su4U4TYx82A6de7M8yT4gwR_ez1t7nSX3nqO4';

export const supabase = createClient(supabaseUrl, supabaseKey);
