
const time_ago = (time) => {

    switch (typeof time) {
        case 'number':
            break;
        case 'string':
            time = +new Date(time)
            break;
        case 'object':
            if (time.constructor === Date) time = time.getTime();
            break;
        default:
            time = +new Date();
    }

    const time_formats = [
        [60, "seconds", 1],
        [3600, "minutes", 60],
        [86400, "hours", 3600],
        [604800, "days", 86400],
        [2419200, "weeks", 604800],
        [29030400, "months", 2419200],
        [2903040000, "years", 29030400],
        [58060800000, "centuries", 2903040000]
    ]

    let seconds = (+new Date() - time) / 1000,
        token = "ago"

    let i = 0,
        format
     
        while ( format = time_formats[i++] )
            if ( seconds < format[0] ) {
                if ( seconds < 300 ) {
                    /* This shows "just now" for 5 minutes and below */
                    return "Just now"
                } else {
                    return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token
                }
            }
    return time
            
}

export default time_ago