"use client";

import { useState } from 'react';
import Image from 'next/image';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Shield, 
  Heart, 
  ShoppingCart, 
  TrendingUp, 
  Settings, 
  Edit3, 
  Camera,
  Star,
  Clock,
  Award,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileSettings } from './_components/profile-settings';
import { ActivityHistory } from './_components/activity-history';
import { FavoriteMarkets } from './_components/favorite-markets';

// Mock user data
const userData = {
  id: 1,
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  location: "Downtown, City Center",
  joinDate: "March 2023",
  membershipLevel: "Gold Member",
  stats: {
    marketsVisited: 12,
    priceUpdates: 47,
    reviewsWritten: 23,
    pointsEarned: 1250
  },
  preferences: {
    notifications: {
      priceAlerts: true,
      newMarkets: true,
      weeklyDigest: false,
      promotions: true
    },
    privacy: {
      profileVisible: true,
      showActivity: false,
      shareLocation: true
    }
  }
};

const tabs = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'activity', label: 'Activity', icon: Clock },
  { id: 'favorites', label: 'Favorites', icon: Heart }
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab userData={userData} />;
      case 'settings':
        return <ProfileSettings userData={userData} />;
      case 'activity':
        return <ActivityHistory />;
      case 'favorites':
        return <FavoriteMarkets />;
      default:
        return <OverviewTab userData={userData} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white/20">
                <Image
                  src={userData.avatar}
                  alt={userData.name}
                  fill
                  className="object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center shadow-lg hover:bg-white/90 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{userData.name}</h1>
                <Award className="h-6 w-6 text-yellow-300" />
              </div>
              <p className="text-primary-foreground/80 mb-1">{userData.membershipLevel}</p>
              <div className="flex items-center justify-center md:justify-start space-x-4 text-sm text-primary-foreground/70">
                <span className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{userData.location}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Joined {userData.joinDate}</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-8 mb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl p-4 border shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <MapPin className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{userData.stats.marketsVisited}</div>
                <div className="text-xs text-muted-foreground">Markets Visited</div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{userData.stats.priceUpdates}</div>
                <div className="text-xs text-muted-foreground">Price Updates</div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{userData.stats.reviewsWritten}</div>
                <div className="text-xs text-muted-foreground">Reviews Written</div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{userData.stats.pointsEarned}</div>
                <div className="text-xs text-muted-foreground">Points Earned</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4">
        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="pb-8">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

// Overview Tab Component
function OverviewTab({ userData }: { userData: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Personal Information */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-card rounded-xl p-6 border">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{userData.email}</div>
                <div className="text-sm text-muted-foreground">Email Address</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{userData.phone}</div>
                <div className="text-sm text-muted-foreground">Phone Number</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">{userData.location}</div>
                <div className="text-sm text-muted-foreground">Location</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl p-6 border">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <div className="font-medium">Updated tomato prices at Downtown Market</div>
                <div className="text-sm text-muted-foreground">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Star className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <div className="font-medium">Reviewed Riverside Organic Market</div>
                <div className="text-sm text-muted-foreground">1 day ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <Heart className="h-5 w-5 text-red-600" />
              <div className="flex-1">
                <div className="font-medium">Added Central Plaza Market to favorites</div>
                <div className="text-sm text-muted-foreground">3 days ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Membership Status */}
        <div className="bg-card rounded-xl p-6 border">
          <h3 className="text-lg font-semibold mb-4">Membership Status</h3>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="h-8 w-8 text-white" />
            </div>
            <div className="font-semibold text-lg">{userData.membershipLevel}</div>
            <div className="text-sm text-muted-foreground mb-4">
              {userData.stats.pointsEarned} points earned
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <div className="text-xs text-muted-foreground">250 points to Platinum</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-xl p-6 border">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Bell className="h-4 w-4 mr-3" />
              Notification Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-3" />
              Privacy Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ShoppingCart className="h-4 w-4 mr-3" />
              Order History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}