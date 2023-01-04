import NProgress from "nprogress";
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { GlobalStyles } from '@mui/material';

export function LoadingBar({ isLoading, startDelay = 500 }) {
  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        NProgress.start();
      }, startDelay);

      return () => {
        clearTimeout(timer);
      };
    }

    NProgress.done();
    return undefined;
  }, [isLoading, startDelay]);
	
  return (
    <GlobalStyles
      styles={theme => ({
        '#nprogress': {
          position: 'fixed',
          top: 0,
          right: 0,
          left: 0,
          // background: '#fff',
          height: 3,
          pointerEvents: 'none',
          zIndex: theme.zIndex.snackbar, // TODO: add custom zIndex on theme?
        },
        '#nprogress .bar': {
          background: theme.palette.primary.dark
        },
        '#nprogress .peg': {
          boxShadow: `0 0 10px ${theme.palette.primary[500]},
            0 0 5px ${theme.palette.primary[500]}`,
          display: 'block',
          height: '100%',
          opacity: 1,
          position: 'absolute', 
          right: 0,
          transform: 'rotate(3deg) translate(0, -4px)',
          width: '100px',
        }
      })}
    />
  );
}

LoadingBar.propTypes = {
  isLoading: PropTypes.bool,
  startDelay: PropTypes.number,
};