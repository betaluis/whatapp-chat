// React
import { useState, useRef } from 'react';

// Next
import { useRouter } from 'next/router';

// Firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';

// Components
import Message from './Message';
import TimeAgo from './TimeAgo';

// Utilities
import getRecipientEmail from '../utils/getRecipientEmail';

// Styles
import styled from 'styled-components';
import { Avatar } from '@mui/material';
import MoreVert from '@mui/icons-material/MoreVert';
import { AttachFile, InsertEmoticonOutlined, Mic } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const ChatScreen = ({ chat, messages }) => {

    const [user] = useAuthState(auth);
    const router = useRouter();
    // const [input, setInput] = useState('');
    const chatInput = useRef();

    const chatDocRef = doc(db, 'chats', router.query.id)
    const subCollection = collection(chatDocRef, "messages")
    const orderedMessagesQuery = query(subCollection, orderBy("timestamp", "asc"))
    const [ messagesSnapshot ] = useCollection(orderedMessagesQuery);

    const usersDocRef = doc(db, 'users', user.uid)
    const recipientEmailQuery = query(collection(db, "users"), where("email", "==", getRecipientEmail(chat.users, user))); 
    const [ recipientEmailSnapshot ] = useCollection(recipientEmailQuery);


    const showMessage = () => {

        if (messagesSnapshot) {
            return messagesSnapshot.docs.map(message => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime()
                    }}
                />
            ))
        } else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message} />
            ))
        }

    }

    const sendMessage = (e) => {
        e.preventDefault();
        console.log(chatInput.current.value);


        // Updates "last seen" 
        setDoc(usersDocRef, {
            lastSeen: serverTimestamp()
        }, {merge: true});

        addDoc(subCollection, {
            timestamp: serverTimestamp(),
            message: chatInput.current.value,
            user: user.email,
            photoURL: user.photoURL
        }) 

        chatInput.current.value = '';
        chatInput.current.focus();

    }

    const recipientEmail = getRecipientEmail(chat.users, user);
    const recipientData = recipientEmailSnapshot?.docs?.[0]?.data();

    return (
        <Container>
            <Header>
                {
                    recipientData ? 
                        <Avatar src={ recipientData?.photoURL } /> : 
                        <Avatar src={recipientEmail[0]} />
                }
                <HeaderInformation>
                    <h3>{recipientEmail}</h3>
                    {
                        recipientEmailSnapshot ?
                            <p>
                                Last active: {' '}
                                {
                                    recipientData?.lastSeen ?
                                        <TimeAgo date={recipientData.lastSeen?.toDate()} /> :
                                        "unavailable"
                                }
                            </p> :
                            <p>Loading last active...</p>
                    }
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </HeaderIcons>
            </Header>

            <MessageContainer>
                {showMessage()}
                <EndOfMessage />
            </MessageContainer>

            <InputContainer onSubmit={sendMessage}>
                <InsertEmoticonOutlined />
                <Input 
                    ref={chatInput}
                />
                <button hidden disabled={!chatInput} type="submit" onClick={sendMessage}>
                    Send Message
                </button>
                <Mic />
            </InputContainer>
        </Container>
    );
}

export default ChatScreen;

const Container = styled.div`
`;

const Header = styled.div`
    position: sticky;
    top: 0;
    display: flex;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
    height: 80px;
    padding: 11px;
    background-color: white;
    z-index: 100;
`;

const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }
    > p {
        font-size: 14px;
        color: gray;
    }
`;

const HeaderIcons = styled.div`
`;

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`;

const EndOfMessage = styled.div``;

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`;