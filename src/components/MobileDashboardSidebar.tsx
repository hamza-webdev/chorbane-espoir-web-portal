
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, FileText, Users, UserCheck, Calendar, Trophy, Camera, Heart, CreditCard } from "lucide-react";
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
    { id: "subscriptions", label: "Abonnements", icon: CreditCard },
  ];

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setIsOpen(false);
  };

  const activeTabLabel = tabs.find(tab => tab.id === activeTab)?.label || 'Menu';

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="mb-4 w-full sm:w-auto">
            <Menu size={16} className="mr-2" />
            <span className="font-medium">{activeTabLabel}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 sm:w-96">
          <SheetHeader className="pb-6">
            <SheetTitle className="text-left text-lg font-bold text-green-800">
              Menu Dashboard
            </SheetTitle>
          </SheetHeader>
          <nav className="h-full overflow-y-auto">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-12 text-base font-medium ${
                      isActive 
                        ? "bg-green-600 hover:bg-green-700 text-white" 
                        : "hover:bg-green-50 hover:text-green-700"
                    }`}
                    onClick={() => handleTabClick(tab.id)}
                  >
                    <Icon size={18} className="mr-3 flex-shrink-0" />
                    <span className="truncate">{tab.label}</span>
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
