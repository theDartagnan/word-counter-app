/* eslint react/jsx-props-no-spreading: off */
import { useEffect } from 'react';
import PropTypes from 'prop-types';

function setPageTitle(pageTitle, overrideAppTitle) {
  if (!pageTitle) {
    document.title = APP_ENV_APP_TITLE;
  }
  else if (overrideAppTitle) {
    document.title = pageTitle;
  }
  else {
    document.title = `${APP_ENV_APP_TITLE} - ${pageTitle}`;
  }
}

export function withPageTitle(WrappedComponent, pageTitle, overrideAppTitle = false) {
  return function PagedComponent(props) {
    useEffect(() => {
      setPageTitle(pageTitle, overrideAppTitle);
    }, []);
    return (<WrappedComponent {...props} />);
  };
}

export default function WithPagedTitle({ pageTitle, overrideAppTitle = false, children }) {
  useEffect(() => {
    setPageTitle(pageTitle, overrideAppTitle);
  }, [pageTitle, overrideAppTitle]);
  return children;
}

WithPagedTitle.propTypes = {
  pageTitle: PropTypes.string,
  overrideAppTitle: PropTypes.bool,
  children: PropTypes.element.isRequired,
};
