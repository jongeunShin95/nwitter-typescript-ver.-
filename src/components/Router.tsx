import React, { useState } from 'react';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import { User } from 'firebase';
import Navigation from './Navigation';
import Profile from '../routes/Profile';

type RouterProps = {
    isLoggedIn: boolean | null
};

export default ({ isLoggedIn }: RouterProps) => {
    return (
        <Router>
            { isLoggedIn && <Navigation /> }
            <Switch>
                { isLoggedIn ?
                    <>
                        <Route exact path="/">
                            <Home />
                        </Route>
                        <Route exact path="/profile">
                            <Profile />
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