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
          { key: 'referencesFound', step: stats.referencesFound
            ? `Marqueur de références trouvé page ${stats.referencesPageNumber} !`
            : 'Aucun marqueur de références trouvé.',
          done: stats.referencesFound },
          { key: 'finish', step: 'Fichier traité avec succès !', done: stats.fileProcessed },
        ]}
        currentPercent={stats.numPages > 0 ? (100 * stats.currentProcessingPage) / stats.numPages : 0}
        complete={stats.fileProcessed}
        className={className}
      />
      {!stats.processingError && (
        <FileProcessorResults
          className="mt-4 wrap-break-word"
          titles={[
            `Nombre de mots dans ${textProcessController.file?.name ? textProcessController.file.name : '<fichier inconnu>'}`,
            'Nombre de glyphes',
          ]}
          values={[
            stats.alphaNumWordCount.toLocaleString(),
            stats.glyphCount.toLocaleString()]}
          referencesFound={stats.referencesFound}
          referencesText={stats.referencesText}
          referencesPageNumber={stats.referencesPageNumber}
          extraInfos={APP_ENV_COUNT_DETAILS
            ? [
                { key: 'V1', value: `Nb. mots : ${stats.alphaNumWordCount.toLocaleString()}` },
                { key: 'V2', value: `Nb. mots bruts : ${stats.rawWordCount.toLocaleString()}` },
                { key: 'V5', value: `Nb. glyphes : ${stats.glyphCount.toLocaleString()}` },
                { key: 'V3', value: `Nb. mots ref. incluses : ${stats.totalAlphaNumWordCount.toLocaleString()}` },
                { key: 'V4', value: `Nb. mots bruts ref. incluses : ${stats.totalRawWordCount.toLocaleString()}` },
                { key: 'V6', value: `Nb. glyphes  ref. incluses : ${stats.totalGlyphCount.toLocaleString()}` },
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
