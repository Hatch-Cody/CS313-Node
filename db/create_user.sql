DROP TABLE users;
CREATE TABLE users ( id SERIAL PRIMARY KEY NOT NULL, username VARCHAR(50) NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, time_json VARCHAR, time_in VARCHAR, time_out VARCHAR );


DROP TABLE hours;
CREATE TABLE hours ( user_id INTEGER,time_json VARCHAR,FOREIGN KEY (user_id) REFERENCES users (id) );


SELECT * FROM users;

