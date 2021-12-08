import React, { useEffect, useState } from 'react';
import Router from './Router';
import { authService } from '../fbase';

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState<any | null>(null);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args: any) => user.updateProfile(args),
        });
      } else setIsLoggedIn(false);

      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;

    setUserObj({
      displayName: user?.displayName,
      uid: user?.uid,
      updateProfile: (args: any) => user?.updateProfile(args),
    });
  }

  return (
    <>
      {init ? <Router refreshUser={refreshUser} isLoggedIn={isLoggedIn} userObj={userObj} /> : "Initializing..."}
      {/* <footer>&copy; { new Date().getFullYear() } Nwitter</footer> */}
    </>
  );
}

export default App;
