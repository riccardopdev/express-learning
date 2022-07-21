#### Book App

From Web Dev Simplified tutorials: https://www.youtube.com/playlist?list=PLZlA0Gpn_vH8jbFkBjOuFjhxANC63OmXM

An application built with NodeJS, express and MongoDB.

The MongoDB database is installed locally and requires the installation of MongoDB and mongosh:
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/
https://www.mongodb.com/docs/mongodb-shell/install/

The application allows to create and view authors and books in two different collections in a database called mybrary.

Dependencies:  
**express:**  To create the server  
**ejs:**  Template engine for dynamic pages  
**express-ejs-layouts:**  Allows to split the HTML content in separable reusable sections  
**mongoose:**  Allows to connect to MongoDB and implement queries to the data  
**body-parser:** Allows us to access the body values from req.body  
**multer:** Allows to work with multipart forms (enctype="multipart/form-data") and upload files to the server  
**method-override:** Allows to override GET and POST methods from a form into PUT and DELETE  

Dev dependencies  
**nodemon:**  To automatically restart the express server  
**dotenv:**  To store sensitive data in local variables  