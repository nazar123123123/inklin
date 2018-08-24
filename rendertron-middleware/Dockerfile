# build environment
FROM node 
RUN mkdir /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install -g -s --no-progress yarn
RUN yarn add express rendertron-middleware 
COPY index.js /app 

EXPOSE 80
CMD ["node", "index.js"]