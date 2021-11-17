# Baytree Project

The Baytree App is designed to facilitate the tracking of each volunteers' progress with each client.

## Members  (Team Jupiter): 

<dl>
<dt>Scrum Master:</dt>
<dd>Yanze Zheng</dd>

<dt>Product Owner:</dt>
<dd>Shubham Joon</dd>

<dt>Repo Manager:</dt> 
<dd>Ashvinder Grewal</dd>

<dt>Team Members:</dt> 
<dd>Jake Kim</dd> 
<dd>Herman Luo</dd>
<dd>Jasim Khan Pathan</dd>
<dd>Jack Ren</dd>
</dl>

<br>

# How to use Docker to run the app:


1. Install Docker at this link: https://www.docker.com/get-started
2. After Docker is installed, navigate to the directory containing the ***docker-compose.yaml*** file
3. Run:

        $ docker-compose build

4. To start the application, run: 

        $ docker-compose up -d

5. The stop the app, run:
        
        $ docker-compose down

<br>

If you want to open a terminal within an app use the command: 

        $ docker exec -it [container-id] bash

# Backend - Baytree_App: 

### Install mySQL Server and Library
sudo apt install <br>
libmysqlclient-dev <br>
mysql-server <br>
mysql-client <br>


### Install Python Library
pip3 install -i requirements.txt


### Initialize mySQL Database
Create Database Baytree default character set 'utf8'; <br>
Grant all privileges on Baytree.* to 'Baytree'@localhost identified by 'Baytree123';


### Make Migrations
python3 manage.py makemigrations worklogs <br>
python3 manage.py migrate


### Create Superuser
python3 manage.py createsuperuser <br>
(enter your email and password) 


### Start Django
python3 manage.py runserver


### Visit Admin Site
http://127.0.0.1:8000/admin/ <br>
enter superuser credentials in step 5


<br>
<br>

# Frontend - Getting Started with a React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.


<br>
<br>
# 


# Mobile Application

### Technical Requirements

● Flutter SDK - then run flutter doctor and update your path <br>
● Xcode <br>
● Android Studio <br>

### Run Application 

Run the file "prj\mobile\lib\main.dart"

