import PropTypes from 'prop-types';
import FileProcessorError from './FileProcessorError';
import FileProcessorResults from './FileProcessorResults';
import FileProcessorSteps from './FileProcessorSteps';
import { useSyncExternalStore } from 'react';
import TextProcessController from './services/TextProcessController';
import classNames from 'classnames';

export default function FileProcessor({ textProcessController, className }) {
  const stats = useSyncExternalStore(lst => textProcessController.subscribe(lst), () => textProcessController.stats);

  if (!stats) {
    return null;
  }

  return (
    <>
      {!!stats.processingError && (
        <FileProcessorError error={stats.processingError} className={classNames(className, 'mb-4')} />
      )}
      <FileProcessorSteps
        steps={[
          { key: 'open', step: 'Ouverture du fichier PDF...', done: true },
          { key: 'page', step: `Page traitée : ${stats.currentProcessingPage} / ${stats.numPages}...`, done: stats.currentProcessingPage > 0 },
          { key: 'finish', step: 'Fichier traité avec succès !', done: stats.fileProcessed },
        ]}
        currentPercent={stats.numPages > 0 ? (100 * stats.currentProcessingPage) / stats.numPages : 0}
        complete={stats.fileProcessed}
        className={className}
      />
      {!stats.processingError && (
        <FileProcessorResults
          className="mt-4 wrap-break-word"
          title={`Nombre de mots dans ${textProcessController.file?.name ? textProcessController.file.name : '<fichier inconnu>'}`}
          value={stats.alphaNumWordCount.toLocaleString()}
          referencesFound={stats.referencesFound}
          extraInfos={APP_ENV_COUNT_DETAILS
            ? [
                { key: 'V1', value: `Nb. mots : ${stats.alphaNumWordCount.toLocaleString()}` },
                { key: 'V2', value: `Nb. mots bruts : ${stats.rawWordCount.toLocaleString()}` },
                { key: 'V3', value: `Nb. mots ref. incluses : ${stats.totalAlphaNumWordCount.toLocaleString()}` },
                { key: 'V4', value: `Nb. mots bruts ref. incluses : ${stats.totalRawWordCount.toLocaleString()}` },
              ]
            : []}
          complete={stats.fileProcessed}
        />
      )}
    </>
  );
}

FileProcessor.propTypes = {
  textProcessController: PropTypes.instanceOf(TextProcessController),
  className: PropTypes.string,
};
