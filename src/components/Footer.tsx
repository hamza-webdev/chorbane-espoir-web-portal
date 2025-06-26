
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
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
            <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/equipe" className="hover:text-green-400 transition-colors">Équipe</a></li>
              <li><a href="/matchs" className="hover:text-green-400 transition-colors">Matchs</a></li>
              <li><a href="/actualites" className="hover:text-green-400 transition-colors">Actualités</a></li>
              <li><a href="/galeries" className="hover:text-green-400 transition-colors">Galeries</a></li>
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
            
            <div className="flex space-x-4 mt-4">
              <Facebook size={20} className="text-gray-300 hover:text-green-400 cursor-pointer transition-colors" />
              <Instagram size={20} className="text-gray-300 hover:text-green-400 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Espoir Sportif de Chorbane. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
