import React, { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from 'react-toastify'; // for displaying popups
// Interface for the form data
interface WordPressCredentials {
    wordpress_site_url: string;
    wordpress_username: string;
    wordpress_password: string;
  }
  
  const WordPressSettings: React.FC = () => {
    const [wordpressUrl, setWordpressUrl] = useState<string>('');
    const [wordpressUsername, setWordpressUsername] = useState<string>('');
    const [wordpressPassword, setWordpressPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
  
    // API URL - adjust it as per your backend API
    const apiUrl = 'http://localhost:5000/user/wordpress';
  
    // Function to get the token from localStorage (or cookies)
    const getToken = () => {
      return localStorage.getItem('accesstoken'); // Assuming you stored the token in localStorage
    };
  
    // Function to handle form submission
    const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();
      setIsLoading(true);
  
      const data: WordPressCredentials = {
        wordpress_site_url: wordpressUrl,
        wordpress_username: wordpressUsername,
        wordpress_password: wordpressPassword,
      };
  
      const token = getToken();
      if (!token) {
        toast.error('Authentication token is missing');
        setIsLoading(false);
        return;
      }
  
      try {
        console.log(token)
        const response = await fetch(apiUrl, {
          method: 'POST', // Use PUT for updating credentials
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Add the token to the request header
          },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Something went wrong');
        }
        
        setWordpressPassword("")
        setWordpressUrl("")
        setWordpressUsername("")
        // Show success popup
        toast.success('WordPress credentials saved successfully');
      } catch (error: any) {
        setWordpressPassword("")
        setWordpressUrl("")
        setWordpressUsername("")
        // Show failure popup
        toast.error(error.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="wordpress-url">WordPress URL</Label>
              <Input
                id="wordpress-url"
                placeholder="Enter your WordPress site URL"
                value={wordpressUrl}
                onChange={(e) => setWordpressUrl(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="wordpress-username">WordPress Username</Label>
              <Input
                id="wordpress-username"
                placeholder="Enter your WordPress username"
                value={wordpressUsername}
                onChange={(e) => setWordpressUsername(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="wordpress-password">WordPress Password</Label>
              <Input
                id="wordpress-password"
                type="password"
                placeholder="Enter your WordPress password"
                value={wordpressPassword}
                onChange={(e) => setWordpressPassword(e.target.value)}
              />
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  };
  
  export default WordPressSettings;