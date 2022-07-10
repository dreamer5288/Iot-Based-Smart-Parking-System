CREATE DATABASE sps;
USE sps;

CREATE TABLE auth (
	name VARCHAR(127) NOT NULL,
    email VARCHAR(127) NOT NULL,
    password VARCHAR(127) NOT NULL,
    p_code INT NOT NULL,
    d_amount INT NOT NULL,
    start VARCHAR(45) NOT NULL,
    end VARCHAR(45) NOT NULL,
    id INT NOT NULL,
    PRIMARY KEY(email));
    
CREATE TABLE parking (
	loc VARCHAR(127) NOT NULL,
    code INT NOT NULL,
    slot INT NOT NULL,
    price VARCHAR(127) NOT NULL,
    stauts INT NOT NULL,
    et VARCHAR(45) NOT NULL,
    sesnor INT NOT NULL,
    PRIMARY KEY(code));

INSERT INTO auth VALUES ('admin', 'admin@gmail.com', '$2b$10$Y9zqlh049bGRSa5hgPChwO/X/3Cn41.1X2kvWr9qdW1sqLdeIx4M.', '0', '0', '0', '0', '1');
INSERT INTO parking VALUES ('mall', '1', '1', '100', '4', '0', '0');
