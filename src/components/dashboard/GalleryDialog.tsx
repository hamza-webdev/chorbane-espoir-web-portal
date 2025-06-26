
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GalleryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gallery?: any;
}

const GalleryDialog = ({ open, onOpenChange, gallery }: GalleryDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_image: '',
    event_date: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (gallery) {
      setFormData({
        title: gallery.title || '',
        description: gallery.description || '',
        cover_image: gallery.cover_image || '',
        event_date: gallery.event_date || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        cover_image: '',
        event_date: ''
      });
    }
  }, [gallery]);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        title: data.title,
        description: data.description || null,
        cover_image: data.cover_image || null,
        event_date: data.event_date || null
      };

      if (gallery) {
        const { error } = await supabase
          .from('galleries')
          .update(payload)
          .eq('id', gallery.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('galleries')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['galleries-admin'] });
      toast({
        title: gallery ? "Galerie modifiée" : "Galerie créée",
        description: gallery ? "La galerie a été modifiée avec succès." : "La galerie a été créée avec succès.",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la galerie.",
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{gallery ? 'Modifier la galerie' : 'Nouvelle galerie'}</DialogTitle>
          <DialogDescription>
            {gallery ? 'Modifiez les informations de la galerie' : 'Créez une nouvelle galerie de photos'}
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
              placeholder="Nom de la galerie"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Description de la galerie"
            />
          </div>

          <div>
            <Label htmlFor="event_date">Date de l'événement</Label>
            <Input
              id="event_date"
              type="date"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="cover_image">Image de couverture (URL)</Label>
            <Input
              id="cover_image"
              value={formData.cover_image}
              onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
              placeholder="URL de l'image de couverture"
            />
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

export default GalleryDialog;
