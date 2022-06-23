# Baytree Project

The Baytree App is designed to facilitate the tracking of each volunteers' progress with each client.

## Run Using Docker

### Setup

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

According to Google's new less-secure app policy, the gmail account must have 2-factor authentication enabled and an "app password" must be created which can be used with Django.

Replace instances of `something_random` with random strings, and `the_username` and `the_password` with appropriate credentials (which you can obtain by talking to someone on the team).

3. Install frontend dependencies (if running in Docker - see frontend section if not):

```
docker compose run --rm frontend npm install
docker compose run --rm admin-frontend npm install
```

4. Then, run the application: `docker compose up`

5. Run migrations and create a superuser (while the application is running):

```
docker exec baytree_server python manage.py migrate
docker exec -it baytree_server python manage.py createsuperuser
```

6. You can use `Ctrl+C` to stop running the application

### Run Locally

- To run the entire application: `docker compose up`
- To run only the backend + database: `docker compose up server`
- If new backend packages have been installed, run `docker compose build` prior to running the `up` commands above
- If new frontend packages have been installed, run the following prior to running the `up` commands above:

```
docker compose run --rm frontend npm install
docker compose run --rm admin-frontend npm install
```

### Commands Inside Container

If you want to open a terminal within a container, use the command: `docker exec -it [container-name] bash`

<br>

## Backend

The recommended way to run the backend is within Docker (using the instructions above).

### Migrations

After a model change, run the following to make database migrations:

```
docker exec baytree_server python manage.py makemigrations
```

To migrate your database, either because you or someone else made database migrations, run:

```
docker exec baytree_server python manage.py migrate
```

### Creating a User

You can create a super (admin) user by running:

```
docker exec -it baytree_server python manage.py createsuperuser
```

### Install Package

You can install a new package by adding it to `requirements.txt` and then running `docker compose build` while the application isn't running.

<br>

## Frontends

### Install Package

To install a package, with the application running:

- frontend: `docker exec baytree_frontend npm install [package name]`
- admin-frontend: `docker exec baytree_admin_frontend npm install [package name]`

### Run Outside of Docker

The frontends can either be run in Docker (using the instructions above) or outside of Docker. Due to the large number of files in `node_modules`, file system performance may be better outside of Docker. To run outside of Docker:

1. Install [Node.js](https://nodejs.org/en/)
2. Run `npm install` in both frontend folders
3. Use the command `docker compose up server` to run only the backend + database
4. Use the following commands to run the frontends:
   - frontend: `npm start`
   - admin-frontend: `npm run dev`

<br>

## Mobile Application

Development on the mobile application ceased around summer 2021.

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

Navigate to http://localhost:3001/admin in your browser and use your superuser credentials (or any admin user credentials) to log in


## Deployment

For information on deployment, see `README.md` in `scripts/` folder.