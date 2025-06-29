
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

    console.log('File selected:', file.name, file.size, file.type);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un fichier image.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (22MB)
    if (file.size > 22 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "La taille du fichier ne doit pas dépasser 22MB.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Create unique filename with better mobile compatibility
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      console.log('Uploading file to path:', filePath);

      // Upload file to Supabase storage directly
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Erreur de téléchargement: ${uploadError.message}`);
      }

      console.log('File uploaded successfully:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      if (!urlData?.publicUrl) {
        throw new Error('Impossible d\'obtenir l\'URL publique du fichier');
      }

      console.log('Public URL obtained:', urlData.publicUrl);

      setPreview(urlData.publicUrl);
      onPhotoChange(urlData.publicUrl);

      toast({
        title: "Succès",
        description: "Photo téléchargée avec succès.",
      });

      // Clear the input
      event.target.value = '';

    } catch (error: any) {
      console.error('Photo upload error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors du téléchargement de la photo. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoChange('');
    toast({
      title: "Photo supprimée",
      description: "La photo a été supprimée avec succès.",
    });
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex flex-col gap-4">
        {/* File Input */}
        <div className="flex-1">
          <Input
            type="file"
            accept="image/*,image/heic,image/heif"
            onChange={handleFileUpload}
            disabled={uploading}
            className="cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Formats supportés: JPG, PNG, WebP, GIF (max 22MB)
          </p>
        </div>

        {/* Preview */}
        {preview && (
          <div className="relative inline-block">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
              <img
                src={preview}
                alt="Aperçu"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image load error for:', preview);
                  e.currentTarget.src = '/placeholder.svg';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', preview);
                }}
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-7 w-7 rounded-full p-0 shadow-lg hover:shadow-xl transition-shadow"
              onClick={handleRemovePhoto}
              disabled={uploading}
            >
              <X size={14} />
            </Button>
          </div>
        )}

        {/* Upload Status */}
        {uploading && (
          <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            <Upload size={16} className="animate-spin" />
            <span>Téléchargement en cours...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoUpload;
