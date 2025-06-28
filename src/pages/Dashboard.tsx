
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

  const tabs = [
    { id: "articles", label: "Articles", icon: FileText, shortLabel: "Art." },
    { id: "players", label: "Joueurs", icon: Users, shortLabel: "Joueurs" },
    { id: "staff", label: "Staff", icon: UserCheck, shortLabel: "Staff" },
    { id: "matches", label: "Matchs", icon: Calendar, shortLabel: "Match" },
    { id: "competitions", label: "Compétitions", icon: Trophy, shortLabel: "Comp." },
    { id: "galleries", label: "Galeries", icon: Camera, shortLabel: "Gal." },
    { id: "donations", label: "Donations", icon: Heart, shortLabel: "Don." },
    { id: "subscriptions", label: "Abonnements", icon: CreditCard, shortLabel: "Abo." },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />

        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
            {/* Mobile Sidebar */}
            <MobileDashboardSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Desktop Tabs */}
            <TabsList className="hidden lg:grid w-full grid-cols-8 h-auto bg-white border">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger 
                    key={tab.id}
                    value={tab.id} 
                    className="flex items-center gap-2 text-sm lg:text-base p-3 lg:p-4 data-[state=active]:bg-green-600 data-[state=active]:text-white"
                  >
                    <Icon size={16} />
                    <span className="hidden xl:inline">{tab.label}</span>
                    <span className="xl:hidden">{tab.shortLabel}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {/* Tab Contents */}
            <div className="bg-white rounded-lg shadow-sm border min-h-[600px]">
              <TabsContent value="articles" className="m-0 p-4 sm:p-6">
                <ArticlesManager />
              </TabsContent>

              <TabsContent value="players" className="m-0 p-4 sm:p-6">
                <PlayersManager />
              </TabsContent>

              <TabsContent value="staff" className="m-0 p-4 sm:p-6">
                <StaffManager />
              </TabsContent>

              <TabsContent value="matches" className="m-0 p-4 sm:p-6">
                <MatchesManager />
              </TabsContent>

              <TabsContent value="competitions" className="m-0 p-4 sm:p-6">
                <CompetitionsManager />
              </TabsContent>

              <TabsContent value="galleries" className="m-0 p-4 sm:p-6">
                <GalleriesManager />
              </TabsContent>

              <TabsContent value="donations" className="m-0 p-4 sm:p-6">
                <DonationsManager />
              </TabsContent>

              <TabsContent value="subscriptions" className="m-0 p-4 sm:p-6">
                <SubscriptionsManager />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
