import firebase from 'firebase';
import React, { FormEvent, useEffect, useState } from 'react';
import Nweet from '../components/Nweet';

import { dbService } from '../fbase';

type nweetType = {
    data: firebase.firestore.DocumentData,
    id: string
};

type HomeProps = {
    userObj: firebase.User | null
}

const Home = ({ userObj }: HomeProps) => {
    const [nweet, setNweet] = useState('');
    const [nweets, setNweets] = useState<nweetType[]>([]);

    useEffect(() => {
        dbService.collection("nweets").onSnapshot(snapshot => {
            const nweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                data: doc.data(),
            }));
            setNweets(nweetArray);
        });
    }, []);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj?.uid
        });
        setNweet("");
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { value } } = e;
        setNweet(value);
    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="submit" value="Nweet" /> 
            </form>
            <div>
                { nweets.map((nweet: nweetType) => 
                    <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.data.creatorId === userObj?.uid}/>
                )}
            </div>
        </div>
    );
};

export default Home;