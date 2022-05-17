import time_ago from '../utils/time_ago'

const TimeAgo = ({ date }) => {

    const formattedDate = time_ago(date);
    
    return formattedDate && <span>{formattedDate}</span> 
}


export default TimeAgo;