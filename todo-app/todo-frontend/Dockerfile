FROM node:16 as build-stage
WORKDIR /usr/src/app

COPY . .

RUN npm ci
ENV REACT_APP_BACKEND_URL='http://localhost:8080/api'

# run tests
RUN CI=true npm test
RUN npm run build

# copy to nginx for serving static files
FROM nginx:1.20.1
COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html
