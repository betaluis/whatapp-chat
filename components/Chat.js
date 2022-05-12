
// Styles
import styled from 'styled-components';
import { Avatar } from '@mui/material';

// Utils
import getRecipientEmail from '../utils/getRecipientEmail';

// Firebase
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where } from 'firebase/firestore';

const Chat = ({ id, users }) => {

    const [user] = useAuthState(auth);

    // query from users data
    const usersCollection = collection(db, 'users');
    const recipientQuery = query(usersCollection, where("email", "==", getRecipientEmail(users, user)))
    const [recipientSnapshot] = useCollection(recipientQuery);

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users, user);
    
    return ( 
        <Container>
            {
                recipient ? 
                    <UserAvatar src={recipient?.photoURL} /> :
                    <UserAvatar>{recipientEmail[0]}</UserAvatar>
            }
            <p>{recipientEmail}</p>
        </Container>
     );
}
 
export default Chat;

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;

    :hover {
        background-color: #e9eaeb;
    }
`
const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;