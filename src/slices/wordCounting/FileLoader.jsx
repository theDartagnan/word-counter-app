import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useFormStatus } from 'react-dom';

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

export default function FileLoader({ onLoadFile, processingFile = false, className }) {
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
      <FileForm processingFile={processingFile} />
    </form>
  );
}

FileLoader.propTypes = {
  onLoadFile: PropTypes.func.isRequired,
  processingFile: PropTypes.bool,
  className: PropTypes.string,
};
