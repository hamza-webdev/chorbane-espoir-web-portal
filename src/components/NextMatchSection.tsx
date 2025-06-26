
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const NextMatchSection = () => {
  const { data: nextMatch, isLoading } = useQuery({
    queryKey: ['nextMatch'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          competitions (name, type)
        `)
        .eq('status', 'a_venir')
        .gte('match_date', new Date().toISOString())
        .order('match_date', { ascending: true })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (!nextMatch) {
    return (
      <section className="py-16 bg-green-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-8 text-gray-900">Prochain Match</h3>
          <p className="text-gray-600">Aucun match programmé pour le moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-green-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Prochain Match</h3>
        <Card className="bg-white shadow-xl border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <div className="text-center">
              <Badge className="bg-white text-green-800 mb-4">
                {nextMatch.competitions?.name || 'Match'}
              </Badge>
              <CardTitle className="text-2xl md:text-3xl">
                ESC Chorbane vs {nextMatch.opponent_team}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <Calendar className="w-8 h-8 text-green-600 mb-2" />
                <p className="font-semibold text-gray-900">
                  {format(new Date(nextMatch.match_date), 'EEEE dd MMMM yyyy', { locale: fr })}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="w-8 h-8 text-green-600 mb-2" />
                <p className="font-semibold text-gray-900">
                  {format(new Date(nextMatch.match_date), 'HH:mm')}
                </p>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-8 h-8 text-green-600 mb-2" />
                <p className="font-semibold text-gray-900">
                  {nextMatch.venue || (nextMatch.is_home ? 'Domicile' : 'Extérieur')}
                </p>
                <Badge variant={nextMatch.is_home ? "default" : "secondary"} className="mt-1">
                  {nextMatch.is_home ? 'Domicile' : 'Extérieur'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default NextMatchSection;
