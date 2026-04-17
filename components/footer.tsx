export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">keycevente</h3>
            <p className="text-sm leading-relaxed">
              Votre boutique en ligne spécialisée dans les claviers mécaniques, keycaps et accessoires premium.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-white font-bold mb-4">Produits</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/catalog" className="hover:text-cyan-400 transition">Tous les produits</a></li>
              <li><a href="/catalog?categoryId=1" className="hover:text-cyan-400 transition">Claviers</a></li>
              <li><a href="/catalog?categoryId=2" className="hover:text-cyan-400 transition">Keycaps</a></li>
              <li><a href="/catalog?categoryId=3" className="hover:text-cyan-400 transition">Switches</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition">Contact</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Livraison</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Retours</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition">Mentions légales</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Confidentialité</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">CGU</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <p className="text-center text-sm">
            © {currentYear} keycevente. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
