import React, { FormEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { authService, dbService } from '../fbase';

type ProfileProps = {
    refreshUser: () => void,
    userObj: firebase.User | null
}


export default ({ refreshUser, userObj }: ProfileProps) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj?.displayName);

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }

    const getMyNweets = async () => {
        const nweets = await dbService
            .collection("nweets")
            .where("creatorId", "==", userObj?.uid)
            .orderBy("createdAt")
            .get();
        console.log(nweets.docs.map((doc) => doc.data()));
    }

    useEffect(() => {
        getMyNweets();
    }, []);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { value }} = e;
        setNewDisplayName(value);
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (userObj?.displayName !== newDisplayName) {
            await userObj?.updateProfile({
                displayName: newDisplayName
            });
            refreshUser();
        }
    }

    return (
        <>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Display name" onChange={onChange} />
                <input type="submit" value="Update Profile" />
            </form>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};