import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function AppPresentation({ className }) {
  return (
    <div className={classNames(className, 'text-center lg:text-left')}>
      <h1>Compteur de mots de fichiers PDF</h1>
      <p className="py-6">
        Ce compteur de mots de fichiers PDF proposé par l&rsquo;ATIEF offre aux auteurs ou relecteurs d&rsquo;articles un moyen standard et reproductible de compter les mots de fichiers PDF. Il est proposé dans le cadre des processus de relectures des conférences EIAH et RJC-EIAH pour s&rsquo;accorder sur le respect de la limite de mots d&rsquo;une soumission.
      </p>
      <p className="py-2">
        Cette application web est entièrement autonome et ne nécessite aucun traitement déporté. Les fichiers PDF ne sont jamais transmis à l&rsquo;extérieur de votre machine. Le décodage du format PDF et le comptage des mots est réalisé entièrement au sein de votre navigateur.
      </p>
    </div>
  );
}

AppPresentation.propTypes = {
  className: PropTypes.string,
};
