
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TeamComposition from "@/components/TeamComposition";

const TeamCompositionPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Composition d'Équipe - Espoir Sportif de Chorbane</title>
        <meta name="description" content="Découvrez la composition tactique de notre équipe avec les formations et positions des joueurs sur le terrain." />
      </Helmet>
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="pt-8 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Composition d'Équipe
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Découvrez notre composition tactique et les formations utilisées par l'équipe. 
                Cliquez sur un joueur pour voir ses informations détaillées.
              </p>
            </div>

            {/* Team Composition Component */}
            <TeamComposition />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default TeamCompositionPage;
