-- Trigger on addition of pet
CREATE OR REPLACE FUNCTION mustBe_petOwner()
RETURNS TRIGGER as $$
DECLARE count numeric; name text;
begin
SELECT COUNT (*) INTO count FROM petowners
WHERE NEW.oid = petowners.oid;
IF count > 0 THEN
RETURN NEW;
else
select users.name into name
from users
where users.id = new.oid;
insert into petowners values (new.oid, name);
RETURN NEW;
END IF;
END;
$$ LANGUAGE plpgsql;

drop trigger if exists add_pets on pets;
create TRIGGER add_pets
BEFORE INSERT
ON pets
FOR EACH ROW
EXECUTE PROCEDURE mustBe_petOwner();

-- Trigger on deletion of pet
CREATE OR REPLACE FUNCTION remove_petOwner()
RETURNS TRIGGER as $$
DECLARE count numeric; currOid integer;
begin
currOid:=old.oid;
SELECT COUNT (*) INTO count FROM pets
group by OID
having oid = OLD.oid;
IF count > 0 THEN
RETURN OLD;
else
delete from petowners 
where petowners.oid= currOid;
RETURN OLD;
END IF;
END;
$$ LANGUAGE plpgsql;

drop trigger if exists delete_pets on pets;
create TRIGGER delete_pets
AFTER DELETE
ON pets
FOR EACH ROW
EXECUTE PROCEDURE remove_petOwner();


-- Trigger on addition of service
CREATE OR REPLACE FUNCTION mustBe_careTaker()
RETURNS TRIGGER as $$
DECLARE count numeric; name text;
begin
SELECT COUNT (*) INTO count FROM caretaker
WHERE NEW.cid = caretaker.cid;
IF count > 0 THEN
RETURN NEW;
else
select users.name into name
from users
where users.id = new.cid;
insert into caretaker values (new.cid, name);
RETURN NEW;
END IF;
END;
$$ LANGUAGE plpgsql;

drop trigger if exists add_service on services;
create TRIGGER add_service
BEFORE INSERT
ON services
FOR EACH ROW
EXECUTE PROCEDURE mustBe_careTaker();


-- Trigger on deletion of service
CREATE OR REPLACE FUNCTION remove_careTaker()
RETURNS TRIGGER as $$
DECLARE count numeric; currCid integer;
begin
currCid:=old.cid;
SELECT COUNT (*) INTO count FROM services
group by cid
having cid = OLD.cid;
IF count > 0 THEN
RETURN OLD;
else
delete from caretaker
where caretaker.cid= currCid;
RETURN OLD;
END IF;
END;
$$ LANGUAGE plpgsql;

drop trigger if exists delete_service on services;
create TRIGGER delete_service
AFTER DELETE
ON services
FOR EACH row
WHEN (pg_trigger_depth() = 0)
EXECUTE PROCEDURE remove_careTaker();

-- Trigger on insertion of service
CREATE OR REPLACE FUNCTION check_date()
RETURNS TRIGGER as $$
DECLARE count numeric; 
newStartDate date; newEndDate date; initialStartDate date; initialenddate date;
begin
newStartDate:=new.startDate;
newEndDate:=new.endDate;
with allServices as 
( select * 
  from services
  where cid = new.cid
)
SELECT count(*) into count 
from allServices S
where S.service=new.service and  
(S.startdate, S.enddate + interval '1 day') OVERLAPS
(newStartDate, newEnddate + interval '1 day');
if count <= 0 then return new;
else 
SELECT startdate into initialstartdate
from allServices S
where S.service=new.service and  
(S.startdate, S.enddate + interval '1 day') OVERLAPS
(newStartDate, newEnddate + interval '1 day')
order by startdate asc
limit 1;
if newstartdate < initialstartdate then initialstartdate:=newstartdate;
end if;
SELECT enddate into initialenddate
from allServices S
where S.service=new.service and  
(S.startdate, S.enddate + interval '1 day') OVERLAPS
(newStartDate, newEnddate + interval '1 day')
order by enddate desc
limit 1;
if initialenddate < newenddate then initialenddate:=newenddate;
end if;
delete 
from allServices S
where S.service=new.service and  
(S.startdate, S.enddate + interval '1 day') OVERLAPS
(newStartDate, newEnddate + interval '1 day');
insert into services values (new.service, initialstartdate, initialenddate, new.rate, new.cid);
return null;
end if;
end;
$$ LANGUAGE plpgsql;



drop trigger if exists update_service on services;
create TRIGGER update_service
BEFORE insert 
ON services
FOR EACH row
WHEN (pg_trigger_depth() = 0)
EXECUTE PROCEDURE check_date();

