import React, { FormEvent, useState } from 'react';

import firebase from 'firebase';
import { dbService } from '../fbase';

type nweetType = {
    data: firebase.firestore.DocumentData,
    id: string
};

type nweetObj = {
    nweetObj: nweetType,
    isOwner: boolean
}

const Nweet = ({ nweetObj, isOwner }: nweetObj) => {
    const [editing, setEditing] = useState(false);
    const [newNweet, setNewNweet] = useState(nweetObj.data.text);

    const onDeleteClick = async () => {
        const ok = window.confirm("Are you sure you want to delete this nweet?")
        console.log(ok);
        if (ok) await dbService.doc(`nweets/${nweetObj.id}`).delete();
    }

    const toggleEditing = () => setEditing((prev) => !prev);

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log(nweetObj, newNweet);
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text: newNweet
        });
        setEditing(false);
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { target: { value } } = e;
        setNewNweet(value);
    }

    return (
        <div>
            { editing ? (
                <>
                    <form onSubmit={onSubmit}>
                        <input type="text" placeholder="Edit your nweet" onChange={onChange} value={newNweet} required />
                        <input type="submit" value="Update Nweet" />
                    </form>
                    <button onClick={toggleEditing}>Cancel</button>
                </>
            ) : (
                <>
                    <h4>{nweetObj.data.text}</h4>
                    { nweetObj.data.attachmentUrl && <img src={nweetObj.data.attachmentUrl} width="50px" height="50px" />}
                    { isOwner && (
                        <>
                            <button onClick={onDeleteClick}>Delete Nweet</button>
                            <button onClick={toggleEditing}>Edit Nweet</button>
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default Nweet;