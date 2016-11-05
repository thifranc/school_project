# school_project

Install node_modules : ```npm i```

Install semantic UI in ```./public/semantic``` (should create src and tasks directories)  
Then got to ./public/semantic and run ```gulp build``` (should create dist directory)

Install Docker and DB :

```docker build --tag pg_matcha_img .```

```docker run -p 5432:5432 --name pg_matcha -e POSTGRES_PASSWORD=lol -d pg_matcha_img```

Launch project

```./node_modules/nodemon/bin/nodemon.js appli.js```
