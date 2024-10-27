// Function to authenticate the user via site's JWT token
function isAuthenticated(){
    // Retrieve usertoken from local storage
    const token = window.localStorage.getItem(_USERTOKEN);          
    // Check the token's expiry 
    const expired = isTokenExpired(token);                          
    // If expired, return (false)
    if(expired)                                                     
        return;
    // Else return token (usertoken)
    return token;                                                   
}

// Function to check if the token has expired
function isTokenExpired(token) {                                    
    // Return true if token passed in is undefined 
    if (!token) return true;                                        
    // Decode the JWT token (a base64-encoded JSON payload)
    const payload = JSON.parse(atob(token.split('.')[1]));          
    // Get the expiration time from the token payload
    const expirationTime = payload.exp;                             
    // Current time in seconds
    const currentTime = Math.floor(Date.now() / 1000);              
    // Return true ONLY when currentTime is LESS THAN token's expirationTime
    return expirationTime < currentTime;                            
}

// Function to decode the user's email from the parameter
function decodeUser(token){                                         
    
    // !! Extract authenticated user's email from the token
    const arrToken = token.split(".");                              
    const decodedToken = JSON.parse(window.atob(arrToken[1]));
    const email = decodedToken.sub;
    return {email: email};

}

// ?? async / await
// ?? Async functions return results wrapped in a resolved Promise; for any errors, a 'rejected' Promise is returned 
// ?? In an async function, await pauses execution for the function until a Promise is resolved/rejected. 

// Funtion to login
async function login(formData = {}){
    // Return if the object is empty
    if(Object.entries(formData).length === 0)                                               
        return;

    // !! Try/catch block (exception handling) to send data to login enpoint
    try {       
        // !! DONE: API call for Authentication                                                                            
        const response = await fetch(_ENDPOINT_LOGIN, {                                     
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        });

        const status = response.status;
        // If response status == 200 (ok)
        if(response.ok){                                                                    
            const result = await response.json();
            const token = result.token;                                                   
             // Store the string in localStorage with the key 'usertoken'
            window.localStorage.setItem(_USERTOKEN, token);                                
            
            spinner.displaySpinner(false);
            window.location = _PROFILE_URL;
        }
        // Else return false 
        return status === 200 ? data : false;                                                
                                                                         
    } catch (error) {
        console.log("Exception error gotten is: ", error.message);
        return error.message;
    }
    
}

// Function to create new patient upon registration
async function postPatient(userId) {
    const url = `http://localhost:8080/api/patient/${userId}`;
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
    });
}

// Funtion to register
async function register(formData){
    console.log(formData);
    // Return if the object is empty
    if(Object.entries(formData).length === 0)                                               
        return;

    // !! Try/catch block (exception handling) to send data to login enpoint
    try {
        // FETCH requests - send data or retrive data by calling an API endpoint            
            const response = await fetch(_ENDPOINT_SIGNUP, {    
                // Perform an async POST request to process the form data                            
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            });
        
            // send email and password to server
            const status = response.status;
            const data = await response.json();
            // return 226 if account is already in use
            if (status === 226)                                                             
                return status;

            postPatient(data.user.userId);

            spinner.displaySpinner(false);
            window.location = _LOGIN_URL;

            // Return the result only if the status is 200 (OK), else return false
            return status === 200 ? data : false;

    } catch (error) {
        console.log("Exception error gotten is: ", error.message);
        return error.message;
    }   
}

// Funtion to update
async function update(formData1, formData2 = {}){
    const token = window.localStorage.getItem(_USERTOKEN);

    try {
        await fetch(`http://localhost:8080/api/user/${formData1.userId}`, {
            method: 'PUT',
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData1)
        });
        const role = formData1.role;

        if (role === "Patient") {
            await fetch(`http://localhost:8080/api/patient/${formData2.patientId}`, {
                method: 'PUT',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData2)
            });
        }

    } catch (error) {
        console.log("Exception error gotten is: ", error.message);
        return;
    }
    ftnUpdatedMessge();
}

// Function to logout
function logout(){
    // Remove the string in localStorage with the key 'usertoken'                                               
    window.localStorage.removeItem(_USERTOKEN);    
     // Redirect the user to homepage                                         
    window.location = _HOME_URL;                                                           
}
