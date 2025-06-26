
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-green-800 to-green-600 text-white py-20">
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
          <Button size="lg" className="bg-white text-green-800 hover:bg-green-50">
            Découvrir l'équipe
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-800">
            Prochains matchs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
