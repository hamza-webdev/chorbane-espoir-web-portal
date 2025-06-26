
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Users, Building, GraduationCap, Car, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fr, ar } from "date-fns/locale";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DonationForm from "@/components/DonationForm";

const Donations = () => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'ar' ? ar : fr;

  const { data: donations, isLoading, error, refetch } = useQuery({
    queryKey: ['donations'],
    queryFn: async () => {
      console.log('Fetching donations...');
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching donations:', error);
        throw error;
      }
      
      console.log('Donations fetched:', data);
      return data || [];
    },
    refetchOnWindowFocus: false,
  });

  // Calculate total amount with proper error handling
  const totalAmount = donations?.reduce((sum, donation) => {
    console.log('Processing donation amount:', donation.amount, 'type:', typeof donation.amount);
    
    // Handle different amount formats
    let amount = 0;
    if (donation.amount !== null && donation.amount !== undefined) {
      if (typeof donation.amount === 'string') {
        const parsed = parseFloat(donation.amount);
        amount = isNaN(parsed) ? 0 : parsed;
      } else if (typeof donation.amount === 'number') {
        amount = donation.amount;
      }
    }
    
    console.log('Converted amount:', amount);
    return sum + amount;
  }, 0) || 0;

  console.log('Total amount calculated:', totalAmount);
  console.log('Number of donations:', donations?.length || 0);

  const fundUsageItems = [
    {
      icon: Users,
      title: t("donations.equipment"),
      description: t("donations.equipment_desc"),
      color: "text-blue-600"
    },
    {
      icon: Building,
      title: t("donations.infrastructure"),
      description: t("donations.infrastructure_desc"),
      color: "text-green-600"
    },
    {
      icon: GraduationCap,
      title: t("donations.training"),
      description: t("donations.training_desc"),
      color: "text-purple-600"
    },
    {
      icon: Car,
      title: t("donations.transport"),
      description: t("donations.transport_desc"),
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft size={16} className="mr-2" />
              {t("common.back", "Retour")}
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("donations.title")}
            </h1>
            <p className="text-gray-600 text-lg">
              {t("donations.subtitle")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Donation Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Impact Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  {t("donations.impact_title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  {t("donations.impact_description")}
                </p>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {totalAmount.toLocaleString('fr-FR', { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 2 
                    })} DT
                  </div>
                  <p className="text-sm text-green-700 font-medium">
                    {t("donations.total_raised", "Total collecté")}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {donations?.length || 0} donation{(donations?.length || 0) > 1 ? 's' : ''} reçue{(donations?.length || 0) > 1 ? 's' : ''}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Fund Usage */}
            <Card>
              <CardHeader>
                <CardTitle>{t("donations.fund_usage")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {fundUsageItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <Icon className={`h-5 w-5 mt-1 ${item.color}`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Donations */}
            <Card>
              <CardHeader>
                <CardTitle>{t("donations.recent_donations", "Dons récents")}</CardTitle>
                <CardDescription>
                  {t("donations.recent_donations_desc", "Merci à tous nos généreux donateurs")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">{t("common.loading")}</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-600 font-medium">Erreur lors du chargement des donations</p>
                      <p className="text-sm text-red-500 mt-1">{error.message}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => refetch()}
                        className="mt-3"
                      >
                        Réessayer
                      </Button>
                    </div>
                  </div>
                ) : donations && donations.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {donations.map((donation) => {
                      // Handle amount conversion with better error handling
                      let amount = 0;
                      if (donation.amount !== null && donation.amount !== undefined) {
                        if (typeof donation.amount === 'string') {
                          const parsed = parseFloat(donation.amount);
                          amount = isNaN(parsed) ? 0 : parsed;
                        } else if (typeof donation.amount === 'number') {
                          amount = donation.amount;
                        }
                      }
                      
                      return (
                        <div key={donation.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-gray-900">
                                {donation.is_anonymous ? t("donations.anonymous_donor", "Donateur anonyme") : (donation.donor_name || "Donateur")}
                              </p>
                              {donation.payment_method && (
                                <Badge variant="outline" className="text-xs">
                                  {donation.payment_method.toUpperCase()}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {format(new Date(donation.created_at), 'dd MMM yyyy à HH:mm', { locale: dateLocale })}
                            </p>
                            {donation.message && (
                              <p className="text-sm text-gray-700 italic mt-2 bg-gray-50 p-2 rounded">
                                "{donation.message}"
                              </p>
                            )}
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-lg font-bold text-green-600">
                              {amount.toLocaleString('fr-FR', { 
                                minimumFractionDigits: 2, 
                                maximumFractionDigits: 2 
                              })} {donation.currency || 'DT'}
                            </div>
                            <Badge 
                              variant={donation.status === 'completed' ? 'default' : 'secondary'} 
                              className="text-xs mt-1"
                            >
                              {donation.status === 'completed' ? 'Confirmé' : donation.status}
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium">
                      {t("donations.no_donations", "Aucun don pour le moment")}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Soyez le premier à soutenir notre club !
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Donation Form */}
          <div className="lg:col-span-1">
            <DonationForm onDonationSuccess={() => refetch()} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Donations;
