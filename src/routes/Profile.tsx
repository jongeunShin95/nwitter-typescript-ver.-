import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { authService, dbService } from '../fbase';

type ProfileProps = {
    userObj: firebase.User | null
}


export default ({ userObj }: ProfileProps) => {
    const history = useHistory();

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

    return (
        <>
            <button onClick={onLogOutClick}>Log Out</button>
        </>
    );
};