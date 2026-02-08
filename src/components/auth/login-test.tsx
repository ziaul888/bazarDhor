"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/lib/api/hooks/useAuth';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle } from 'lucide-react';

/**
 * Test component to demonstrate /api/auth/login integration
 * Uses the exact payload format: { "email": "john@example.com", "password": "Password123!" }
 */
export function LoginTest() {
  const [isLoading, setIsLoading] = useState(false);
  const loginMutation = useLogin();

  const testLogin = async () => {
    setIsLoading(true);
    
    try {
      // This calls /api/auth/login with the exact payload you specified
      const response = await loginMutation.mutateAsync({
        email: "john@example.com",
        password: "Password123!"
      });

      toast.success('Login Successful!', {
        description: `Welcome ${response.user.name}!`,
        icon: <CheckCircle className="h-5 w-5" />,
      });

      console.log('Login response:', response);
      console.log('User data:', response.user);
      console.log('Token stored in localStorage');
      
    } catch (error) {
      const errorMessage = (error as Error)?.message || 'Login failed';
      
      toast.error('Login Failed', {
        description: errorMessage,
        icon: <AlertCircle className="h-5 w-5" />,
      });
      
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-lg font-semibold mb-4">API Login Test</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Tests the /api/auth/login endpoint with payload:
        <br />
        <code className="bg-muted px-2 py-1 rounded">
          &#123; "email": "john@example.com", "password": "Password123!" &#125;
        </code>
      </p>
      
      <Button 
        onClick={testLogin} 
        disabled={isLoading || loginMutation.isPending}
        className="w-full"
      >
        {isLoading || loginMutation.isPending ? 'Logging in...' : 'Test Login API'}
      </Button>
      
      {loginMutation.isError && (
        <p className="text-sm text-destructive mt-2">
          Error: {(loginMutation.error as Error)?.message}
        </p>
      )}
    </div>
  );
}