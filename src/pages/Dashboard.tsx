
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, Trophy, Calendar, Camera, UserCheck } from "lucide-react";
import ArticlesManager from "@/components/dashboard/ArticlesManager";
import PlayersManager from "@/components/dashboard/PlayersManager";
import StaffManager from "@/components/dashboard/StaffManager";
import MatchesManager from "@/components/dashboard/MatchesManager";
import CompetitionsManager from "@/components/dashboard/CompetitionsManager";
import GalleriesManager from "@/components/dashboard/GalleriesManager";
import DashboardHeader from "@/components/DashboardHeader";
import ProtectedRoute from "@/components/ProtectedRoute";

const Dashboard = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Tabs defaultValue="articles" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 lg:grid-cols-6 h-auto">
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
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
