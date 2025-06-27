
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, Trophy, Calendar, Camera, UserCheck, Heart, CreditCard } from "lucide-react";
import ArticlesManager from "@/components/dashboard/ArticlesManager";
import PlayersManager from "@/components/dashboard/PlayersManager";
import StaffManager from "@/components/dashboard/StaffManager";
import MatchesManager from "@/components/dashboard/MatchesManager";
import CompetitionsManager from "@/components/dashboard/CompetitionsManager";
import GalleriesManager from "@/components/dashboard/GalleriesManager";
import DonationsManager from "@/components/dashboard/DonationsManager";
import SubscriptionsManager from "@/components/dashboard/SubscriptionsManager";
import DashboardHeader from "@/components/DashboardHeader";
import MobileDashboardSidebar from "@/components/MobileDashboardSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("articles");

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            {/* Mobile Sidebar */}
            <MobileDashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Desktop Tabs */}
            <TabsList className="hidden md:grid w-full grid-cols-4 md:grid-cols-8 lg:grid-cols-8 h-auto">
              <TabsTrigger value="articles" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                <FileText size={14} className="sm:size-4" />
                <span className="hidden sm:inline">Articles</span>
                <span className="sm:hidden">Art.</span>
              </TabsTrigger>
              <TabsTrigger value="players" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                <Users size={14} className="sm:size-4" />
                <span className="hidden sm:inline">Joueurs</span>
                <span className="sm:hidden">Joueurs</span>
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                <UserCheck size={14} className="sm:size-4" />
                <span className="hidden sm:inline">Staff</span>
                <span className="sm:hidden">Staff</span>
              </TabsTrigger>
              <TabsTrigger value="matches" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                <Calendar size={14} className="sm:size-4" />
                <span className="hidden sm:inline">Matchs</span>
                <span className="sm:hidden">Match</span>
              </TabsTrigger>
              <TabsTrigger value="competitions" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                <Trophy size={14} className="sm:size-4" />
                <span className="hidden sm:inline">Compétitions</span>
                <span className="sm:hidden">Comp.</span>
              </TabsTrigger>
              <TabsTrigger value="galleries" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                <Camera size={14} className="sm:size-4" />
                <span className="hidden sm:inline">Galeries</span>
                <span className="sm:hidden">Gal.</span>
              </TabsTrigger>
              <TabsTrigger value="donations" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                <Heart size={14} className="sm:size-4" />
                <span className="hidden sm:inline">Donations</span>
                <span className="sm:hidden">Don.</span>
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
                <CreditCard size={14} className="sm:size-4" />
                <span className="hidden sm:inline">Abonnements</span>
                <span className="sm:hidden">Abo.</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="articles">
              <ArticlesManager />
            </TabsContent>

            <TabsContent value="players">
              <PlayersManager />
            </TabsContent>

            <TabsContent value="staff">
              <StaffManager />
            </TabsContent>

            <TabsContent value="matches">
              <MatchesManager />
            </TabsContent>

            <TabsContent value="competitions">
              <CompetitionsManager />
            </TabsContent>

            <TabsContent value="galleries">
              <GalleriesManager />
            </TabsContent>

            <TabsContent value="donations">
              <DonationsManager />
            </TabsContent>

            <TabsContent value="subscriptions">
              <SubscriptionsManager />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
