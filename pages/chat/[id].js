import styled from 'styled-components';

// Components
import Head from 'next/head';
import { useRouter } from 'next/router';
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';

// Firebase
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import getRecipientEmail from '../../utils/getRecipientEmail';

export default function Chat({ messages, chat }) {

    const [ user ] = useAuthState(auth);

    return (
        <Container>
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} /> 
            </ChatContainer>
        </Container>
    )
}

export const getServerSideProps = async (context) => {


    const id = context.query.id;
    
    const docRef = doc(db, 'chats', id);
    const subCollection = collection(docRef, "messages");
    const q = query(subCollection, orderBy("timestamp", "asc"));
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => (
        {
            ...doc.data(),
            id: doc.id
        }
    )).map( messages => (
        {
            ...messages,
            timestamp: messages.timestamp.toDate().getTime(),
        }
    ));

    const chatRes = await getDoc(docRef);
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

    return {
        props: {
            id,
            messages: JSON.stringify(messages),
            chat,
        }
    }

}

const Container = styled.div`
    display: flex;
`;

const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none; /* IE and edge */
    scrollbar-width: none; /* firefox */
`;
