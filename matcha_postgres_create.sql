CREATE DATABASE matcha;

\c matcha

CREATE EXTENSION postgis;
CREATE TYPE looking AS ENUM ('men', 'women', 'both');
CREATE TYPE sex AS ENUM ('men', 'women');
CREATE TYPE notif_type AS ENUM ('like', 'unlike', 'block', 'unblock', 'view', 'match');

CREATE TABLE "users" (
	"id" serial NOT NULL,
	"nom" varchar NOT NULL,
	"prenom" varchar NOT NULL,
	"age" int2 NOT NULL,
	"login" varchar NOT NULL UNIQUE,
	"mail" varchar NOT NULL UNIQUE,
	"passwd" varchar NOT NULL,
	"tmp_passwd" varchar DEFAULT NULL,
	"sex" sex NOT NULL,
	"looking" looking NOT NULL DEFAULT 'both',
	"bio" varchar,
	"last_log" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	"pop" int DEFAULT 0,
	"geom" geometry NOT NULL,
	CONSTRAINT user_pk PRIMARY KEY ("id")
	) WITH (
	OIDS=FALSE
);



CREATE TABLE "img" (
	"user" int NOT NULL,
	"path" varchar NOT NULL,
	"main" BOOLEAN DEFAULT NULL,
	CONSTRAINT img_id FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE CASCADE
	) WITH (
	OIDS=FALSE
);



CREATE TABLE "likes" (
	"dest" int NOT NULL,
	"src" int NOT NULL,
	"date" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT likes_src FOREIGN KEY ("src") REFERENCES "users"("id") ON DELETE CASCADE,
	CONSTRAINT likes_dest FOREIGN KEY ("dest") REFERENCES "users"("id") ON DELETE CASCADE
	) WITH (
	OIDS=FALSE
);



CREATE TABLE "blocks" (
	"dest" int NOT NULL,
	"src" int NOT NULL,
	"date" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT blocks_src FOREIGN KEY ("src") REFERENCES "users"("id") ON DELETE CASCADE,
	CONSTRAINT blocks_dest FOREIGN KEY ("dest") REFERENCES "users"("id") ON DELETE CASCADE
	) WITH (
	OIDS=FALSE
);



CREATE TABLE "views" (
	"dest" int NOT NULL,
	"src" int NOT NULL,
	"date" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT views_src FOREIGN KEY ("src") REFERENCES "users"("id") ON DELETE CASCADE,
	CONSTRAINT views_dest FOREIGN KEY ("dest") REFERENCES "users"("id") ON DELETE CASCADE
	) WITH (
	OIDS=FALSE
);



CREATE TABLE "msgs" (
	"dest" int NOT NULL,
	"src" int NOT NULL,
	"date" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	"value" varchar NOT NULL,
	CONSTRAINT msgs_src FOREIGN KEY ("src") REFERENCES "users"("id") ON DELETE CASCADE,
	CONSTRAINT msgs_dest FOREIGN KEY ("dest") REFERENCES "users"("id") ON DELETE CASCADE
	) WITH (
	OIDS=FALSE
);



CREATE TABLE "notifs" (
	"id" serial NOT NULL,
	"dest" int NOT NULL,
	"src" int NOT NULL,
	"src_login" varchar NOT NULL,
	"type" notif_type NOT NULL,
	"date" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT notifs_src FOREIGN KEY ("src") REFERENCES "users"("id") ON DELETE CASCADE,
	CONSTRAINT notifs_dest FOREIGN KEY ("dest") REFERENCES "users"("id") ON DELETE CASCADE,
	CONSTRAINT notifs_id PRIMARY KEY ("id")
	) WITH (
	OIDS=FALSE
);



CREATE TABLE "user_tags" (
	"user" int NOT NULL,
	"tags" varchar NOT NULL,
	CONSTRAINT tag_id FOREIGN KEY ("user") REFERENCES "users"("id") ON DELETE CASCADE
	) WITH (
	OIDS=FALSE
);



CREATE TABLE "tags" (
	"id" serial NOT NULL,
	"name" varchar NOT NULL UNIQUE,
	CONSTRAINT pk PRIMARY KEY ("id")
	) WITH (
	OIDS=FALSE
);


CREATE OR REPLACE FUNCTION notif_emit() RETURNS trigger AS $$
DECLARE
BEGIN
	PERFORM pg_notify('my-channel',
					'{"src":' || NEW.src
					|| ',"dest":' || NEW.dest
					|| ',"type":"' || NEW.type
					|| '","src_login":"' || NEW.src_login
					|| '","id":' || NEW.id || '}');
	RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notif AFTER INSERT ON notifs
FOR EACH ROW EXECUTE PROCEDURE notif_emit();
