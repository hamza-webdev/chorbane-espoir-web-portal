
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const NewsSection = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Dernières Actualités</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Dernières Actualités</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles?.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-green-600">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Actualité
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarDays size={16} className="mr-1" />
                    {format(new Date(article.created_at), 'dd MMM yyyy', { locale: fr })}
                  </div>
                </div>
                <CardTitle className="text-xl text-gray-900 line-clamp-2">
                  {article.title}
                </CardTitle>
                {article.author && (
                  <CardDescription className="text-green-600">
                    Par {article.author}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 line-clamp-3">
                  {article.excerpt || article.content.substring(0, 150) + '...'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
