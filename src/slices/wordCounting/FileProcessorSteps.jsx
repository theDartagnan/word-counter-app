import classNames from 'classnames';
import PropTypes from 'prop-types';

export default function FileProcessorSteps({ steps, currentPercent = 0,
  hideProgress = false, className }) {
  return (
    <>
      <h3>Traitement</h3>
      <ul className={classNames(className, 'list rounded-box shadow-md')}>
        {!hideProgress && (
          <li className="pb-2 tracking-wide">
            <progress
              className="progress progress-primary"
              min="0"
              max="100"
              value={Math.round(currentPercent) || 0}
            >
            </progress>
          </li>
        )}
        {steps.map(({ key, step, done }) => (
          <li key={key} className={classNames('list-row', { 'opacity-25': !done })}>{step}</li>
        ))}
      </ul>
    </>
  );
}

FileProcessorSteps.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.node.isRequired,
    step: PropTypes.node.isRequired,
    done: PropTypes.bool,
  })).isRequired,
  currentPercent: PropTypes.number,
  hideProgress: PropTypes.bool,
  className: PropTypes.string,
};
