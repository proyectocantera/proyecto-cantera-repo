import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vzcwgontkftdhgdcftor.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6Y3dnb250a2Z0ZGhnZGNmdG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTIzNjksImV4cCI6MjA2NjUyODM2OX0.F-Vp9GFIkYltDRm6vcR0ZcUtG4qibsYkG30LMKXE_Bs'

export const supabase = createClient(supabaseUrl, supabaseKey);