# Baytree Project

The Baytree App is designed to facilitate the tracking of each volunteers' progress with each client.

## Run Using Docker

1. Install Docker: https://www.docker.com/get-started
2. Create a file named `.env` (for environment variables) in the same directory as `docker-compose.yml`. It should look like this:

```
SECRET_KEY=something_random

MYSQL_USER=dbuser
MYSQL_PASSWORD=something_random

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=the_account@gmail.com
EMAIL_PASSWORD=the_password

VIEWS_USERNAME=the_username
VIEWS_PASSWORD=the_password
```

Replace instances of `something_random` with random strings, and `the_username` and `the_password` with appropriate credentials (which you can obtain by talking to someone on the team).

3. Install frontend dependencies:

```
docker-compose run --rm frontend npm install
docker-compose run --rm admin-frontend npm install
```

4. Then, run the application: `docker-compose up`

5. The first time you run the app, you'll need to run migrations and create a superuser (while the application is running):

```
docker exec baytree_server python manage.py migrate
docker exec -it baytree_server python manage.py createsuperuser
```

6. You can use `Ctrl+C` to stop running the application

<br>

If you want to open a terminal within an app use the command: `docker exec -it [container-name] bash`

## Backend - Baytree_App: 

### Install mySQL Server and Library
sudo apt install <br>
libmysqlclient-dev <br>
mysql-server <br>
mysql-client <br>
For Windows: use the MySQL Community installer to install MySQL Server, WorkBench, and the Python Connector: <br>
https://dev.mysql.com/downloads/windows/installer/8.0.html

### Install Python Library
pip3 install -r requirements.txt


### Initialize mySQL Database
Create Database Baytree default character set 'utf8'; <br>
CREATE USER 'Baytree'@'localhost' IDENTIFIED BY 'Baytree123';<br>
GRANT ALL PRIVILEGES ON Baytree.* TO 'Baytree'@'localhost' WITH GRANT OPTION;<br>
FLUSH PRIVILEGES


### Make Migrations
python3 manage.py makemigrations <br>
python3 manage.py migrate


### Create Superuser
python3 manage.py createsuperuser <br>
(enter your email and password) 

### Provide .env file with secrets
Place an .env file with the appropriate secrets used in mentorsupport/baytree_app/development_settings.py & production_settings.py at mentorsupport/baytree_app.

### Start Django
python3 manage.py runserver


### Visit Admin Site
http://127.0.0.1:8000/admin/ <br>
enter superuser credentials in step 5


<br>
<br>

## Frontend - Getting Started with a React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the frontend folder, there is a variable REACT_APP_RESOURCES_URL in both .env.developement and .env.production
Ask a previous developer for a link, to be placed into this variable, so you can have access to the resource page.

Then in the frontend directory, you can run:

### `npm install`

Installs any necessary dependencies for the react application. This command must be run first before the ones below.

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


## Mobile Application

### Technical Requirements

● Flutter SDK - then run flutter doctor and update your path <br>
● Xcode <br>
● Android Studio <br>

### Run Application 

Run the file "prj\mobile\lib\main.dart"

### TEMPORARILY Run Application

In the mobile folder run the following commands:

flutter pub get

After setting up the emulator run:

flutter run --no-sound-null-safety 


## Admin Portal

In the admin-frontend folder:

FIRST TIME RUN: Install all necessary packages with npm install

Execute npm run dev to start running a development server on localhost:3001

Execute npm run build and then npm run start to build for production and run on localhost:3001

To run within Docker, see instructions above

Navigate to http://localhost:3001/admin in your browser and use your superuser credentials (or any admin user credentials) to log in