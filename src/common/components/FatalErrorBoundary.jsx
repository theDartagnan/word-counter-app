import classNames from 'classnames';
import { isRouteErrorResponse, useRouteError } from 'react-router';

export default function FatalErrorBoundary() {
  const error = useRouteError();

  let errorTitle;
  let errorMessage;
  if (isRouteErrorResponse(error)) {
    errorTitle = 'Erreur réseau survenue.';
    errorMessage = `Erreur code ${error.status} : ${error.statusText}`;
  }
  else if (error instanceof Error) {
    errorTitle = 'Erreur système survenue.';
    errorMessage = error.message;
  }
  else {
    errorTitle = 'Erreur inconnue survenue.';
    errorMessage = null;
  }

  return (
    <main className="bg-base-200 p-4 flex flex-col items-center">
      <div className="max-w-xl">
        <div role="alert" className={classNames(classNames, 'alert alert-error alert-vertical sm:alert-horizontal')}>
          {/* Exclamation mark triangle */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3>{errorTitle}</h3>
            <div className="text-xs">{errorMessage}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
