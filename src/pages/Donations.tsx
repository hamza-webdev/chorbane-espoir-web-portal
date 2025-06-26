
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

const Donations = () => {
  const { t, i18n } = useTranslation();
  const dateLocale = i18n.language === 'ar' ? ar : fr;

  const { data: donations, isLoading, error, refetch } = useQuery({
    queryKey: ['public-donations'],
    queryFn: async () => {
      console.log('Fetching donations from database...');
      
      const { data, error } = await supabase
        .from('donations')
        .select(`
          id,
          donor_name,
          donor_email,
          donor_phone,
          amount,
          currency,
          payment_method,
          is_anonymous,
          message,
          status,
          created_at,
          updated_at
        `)
        .eq('status', 'completed')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching donations:', error);
        throw new Error(`Erreur de récupération des donations: ${error.message}`);
      }
      
      console.log('Donations fetched successfully:', data?.length || 0, 'donations');
      return data || [];
    },
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Calculate total amount with better error handling
  const totalAmount = donations?.reduce((sum, donation) => {
    console.log('Processing donation:', donation.id, 'amount:', donation.amount);
    
    let amount = 0;
    if (donation.amount !== null && donation.amount !== undefined) {
      if (typeof donation.amount === 'string') {
        const parsed = parseFloat(donation.amount);
        amount = isNaN(parsed) ? 0 : parsed;
      } else if (typeof donation.amount === 'number') {
        amount = donation.amount;
      }
    }
    
    return sum + amount;
  }, 0) || 0;

  console.log('Total donations:', donations?.length || 0);
  console.log('Total amount calculated:', totalAmount);

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

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Impact Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                {t("donations.impact_title", "Impact de vos donations")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                {t("donations.impact_description", "Grâce à votre générosité, nous pouvons continuer à développer notre club et offrir les meilleures conditions à nos joueurs.")}
              </p>
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {totalAmount.toLocaleString('fr-FR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })} DT
                </div>
                <p className="text-lg text-green-700 font-medium mb-1">
                  {t("donations.total_raised", "Total collecté")}
                </p>
                <p className="text-sm text-green-600">
                  {donations?.length || 0} donation{(donations?.length || 0) > 1 ? 's' : ''} confirmée{(donations?.length || 0) > 1 ? 's' : ''}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Fund Usage */}
          <Card>
            <CardHeader>
              <CardTitle>{t("donations.fund_usage", "Utilisation des fonds")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fundUsageItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <Icon className={`h-6 w-6 mt-0.5 ${item.color}`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information for Donations */}
          <Card>
            <CardHeader>
              <CardTitle>{t("donations.how_to_donate", "Comment faire un don")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Pour faire un don à notre club, veuillez nous contacter directement :
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    <p className="font-medium text-blue-900">📧 Email : contact@escchebba.tn</p>
                    <p className="font-medium text-blue-900">📞 Téléphone : +216 XX XXX XXX</p>
                    <p className="font-medium text-blue-900">📍 Adresse : Chebba, Mahdia</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Notre équipe vous guidera dans le processus de donation et vous fournira toutes les informations nécessaires.
                </p>
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
                  <p className="text-gray-600">{t("common.loading", "Chargement...")}</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-600 font-medium mb-2">Erreur lors du chargement des donations</p>
                    <p className="text-sm text-red-500 mb-4">{error.message}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => refetch()}
                      className="text-red-600 hover:text-red-700"
                    >
                      Réessayer
                    </Button>
                  </div>
                </div>
              ) : donations && donations.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {donations.map((donation) => {
                    // Handle amount conversion safely
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
                      <div key={donation.id} className="flex items-start justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-medium text-gray-900 truncate">
                              {donation.is_anonymous ? 
                                t("donations.anonymous_donor", "Donateur anonyme") : 
                                (donation.donor_name || "Donateur")
                              }
                            </p>
                            {donation.payment_method && (
                              <Badge variant="outline" className="text-xs shrink-0">
                                {donation.payment_method.replace('_', ' ').toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="flex items-center gap-1">
                              <span>📅</span>
                              {format(new Date(donation.created_at), 'dd MMMM yyyy à HH:mm', { locale: dateLocale })}
                            </p>
                            
                            {!donation.is_anonymous && donation.donor_email && (
                              <p className="flex items-center gap-1">
                                <span>📧</span>
                                <span className="truncate">{donation.donor_email}</span>
                              </p>
                            )}
                            
                            {!donation.is_anonymous && donation.donor_phone && (
                              <p className="flex items-center gap-1">
                                <span>📞</span>
                                {donation.donor_phone}
                              </p>
                            )}
                          </div>
                          
                          {donation.message && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-200">
                              <p className="text-sm text-gray-700 italic">
                                💬 "{donation.message}"
                              </p>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right ml-4 shrink-0">
                          <div className="text-xl font-bold text-green-600">
                            {amount.toLocaleString('fr-FR', { 
                              minimumFractionDigits: 2, 
                              maximumFractionDigits: 2 
                            })} {donation.currency || 'DT'}
                          </div>
                          <Badge 
                            variant="default"
                            className="text-xs mt-1 bg-green-100 text-green-800"
                          >
                            ✓ Confirmé
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
      </main>

      <Footer />
    </div>
  );
};

export default Donations;
