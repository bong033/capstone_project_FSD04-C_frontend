let spinner = null;
let initPage = true;

// EventListener to instantiate the navController
document.addEventListener("DOMContentLoaded", async (event) => {
    
    // Instantiate an instance of the siteMenu
    const navController = new NavController("navbarNav");
    navController.displayNav();

    // apply class active for active page
    const currentPage = window.location.pathname;
    const activeLink = document.querySelectorAll('.nav-link');
    const navLink = navController.navItems;

    for (let index = 0; index < navLink.length; index++) {
        if (currentPage.includes(navLink[index].url)) {
            activeLink[index].classList.add('active');
        }   
    }

    // Instantiate a spinner, currently used in login.html and register.html
    spinner = new Spinner();
    // If _PROFILE_URL exists, profilePageExists = true
    const profilePageExists = window.location.pathname.includes(_PROFILE_URL);      
    
    if(profilePageExists){                                                          
        const token = isAuthenticated();                                     
                                                                            
        if(!token)    
            // Redirect the user to index.html if token does not exist     
            window.location = _HOME_URL;                                              
        // decode the token for the role
        const user = decodeUser(token);                                             

        // Perform the fetch request with the token for user profile
        async function fetchUserData(userEmail, token) {
            try {
                const response = await fetch(`http://localhost:8080/api/user/${userEmail}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // Parse the JSON response
                const userData = await response.json(); 
                // Handle the data
                console.log('User data:', userData); 
                // Return userData
                return userData; 
        
            } catch (error) {
                // Handle errors
                console.error('There was a problem with the fetch operation:', error); 
                // Rethrow the error if you want to handle it later
                throw error; 
            }
        }

        // Perform the fetch request with the token for nurse profile
        async function fetchNurseData(userData, token) {
            try {
                const response = await fetch(`http://localhost:8080/api/nurse/user/${userData}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // Parse the JSON response
                const nurseData = await response.json(); 
                // Handle the data
                console.log('User data:', nurseData); 
                // Return userData
                return nurseData; 
        
            } catch (error) {
                // Handle errors
                console.error('There was a problem with the fetch operation:', error); 
                // Rethrow the error if you want to handle it later
                throw error; 
            }
        } 

        // Perform the fetch request with the token for patient profile
        async function fetchPatientData(userData, token) {
            try {
                const response = await fetch(`http://localhost:8080/api/patient/user/${userData}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // Parse the JSON response
                const patientData = await response.json(); 
                // Handle the data
                console.log('User data:', patientData); 
                // Return userData
                return patientData; 
        
            } catch (error) {
                // Handle errors
                console.error('There was a problem with the fetch operation:', error); 
                // Rethrow the error if you want to handle it later
                throw error; 
            }
        } 
         
        const userData = await fetchUserData(user.email, token);   

        if (userData.role === "Admin") {
            adminProfile(userData.role, userData);
        } else if (userData.role === "Nurse") {           
            const nurseData = await fetchNurseData(userData.userId, token); 
            staffProfile(userData.role, userData, nurseData);
        } else if (userData.role === "Patient") {  
            const patientData = await fetchPatientData(userData.userId, token);
            customerProfile(userData.role, userData, patientData);
        }
    }
})    
