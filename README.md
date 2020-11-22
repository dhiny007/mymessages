# MyMessages

## **Instructions**

* Open the command prompt by running the command **cmd**, and then navigate to the folder named **Foodkart** through command prompt. Once done, run the command **ng serve** to start the frontend.
* Also start the backend server in the same place by using the command **npm run startServer**.
* Connect the backend to the database through command prompt by using the command **"<THE_PATH_OF_MONGOD.EXE>" --dbpath="<THE_DATABASE_PATH>"**. An example of how the command will look like: 
"C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe" --dbpath="c:\Mongo Database Details\data\node-angularDB".
* The backend connection to the database may fail at times. In such cases, just restart the backend server.
* Once the frontend,backend and database are up and running, navigate to the URL **http://localhost:4200/** to view the MyMessages application.

## **Technologies**

* This application is built using Angular for frontend, Node JS for backend and MongoDB for Database. 
* The programming languages used are Typescript,Javascript, HTML and CSS. This application also makes good use of the angular material design.

## **Features**

* Create a new account by **signing up** and once this is done, you will be able to login into the application using the credentials anytime.
* Once logged in, you will see a list of various posts added by different users. Clicking on a particular post will expand the post and show more details. Also you will find two tabs in the navigation bar,namely New Post and Logout.
* Selecting the **New Post** tab will allow you to create a new post and this will be added to the list of posts.
* **Clicking on a post you added** will show the post in detail and also **give you the option to edit and delete the post**. 
* However **you will not be able to edit or delete posts added by other people**. You will only be able to see the posts added by other people in detail.
* Each **login session** will be **valid only upto 1 hour**. After 1 hour of a single user login session, he/she will be **automatically logged out**.
* Clicking on **Logout** will log you out of your current login session instantly.



