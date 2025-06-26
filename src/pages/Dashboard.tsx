
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Trophy, Calendar, Camera, UserCheck } from "lucide-react";
import ArticlesManager from "@/components/dashboard/ArticlesManager";
import PlayersManager from "@/components/dashboard/PlayersManager";
import StaffManager from "@/components/dashboard/StaffManager";
import MatchesManager from "@/components/dashboard/MatchesManager";
import CompetitionsManager from "@/components/dashboard/CompetitionsManager";
import GalleriesManager from "@/components/dashboard/GalleriesManager";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard ESC Chorbane</h1>
          <p className="text-gray-600 mt-2">Gestion du contenu et des données du club</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="articles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 lg:grid-cols-6">
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <FileText size={16} />
              <span className="hidden sm:inline">Articles</span>
            </TabsTrigger>
            <TabsTrigger value="players" className="flex items-center gap-2">
              <Users size={16} />
              <span className="hidden sm:inline">Joueurs</span>
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <UserCheck size={16} />
              <span className="hidden sm:inline">Staff</span>
            </TabsTrigger>
            <TabsTrigger value="matches" className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="hidden sm:inline">Matchs</span>
            </TabsTrigger>
            <TabsTrigger value="competitions" className="flex items-center gap-2">
              <Trophy size={16} />
              <span className="hidden sm:inline">Compétitions</span>
            </TabsTrigger>
            <TabsTrigger value="galleries" className="flex items-center gap-2">
              <Camera size={16} />
              <span className="hidden sm:inline">Galeries</span>
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
  );
};

export default Dashboard;
