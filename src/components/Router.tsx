import React, { useState } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import firebase, { User } from 'firebase';
import Navigation from './Navigation';
import Profile from '../routes/Profile';

type RouterProps = {
    isLoggedIn: boolean | null,
    userObj: firebase.User | null
};

export default ({ isLoggedIn, userObj }: RouterProps) => {
    return (
        <Router>
            { isLoggedIn && <Navigation userObj={userObj} /> }
            <Switch>
                { isLoggedIn ?
                    <>
                        <Route exact path="/">
                            <Home userObj={userObj} />
                        </Route>
                        <Route exact path="/profile">
                            <Profile userObj={userObj} />
                        </Route>
                        <Redirect from="*" to="/" />
                    </> : (
                        <>
                            <Route exact path="/">
                                <Auth />
                            </Route>
                            <Redirect from="*" to="/" />
                        </>
                    )
                }
            </Switch>
        </Router>
    );
}