
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Photo {
  id: string;
  image_url: string;
  caption?: string;
}

interface Gallery {
  id: string;
  title: string;
  description?: string;
  event_date?: string;
  photos: Photo[];
}

interface GalleryModalProps {
  gallery: Gallery | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GalleryModal = ({ gallery, open, onOpenChange }: GalleryModalProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!gallery) return null;

  const photos = gallery.photos || [];
  const currentPhoto = photos[currentPhotoIndex];

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setCurrentPhotoIndex(0);
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold">{gallery.title}</DialogTitle>
          {gallery.description && (
            <p className="text-gray-600 mt-2">{gallery.description}</p>
          )}
          {gallery.event_date && (
            <p className="text-sm text-gray-500">
              {format(new Date(gallery.event_date), 'dd MMMM yyyy', { locale: fr })}
            </p>
          )}
        </DialogHeader>

        {photos.length > 0 ? (
          <div className="flex-1 flex flex-col">
            {/* Photo principale */}
            <div className="flex-1 relative bg-black flex items-center justify-center">
              <img
                src={currentPhoto.image_url}
                alt={currentPhoto.caption || gallery.title}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Boutons de navigation */}
              {photos.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevPhoto}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextPhoto}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Indicateur de photo */}
              {photos.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentPhotoIndex + 1} / {photos.length}
                </div>
              )}
            </div>

            {/* Caption */}
            {currentPhoto.caption && (
              <div className="p-4 bg-gray-50 border-t">
                <p className="text-gray-700">{currentPhoto.caption}</p>
              </div>
            )}

            {/* Miniatures */}
            {photos.length > 1 && (
              <div className="p-4 border-t">
                <div className="flex gap-2 overflow-x-auto">
                  {photos.map((photo, index) => (
                    <button
                      key={photo.id}
                      onClick={() => setCurrentPhotoIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                        index === currentPhotoIndex
                          ? 'border-green-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={photo.image_url}
                        alt={photo.caption || `Photo ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Aucune photo disponible dans cette galerie</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;
