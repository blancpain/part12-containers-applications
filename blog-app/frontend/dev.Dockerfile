FROM node:16

WORKDIR /usr/src/app

# COPY entrypoint.sh /entrypoint.sh
# RUN chmod +x /entrypoint.sh

COPY . .

RUN npm install

ENV VITE_BACKEND_URL=/api

# ENTRYPOINT ["/entrypoint.sh"]

CMD ["npm", "run", "dev"]