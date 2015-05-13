CREATE DATABASE slidifier;

CREATE TABLE slidifier.slideshows (
	id varchar(500) NOT NULL PRIMARY KEY,
	admin_key varchar(500) NOT NULL,
	src longtext
);

CREATE TABLE images (
id VARCHAR(500) NOT NULL PRIMARY KEY,
bytes MEDIUMBLOB NOT NULL;
);
