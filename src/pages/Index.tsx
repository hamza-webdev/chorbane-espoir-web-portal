import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Camera, Mail, Phone, Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr, ar } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import MatchDialog from "@/components/dashboard/MatchDialog";
import Header from "@/components/Header";
import GalleryModal from "@/components/GalleryModal";
import ReactionButtons from "@/components/ReactionButtons";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { t, i18n } = useTranslation();
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);

  // Get the appropriate date-fns locale
  const dateLocale = i18n.language === 'ar' ? ar : fr;

  const { data: articles } = useQuery({
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

  const { data: players } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: matches } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          competitions (name, type)
        `)
        .order('match_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: staff } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: galleries } = useQuery({
    queryKey: ['galleries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('galleries')
        .select(`
          *,
          photos (image_url, caption)
        `)
        .order('event_date', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    }
  });

  const getMatchStatus = (match: any) => {
    const matchDate = new Date(match.match_date);
    const now = new Date();
    
    if (match.status === 'termine') return { label: t('matches.status.finished'), variant: 'outline' as const };
    if (match.status === 'reporte') return { label: t('matches.status.postponed'), variant: 'destructive' as const };
    if (match.status === 'en_cours') return { label: t('matches.status.ongoing'), variant: 'secondary' as const };
    if (matchDate > now) return { label: t('matches.status.upcoming'), variant: 'default' as const };
    
    return { label: t('matches.status.upcoming'), variant: 'default' as const };
  };

  const nextMatch = matches?.find(match => 
    new Date(match.match_date) > new Date() && match.status === 'a_venir'
  );

  const handleGalleryClick = (gallery: any) => {
    setSelectedGallery(gallery);
    setGalleryModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        {/* Section Accueil */}
        <section id="accueil" className="bg-gradient-to-r from-green-600 to-green-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {t('hero.title')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-green-100">
                {t('hero.subtitle')}
              </p>
              <div className="flex justify-center space-x-4">
                <a href="#equipe" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                  {t('hero.discover_team')}
                </a>
                <a href="#matchs" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition">
                  {t('hero.view_matches')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Prochain match en vedette */}
        {nextMatch && (
          <section className="bg-gray-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('matches.next_match')}</h2>
              </div>
              <div className="max-w-2xl mx-auto">
                <Card className="bg-white shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-4">
                        ESC {t('matches.vs')} {nextMatch.opponent_team}
                      </div>
                      <div className="flex items-center justify-center space-x-6 text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          {format(new Date(nextMatch.match_date), 'dd/MM/yyyy à HH:mm', { locale: dateLocale })}
                        </div>
                        {nextMatch.venue && (
                          <div className="flex items-center">
                            <MapPin className="h-5 w-5 mr-2" />
                            {nextMatch.venue}
                          </div>
                        )}
                      </div>
                      {nextMatch.competitions && (
                        <Badge variant="outline" className="mb-4">
                          {nextMatch.competitions.name}
                        </Badge>
                      )}
                      <div className="text-sm text-gray-600 mb-4">
                        {nextMatch.is_home ? t('matches.home') : t('matches.away')}
                      </div>
                      <ReactionButtons 
                        entityType="match" 
                        entityId={nextMatch.id} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Section Équipe */}
        <section id="equipe" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('team.title')}</h2>
              <p className="text-lg text-gray-600">{t('team.subtitle')}</p>
            </div>

            {/* Joueurs */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t('team.players')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {players?.map((player) => (
                  <Card key={player.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {player.photo ? (
                        <img 
                          src={player.photo} 
                          alt={player.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <Users className="h-16 w-16 text-gray-400" />
                      )}
                      {player.photo && (
                        <Users className="h-16 w-16 text-gray-400 hidden" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-lg">{player.name}</h4>
                        {player.jersey_number && (
                          <Badge className="bg-green-600">#{player.jersey_number}</Badge>
                        )}
                      </div>
                      <p className="text-green-600 capitalize mb-2">{player.position}</p>
                      <div className="text-sm text-gray-600 space-y-1 mb-3">
                        {player.age && <p>{t('team.age')}: {player.age} {t('team.years')}</p>}
                        {player.height && <p>{t('team.height')}: {player.height} {t('team.cm')}</p>}
                        {player.weight && <p>{t('team.weight')}: {player.weight} {t('team.kg')}</p>}
                      </div>
                      {player.bio && (
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{player.bio}</p>
                      )}
                      <ReactionButtons 
                        entityType="player" 
                        entityId={player.id} 
                        size="sm"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Staff */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">{t('team.staff')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff?.map((member) => (
                  <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {member.photo ? (
                        <img 
                          src={member.photo} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <Users className="h-16 w-16 text-gray-400" />
                      )}
                      {member.photo && (
                        <Users className="h-16 w-16 text-gray-400 hidden" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-lg mb-2">{member.name}</h4>
                      <p className="text-green-600 capitalize mb-2">{member.role.replace('_', ' ')}</p>
                      <div className="text-sm text-gray-600 space-y-1 mb-2">
                        {member.email && <p>{t('team.email')}: {member.email}</p>}
                        {member.phone && <p>{t('team.phone')}: {member.phone}</p>}
                        {member.joined_date && (
                          <p>{t('team.joined')}: {format(new Date(member.joined_date), 'dd/MM/yyyy', { locale: dateLocale })}</p>
                        )}
                      </div>
                      {member.bio && (
                        <p className="text-gray-600 text-sm line-clamp-3 mb-3">{member.bio}</p>
                      )}
                      <ReactionButtons 
                        entityType="staff" 
                        entityId={member.id} 
                        size="sm"
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section Matchs */}
        <section id="matchs" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div className="text-center flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('matches.title')}</h2>
                <p className="text-lg text-gray-600">{t('matches.subtitle')}</p>
              </div>
              {isAuthenticated && (
                <Button onClick={() => setMatchDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus size={16} className="mr-2" />
                  {t('matches.new_match')}
                </Button>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches?.map((match) => {
                const statusInfo = getMatchStatus(match);
                return (
                  <Card key={match.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        ESC {t('matches.vs')} {match.opponent_team}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(match.match_date), 'dd/MM/yyyy à HH:mm', { locale: dateLocale })}</span>
                        </div>
                        {match.venue && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{match.venue}</span>
                          </div>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <div className="space-y-2">
                          <Badge variant={statusInfo.variant}>
                            {statusInfo.label}
                          </Badge>
                          {match.status === 'termine' && (
                            <div className="text-lg font-bold">
                              {match.our_score} - {match.opponent_score}
                            </div>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{match.is_home ? t('matches.home') : t('matches.away')}</p>
                          {match.competitions && (
                            <p className="text-green-600">{match.competitions.name}</p>
                          )}
                        </div>
                      </div>
                      <ReactionButtons 
                        entityType="match" 
                        entityId={match.id} 
                        size="sm"
                      />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section Actualités */}
        <section id="actualites" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('news.title')}</h2>
              <p className="text-lg text-gray-600">{t('news.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles?.map((article) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {article.featured_image && (
                    <div className="h-48 bg-gray-200">
                      <img 
                        src={article.featured_image} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                    {article.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                    )}
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>{format(new Date(article.created_at), 'dd MMM yyyy', { locale: dateLocale })}</span>
                      {article.author && <span>{t('news.by')} {article.author}</span>}
                    </div>
                    <ReactionButtons 
                      entityType="article" 
                      entityId={article.id} 
                      size="sm"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Section Galeries */}
        <section id="galeries" className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('galleries.title')}</h2>
              <p className="text-lg text-gray-600">{t('galleries.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleries?.map((gallery) => (
                <Card 
                  key={gallery.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleGalleryClick(gallery)}
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    {gallery.photos && gallery.photos[0] ? (
                      <img 
                        src={gallery.photos[0].image_url} 
                        alt={gallery.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="h-16 w-16 text-gray-400" />
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{gallery.title}</h3>
                    {gallery.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{gallery.description}</p>
                    )}
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      {gallery.event_date && (
                        <span>{format(new Date(gallery.event_date), 'dd MMM yyyy', { locale: dateLocale })}</span>
                      )}
                      <span>{gallery.photos?.length || 0} {t('galleries.photos')}</span>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        <Camera className="h-4 w-4 mr-2" />
                        {t('galleries.view_photos')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Section Contact */}
        <section id="contact" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('contact.title')}</h2>
              <p className="text-lg text-gray-600">{t('contact.subtitle')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-6">{t('contact.info')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-3" />
                    <span>{t('contact.address')}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-green-600 mr-3" />
                    <span>+216 XX XXX XXX</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-green-600 mr-3" />
                    <span>contact@escchebba.tn</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-green-600 mr-3" />
                    <span>{t('contact.hours')}</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-semibold mb-4">{t('contact.follow_us')}</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="text-green-600 hover:text-green-700">Facebook</a>
                    <a href="#" className="text-green-600 hover:text-green-700">Instagram</a>
                    <a href="#" className="text-green-600 hover:text-green-700">Twitter</a>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-6">{t('contact.send_message')}</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.name')}</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('team.email')}</label>
                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.subject')}</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact.message')}</label>
                    <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition">
                    {t('contact.send')}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ESC Chebba</h3>
              <p className="text-gray-400">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('footer.navigation')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#accueil" className="hover:text-white">{t('header.home')}</a></li>
                <li><a href="#equipe" className="hover:text-white">{t('header.team')}</a></li>
                <li><a href="#matchs" className="hover:text-white">{t('header.matches')}</a></li>
                <li><a href="#actualites" className="hover:text-white">{t('header.news')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('header.contact')}</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Chebba, Mahdia</li>
                <li>+216 XX XXX XXX</li>
                <li>contact@escchebba.tn</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{t('contact.follow_us')}</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Espoir Sportif de Chorbane. {t('footer.rights')}</p>
          </div>
        </div>
      </footer>

      {isAuthenticated && (
        <MatchDialog
          open={matchDialogOpen}
          onOpenChange={setMatchDialogOpen}
        />
      )}

      <GalleryModal
        gallery={selectedGallery}
        open={galleryModalOpen}
        onOpenChange={setGalleryModalOpen}
      />
    </div>
  );
};

export default Index;
