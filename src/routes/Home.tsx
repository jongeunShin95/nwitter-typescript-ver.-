import firebase from 'firebase';
import React, { FormEvent, useEffect, useState } from 'react';
import Nweet from '../components/Nweet';
import { v4 as uuidv4 } from 'uuid';

import { dbService, storageService } from '../fbase';

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
    const [attachment, setAttachment] = useState('');

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
        let attachmentUrl = "";

        if (attachment != "") {
            const fileRef = storageService.ref().child(`${userObj?.uid}/${uuidv4()}`);
            const response = await fileRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            createorId: userObj?.uid,
            attachmentUrl
        }

        console.log(userObj?.uid);
        await dbService.collection("nweets").add(nweetObj);
        setNweet("");
        setAttachment("");
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { value } } = e;
        setNweet(value);
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { files }} = e;
        const theFile = files![0];
        const reader = new FileReader();
        reader.onload = (finishedEvent: any) => {
            const { currentTarget: { result }} = finishedEvent;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }

    const onClearAttachment = () => setAttachment('');

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Nweet" /> 
                { attachment && (
                    <div>
                        <img src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                    )
                }
            </form>
            <div>
                { nweets.map((nweet: nweetType) => 
                    <Nweet key={nweet.id} nweetObj={
                        nweet} isOwner={nweet.data.creatorId === userObj?.uid} />
                )}
            </div>
        </div>
    );
};

export default Home;