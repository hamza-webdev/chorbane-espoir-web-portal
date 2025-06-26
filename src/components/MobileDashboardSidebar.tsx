
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, FileText, Users, UserCheck, Calendar, Trophy, Camera, Heart } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface MobileDashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileDashboardSidebar = ({ activeTab, onTabChange }: MobileDashboardSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: "articles", label: "Articles", icon: FileText },
    { id: "players", label: "Joueurs", icon: Users },
    { id: "staff", label: "Staff", icon: UserCheck },
    { id: "matches", label: "Matchs", icon: Calendar },
    { id: "competitions", label: "Compétitions", icon: Trophy },
    { id: "galleries", label: "Galeries", icon: Camera },
    { id: "donations", label: "Donations", icon: Heart },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="mb-4">
            <Menu size={16} className="mr-2" />
            Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72">
          <SheetHeader>
            <SheetTitle>Menu Dashboard</SheetTitle>
          </SheetHeader>
          <nav className="mt-6">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <Icon size={16} className="mr-3" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileDashboardSidebar;
