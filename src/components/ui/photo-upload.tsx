
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string) => void;
  label: string;
  folder?: string;
}

const PhotoUpload = ({ currentPhoto, onPhotoChange, label, folder = "general" }: PhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "La taille du fichier ne doit pas dépasser 5MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onPhotoChange(publicUrl);

      toast({
        title: "Succès",
        description: "Photo téléchargée avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement de la photo.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoChange('');
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="cursor-pointer"
          />
        </div>
        {preview && (
          <div className="relative">
            <div className="w-20 h-20 rounded-lg overflow-hidden border">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={handleRemovePhoto}
            >
              <X size={12} />
            </Button>
          </div>
        )}
      </div>
      {uploading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Upload size={16} className="animate-spin" />
          Téléchargement en cours...
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
