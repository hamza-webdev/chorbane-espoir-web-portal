
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, Trophy, Camera, Mail, Phone, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const Index = () => {
  const [activeSection, setActiveSection] = useState("accueil");

  // Fetch articles
  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch next match
  const { data: nextMatch, isLoading: matchLoading } = useQuery({
    queryKey: ['nextMatch'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          competitions (name, type)
        `)
        .eq('status', 'a_venir')
        .gte('match_date', new Date().toISOString())
        .order('match_date', { ascending: true })
        .limit(1)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });

  // Fetch players
  const { data: players, isLoading: playersLoading } = useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('jersey_number', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch all matches
  const { data: matches, isLoading: matchesLoading } = useQuery({
    queryKey: ['matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          competitions (name, type)
        `)
        .order('match_date', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch galleries
  const { data: galleries, isLoading: galleriesLoading } = useQuery({
    queryKey: ['galleries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('galleries')
        .select(`
          *,
          photos (*)
        `)
        .order('created_at', { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    }
  });

  const navigation = [
    { name: "Accueil", href: "#accueil", id: "accueil" },
    { name: "Équipe", href: "#equipe", id: "equipe" },
    { name: "Matchs", href: "#matchs", id: "matchs" },
    { name: "Actualités", href: "#actualites", id: "actualites" },
    { name: "Galeries", href: "#galeries", id: "galeries" },
    { name: "Contact", href: "#contact", id: "contact" }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Header fixe */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-lg border-b-4 border-green-600 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">ESC</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">Espoir Sportif</h1>
                <p className="text-sm text-green-600">de Chorbane</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-colors duration-200 ${
                    activeSection === item.id 
                      ? 'text-green-600 border-b-2 border-green-600' 
                      : 'text-gray-700 hover:text-green-600'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <Button 
                onClick={() => window.open('/auth', '_blank')}
                variant="outline" 
                className="ml-4"
              >
                Dashboard
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="pt-20">
        {/* Section Accueil */}
        <section id="accueil" className="relative bg-gradient-to-r from-green-800 to-green-600 text-white py-20">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Espoir Sportif de Chorbane
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Fondé en 1975 • Couleurs Vert et Blanc
            </p>
            <p className="text-lg mb-10 max-w-3xl mx-auto">
              Bienvenue sur le site officiel de l'Espoir Sportif de Chorbane. 
              Suivez notre équipe, découvrez nos joueurs et restez informés de toute l'actualité du club.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-green-800 hover:bg-green-50"
                onClick={() => scrollToSection('equipe')}
              >
                Découvrir l'équipe
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-green-800"
                onClick={() => scrollToSection('matchs')}
              >
                Prochains matchs
              </Button>
            </div>
          </div>
        </section>

        {/* Section Prochain Match */}
        {nextMatch && (
          <section className="py-16 bg-green-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Prochain Match</h3>
              <Card className="bg-white shadow-xl border-2 border-green-200">
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                  <div className="text-center">
                    <Badge className="bg-white text-green-800 mb-4">
                      {nextMatch.competitions?.name || 'Match'}
                    </Badge>
                    <CardTitle className="text-2xl md:text-3xl">
                      ESC Chorbane vs {nextMatch.opponent_team}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="flex flex-col items-center">
                      <CalendarDays className="w-8 h-8 text-green-600 mb-2" />
                      <p className="font-semibold text-gray-900">
                        {format(new Date(nextMatch.match_date), 'EEEE dd MMMM yyyy', { locale: fr })}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <Trophy className="w-8 h-8 text-green-600 mb-2" />
                      <p className="font-semibold text-gray-900">
                        {format(new Date(nextMatch.match_date), 'HH:mm')}
                      </p>
                    </div>
                    <div className="flex flex-col items-center">
                      <MapPin className="w-8 h-8 text-green-600 mb-2" />
                      <p className="font-semibold text-gray-900">
                        {nextMatch.venue || (nextMatch.is_home ? 'Domicile' : 'Extérieur')}
                      </p>
                      <Badge variant={nextMatch.is_home ? "default" : "secondary"} className="mt-1">
                        {nextMatch.is_home ? 'Domicile' : 'Extérieur'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* Section Actualités */}
        <section id="actualites" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Dernières Actualités</h3>
            {articlesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {articles?.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-green-600">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Actualité
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <CalendarDays size={16} className="mr-1" />
                          {format(new Date(article.created_at), 'dd MMM yyyy', { locale: fr })}
                        </div>
                      </div>
                      <CardTitle className="text-xl text-gray-900 line-clamp-2">
                        {article.title}
                      </CardTitle>
                      {article.author && (
                        <CardDescription className="text-green-600">
                          Par {article.author}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 line-clamp-3">
                        {article.excerpt || article.content.substring(0, 150) + '...'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section Équipe */}
        <section id="equipe" className="py-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Notre Équipe</h3>
            {playersLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="h-32 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {players?.map((player) => (
                  <Card key={player.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">
                          {player.jersey_number || '?'}
                        </span>
                      </div>
                      <h4 className="font-bold text-lg text-gray-900">{player.name}</h4>
                      <p className="text-green-600">{player.position}</p>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Âge: {player.age || 'N/A'}</p>
                        <p>Nationalité: {player.nationality || 'Tunisie'}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section Matchs */}
        <section id="matchs" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Calendrier des Matchs</h3>
            {matchesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {matches?.map((match) => (
                  <Card key={match.id} className="hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1 mb-4 md:mb-0">
                          <h4 className="text-xl font-bold text-gray-900 mb-2">
                            ESC Chorbane vs {match.opponent_team}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <CalendarDays size={16} className="mr-1" />
                              {format(new Date(match.match_date), 'dd/MM/yyyy', { locale: fr })}
                            </span>
                            <span className="flex items-center">
                              <Trophy size={16} className="mr-1" />
                              {format(new Date(match.match_date), 'HH:mm')}
                            </span>
                            <span className="flex items-center">
                              <MapPin size={16} className="mr-1" />
                              {match.venue || (match.is_home ? 'Domicile' : 'Extérieur')}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={match.is_home ? "default" : "secondary"}>
                            {match.is_home ? 'Domicile' : 'Extérieur'}
                          </Badge>
                          <Badge className={
                            match.status === 'termine' ? 'bg-gray-500' :
                            match.status === 'en_cours' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }>
                            {match.status === 'termine' ? 'Terminé' :
                             match.status === 'en_cours' ? 'En cours' :
                             'À venir'}
                          </Badge>
                          {match.status === 'termine' && (
                            <div className="text-lg font-bold">
                              {match.home_score} - {match.away_score}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section Galeries */}
        <section id="galeries" className="py-16 bg-green-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Galeries Photos</h3>
            {galleriesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {galleries?.map((gallery) => (
                  <Card key={gallery.id} className="hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {gallery.photos && gallery.photos[0] ? (
                        <img 
                          src={gallery.photos[0].url} 
                          alt={gallery.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera size={48} className="text-gray-400" />
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-lg text-gray-900 mb-2">{gallery.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{gallery.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{gallery.photos?.length || 0} photos</span>
                        <span>{format(new Date(gallery.created_at), 'dd/MM/yyyy', { locale: fr })}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Section Contact */}
        <section id="contact" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">Contactez-nous</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h4 className="text-xl font-bold mb-6 text-gray-900">Informations de Contact</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <MapPin className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <p className="font-semibold">Adresse</p>
                      <p className="text-gray-600">Chorbane, Tunisie</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <p className="font-semibold">Téléphone</p>
                      <p className="text-gray-600">+216 XX XXX XXX</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-6 h-6 text-green-600 mr-3" />
                    <div>
                      <p className="font-semibold">Email</p>
                      <p className="text-gray-600">contact@escchorbane.tn</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-xl font-bold mb-6 text-gray-900">Envoyez-nous un message</h4>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input 
                      type="email" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea 
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    ></textarea>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Envoyer le message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">ESC</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Espoir Sportif de Chorbane</h3>
                    <p className="text-gray-300">Fondé en 1975</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  Club de football amateur tunisien basé à Chorbane. 
                  Nous portons fièrement les couleurs vert et blanc depuis près de 50 ans.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Navigation</h4>
                <ul className="space-y-2 text-gray-300">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <button 
                        onClick={() => scrollToSection(item.id)}
                        className="hover:text-green-400 transition-colors"
                      >
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-green-400" />
                    <span className="text-sm">Chorbane, Tunisie</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2 text-green-400" />
                    <span className="text-sm">+216 XX XXX XXX</span>
                  </div>
                  <div className="flex items-center">
                    <Mail size={16} className="mr-2 text-green-400" />
                    <span className="text-sm">contact@escchorbane.tn</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Espoir Sportif de Chorbane. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
