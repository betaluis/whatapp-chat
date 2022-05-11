import Head from "next/head";
import styled from "styled-components";
import { Button } from "@mui/material";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";

const Login = () => {

    const signIn = () => {
        signInWithPopup(auth, googleProvider).catch(alert);
    }

    return ( 
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Logo 
                    src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
                />
                <LoginButton variant="outlined" onClick={signIn}>Sign in with Google</LoginButton>
            </LoginContainer>
        </Container>
     );
    
}
 
export default Login;

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
`;

const LoginContainer = styled.div`
    padding: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 4px 14px -3px rgba(0,0,0.7, 0.5); 
`;

const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`;

const LoginButton = styled(Button)`
    color: black;
    border-color: black;
    box-shadow: 1px 2px 0px rgba(0,0,0,0.2);
`;