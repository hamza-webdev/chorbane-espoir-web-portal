import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Shirt, Save, Plus, User, AlertCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for fallback
const mockPlayers = [
  { id: '1', name: 'Gardien', jersey_number: 1, position: 'gardien', photo: null, age: 25, height: 185, weight: 80, bio: null },
  { id: '2', name: 'Défenseur 1', jersey_number: 2, position: 'defenseur', photo: null, age: 24, height: 180, weight: 75, bio: null },
  { id: '3', name: 'Défenseur 2', jersey_number: 3, position: 'defenseur', photo: null, age: 26, height: 182, weight: 78, bio: null },
  { id: '4', name: 'Défenseur 3', jersey_number: 4, position: 'defenseur', photo: null, age: 23, height: 178, weight: 73, bio: null },
  { id: '5', name: 'Défenseur 4', jersey_number: 5, position: 'defenseur', photo: null, age: 27, height: 184, weight: 79, bio: null },
  { id: '6', name: 'Milieu 1', jersey_number: 6, position: 'milieu', photo: null, age: 25, height: 175, weight: 70, bio: null },
  { id: '7', name: 'Milieu 2', jersey_number: 7, position: 'milieu', photo: null, age: 24, height: 177, weight: 72, bio: null },
  { id: '8', name: 'Milieu 3', jersey_number: 8, position: 'milieu', photo: null, age: 26, height: 176, weight: 71, bio: null },
  { id: '9', name: 'Attaquant 1', jersey_number: 9, position: 'attaquant', photo: null, age: 23, height: 180, weight: 75, bio: null },
  { id: '10', name: 'Attaquant 2', jersey_number: 10, position: 'attaquant', photo: null, age: 25, height: 178, weight: 74, bio: null },
  { id: '11', name: 'Attaquant 3', jersey_number: 11, position: 'attaquant', photo: null, age: 24, height: 179, weight: 76, bio: null },
];

const mockStaff = [
  { id: '1', name: 'Entraîneur Principal', role: 'entraineur', photo: null, bio: null },
  { id: '2', name: 'Président', role: 'manager', photo: null, bio: null },
];

interface Player {
  id: string;
  name: string;
  jersey_number: number | null;
  position: string;
  photo: string | null;
  age: number | null;
  height: number | null;
  weight: number | null;
  bio: string | null;
}

interface Staff {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  bio: string | null;
}

interface Formation {
  name: string;
  positions: {
    [key: string]: { x: number; y: number }[];
  };
}

interface SavedComposition {
  id: string;
  title: string;
  formation: string;
  player_positions: any;
  created_at: string;
}

interface PlayerPosition {
  playerId: string;
  x: number;
  y: number;
}

const formations: Formation[] = [
  {
    name: "4-3-3",
    positions: {
      gardien: [{ x: 50, y: 90 }],
      defenseur: [
        { x: 20, y: 75 },
        { x: 40, y: 75 },
        { x: 60, y: 75 },
        { x: 80, y: 75 }
      ],
      milieu: [
        { x: 30, y: 50 },
        { x: 50, y: 50 },
        { x: 70, y: 50 }
      ],
      attaquant: [
        { x: 25, y: 25 },
        { x: 50, y: 25 },
        { x: 75, y: 25 }
      ]
    }
  },
  {
    name: "4-4-2",
    positions: {
      gardien: [{ x: 50, y: 90 }],
      defenseur: [
        { x: 20, y: 75 },
        { x: 40, y: 75 },
        { x: 60, y: 75 },
        { x: 80, y: 75 }
      ],
      milieu: [
        { x: 20, y: 50 },
        { x: 40, y: 50 },
        { x: 60, y: 50 },
        { x: 80, y: 50 }
      ],
      attaquant: [
        { x: 40, y: 25 },
        { x: 60, y: 25 }
      ]
    }
  },
  {
    name: "3-5-2",
    positions: {
      gardien: [{ x: 50, y: 90 }],
      defenseur: [
        { x: 30, y: 75 },
        { x: 50, y: 75 },
        { x: 70, y: 75 }
      ],
      milieu: [
        { x: 15, y: 50 },
        { x: 35, y: 50 },
        { x: 50, y: 50 },
        { x: 65, y: 50 },
        { x: 85, y: 50 }
      ],
      attaquant: [
        { x: 40, y: 25 },
        { x: 60, y: 25 }
      ]
    }
  }
];

const TeamComposition = () => {
  const [selectedFormation, setSelectedFormation] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [animateIn, setAnimateIn] = useState(false);
  const [compositionTitle, setCompositionTitle] = useState("");
  const [playerPositions, setPlayerPositions] = useState<PlayerPosition[]>([]);
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loadedComposition, setLoadedComposition] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Enhanced queries with better error handling and fallback
  const { data: playersData, isLoading: playersLoading, error: playersError, refetch: refetchPlayers } = useQuery({
    queryKey: ['players-composition'],
    queryFn: async () => {
      console.log('Attempting to fetch players...');
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('active', true)
        .order('jersey_number', { ascending: true });
      
      if (error) {
        console.error('Supabase players error:', error);
        throw error;
      }
      console.log('Players fetched successfully:', data?.length || 0);
      return data as Player[];
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    onError: (error) => {
      console.error('Players query failed, switching to mock data:', error);
      setUseMockData(true);
    }
  });

  const { data: staffData, isLoading: staffLoading, error: staffError, refetch: refetchStaff } = useQuery({
    queryKey: ['staff-composition'],
    queryFn: async () => {
      console.log('Attempting to fetch staff...');
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('active', true)
        .in('role', ['entraineur', 'manager'])
        .order('role', { ascending: true });
      
      if (error) {
        console.error('Supabase staff error:', error);
        throw error;
      }
      console.log('Staff fetched successfully:', data?.length || 0);
      return data as Staff[];
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 5 * 60 * 1000,
    onError: (error) => {
      console.error('Staff query failed, switching to mock data:', error);
      setUseMockData(true);
    }
  });

  const { data: savedCompositions, refetch: refetchCompositions } = useQuery({
    queryKey: ['saved-compositions'],
    queryFn: async () => {
      console.log('Attempting to fetch saved compositions...');
      const { data, error } = await supabase
        .from('team_compositions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Compositions error:', error);
        throw error;
      }
      console.log('Compositions fetched successfully:', data?.length || 0);
      return data as SavedComposition[];
    },
    retry: 1,
    enabled: !useMockData
  });

  // Use mock data if there are connection issues
  const players = useMockData ? mockPlayers : playersData;
  const staff = useMockData ? mockStaff : staffData;
  const isLoading = useMockData ? false : (playersLoading || staffLoading);
  const hasError = !useMockData && (playersError || staffError);

  const saveCompositionMutation = useMutation({
    mutationFn: async (compositionData: {
      title: string;
      formation: string;
      player_positions: PlayerPosition[];
    }) => {
      if (useMockData) {
        throw new Error("Sauvegarde indisponible en mode démonstration");
      }
      const { data, error } = await supabase
        .from('team_compositions')
        .insert({
          title: compositionData.title,
          formation: compositionData.formation,
          player_positions: compositionData.player_positions as any
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Composition sauvegardée",
        description: "La composition d'équipe a été sauvegardée avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ['saved-compositions'] });
    },
    onError: (error: any) => {
      console.error('Save composition error:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de sauvegarder la composition.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    setAnimateIn(false);
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, [selectedFormation]);

  const handleRetry = () => {
    setUseMockData(false);
    refetchPlayers();
    refetchStaff();
    refetchCompositions();
  };

  const handleUseMockData = () => {
    setUseMockData(true);
    toast({
      title: "Mode démonstration",
      description: "Utilisation des données de démonstration.",
    });
  };

  const handleDragStart = (e: React.DragEvent, player: Player) => {
    setDraggedPlayer(player);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
    const dragImage = document.createElement('div');
    dragImage.innerHTML = '⚽';
    dragImage.style.fontSize = '24px';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-1000px';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 12, 12);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragEnd = () => {
    setDraggedPlayer(null);
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedPlayer) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const clampedX = Math.max(10, Math.min(90, x));
    const clampedY = Math.max(10, Math.min(90, y));

    setPlayerPositions(prev => {
      const existing = prev.find(p => p.playerId === draggedPlayer.id);
      if (existing) {
        return prev.map(p => 
          p.playerId === draggedPlayer.id 
            ? { ...p, x: clampedX, y: clampedY }
            : p
        );
      } else {
        return [...prev, { playerId: draggedPlayer.id, x: clampedX, y: clampedY }];
      }
    });

    setDraggedPlayer(null);
    setIsDragging(false);
  };

  const getPlayersByPosition = (position: string): Player[] => {
    if (!players) return [];
    return players.filter(player => player.position === position);
  };

  const assignPlayersToPositions = () => {
    const formation = formations[selectedFormation];
    const assignedPlayers: { player: Player; position: { x: number; y: number } }[] = [];

    Object.entries(formation.positions).forEach(([position, positions]) => {
      const positionPlayers = getPlayersByPosition(position);
      positions.forEach((pos, index) => {
        if (positionPlayers[index]) {
          const customPosition = playerPositions.find(p => p.playerId === positionPlayers[index].id);
          assignedPlayers.push({
            player: positionPlayers[index],
            position: customPosition ? { x: customPosition.x, y: customPosition.y } : pos
          });
        }
      });
    });

    return assignedPlayers;
  };

  const getPositionLabel = (position: string) => {
    const positions = {
      'gardien': 'Gardien',
      'defenseur': 'Défenseur',
      'milieu': 'Milieu',
      'attaquant': 'Attaquant'
    };
    return positions[position] || position;
  };

  const getRoleLabel = (role: string) => {
    const roles = {
      'entraineur': 'Entraîneur',
      'manager': 'Président'
    };
    return roles[role] || role;
  };

  const handleSaveComposition = () => {
    if (!compositionTitle.trim()) {
      toast({
        title: "Titre requis",
        description: "Veuillez saisir un titre pour la composition.",
        variant: "destructive",
      });
      return;
    }

    saveCompositionMutation.mutate({
      title: compositionTitle,
      formation: formations[selectedFormation].name,
      player_positions: playerPositions
    });
  };

  const loadComposition = (composition: SavedComposition) => {
    setCompositionTitle(composition.title);
    const formationIndex = formations.findIndex(f => f.name === composition.formation);
    if (formationIndex !== -1) {
      setSelectedFormation(formationIndex);
    }
    setPlayerPositions(composition.player_positions || []);
    setLoadedComposition(composition.id);
    
    toast({
      title: "Composition chargée",
      description: `La composition "${composition.title}" a été chargée.`,
    });
  };

  const resetComposition = () => {
    setCompositionTitle("");
    setPlayerPositions([]);
    setLoadedComposition(null);
  };

  // Enhanced error handling with retry options
  if (hasError && !useMockData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-red-600 mb-2">Problème de connexion</h3>
          <p className="text-gray-600 mb-4">
            Impossible de charger les données depuis la base de données.
          </p>
          <div className="space-y-2">
            <Button onClick={handleRetry} className="mr-2">
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </Button>
            <Button onClick={handleUseMockData} variant="outline">
              Mode démonstration
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Users className="mx-auto h-12 w-12 text-gray-400 animate-pulse mb-4" />
          <p className="text-gray-600">Chargement de la composition...</p>
        </div>
      </div>
    );
  }

  if (!players || !staff) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <p className="text-gray-600 mb-4">Aucune donnée disponible</p>
          <Button onClick={handleUseMockData}>
            Utiliser les données de démonstration
          </Button>
        </div>
      </div>
    );
  }

  const assignedPlayers = assignPlayersToPositions();
  const allAssignedPlayerIds = assignedPlayers.map(ap => ap.player.id);
  const availablePlayers = players.filter(player => !allAssignedPlayerIds.includes(player.id));

  return (
    <div className="space-y-6">
      {/* Mock data indicator */}
      {useMockData && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Mode démonstration activé</span>
              <Button onClick={handleRetry} size="sm" variant="outline" className="ml-auto">
                <RefreshCw className="h-4 w-4 mr-1" />
                Reconnecter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Composition management */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <Label htmlFor="composition-title">Titre de la composition</Label>
              <Input
                id="composition-title"
                value={compositionTitle}
                onChange={(e) => setCompositionTitle(e.target.value)}
                placeholder="Ex: Formation titulaire"
                className="mt-1"
              />
            </div>
            {!useMockData && (
              <div>
                <Label>Compositions sauvegardées</Label>
                <Select onValueChange={(value) => {
                  const composition = savedCompositions?.find(c => c.id === value);
                  if (composition) loadComposition(composition);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Charger une composition" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedCompositions?.map((composition) => (
                      <SelectItem key={composition.id} value={composition.id}>
                        {composition.title} ({composition.formation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex gap-2">
              <Button
                onClick={handleSaveComposition}
                disabled={saveCompositionMutation.isPending || useMockData}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
              <Button onClick={resetComposition} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formation selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {formations.map((formation, index) => (
          <Button
            key={formation.name}
            variant={selectedFormation === index ? "default" : "outline"}
            onClick={() => setSelectedFormation(index)}
            className={selectedFormation === index ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {formation.name}
          </Button>
        ))}
      </div>

      {/* Football stadium with staff beside it */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Staff members (left side) */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3 text-center">Banc de touche</h3>
              <div className="space-y-3">
                {staff.map((member) => (
                  <div
                    key={member.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, member as any)}
                    onDragEnd={handleDragEnd}
                    className="flex flex-col items-center p-2 border rounded-lg cursor-move hover:cursor-grab active:cursor-grabbing hover:bg-gray-50 transition-colors bg-blue-50 border-blue-200"
                  >
                    <Avatar className="h-10 w-10 mb-2">
                      <AvatarImage src={member.photo || undefined} alt={member.name} />
                      <AvatarFallback className="bg-blue-700 text-white">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-xs font-medium truncate w-full">{member.name}</p>
                      <Badge variant="outline" className="text-xs mt-1 bg-blue-100">
                        {getRoleLabel(member.role)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Football stadium with realistic view from above */}
        <Card className="lg:col-span-8 order-1 lg:order-2 mx-auto max-w-2xl shadow-2xl overflow-hidden">
          <CardContent className="p-2 sm:p-3">
            <div 
              className={`relative rounded-lg overflow-hidden ${isDragging ? 'ring-2 ring-blue-400' : ''}`}
              style={{ 
                aspectRatio: '1.5/1.8', 
                cursor: isDragging ? 'grabbing' : 'default'
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {/* Stadium structure with CSS gradients */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-lg">
                {/* Stadium stands */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-600 via-gray-500 to-gray-700 rounded-lg"></div>
                
                {/* Inner stadium border */}
                <div className="absolute inset-4 bg-gradient-to-br from-green-800 via-green-700 to-green-900 rounded-lg border-4 border-gray-600 shadow-inner">
                  
                  {/* Football field */}
                  <div className="absolute inset-2 bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-lg shadow-2xl">
                    
                    {/* Field pattern for realistic grass texture */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="h-full w-full bg-gradient-to-r from-green-600 to-green-500 bg-[length:20px_20px] opacity-30"></div>
                      <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(0,0,0,0.1)_50%,transparent_51%)] bg-[length:40px_40px]"></div>
                    </div>
                    
                    {/* Stadium lights effect */}
                    <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/10 rounded-lg"></div>
                    
                    {/* Field markings */}
                    <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 200 300">
                      {/* Outer lines */}
                      <rect x="10" y="10" width="180" height="280" fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
                      
                      {/* Center circle */}
                      <circle cx="100" cy="150" r="30" fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
                      <circle cx="100" cy="150" r="2" fill="white" opacity="0.9"/>
                      
                      {/* Center line */}
                      <line x1="10" y1="150" x2="190" y2="150" stroke="white" strokeWidth="2" opacity="0.9"/>
                      
                      {/* Goal areas */}
                      <rect x="70" y="10" width="60" height="18" fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
                      <rect x="70" y="272" width="60" height="18" fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
                      
                      {/* Penalty areas */}
                      <rect x="50" y="10" width="100" height="44" fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
                      <rect x="50" y="246" width="100" height="44" fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
                      
                      {/* Penalty spots */}
                      <circle cx="100" cy="32" r="2" fill="white" opacity="0.9"/>
                      <circle cx="100" cy="268" r="2" fill="white" opacity="0.9"/>
                      
                      {/* Goals */}
                      <rect x="85" y="5" width="30" height="5" fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
                      <rect x="85" y="290" width="30" height="5" fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
                      
                      {/* Corner arcs */}
                      <path d="M 10 10 Q 20 10 20 20" fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
                      <path d="M 190 10 Q 180 10 180 20" fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
                      <path d="M 10 290 Q 20 290 20 280" fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
                      <path d="M 190 290 Q 180 290 180 280" fill="none" stroke="white" strokeWidth="2" opacity="0.9"/>
                    </svg>

                    {/* Drop zone indicator */}
                    {isDragging && (
                      <div className="absolute inset-0 bg-blue-400/20 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center z-20">
                        <div className="text-white bg-blue-600 px-4 py-2 rounded-lg font-medium shadow-lg">
                          Déposez le joueur ici
                        </div>
                      </div>
                    )}

                    {/* Players */}
                    {assignedPlayers.map(({ player, position }, index) => {
                      const isCustomPositioned = playerPositions.some(p => p.playerId === player.id);
                      return (
                        <div
                          key={player.id}
                          className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-all duration-500 z-30 ${
                            animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                          } ${isCustomPositioned ? 'ring-2 ring-yellow-400 ring-opacity-80' : ''}`}
                          style={{
                            left: `${position.x}%`,
                            top: `${position.y}%`,
                            animationDelay: `${index * 100}ms`
                          }}
                          onClick={() => setSelectedPlayer(player)}
                          draggable
                          onDragStart={(e) => handleDragStart(e, player)}
                          onDragEnd={handleDragEnd}
                        >
                          <div className="flex flex-col items-center group hover:scale-110 transition-transform duration-200">
                            <div className="relative">
                              <Avatar className="h-6 w-6 sm:h-8 sm:w-8 border-2 border-white shadow-lg bg-white">
                                <AvatarImage src={player.photo || undefined} alt={player.name} />
                                <AvatarFallback className="bg-green-700 text-white text-xs">
                                  <Shirt className="h-3 w-3 sm:h-4 sm:w-4" />
                                </AvatarFallback>
                              </Avatar>
                              {player.jersey_number && (
                                <Badge className="absolute -bottom-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center p-0 border border-white">
                                  {player.jersey_number}
                                </Badge>
                              )}
                            </div>
                            <div className="mt-1 text-center">
                              <p className="text-white text-xs font-medium shadow-lg bg-black/60 px-2 py-1 rounded backdrop-blur-sm">
                                {player.name.split(' ').slice(-1)[0]}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Substitutes (right side) */}
        <div className="lg:col-span-2 order-3">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3 text-center">Remplaçants</h3>
              <div className="space-y-3">
                {availablePlayers.slice(0, 7).map((player) => (
                  <div
                    key={player.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, player)}
                    onDragEnd={handleDragEnd}
                    className="flex flex-col items-center p-2 border rounded-lg cursor-move hover:cursor-grab active:cursor-grabbing hover:bg-gray-50 transition-colors bg-orange-50 border-orange-200"
                  >
                    <Avatar className="h-10 w-10 mb-2">
                      <AvatarImage src={player.photo || undefined} alt={player.name} />
                      <AvatarFallback className="bg-orange-700 text-white">
                        <Shirt className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="text-xs font-medium truncate w-full">{player.name}</p>
                      <Badge variant="outline" className="text-xs mt-1 bg-orange-100">
                        #{player.jersey_number || 'N/A'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Available players - Moved below the field */}
      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Joueurs disponibles</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {availablePlayers.map((player) => (
              <div
                key={player.id}
                draggable
                onDragStart={(e) => handleDragStart(e, player)}
                onDragEnd={handleDragEnd}
                className="flex flex-col items-center p-2 border rounded-lg cursor-move hover:cursor-grab active:cursor-grabbing hover:bg-gray-50 transition-colors"
                style={{ cursor: isDragging && draggedPlayer?.id === player.id ? 'grabbing' : 'grab' }}
              >
                <Avatar className="h-12 w-12 mb-2">
                  <AvatarImage src={player.photo || undefined} alt={player.name} />
                  <AvatarFallback className="bg-green-700 text-white">
                    <Shirt className="h-6 w-6" />
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="text-xs font-medium truncate w-full">{player.name}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    #{player.jersey_number || 'N/A'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Formation info */}
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
          Formation {formations[selectedFormation].name}
          {loadedComposition && (
            <Badge className="ml-2 bg-blue-600">
              Composition chargée
            </Badge>
          )}
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          {assignedPlayers.length} joueur(s) sur le terrain
        </p>
        {playerPositions.length > 0 && (
          <p className="text-sm text-blue-600 mt-1">
            {playerPositions.length} position(s) personnalisée(s)
          </p>
        )}
      </div>

      {/* Player details modal */}
      <Dialog open={!!selectedPlayer} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedPlayer?.photo || undefined} alt={selectedPlayer?.name} />
                <AvatarFallback>
                  <Users className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold">{selectedPlayer?.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-600">
                    {selectedPlayer?.jersey_number ? `#${selectedPlayer.jersey_number}` : 'N/A'}
                  </Badge>
                  <Badge variant="outline">
                    {selectedPlayer && getPositionLabel(selectedPlayer.position)}
                  </Badge>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              {selectedPlayer?.age && (
                <div>
                  <p className="text-sm text-gray-600">Âge</p>
                  <p className="font-semibold">{selectedPlayer.age} ans</p>
                </div>
              )}
              {selectedPlayer?.height && (
                <div>
                  <p className="text-sm text-gray-600">Taille</p>
                  <p className="font-semibold">{selectedPlayer.height} cm</p>
                </div>
              )}
              {selectedPlayer?.weight && (
                <div>
                  <p className="text-sm text-gray-600">Poids</p>
                  <p className="font-semibold">{selectedPlayer.weight} kg</p>
                </div>
              )}
            </div>
            {selectedPlayer?.bio && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Biographie</p>
                <p className="text-sm leading-relaxed">{selectedPlayer.bio}</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamComposition;
