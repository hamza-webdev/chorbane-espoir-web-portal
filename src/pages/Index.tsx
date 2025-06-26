
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Trophy, Camera } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import NewsSection from "@/components/NewsSection";
import NextMatchSection from "@/components/NextMatchSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <Header />
      <HeroSection />
      <NewsSection />
      <NextMatchSection />
      <Footer />
    </div>
  );
};

export default Index;
