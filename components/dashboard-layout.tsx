'use client'

import { useState } from 'react'
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

export function DashboardLayout() {
  const [activePage, setActivePage] = useState("Dashboard")
  const [popupVisible, setPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    keywords: '',
    content: '',
  });

  const handleChange = (e:any) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setPopupVisible(true); // Show success popup
        setTimeout(() => setPopupVisible(false), 3000); // Hide after 3 seconds
      } else {
        console.error('Failed to generate blog post');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };



  const renderPageContent = () => {
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
                  <div className="text-2xl font-bold text-gray-900">48</div>
                  <p className="text-sm text-gray-500">Published Posts</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-gray-900">8</div>
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
                    <Input id="title" placeholder="Enter blog post title" value={formData.title} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                    <Input id="keywords" placeholder="Enter SEO keywords" value={formData.keywords} onChange={handleChange} />
                  </div>
                  <div>
                    <Label htmlFor="content">Key Points</Label>
                    <Textarea id="content" placeholder="Enter key points for your blog post" rows={5} value={formData.content} onChange={handleChange} />
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
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="wordpress-url">WordPress URL</Label>
                  <Input id="wordpress-url" placeholder="Enter your WordPress site URL" />
                </div>
                <div>
                  <Label htmlFor="naver-api-key">Naver API Key</Label>
                  <Input id="naver-api-key" type="password" placeholder="Enter your Naver API key" />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Settings</Button>
              </form>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
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
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">User Name</p>
                  <p className="text-xs text-gray-500">user@example.com</p>
                </div>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="ml-64 flex-1">
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
  )
}