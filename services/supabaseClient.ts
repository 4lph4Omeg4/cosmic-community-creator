import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wdclgadjetxhcududipz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkY2xnYWRqZXR4aGN1ZHVkaXB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0ODMwNDUsImV4cCI6MjA2OTA1OTA0NX0.5hWgUyRpqwwqNIBFCJqjF68_6zxN65Q43d0ziA2Qleo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

