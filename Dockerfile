#Download Node Alpine image
FROM node:20.1.0-alpine As build

#Setup the working directory
WORKDIR /usr/src/app

#Copy package.json
COPY package.json package-lock.json ./

#Install dependencies
RUN npm install

#Copy other files and folder to working directory
COPY . .

#Build Angular application in PROD mode
RUN npm run build

#Download NGINX Image
FROM nginx:1.25.0-alpine

#Copy built angular files to NGINX HTML folder
COPY --from=build /usr/src/app/dist/Mobalisator-5000/ /usr/share/nginx/html