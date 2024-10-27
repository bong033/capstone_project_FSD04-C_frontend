class NavController {

    constructor(element){
        this.siteMenu = document.getElementById(element);
        this.navbar = document.createElement("ul");
        this.navItems = [
            {"title":_HOME_TITLE, "url": _HOME_URL}, 
            {"title":_ABOUT_TITLE, "url": _ABOUT_URL}, 
            {"title":_REGISTER_TITLE, "url": _REGISTER_URL}, 
            {"title":_LOGIN_TITLE, "url": _LOGIN_URL},
            {"title":_LOGOUT_TITLE, "url": _LOGOUT_URL}
        ];
    }

    displayNav(){

        this.navbar.className = "navbar-nav ms-auto mb-lg-0";
        this.siteMenu.appendChild(this.navbar);

        // Obtain the token of the authenticated user
        const token = isAuthenticated();                                                                        
        // Populate the navbar, and done conditionally for Login or Logout
        this.navItems.forEach((item) => {                                                                       
            // Used for links that require emphasis (join/log in, logout, useremail)
            const underLinedLink = "nav-link fw-bolder text-decoration-underline";                              
            
            switch (true) {
                case (item.title.toLowerCase() !== _LOGIN_TITLE && item.title.toLowerCase() !== _LOGOUT_TITLE && item.title.toLowerCase() !== _REGISTER_TITLE):
                    // Display menu items not used for authentication
                    this.displayNavItem(item);                                                                  
                    break;
                case (!token && item.title.toLowerCase() === _REGISTER_TITLE):
                    // Display the link to register for new users
                    this.displayNavItem(item);                                                                  
                    break;
                case (!token && item.title.toLowerCase() === _LOGIN_TITLE):
                    // Display the link to login for UNauthenticated users
                    this.displayNavItem(item);                                                                  
                    break;
                case (token && item.title.toLowerCase() === _LOGOUT_TITLE):   
                    // Display the link to logout for authenticated users          
                    this.displayNavItem(item)                                                                   
                    break;
                default:            
                    // For anything else, include statements to create additional links                                                                            
                    break;
            }
        });
        
        if(token){
            const user = decodeUser(token);
            const userItem = {"title": user.email, "url": _PROFILE_URL};
            this.displayNavProfile(userItem);
        }

        return;
    }

    displayNavItem(item, underLinedLink = null){
        
        // Append menu item as list item
        const navItem = document.createElement("li");                                                           
        this.navbar.appendChild(navItem);               
        navItem.className = "nav-item text-nowrap"; 
        
        // Append link to menu item
        const navLink = document.createElement("a");                                                            
        navItem.appendChild(navLink);      

        // Change the navLinks's class if parameter underLinedLink is NOT equals to null
        if(underLinedLink !== null)                                                                              
            navLink.className = underLinedLink;
        else
            navLink.className = "nav-link";
        // Set the text and the link
        navLink.textContent = item.title.charAt(0).toUpperCase() + item.title.slice(1);                         
        
        // If title is 'logout',
        if(item.title === _LOGOUT_TITLE){ 
            // Apply a placeholder anchor (#)                                                                       
            navLink.href = "#";    
            // add eventListener                                                                              
            navLink.addEventListener("click", (event) => {                                                      
                console.log("logging out");    
                // call function logout()                                                                 
                logout();                                                                                                                                                              
            })
        // Otherwise, apply item URL
        }else{
            navLink.href = item.url;                                                                            
        }
    }

    displayNavProfile(item){
        // Append menu item as list item
        const navItem = document.createElement("li");                                                           
        this.navbar.appendChild(navItem);               
        navItem.className = "nav-item text-nowrap"; 
        // Append link to menu item
        const navLink = document.createElement("a");                                                            
        navItem.appendChild(navLink);  
        navLink.className = "nav-link";
        navLink.setAttribute("data-bs-toggle", "tooltip");
        navLink.setAttribute("data-bs-title", item.title);
         // Set the ICON and the link
        const iconElement = document.createElement('i');                                                       
        iconElement.className = "fs-3 fa fa-user-circle px-3";
        navLink.appendChild(iconElement);
        navLink.href = item.url;
        // Set a new instance of the tooltip for the profile
        const tooltipProifleLink = navLink;                                                                     
        const tooltipProfile =  new bootstrap.Tooltip(tooltipProifleLink);
        
    }
}