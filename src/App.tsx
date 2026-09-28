import React, { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { Loader } from './components/shell/Loader';

export function App() {
  const [loaderComplete, setLoaderComplete] = useState(() => {
    // If deep link or already seen, skip loader
    const isDeepLink = window.location.pathname !== '/' && window.location.pathname !== '';
    const hasSeen = sessionStorage.getItem('dnn_seen') === '1';
    return isDeepLink || hasSeen;
  });

  return (
    <>
      {!loaderComplete && (
        <Loader onComplete={() => setLoaderComplete(true)} />
      )}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
