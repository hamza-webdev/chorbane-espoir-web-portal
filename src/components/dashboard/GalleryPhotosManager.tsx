import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GalleryPhotosManagerProps {
  galleryId: string;
  galleryTitle: string;
}

const GalleryPhotosManager = ({ galleryId, galleryTitle }: GalleryPhotosManagerProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState<any>(null);
  const [formData, setFormData] = useState({
    image_url: '',
    caption: '',
    order_index: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: photos, isLoading } = useQuery({
    queryKey: ['gallery-photos', galleryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .eq('gallery_id', galleryId)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        gallery_id: galleryId,
        image_url: data.image_url,
        caption: data.caption || null,
        order_index: data.order_index || 0
      };

      if (editingPhoto) {
        const { error } = await supabase
          .from('photos')
          .update(payload)
          .eq('id', editingPhoto.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('photos')
          .insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-photos', galleryId] });
      queryClient.invalidateQueries({ queryKey: ['galleries-admin'] });
      toast({
        title: editingPhoto ? "Photo modifiée" : "Photo ajoutée",
        description: editingPhoto ? "La photo a été modifiée avec succès." : "La photo a été ajoutée avec succès.",
      });
      handleCloseDialog();
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la photo.",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('photos')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery-photos', galleryId] });
      queryClient.invalidateQueries({ queryKey: ['galleries-admin'] });
      toast({
        title: "Photo supprimée",
        description: "La photo a été supprimée avec succès.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la photo.",
        variant: "destructive",
      });
    }
  });

  const handleEdit = (photo: any) => {
    setEditingPhoto(photo);
    setFormData({
      image_url: photo.image_url || '',
      caption: photo.caption || '',
      order_index: photo.order_index || 0
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette photo ?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPhoto(null);
    setFormData({
      image_url: '',
      caption: '',
      order_index: 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="flex justify-center p-4">Chargement...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold">{galleryTitle}</h3>
          <p className="text-xs sm:text-sm text-gray-600">{photos?.length || 0} photo(s)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setDialogOpen(true)} size="sm" className="w-full sm:w-auto">
              <Plus size={16} className="mr-2" />
              Ajouter une photo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">{editingPhoto ? 'Modifier la photo' : 'Ajouter une photo'}</DialogTitle>
              <DialogDescription className="text-sm">
                {editingPhoto ? 'Modifiez les informations de la photo' : 'Ajoutez une nouvelle photo à la galerie'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="image_url" className="text-sm">URL de l'image *</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                  placeholder="https://exemple.com/image.jpg"
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="caption" className="text-sm">Légende</Label>
                <Textarea
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  rows={2}
                  placeholder="Légende de la photo"
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="order_index" className="text-sm">Ordre d'affichage</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  min="0"
                  className="text-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <Button type="submit" disabled={saveMutation.isPending} className="w-full sm:w-auto">
                  {saveMutation.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseDialog} className="w-full sm:w-auto">
                  Annuler
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {photos?.map((photo) => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={photo.image_url}
                alt={photo.caption || 'Photo de galerie'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            <CardContent className="p-2 sm:p-3">
              {photo.caption && (
                <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                  {photo.caption}
                </p>
              )}
              <div className="flex flex-col xs:flex-row gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(photo)}
                  className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Edit size={12} className="mr-1" />
                  <span className="hidden xs:inline">Modifier</span>
                  <span className="xs:hidden">Mod.</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(photo.id)}
                  className="text-red-600 hover:text-red-700 text-xs sm:text-sm h-8 sm:h-9 xs:flex-shrink-0"
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {photos?.length === 0 && (
        <div className="text-center py-8">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 text-sm sm:text-base">Aucune photo dans cette galerie</p>
        </div>
      )}
    </div>
  );
};

export default GalleryPhotosManager;
