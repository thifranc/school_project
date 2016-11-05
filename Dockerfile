FROM mdillon/postgis:latest

COPY ./matcha_postgres_create.sql /docker-entrypoint-initdb.d/
