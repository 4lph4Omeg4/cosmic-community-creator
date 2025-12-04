-- Grant permissions to public/anon roles for the users table
GRANT SELECT, INSERT, UPDATE ON TABLE public.users TO anon;
GRANT SELECT, INSERT, UPDATE ON TABLE public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.users TO service_role;

-- Ensure sequence permissions are granted if ID is auto-generated (though it's UUID here, good practice)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
