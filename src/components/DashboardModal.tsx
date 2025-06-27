
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Calendar, 
  Trophy, 
  Camera, 
  FileText, 
  Heart,
  Settings,
  LogOut
} from "lucide-react";
import PlayersManager from "./dashboard/PlayersManager";
import StaffManager from "./dashboard/StaffManager";
import MatchesManager from "./dashboard/MatchesManager";
import CompetitionsManager from "./dashboard/CompetitionsManager";
import ArticlesManager from "./dashboard/ArticlesManager";
import GalleriesManager from "./dashboard/GalleriesManager";
import DonationsManager from "./dashboard/DonationsManager";

interface DashboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DashboardModal = ({ open, onOpenChange }: DashboardModalProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("players");

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: t('auth.signout_success'),
        description: t('auth.goodbye'),
      });
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: t('auth.signout_error'),
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  const tabs = [
    { id: "players", label: t('dashboard.players'), icon: Users, component: PlayersManager },
    { id: "staff", label: t('dashboard.staff'), icon: Settings, component: StaffManager },
    { id: "matches", label: t('dashboard.matches'), icon: Calendar, component: MatchesManager },
    { id: "competitions", label: t('dashboard.competitions'), icon: Trophy, component: CompetitionsManager },
    { id: "articles", label: t('dashboard.articles'), icon: FileText, component: ArticlesManager },
    { id: "galleries", label: t('dashboard.galleries'), icon: Camera, component: GalleriesManager },
    { id: "donations", label: t('dashboard.donations'), icon: Heart, component: DonationsManager },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{t('common.dashboard')}</DialogTitle>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut size={16} className="mr-2" />
            {t('auth.signout')}
          </Button>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-7 mb-4">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1">
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div className="flex-1 overflow-auto">
            {tabs.map((tab) => {
              const Component = tab.component;
              return (
                <TabsContent key={tab.id} value={tab.id} className="mt-0">
                  <Component />
                </TabsContent>
              );
            })}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardModal;
