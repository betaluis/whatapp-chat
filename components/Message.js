// Firebase
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

// Moment
import moment from "moment";

// Styles
import styled from "styled-components";

const Message = ({ user, message }) => {
    
    
    // This is how you determine if the message is from the sender or the receiver.
    const [userLoggedIn] = useAuthState(auth);

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;

    return (
        <Container>
            <TypeOfMessage>
                {message.message}
                <Timestamp>{message.timestamp ? moment(message.timestamp).format('LT') : '...'}</Timestamp>
            </TypeOfMessage>
        </Container>
    );
}


export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
    width: fit-content;
    padding: 15px;
    border-radius: 8px;
    margin: 10px;
    min-width: 60px;
    padding-bottom: 26px;
    position: relative;
    text-align: right;
    `;

// We want to differentiate between sender and receiver. 
// How do I determine if they're a sender or receiver?

const Sender = styled(MessageElement)`
    background-color: #dcf8c6;
    margin-left: auto;
`;

const Receiver = styled(MessageElement)`
    background-color: whitesmoke;
    text-align: left;
`;

const Timestamp = styled.span`
    color: gray;
    padding: 10px;
    font-size: 9px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0;
`;