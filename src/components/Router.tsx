import React, { useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import { User } from 'firebase';

type RouterProps = {
    isLoggedIn: User | null
};

export default ({ isLoggedIn }: RouterProps) => {
    return (
        <Router>
            <Switch>
                { isLoggedIn ?
                    <>
                        <Route exact path="/">
                            <Home />
                        </Route>
                    </> : <Route exact path="/"><Auth /></Route>
                }
            </Switch>
        </Router>
    );
}