FROM node:14-alpine

# Set working directory
WORKDIR /var/www

RUN npm install -g @ionic/cli