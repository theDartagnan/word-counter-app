import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';

export default function FileProcessorResults({ titles, values, referencesFound = false,
  referencesPageNumber = 0, referencesText = null, extraInfos = [],
  complete = true, className }) {
  const resRef = useRef();

  useEffect(() => {
    // On first display, auto-scroll to bottom of the component
    // (noticeable on small screen)
    if (resRef.current) {
      resRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [resRef]);

  const minTitleValues = Math.min(titles.length, values.length);
  const titleValues = titles.slice(0, minTitleValues).map((title, idx) => [title, values[idx]]);

  return (
    <>
      <h3 className={classNames(className)}>
        {!complete && (<span className="loading loading-ring loading-xs me-1"></span>)}
        Résultats
      </h3>
      <div
        ref={resRef}
        className={classNames('stats overflow-x-hidden rounded-box shadow-md', { 'text-primary': complete, 'text-secondary opacity-50': !complete })}
      >
        <div className="stat">
          {titleValues.map(([title, value]) => (
            <>
              <div className="stat-title">{title}</div>
              <div className="stat-value">{value}</div>
            </>
          ))}
          {!!referencesFound && (
            <div className="stat-desc">
              Références trouvées page
              {' '}
              {referencesPageNumber}
              , exclues du compte.
            </div>
          )}
          {!!referencesFound && !!referencesText && (
            <div className="stat-desc">
              Texte marqueur de référence : &laquo;
              {referencesText}
              &raquo;
            </div>
          )}
          {!!extraInfos && extraInfos.map(({ key, value: infoValue }) => (
            <div key={key} className="stat-desc">{infoValue}</div>
          ))}
        </div>
      </div>
    </>
  );
}

FileProcessorResults.propTypes = {
  titles: PropTypes.arrayOf(PropTypes.string).isRequired,
  values: PropTypes.arrayOf(PropTypes.node).isRequired,
  referencesFound: PropTypes.bool,
  referencesText: PropTypes.string,
  referencesPageNumber: PropTypes.number,
  extraInfos: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.node.isRequired,
    value: PropTypes.node.isRequired,
  })),
  complete: PropTypes.bool,
  className: PropTypes.string,
  ref: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};
