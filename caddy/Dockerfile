FROM caddy:2.4.6

# these paths are relative to the project root, not this folder
ADD caddy/Caddyfile /etc/caddy/Caddyfile

# Extract website (avoid ADD: its unpredictable, and seems not to extract on CI/CD server July 2022)
# Note: this does leave behind the extar tar.gz file in a layer, but these files are <1M so acceptable.
RUN mkdir -p /var/www/frontend/
COPY frontend_build.tar.gz /var/www/frontend/
RUN cd /var/www/frontend/ && \
    tar -xzf frontend_build.tar.gz && \
    rm frontend_build.tar.gz

RUN mkdir -p /var/www/admin-frontend/
COPY admin_frontend_build.tar.gz /var/www/admin-frontend/
RUN cd /var/www/admin-frontend/ && \
    tar -xzf admin_frontend_build.tar.gz && \
    rm admin_frontend_build.tar.gz
