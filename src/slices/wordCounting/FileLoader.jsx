import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useRef, useSyncExternalStore } from 'react';
import { useFormStatus } from 'react-dom';
import TextProcessController from './services/TextProcessController';

function FileForm({ processingFile = false }) {
  const { pending } = useFormStatus();

  const processing = pending || processingFile;

  return (
    <fieldset disabled={processing} className="fieldset">
      <legend className="fieldset-legend">Sélectionnez ou glissez-déposez ici Votre fichier PDF.</legend>
      <input
        type="file"
        name="file"
        accept=".pdf,application/pdf"
        required
        className="file-input file-input-primary"
      />
      <input type="submit" className="btn btn-primary mt-4" value="Traiter le fichier" />
    </fieldset>
  );
}

FileForm.propTypes = {
  processingFile: PropTypes.bool,
};

export default function FileLoader({ onLoadFile, textProcessController, className }) {
  const stats = useSyncExternalStore(lst => textProcessController.subscribe(lst), () => textProcessController.stats);
  const ref = useRef(null);

  async function onSubmitForm(formData) {
    const file = formData.get('file');
    if (!file) {
      console.warn('Unable to load file from input!');
      return;
    }
    return onLoadFile(file);
  }

  return (
    <form ref={ref} action={onSubmitForm} className={classNames(className)}>
      <FileForm processingFile={stats?.processing} />
    </form>
  );
}

FileLoader.propTypes = {
  onLoadFile: PropTypes.func.isRequired,
  textProcessController: PropTypes.instanceOf(TextProcessController),
  className: PropTypes.string,
};
