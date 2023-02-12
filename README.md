# Baytree Project

The Baytree App is designed to facilitate the tracking of each volunteers' progress with each client.

## Run Using Docker

### Setup

1. Install [Docker](https://www.docker.com/get-started)
2. Create a file named `.env` (for environment variables) in the same directory as `docker-compose.yml`. It should look like this:<br>

   ```text
   SECRET_KEY=something_random

   MYSQL_USER=dbuser
   MYSQL_PASSWORD=something_random

   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=the_account@gmail.com
   EMAIL_PASSWORD=the_password

   VIEWS_USERNAME=the_username
   VIEWS_PASSWORD=the_password

   CELERY_BROKER_URL=redis://redis:6379
   CELERY_RESULT_BACKEND=redis://redis:6379
   AWS_ACCESS_KEY_ID= {your_id}
   AWS_SECRET_ACCESS_KEY= {your_key}
   AWS_DEFAULT_REGION= us-east-1

   GRAFANA_LOGGING_URL=logs-prod3.grafana.net
   GRAFANA_USER=319402
   GRAFANA_API_KEY={your_Grafana_API_key}
   ```

   According to Google's new less-secure app policy, the gmail account must have 2-factor authentication enabled and an "app password" must be created which can be used with Django.

   Replace instances of `something_random` with random strings, and `the_username` and `the_password` with appropriate credentials (which you can obtain by talking to someone on the team).

   You can get the `your_Grafana_API_key` by talking to someone on the team.

   You can get the `your_id` and `your_key` by talking to someone on the team.

3. Install frontend dependencies (if running in Docker - see frontend section if not):

   ```bash
   docker compose run --rm frontend npm install
   docker compose run --rm admin-frontend npm install
   ```

4. You need to build the docker compose first or when you updated the dependencies

   ```bash
   docker compose build
   ```

5. Then, run the application:

   ```bash
   docker compose up
   ```

6. Run migrations and create a superuser (while the application is running):

   ```bash
   docker exec baytree_server python manage.py migrate
   docker exec -it baytree_server python manage.py createsuperuser
   ```
7. install default preference:

   ```bash
   docker exec baytree_server python manage.py loaddata defaultPreferences.json
   docker exec baytree_server python manage.py loaddata goalCategories
   docker exec baytree_server python manage.py loaddata ukHolidays
   ```

8. You can use `Ctrl+C` to stop running the application

### Run Locally

- To run the entire application: `docker compose up`
- To run only the backend + database: `docker compose up server`
- If new backend packages have been installed, run `docker compose build` prior to running the `up` commands above
- If new frontend packages have been installed, run the following prior to running the `up` commands above:

   ```bash
   docker compose run --rm frontend npm install
   docker compose run --rm admin-frontend npm install
   ```

### Commands Inside Container

If you want to open a terminal within a container, use the command:

```bash
docker exec -it [container-name] bash
```

## Backend

The recommended way to run the backend is within Docker (using the instructions above).

### Migrations

After a model change, run the following to make database migrations:

```bash
docker exec baytree_server python manage.py makemigrations
```

To migrate your database, either because you or someone else made database migrations, run:

```bash
docker exec baytree_server python manage.py migrate
```

To install default preference:

   ```bash
   docker exec baytree_server python manage.py loaddata defaultPreferences.json
   docker exec baytree_server python manage.py loaddata goalCategories
   docker exec baytree_server python manage.py loaddata ukHolidays

   ```

### Creating a User

You can create a super (admin) user by running:

```bash
docker exec -it baytree_server python manage.py createsuperuser
```

### Starting Cronjobs for storing active users

The project uses Celery to run background tasks. To start up Celery use the following command:

```
docker exec baytree_server python manage.py start_celery
```

To stop the Celery worker, you should use the following command:

```
docker exec baytree_server python manage.py stop_celery
```

### Install backend Packages

You can install a new package by adding it to `requirements.txt` and then running `docker compose build` while the application isn't running.

## Frontends

### Install Frontend Packages

Run these commands to manage the depenedencies for containers `baytree_frontend` and `baytree_admin_frontend`

- Install packages as build dependenency, with the application running:

   ```bash
   docker exec [container_name] npm install [package_1] [package_2] ...

   # Shorthand syntax
   docker exec [container_name] npm i [package_1] [package_2] ...
   ```

- Install packages as a develeper dependency, run the commands above with `--save-dev` tag:

   ```bash
   docker exec [container_name] npm install --save-dev [package_1] [package_2] ...

   # Shorthand syntax
   docker exec [container_name] npm i -D [package_1] [package_2] ...
   ```

- Unistall a package, with the application running

   ```bash
   docker exec [container_name] npm uninstall [package_1] [package_2] ...
   ```

### Run Outside of Docker

The frontends can either be run in Docker (using the instructions above) or outside of Docker. Due to the large number of files in `node_modules`, file system performance may be better outside of Docker. To run outside of Docker:

1. Install [Node.js](https://nodejs.org/en/)
2. Run `npm install` in both frontend folders
3. Use the command `docker compose up server` to run only the backend + database
4. Use the command `docker compose up mock-views-app` to run the node server for mocking Views APIs.
5. Use the following commands to run the frontends:
   - frontend: `npm start`
   - admin-frontend: `npm run dev`

## Admin Portal

Navigate to <http://localhost:3001/admin> in your browser and use your superuser credentials (or any admin user credentials) to log in

## Deployment

For information on deployment, see `README.md` in `scripts/` folder.
