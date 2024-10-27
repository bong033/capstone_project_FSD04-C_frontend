// Function to validate email using regex 
function isEmail(value){
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(value);
}

// Function to validate username using regex 
function isUsername(value){
    const usernameRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return usernameRegex.test(value);
}

// Function to validate password using regex 
function isPassword(value){
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegex.test(value);
}

// Function to validate empty values
function isEmpty(value){
    return value === "";
}

// Function only allows specific characters (as described in the regex)
function isValidMsg(value){
    // reject special characters that may allow code injections scripts / sql injections
    const msgRegex = /^[a-zA-Z0-9\s.,!?'"-]*$/;     
    return msgRegex.test(value);
}