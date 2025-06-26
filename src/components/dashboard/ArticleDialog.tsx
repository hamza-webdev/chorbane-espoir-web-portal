
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ArticleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: any;
}

const ArticleDialog = ({ open, onOpenChange, article }: ArticleDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    published: false,
    featured_image: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        content: article.content || '',
        excerpt: article.excerpt || '',
        author: article.author || '',
        published: article.published || false,
        featured_image: article.featured_image || ''
      });
    } else {
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        author: '',
        published: false,
        featured_image: ''
      });
    }
  }, [article]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (article) {
        const { error } = await supabase
          .from('articles')
          .update(data)
          .eq('id', article.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles-admin'] });
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: article ? "Article modifié" : "Article créé",
        description: article ? "L'article a été modifié avec succès." : "L'article a été créé avec succès.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'article.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{article ? 'Modifier l\'article' : 'Nouvel article'}</DialogTitle>
          <DialogDescription>
            {article ? 'Modifiez les informations de l\'article' : 'Créez un nouvel article pour le site'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Résumé</Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="Résumé de l'article (optionnel)"
              rows={2}
            />
          </div>

          <div>
            <Label htmlFor="content">Contenu *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={8}
              placeholder="Contenu complet de l'article"
            />
          </div>

          <div>
            <Label htmlFor="author">Auteur</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="Nom de l'auteur"
            />
          </div>

          <div>
            <Label htmlFor="featured_image">Image à la une (URL)</Label>
            <Input
              id="featured_image"
              value={formData.featured_image}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
              placeholder="URL de l'image à la une"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
            />
            <Label htmlFor="published">Publier l'article</Label>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={saveMutation.isPending} className="bg-green-600 hover:bg-green-700">
              {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleDialog;
