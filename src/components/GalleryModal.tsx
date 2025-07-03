
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
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full sm:max-w-[95vw] sm:max-h-[90vh] sm:h-auto p-0 gap-0 sm:rounded-lg">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-3 sm:p-6 pb-2 sm:pb-4 border-b flex-shrink-0">
            <DialogTitle className="text-base sm:text-xl lg:text-2xl font-bold pr-8 line-clamp-1">
              {gallery.title}
            </DialogTitle>
            {gallery.description && (
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base line-clamp-2">
                {gallery.description}
              </p>
            )}
            {gallery.event_date && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {format(new Date(gallery.event_date), 'dd MMMM yyyy', { locale: fr })}
              </p>
            )}
          </DialogHeader>

          {photos.length > 0 ? (
            <>
              {/* Photo principale */}
              <div className="flex-1 relative bg-black flex items-center justify-center min-h-0 touch-manipulation">
                <img
                  src={currentPhoto.image_url}
                  alt={currentPhoto.caption || gallery.title}
                  className="max-w-full max-h-full object-contain select-none"
                  draggable={false}
                />
                
                {/* Boutons de navigation - Plus grands sur mobile */}
                {photos.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 border-white/20 text-white w-12 h-12 sm:w-10 sm:h-10 sm:left-4"
                      onClick={prevPhoto}
                    >
                      <ChevronLeft className="h-6 w-6 sm:h-5 sm:w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 border-white/20 text-white w-12 h-12 sm:w-10 sm:h-10 sm:right-4"
                      onClick={nextPhoto}
                    >
                      <ChevronRight className="h-6 w-6 sm:h-5 sm:w-5" />
                    </Button>
                  </>
                )}

                {/* Indicateur de photo */}
                {photos.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                    {currentPhotoIndex + 1} / {photos.length}
                  </div>
                )}
              </div>

              {/* Caption */}
              {currentPhoto.caption && (
                <div className="p-3 sm:p-4 bg-gray-50 border-t flex-shrink-0">
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {currentPhoto.caption}
                  </p>
                </div>
              )}

              {/* Miniatures - Adaptées pour mobile */}
              {photos.length > 1 && (
                <div className="p-2 sm:p-4 border-t flex-shrink-0">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {photos.map((photo, index) => (
                      <button
                        key={photo.id}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentPhotoIndex
                            ? 'border-green-500 scale-105'
                            : 'border-gray-300 hover:border-gray-400'
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 p-4">
              <p className="text-center text-sm sm:text-base">
                Aucune photo disponible dans cette galerie
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;
