import { Link } from 'react-router';

export default function LegalNoticesHome() {
  return (
    <main className="bg-base-200 p-4 flex flex-col items-center">
      <div className="max-w-xl">
        <h1 className="text-info">Mentions Légales</h1>
        <section className="p-2">
          <h3 className="mb-3">Directrice de la publication</h3>
          <p>
            Mme. Marie Lefevre, présidente de l&rsquo;ATIEF
          </p>
        </section>
        <section className="p-2">
          <h3 className="mb-3">Hébergement</h3>
          <p>Ce site est hébergé par l&rsquo;ATIEF</p>
          <a className="link link-info" href="mailto:webmaster@atief.fr">webmaster@atief.fr</a>
        </section>
        <section className="p-2">
          <h3 className="mb-3">Objectifs des contenus</h3>
          <p>
            Ce site a pour objectif de fournir au grand public un système reproductible de comptage
            des mots d&rsquo;un document PDF, dont l&rsquo;intérêt est de faciliter le processus de soumission
            et de relecture de soumissions d&rsquo;articles de recherche.
          </p>
        </section>
        <section className="p-2">
          <h3 className="mb-3">Droits d&rsquo;auteur et copyright</h3>
          <p>
            Ce site est la propriété de L&rsquo;ATIEF et relève de la législation française et internationale sur le droit d’auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés. La reproduction de tout ou partie de ce site sur un support électronique quel qu&rsquo;il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
          </p>
        </section>
        <section className="p-2">
          <h3 className="mb-3">Conception et réalisation</h3>
          <p>
            <strong>Réalisation, contenus et conception</strong>
            : Rémi Venant
          </p>
        </section>
        <aside className="p-2">
          <Link to="/" className="link link-info">Retour à l&rsquo;accueil</Link>
        </aside>
      </div>
    </main>
  );
}
