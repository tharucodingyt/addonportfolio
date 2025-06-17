// Supabase Configuration
const SUPABASE_URL = 'https://yztfwrboqkfnyvmxuqyi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6dGZ3cmJvcWtmbnl2bXh1cXlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxNDIwMjQsImV4cCI6MjA2NTcxODAyNH0.3JylKMrWXesfpFhYP9t3ZYfwHhfF-JnBL6bU8glBM80';
const ADMIN_EMAIL = 'tharu@gmail.com';

// Make sure this runs in browsers without module support and after deployment
(function() {
    try {
        // Export to global window object
        window.SUPABASE_URL = SUPABASE_URL;
        window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
        window.ADMIN_EMAIL = ADMIN_EMAIL;
        
        console.log('Supabase config loaded successfully');
    } catch (err) {
        console.error('Error setting up Supabase configuration:', err);
    }
})();