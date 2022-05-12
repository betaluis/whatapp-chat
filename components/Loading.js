import { CircularProgress } from "@mui/material";

const Loading = () => {
    return ( 
        <center style={{ display: "grid", placeItems: "center", height: "100vh"}}>
            <div>
                <img 
                    src="http://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png" 
                    alt="Whatsapp Image" 
                    height={200}
                    style={{ marginBottom: 10 }}
                />
                <div style={{ display: "grid", placeItems: "center"}}>
                    <CircularProgress color="success" size={80} />
                </div>
            </div>
        </center>
     );
}
 
export default Loading;