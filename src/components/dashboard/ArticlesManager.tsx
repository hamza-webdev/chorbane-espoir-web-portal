
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ArticleDialog from "./ArticleDialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const ArticlesManager = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['articles-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles-admin'] });
      toast({
        title: "Article supprimé",
        description: "L'article a été supprimé avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'article.",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (article: any) => {
    setEditingArticle(article);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingArticle(null);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestion des Articles</h2>
          <p className="text-sm sm:text-base text-gray-600">Créez et gérez les actualités du club</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
          <Plus size={16} className="mr-2" />
          Nouvel Article
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {articles?.map((article) => (
          <Card key={article.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            {article.featured_image && (
              <div className="h-40 sm:h-48 bg-gray-200">
                <img 
                  src={article.featured_image} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="h-40 sm:h-48 bg-gray-200 flex items-center justify-center hidden">
                  <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                </div>
              </div>
            )}
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-sm sm:text-lg line-clamp-2 mb-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Badge variant={article.published ? "default" : "secondary"} className="text-xs w-fit">
                      {article.published ? "Publié" : "Brouillon"}
                    </Badge>
                    <span className="text-xs sm:text-sm">
                      {format(new Date(article.created_at), 'dd/MM/yyyy', { locale: fr })}
                    </span>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 mb-4">
                {article.excerpt || article.content.substring(0, 100) + '...'}
              </p>
              {article.author && (
                <p className="text-xs text-gray-500 mb-4">Par {article.author}</p>
              )}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(article)}
                  className="text-xs sm:text-sm"
                >
                  <Edit size={12} className="mr-1" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(article.id)}
                  className="text-red-600 hover:text-red-700 text-xs sm:text-sm"
                >
                  <Trash2 size={12} className="mr-1" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ArticleDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        article={editingArticle}
      />
    </div>
  );
};

export default ArticlesManager;
