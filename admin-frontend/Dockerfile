FROM node:13.12.0-alpine
WORKDIR /app/admin-frontend

COPY package.json package-lock.json ./
RUN npm install 
RUN npm install react-scripts@3.4.1 -g 
COPY . ./
EXPOSE 3001