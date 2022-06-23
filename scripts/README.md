# Scripts for deployment

## Initial depolyment

* On a fresh Ubuntu 22.04 server, log in as `root` and create the file `/root/setup_production.sh` and copy the contents of the `setup_production.sh` file into this file:  
  `nano /root/setup_production.sh`
- Run the script  
  `chmod +x /root/setup_production.sh`  
  `./setup_production.sh`
  - Script will randomly create some passwords.
  - Tell the script the URL for this server (press ENTER if just using locally)
  - Script will allow you to edit the `.env` file to configure username and password for email account and Views.
  - Script will link the `update.sh` script into the `/root/` folder for future updates.

## Update

To update a running server, log in as `root` and execute the `/root/update.sh` script.

## Release Process

When a new version of the server and front-end are released to the `production` branch the CI/CD pipeline automatically builds and uploads new Docker images to Docker Hub for the backend and the frontend (has the reverse proxy server Caddy and our front-end code). 

Uploaded images are tagged with both `latest` and commit date/SHA (such as `v2022-12-31.abcd5678`). This allows the scripts to clone/pull the repo and get the exact built images corresponding to that release.