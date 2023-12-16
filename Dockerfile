FROM node:14
WORKDIR /app
# копирование файлов package.json и package-lock.json
COPY package*.json ./ 
RUN npm install
COPY . .
# уменьшение количества слоев
RUN npm run build
# исключение ненужных файлов из образа
COPY .dockerignore .dockerignore
# установка NODE_ENV в production для Express-а
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server"]