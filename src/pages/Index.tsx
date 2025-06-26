import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Trophy, Camera, Mail, Phone, Clock, Plus } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import MatchDialog from "@/components/dashboard/MatchDialog";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [matchDialogOpen, setMatchDialogOpen] = useState(false);

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
    
    if (match.status === 'termine') return { label: 'Terminé', variant: 'outline' as const };
    if (match.status === 'reporte') return { label: 'Reporté', variant: 'destructive' as const };
    if (match.status === 'en_cours') return { label: 'En cours', variant: 'secondary' as const };
    if (matchDate > now) return { label: 'À venir', variant: 'default' as const };
    
    return { label: 'À venir', variant: 'default' as const };
  };

  const nextMatch = matches?.find(match => 
    new Date(match.match_date) > new Date() && match.status === 'a_venir'
  );

  return (
    <div className="min-h-screen">
      {/* Header fixe */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl font-bold text-green-600">ESC</span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#accueil" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">Accueil</a>
                <a href="#equipe" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">Équipe</a>
                <a href="#matchs" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">Matchs</a>
                <a href="#actualites" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">Actualités</a>
                <a href="#galeries" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">Galeries</a>
                <a href="#contact" className="text-gray-700 hover:text-green-600 px-3 py-2 text-sm font-medium">Contact</a>
                {isAuthenticated && (
                  <a href="/dashboard" className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">Dashboard</a>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Contenu principal avec padding-top pour compenser le header fixe */}
      <main className="pt-16">
        {/* Section Accueil */}
        <section id="accueil" className="bg-gradient-to-r from-green-600 to-green-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Espoir Sportif de Chorbane
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-green-100">
                Club de football tunisien fondé avec passion
              </p>
              <div className="flex justify-center space-x-4">
                <a href="#equipe" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Découvrir l'équipe
                </a>
                <a href="#matchs" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition">
                  Voir les matchs
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Prochain Match</h2>
              </div>
              <div className="max-w-2xl mx-auto">
                <Card className="bg-white shadow-lg">
                  <CardContent className="p-8">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-4">
                        ESC vs {nextMatch.opponent_team}
                      </div>
                      <div className="flex items-center justify-center space-x-6 text-gray-600 mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          {format(new Date(nextMatch.match_date), 'dd/MM/yyyy à HH:mm', { locale: fr })}
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
                      <div className="text-sm text-gray-600">
                        {nextMatch.is_home ? 'Match à domicile' : 'Match à l\'extérieur'}
                      </div>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
              <p className="text-lg text-gray-600">Découvrez nos joueurs et notre staff technique</p>
            </div>

            {/* Joueurs */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Joueurs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {players?.map((player) => (
                  <Card key={player.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {player.photo ? (
                        <img 
                          src={player.photo} 
                          alt={player.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-lg">{player.name}</h4>
                      <p className="text-green-600">{player.position}</p>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Âge: {player.age || 'N/A'}</p>
                        <p>Taille: {player.height ? `${player.height} cm` : 'N/A'}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Staff */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Staff Technique</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff?.map((member) => (
                  <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {member.photo ? (
                        <img 
                          src={member.photo} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Users className="h-16 w-16 text-gray-400" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-lg">{member.name}</h4>
                      <p className="text-green-600 mb-2">{member.role}</p>
                      {member.bio && (
                        <p className="text-sm text-gray-600 line-clamp-3">{member.bio}</p>
                      )}
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Calendrier des Matchs</h2>
                <p className="text-lg text-gray-600">Suivez tous nos matchs et résultats</p>
              </div>
              {isAuthenticated && (
                <Button onClick={() => setMatchDialogOpen(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus size={16} className="mr-2" />
                  Nouveau Match
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
                        ESC vs {match.opponent_team}
                      </CardTitle>
                      <CardDescription>
                        <div className="flex items-center space-x-2 mb-2">
                          <Calendar className="h-4 w-4" />
                          <span>{format(new Date(match.match_date), 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
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
                      <div className="flex justify-between items-center">
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
                          <p>{match.is_home ? 'Domicile' : 'Extérieur'}</p>
                          {match.competitions && (
                            <p className="text-green-600">{match.competitions.name}</p>
                          )}
                        </div>
                      </div>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Dernières Actualités</h2>
              <p className="text-lg text-gray-600">Restez informé de toute l'actualité du club</p>
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
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                    {article.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>
                    )}
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{format(new Date(article.created_at), 'dd MMM yyyy', { locale: fr })}</span>
                      {article.author && <span>Par {article.author}</span>}
                    </div>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Galeries Photos</h2>
              <p className="text-lg text-gray-600">Revivez les moments forts du club</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleries?.map((gallery) => (
                <Card key={gallery.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                        <span>{format(new Date(gallery.event_date), 'dd MMM yyyy', { locale: fr })}</span>
                      )}
                      <span>{gallery.photos?.length || 0} photos</span>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Contactez-nous</h2>
              <p className="text-lg text-gray-600">Nous sommes là pour répondre à vos questions</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Informations de contact */}
              <div>
                <h3 className="text-xl font-bold mb-6">Informations de contact</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-3" />
                    <span>Chebba, Mahdia, Tunisie</span>
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
                    <span>Lun - Ven: 9h00 - 17h00</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Suivez-nous</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="text-green-600 hover:text-green-700">Facebook</a>
                    <a href="#" className="text-green-600 hover:text-green-700">Instagram</a>
                    <a href="#" className="text-green-600 hover:text-green-700">Twitter</a>
                  </div>
                </div>
              </div>
              
              {/* Formulaire de contact */}
              <div>
                <h3 className="text-xl font-bold mb-6">Envoyez-nous un message</h3>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                    <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition">
                    Envoyer le message
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
                Club de football tunisien fondé avec passion et dédié à l'excellence sportive.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#accueil" className="hover:text-white">Accueil</a></li>
                <li><a href="#equipe" className="hover:text-white">Équipe</a></li>
                <li><a href="#matchs" className="hover:text-white">Matchs</a></li>
                <li><a href="#actualites" className="hover:text-white">Actualités</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Chebba, Mahdia</li>
                <li>+216 XX XXX XXX</li>
                <li>contact@escchebba.tn</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Espoir Sportif de Chebba. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Dialog pour nouveau match */}
      {isAuthenticated && (
        <MatchDialog
          open={matchDialogOpen}
          onOpenChange={setMatchDialogOpen}
        />
      )}
    </div>
  );
};

export default Index;
