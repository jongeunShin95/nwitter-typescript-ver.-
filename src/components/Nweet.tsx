import React from 'react';

import firebase from 'firebase';

type nweetType = {
    data: firebase.firestore.DocumentData,
    id: string
};

type nweetObj = {
    nweetObj: nweetType,
    isOwner: boolean
}

const Nweet = ({ nweetObj, isOwner }: nweetObj) => (
    <div>
        <h4>{nweetObj.data.text}</h4>
        { isOwner && (
            <>
                <button>Delete Nweet</button>
                <button>Edit Nweet</button>
            </>
        )}
    </div>
)

export default Nweet;