#### Tutorial from: https://www.youtube.com/watch?v=-RCnNyD0L-s

This project uses NodeJS, express, passport and a number of other npm dependencies to implements user log-in, log-out and register functionality.
All users are saved to a local array.

Below dependencies are used:

**express:** to create the server  

**ejs:** view template engine for express  

**bcrypt:** to hash passwords  

**passport:** used to persist the user across different requests  

**passport-local:** used to persist the user across different requests  

**express-session:** used to persist the user across different requests  

**express-flash:** used to display messages  

**method-override:** allows to override HTTP methods in the HTML form for Log out button. We replace POST with DELETE  

**nodemon:** to restart the server at each change  

**dotenv:** to store local vaiables