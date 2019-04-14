DROP TABLE if exists users cascade;
DROP TABLE if exists PetOwners cascade;
DROP TABLE if exists Pets cascade;
DROP TABLE if exists Homes cascade;
DROP TABLE if exists Bid cascade;
DROP TABLE if exists History cascade;
DROP TABLE if exists CareTaker cascade;
DROP TABLE if exists Services cascade;
DROP TABLE if exists admins cascade;
drop table if exists review cascade;
drop view if exists owns cascade;
drop view if exists provides cascade;
drop view if exists receives cascade;
drop view if exists issues cascade;
drop view if exists lives CASCADE;
drop view if exists review_caretaker cascade;
drop view if exists review_petowner cascade;

CREATE TABLE Homes (
	id 				serial PRIMARY key,
	address 		VARCHAR(100) not null unique,
	postcode		bigint not null,
	suburb			VARCHAR(100) not null
);


CREATE TABLE users (
	id 					SERIAL primary key,
	name 				text not null,
	email				VARCHAR(100) not null unique,
	password 			text not null,
	lastlogintimestamp	TIMESTAMP not null,
	homeid				serial not null,
	description 		text,
	image 				text not null default 'http://lorempixel.com/400/200/people/',
	FOREIGN key (homeid) REFERENCES homes(id),
	unique(id,name) 
);


CREATE TABLE admins (
	id 			SERIAL PRIMARY KEY,
	name		text not null,
	email		VARCHAR(100) not null unique,
	password 			text not null,
	lastlogintimestamp	TIMESTAMP not null,
	homeid		serial not null references homes(id),
	foreign key (id, name) references users(id,name)
);


CREATE TABLE PetOwners (
	oid				serial primary key,
	owner_name		text not null,
	foreign key (oid, owner_name) references users(id,name) on delete cascade on update cascade
);


CREATE TABLE Pets (
	name				VARCHAR(100) not null,
	weight				smallint not null,
	age					smallint not null,
	breed				VARCHAR(100) not null,
	PetType				VARCHAR(100) not null,
	gender				VARCHAR (100) not null, 
	description			text,
	medical_conditions	text,
	oid					SERIAL not null REFERENCES PetOwners(oid) on delete cascade,
	image1				text not null default 'https://placeimg.com/640/480/animals',
	image2				text not null default 'https://placeimg.com/640/480/animals',
	image3				text not null default 'https://placeimg.com/640/480/animals',
	primary key(name, oid)
);


CREATE TABLE CareTaker (
	cid				SERIAL primary key,
	name 			text not null, 
	PetType			text not null default 'Dog',
	PetSize			smallint not null default 1,
	housingOptions	smallint not null default 1,
	miscOptions		smallint not null default 1,
	NumOfPet		smallint not null default 1,
	foreign key (cid, name) references users(id, name) on delete cascade
);


CREATE TABLE Services (
	Service 		VARCHAR(100) not null,
	StartDate 		DATE not null,
	EndDate 		DATE not null,
	Rate			smallint not null,
	cid				SERIAL not null REFERENCES CareTaker(cid) on delete cascade,
	primary key (cid,service,startdate)
);


CREATE TABLE Bid (
	ServiceStartDate	date not null,
	ServiceEndDate		date not null,
	BidID				SERIAL primary key,
	BidTimestamp		timestamp not null ,
	BidAmount			smallint not null,
	PetName				VARCHAR(100) not null,
	PetOwnerID			SERIAL not null,
	CareTakerID			SERIAL not null,
	service				VARCHAR(100) not null,
	startdate			DATE not null,
	bidrequest			text,
	bidstatus			varchar(20) default 'pending' not null,
	StatusTimestamp 	timestamp not null ,
	foreign key (PetName, petownerid) references pets(name,oid) on delete cascade,
	foreign key (CareTakerID,service,startdate) references services(cid,service,startdate) on delete cascade,
	unique (Petownerid,BidID,CareTakerID,serviceenddate)
);

create table History (
	BidID			Serial not null,
	caretakerid		serial not null,
	petownerid		serial not null,
	isreviewmade	bool not null default False,
	reviewdate		date,
	HistoryID		serial primary key,
	serviceenddate	date not null,
	FOREIGN key (bidid,caretakerid,petownerid,serviceenddate) REFERENCES bid(bidid,caretakerid,petownerid,ServiceEndDate) on delete cascade
);


create table review (
	reviewid 			serial primary key,
	reviewerid			serial not null,
	HistoryID			serial not null,
	ratings				int not null,
	foreign key (historyid) REFERENCES history(historyid) on delete cascade
);


CREATE VIEW provides as 
	select ct.name as caretaker, 
	ct.cid, 
	s.service as service, 
	s.rate
	from services s
	join caretaker ct on ct.cid = s.cid;


CREATE VIEW Owns as 
	select pt.owner_name as owner, 
	p.oid, p.name as petname,
	p.pettype,
	p.breed
	from pets p
	join petowners pt on pt.oid = p.oid;


CREATE VIEW issues as 
	select pt.oid,
	pt.owner_name,
	b.bidamount,
	b.bidid,
	b.bidstatus,
	b.statustimestamp
	from petowners pt
	join bid b on b.petownerid = pt."oid";


CREATE VIEW receives as 
	select ct.name as caretaker, 
	ct.cid,
	b.bidamount,
	b.bidtimestamp,
	b.bidstatus
	from bid b
	join caretaker ct on ct.cid = b.caretakerid;


CREATE view lives AS
	select h.id,
	u.id as userid,
	u.name,
	h.address,
	h.postcode
	from homes h 
	join users u on u.homeid = h.id;

	
create view review_caretaker as 
	select c.cid,
	c."name",
	r.historyid,
	r.ratings
	from review r 
	join caretaker c on c.cid = r.reviewerid;
	

create view review_petowner as 
	select p.oid,
	p.owner_name,
	r.historyid,
	r.ratings
	from review r 
	join petowners p on p.oid = r.reviewerid