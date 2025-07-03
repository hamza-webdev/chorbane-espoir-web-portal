
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Users, Shirt } from "lucide-react";

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

interface Formation {
  name: string;
  positions: {
    [key: string]: { x: number; y: number }[];
  };
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

  const { data: players, isLoading } = useQuery({
    queryKey: ['players-composition'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .eq('active', true)
        .order('jersey_number', { ascending: true });
      
      if (error) throw error;
      return data as Player[];
    }
  });

  useEffect(() => {
    setAnimateIn(false);
    const timer = setTimeout(() => setAnimateIn(true), 100);
    return () => clearTimeout(timer);
  }, [selectedFormation]);

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
          assignedPlayers.push({
            player: positionPlayers[index],
            position: pos
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

  const assignedPlayers = assignPlayersToPositions();

  return (
    <div className="space-y-6">
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

      {/* Football field */}
      <Card className="mx-auto max-w-4xl bg-green-600 shadow-2xl">
        <CardContent className="p-4 sm:p-6">
          <div className="relative bg-green-500 rounded-lg overflow-hidden" style={{ aspectRatio: '2/3' }}>
            {/* Field markings */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 300">
              {/* Outer lines */}
              <rect x="10" y="10" width="180" height="280" fill="none" stroke="white" strokeWidth="2"/>
              
              {/* Center circle */}
              <circle cx="100" cy="150" r="30" fill="none" stroke="white" strokeWidth="2"/>
              <circle cx="100" cy="150" r="2" fill="white"/>
              
              {/* Center line */}
              <line x1="10" y1="150" x2="190" y2="150" stroke="white" strokeWidth="2"/>
              
              {/* Goal areas */}
              <rect x="70" y="10" width="60" height="18" fill="none" stroke="white" strokeWidth="2"/>
              <rect x="70" y="272" width="60" height="18" fill="none" stroke="white" strokeWidth="2"/>
              
              {/* Penalty areas */}
              <rect x="50" y="10" width="100" height="44" fill="none" stroke="white" strokeWidth="2"/>
              <rect x="50" y="246" width="100" height="44" fill="none" stroke="white" strokeWidth="2"/>
              
              {/* Penalty spots */}
              <circle cx="100" cy="32" r="2" fill="white"/>
              <circle cx="100" cy="268" r="2" fill="white"/>
              
              {/* Goals */}
              <rect x="85" y="5" width="30" height="5" fill="none" stroke="white" strokeWidth="2"/>
              <rect x="85" y="290" width="30" height="5" fill="none" stroke="white" strokeWidth="2"/>
            </svg>

            {/* Players */}
            {assignedPlayers.map(({ player, position }, index) => (
              <div
                key={player.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ${
                  animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  animationDelay: `${index * 100}ms`
                }}
                onClick={() => setSelectedPlayer(player)}
              >
                <div className="flex flex-col items-center group hover:scale-110 transition-transform duration-200">
                  <div className="relative">
                    <Avatar className="h-8 w-8 sm:h-12 sm:w-12 border-2 border-white shadow-lg bg-white">
                      <AvatarImage src={player.photo || undefined} alt={player.name} />
                      <AvatarFallback className="bg-green-700 text-white text-xs sm:text-sm">
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
                    <p className="text-white text-xs sm:text-sm font-medium shadow-lg bg-black/30 px-1 rounded backdrop-blur-sm">
                      {player.name.split(' ').slice(-1)[0]}
                    </p>
                  </div>
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
        </h3>
        <p className="text-sm sm:text-base text-gray-600">
          {assignedPlayers.length} joueur(s) sur le terrain
        </p>
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
