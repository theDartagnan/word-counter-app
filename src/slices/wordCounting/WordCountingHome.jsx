import { useState } from 'react';
import AppPresentation from './AppPresentation';
import FileLoader from './FileLoader';
import FileProcessor from './FileProcessor';
import TextProcessController from './services/TextProcessController';

export default function WordCountingHome() {
  const [txtProcess, setTxtProcess] = useState({
    controller: null,
    processing: false,
  });

  function startProcessing(file) {
    const tpc = new TextProcessController(file);
    setTxtProcess({ controller: tpc, processing: true });
    tpc.start().finally(() => {
      setTxtProcess(s => ({ ...s, processing: false }));
    });
  }

  return (
    <main className="hero bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <AppPresentation />
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <FileLoader onLoadFile={startProcessing} processingFile={txtProcess.processing} className="mb-3" />
            {!!txtProcess.controller && (
              <FileProcessor textProcessController={txtProcess.controller} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
