import { Link } from 'react-router';

export default function PrivacyHome() {
  return (
    <main className="bg-base-200 p-4 flex flex-col items-center">
      <div className="max-w-xl">
        <h1 className="text-info">Données personnelles</h1>
        <section className="p-2">
          <h3 className="mb-3">Traitement des données</h3>
          <p>
            Le présent site ne comprend aucun élément de collecte de données personnelles.
            Les formulaires présents sur ce site n&rsquo;envoient aucune information à un serveur.
          </p>
        </section>
        <section className="p-2">
          <h3 className="mb-3">Gestion des cookies</h3>
          <p>
            Ce site n&rsquo;utilise aucun cookie.
          </p>
        </section>
        <aside className="p-2">
          <Link to="/" className="link link-info">Retour à l&rsquo;accueil</Link>
        </aside>
      </div>
    </main>
  );
}
