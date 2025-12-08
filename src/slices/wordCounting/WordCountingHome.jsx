import { useState } from 'react';
import AppPresentation from './AppPresentation';
import FileLoader from './FileLoader';
import FileProcessor from './FileProcessor';
import TextProcessController from './services/TextProcessController';

export default function WordCountingHome() {
  const [txtProcess] = useState(new TextProcessController());

  function startProcessing(file) {
    txtProcess.start(file);
  }

  return (
    <main className="hero bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <AppPresentation />
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <FileLoader onLoadFile={startProcessing} textProcessController={txtProcess} className="mb-3" />
            <FileProcessor textProcessController={txtProcess} />
          </div>
        </div>
      </div>
    </main>
  );
}
