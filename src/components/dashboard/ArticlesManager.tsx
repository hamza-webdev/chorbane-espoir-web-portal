
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ArticleDialog from "./ArticleDialog";
import ReactionButtons from "@/components/ReactionButtons";
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
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Gestion des Articles
          </h2>
          <p className="text-base text-gray-600">
            Créez et gérez les actualités du club
          </p>
        </div>
        <Button 
          onClick={() => setDialogOpen(true)} 
          className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-base px-6 py-2"
        >
          <Plus size={18} className="mr-2" />
          Nouvel Article
        </Button>
      </div>

      {/* Grid des articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
        {articles?.map((article) => (
          <Card key={article.id} className="hover:shadow-lg transition-all duration-200 overflow-hidden border-l-4 border-l-green-600">
            {/* Image de l'article */}
            {article.featured_image && (
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img 
                  src={article.featured_image} 
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="h-48 bg-gray-200 flex items-center justify-center hidden">
                  <FileText className="h-16 w-16 text-gray-400" />
                </div>
              </div>
            )}
            
            <CardHeader className="p-4 lg:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 space-y-2">
                  <CardTitle className="text-lg lg:text-xl leading-tight line-clamp-2">
                    {article.title}
                  </CardTitle>
                  <CardDescription className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge 
                        variant={article.published ? "default" : "secondary"} 
                        className={`text-xs ${article.published ? 'bg-green-600 text-white' : ''}`}
                      >
                        {article.published ? "Publié" : "Brouillon"}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {format(new Date(article.created_at), 'dd/MM/yyyy', { locale: fr })}
                      </span>
                    </div>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 lg:p-6 pt-0">
              {/* Contenu de l'article */}
              <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                {article.excerpt || article.content.substring(0, 120) + '...'}
              </p>
              
              {/* Auteur */}
              {article.author && (
                <p className="text-xs text-gray-500 mb-4 font-medium">
                  Par {article.author}
                </p>
              )}
              
              {/* Boutons de réaction */}
              <div className="mb-4">
                <ReactionButtons 
                  entityType="article" 
                  entityId={article.id} 
                  size="sm"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(article)}
                  className="flex-1 text-sm"
                >
                  <Edit size={14} className="mr-2" />
                  Modifier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(article.id)}
                  className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-sm"
                >
                  <Trash2 size={14} className="mr-2" />
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message si aucun article */}
      {articles?.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun article
          </h3>
          <p className="text-gray-600 mb-4">
            Commencez par créer votre premier article.
          </p>
          <Button onClick={() => setDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
            <Plus size={16} className="mr-2" />
            Créer un article
          </Button>
        </div>
      )}

      <ArticleDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        article={editingArticle}
      />
    </div>
  );
};

export default ArticlesManager;
