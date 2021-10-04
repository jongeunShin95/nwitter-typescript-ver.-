import firebase, { FirebaseError } from 'firebase';
import React, { FormEvent, useState } from 'react';
import { authService, firebaseInstance } from '../fbase';

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newAccount, setNewAccout] = useState(true);
    const [error, setError] = useState("");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        else if (name === 'password') setPassword(value);
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            let data;
            if (newAccount) {
                // create account
                data = await authService.createUserWithEmailAndPassword(email, password);
            } else {
                // log in
                data = await authService.signInWithEmailAndPassword(email, password);
            }

            console.log(data);
        } catch (error) {
            const err = error as FirebaseError;
            setError(err.message);
        }
    }

    const toggleAccount = () => setNewAccout((prev) => !prev);
    const onSocialClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const { name } = e.currentTarget;
        let provider;

        if (name === 'google') {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name === 'github') {
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }

        if (provider == undefined) return;

        const data = await authService.signInWithPopup(provider);
        console.log(data);
    }

    return (
        <div>
            <form onSubmit={onSubmit} >
                <input name="email" type="text" placeholder="Email" required value={email} onChange={onChange} />
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} />
                <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
                { error }
            </form>
            <span onClick={toggleAccount}>
                { newAccount ? 'Sign In' : "Create Account" }
            </span>
            <div>
                <button onClick={onSocialClick} name="google">Continue with Google</button>
                <button onClick={onSocialClick} name="github">Continue with Github</button>
            </div>
        </div>
    )
};