import React, { FormEvent, useEffect, useState } from 'react';
import { dbService } from '../fbase';

type nweetType = {
    data: firebase.firestore.DocumentData,
    id: string
};

const Home = () => {
    const [nweet, setNweet] = useState('');
    const [nweets, setNweets] = useState<nweetType[]>([]);
    const getNweets = async () => {
        const dbNweets = await dbService.collection('nweets').get();
        dbNweets.forEach((document) => {
            const nweetObject: nweetType = {
                data: document.data(),
                id: document.id
            };
            setNweets((prev: nweetType[]) => [nweetObject, ...prev]);
        });
    }

    useEffect(() => {
        getNweets();
    }, []);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await dbService.collection("nweets").add({
            nweet,
            createdAt: Date.now(),
        });
        setNweet("");
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { value } } = e;
        setNweet(value);
    }

    console.log(nweets);
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="submit" value="Nweet" /> 
            </form>
            <div>
                { nweets.map((nweet: nweetType) => 
                    <div key={ nweet.id }>
                        <h4>{ nweet.data.nweet }</h4>
                    </div> 
                )}
            </div>
        </div>
    );
};

export default Home;