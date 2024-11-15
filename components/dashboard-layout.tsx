'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  LayoutDashboard,
  FileEdit,
  ClipboardCheck,
  Settings,
  KeyRound,
  LogOut,
  Bell
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface NavItem {
  title: string
  icon: React.ReactNode
  href: string
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-4 h-4" />,
    href: "/dashboard"
  },
  {
    title: "Create Post",
    icon: <FileEdit className="w-4 h-4" />,
    href: "/create"
  },
  {
    title: "Approve Posts",
    icon: <ClipboardCheck className="w-4 h-4" />,
    href: "/approve"
  },
  {
    title: "SEO Keywords",
    icon: <KeyRound className="w-4 h-4" />,
    href: "/keywords"
  },
  {
    title: "Settings",
    icon: <Settings className="w-4 h-4" />,
    href: "/settings"
  }
]


interface FormData {
  title: string;
  keywords: string;
  content: string;
  publish_date: string; // Added publish_date property
}

interface DashboardData {
  published_posts: number,
  scheduled_posts: number,
}

export function DashboardLayout() {
  const [activePage, setActivePage] = useState("Dashboard")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [profilepic, setProfilepic] = useState("")
  const [popupVisible, setPopupVisible] = useState(false);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    keywords: "",
    content: "",
    publish_date: "", // Initialize with an empty string
  });
  const [data, setData] = useState<DashboardData>({
    published_posts: 0,
    scheduled_posts: 0
  });  // State to hold the fetched data
  const [loading, setLoading] = useState(true);  // State to track loading status
  const [error, setError] = useState(null);  // State to track errors

  const [errorPopupVisible, setErrorPopupVisible] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [id]: value }));
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_or_username: email, password }),
      })

      if (!response.ok) throw new Error("Login failed")
      
      const data = await response.json();
      setUsername(data.username)
      setEmail(data.email)
      setProfilepic(data.profile_pic)
      localStorage.setItem('accesstoken', data.token)
      localStorage.setItem('username', data.username)
      localStorage.setItem('email', data.email)
      localStorage.setItem('profilepic', data. profile_pic)
      setIsAuthenticated(true)
      setIsLoginFormVisible(false)
    } catch (error) {
      console.error("Login Error:", error)
    }
  }

  const handleLogout = async () => {
    try {

      setUsername("")
      setEmail("")
      setProfilepic("")
      localStorage.clear()
      setIsAuthenticated(false)
      setIsLoginFormVisible(true)
    } catch (error) {
      console.error("Login Error:", error)
    }
  }

  const handleSignup = async (username: string, email: string, password: string, profile_pic: File) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("profile_pic", profile_pic);
  
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        body: formData, // FormData automatically sets the correct Content-Type
      });
  
      if (!response.ok) throw new Error("Signup failed");
      handleLogin(email, password); // Automatically log in after signup
    } catch (error) {
      console.error("Signup Error:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert publish_date to UTC if provided
    const dataToSend = { ...formData };
    if (dataToSend.publish_date) {
      const localDate = new Date(dataToSend.publish_date);
      dataToSend.publish_date = localDate.toISOString();
    }

    try {
      const token = localStorage.getItem('accesstoken')
      const response = await fetch("http://localhost:5000/generate-blog", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Add the token to the request header
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Failed to generate blog post.");
      }

      const data = await response.json();
      console.log("Response Data:", data);


      // Clear form and show success popup
      setFormData({ title: "", keywords: "", content: "", publish_date: "" });
      // Show success popup
      setPopupVisible(true);
      setTimeout(() => setPopupVisible(false), 3000);
    } catch (error) {
      console.error("Error:", error);

      // Clear form and show success popup
      setFormData({ title: "", keywords: "", content: "", publish_date: "" });
      // Show error popup
      setErrorPopupVisible(true);
      setTimeout(() => setErrorPopupVisible(false), 3000);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accesstoken')
    const un = localStorage.getItem('username') || ""
    const em = localStorage.getItem('email') || ""
    const pp = localStorage.getItem('profilepic') || ""
    
    if(token){
      setIsAuthenticated(true)
      setUsername(un)
      setEmail(em)
      setProfilepic(pp)
    } else {
      setIsAuthenticated(false)
      setUsername("")
      setEmail("")
      setProfilepic("")
    }
  });


  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accesstoken')
      try {
        const response = await fetch('http://localhost:5000/user/post-stats', {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Add the token to the request header
          },
        });  // Replace with actual API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);  // Set the fetched data
      } catch (err: any) {
        setError(err.message);  // Set error message if API call fails
      } finally {
        setLoading(false);  // Set loading to false after the API call finishes
      }
    };

    fetchData();
  }, []); 

  const renderPageContent = () => {

    if (!isAuthenticated) {
      return isLoginFormVisible ? (
        <LoginForm onLogin={handleLogin} onToggleForm={() => setIsLoginFormVisible(false)} />
      ) : (
        <SignupForm onSignup={handleSignup} onToggleForm={() => setIsLoginFormVisible(true)} />
      )
    }
    switch (activePage) {
      case "Dashboard":
        const recentPosts = [
          { title: "10 Tips for Effective Content Marketing", date: "2024-11-05" },
          { title: "The Future of AI in Business", date: "2024-11-03" },
          { title: "How to Optimize Your Website for SEO", date: "2024-11-01" },
          { title: "The Importance of User Experience in Web Design", date: "2024-10-30" },
          { title: "Emerging Trends in E-commerce for 2025", date: "2024-10-28" },
        ];
        const keywordData = [
          { keyword: 'Technology', count: 15 },
          { keyword: 'Marketing', count: 12 },
          { keyword: 'Business', count: 10 },
          { keyword: 'AI', count: 8 },
          { keyword: 'Design', count: 6 },
        ];
        return (
          <>
            <div className="mb-8">
              <Card>
                <CardContent className="flex items-center gap-6 p-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">Welcome back!</h2>
                    <p className="text-gray-500">Create and manage your auto-generated blog posts</p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setActivePage("Create Post")}>
                    <FileEdit className="mr-2 h-4 w-4" />
                    Create New Post
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-900">12</div>
                  <p className="text-sm text-gray-500">Pending Approvals</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-900">{data!.published_posts}</div>
                  <p className="text-sm text-gray-500">Published Posts</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-900">{data.scheduled_posts}</div>
                  <p className="text-sm text-gray-500">Scheduled Posts</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-900">24</div>
                  <p className="text-sm text-gray-500">Active SEO Keywords</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                <ul className="space-y-4">
                  {recentPosts.map((post, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">{post.title}</span>
                      <span className="text-xs text-gray-500">{post.date}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )
      case "Create Post":
        return (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Blog Post</h2>
              <div>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter blog post title"
                      value={formData.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                    <Input
                      id="keywords"
                      placeholder="Enter SEO keywords"
                      value={formData.keywords}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Key Points</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter key points for your blog post"
                      rows={5}
                      value={formData.content}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="publish_date">Publish Date (Optional)</Label>
                    <Input
                      id="publish_date"
                      type="datetime-local"
                      value={formData.publish_date}
                      onChange={handleChange}
                    />
                  </div>
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Generate Blog Post
                  </Button>
                </form>

                {popupVisible && (
                  <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
                    Blog post generated successfully!
                  </div>
                )}

                {errorPopupVisible && (
                  <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
                    Failed to generate blog post. Please try again.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      case "Approve Posts":
        return (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Approve Posts</h2>
              <p className="text-gray-500 mb-4">No posts pending approval at the moment.</p>
            </CardContent>
          </Card>
        )
      case "SEO Keywords":
        return (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">SEO Keywords Management</h2>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="new-keyword">Add New Keyword</Label>
                  <div className="flex gap-2">
                    <Input id="new-keyword" placeholder="Enter new SEO keyword" />
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add</Button>
                  </div>
                </div>
              </form>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Current Keywords</h3>
                <p className="text-gray-500">No keywords added yet.</p>
              </div>
            </CardContent>
          </Card>
        )
      case "Settings":
        return (
          <div>
            <ToastContainer />
            <WordPressSettings />
          </div>
        );
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar and Navigation: Conditionally rendered */}
        {isAuthenticated ? (
          <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-600 p-1">
                    <FileEdit className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-gray-900">AutoBlogger</span>
                </div>
              </div>
  
              {/* Navigation */}
              <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => (
                  <Button
                    key={item.title}
                    variant={activePage === item.title ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-2",
                      activePage === item.title && "bg-blue-50 text-blue-700"
                    )}
                    onClick={() => setActivePage(item.title)}
                  >
                    {item.icon}
                    {item.title}
                  </Button>
                ))}
              </nav>
  
              {/* User */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={profilepic || "/placeholder.svg"} alt="User Avatar" />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{username}</p>
                    <p className="text-xs text-gray-500">{email}</p>
                  </div>
                  <Button onClick={() => { handleLogout() }} variant="ghost" size="icon">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </aside>
        ) : null}
  
        {/* Main Content */}
        <main className={`flex-1 ${isAuthenticated ? "ml-64" : ""}`}>
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">{activePage}</h1>
              <div className="flex items-center gap-4">
                <Input className="w-64" placeholder="Search..." />
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
  
          <div className="p-8">
            {renderPageContent()}
          </div>
        </main>
      </div>
    </div>
  );
}


import { MouseEventHandler } from 'react'
import WordPressSettings from './settings'

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onToggleForm: MouseEventHandler<HTMLButtonElement>;
}

const LoginForm = ({ onLogin, onToggleForm }: LoginFormProps) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin(email, password)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Login
          </Button>
        </form>
        <p className="mt-4 text-sm">
          Don't have an account?{" "}
          <button onClick={onToggleForm} className="text-blue-600">
            Sign up
          </button>
        </p>
      </CardContent>
    </Card>
  )
}


const SignupForm = ({ onSignup, onToggleForm }: { onSignup: (username: string, email: string, password: string, profile_pic: File) => void, onToggleForm: MouseEventHandler<HTMLButtonElement> }) => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [profilePic, setProfilePic] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (profilePic) {
      onSignup(username, email, password, profilePic)
    } else {
      console.error("Profile picture is required")
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="profile_pic">Profile Picture</Label>
            <Input
              id="profile_pic"
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  setProfilePic(e.target.files[0])
                }
              }}
              required
            />
          </div>
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <button onClick={onToggleForm} className="text-blue-600">
            Login
          </button>
        </p>
      </CardContent>
    </Card>
  )
}



