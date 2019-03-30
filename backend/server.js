let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
let cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');


const PORT = 3001;
let app = express();

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '*', //TO REPLACE
  port: 5432,
});

function rollback(client) {
    client.query('ROLLBACK', function() {
        client.end();
    });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

app.use(morgan('dev'));

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST,DELETE")
  next();
})

app.post('/user/profile', async (request, response) => {
  const { email } = request.body;

  try {
    const table = await pool.query(`
    SELECT *,
    CASE WHEN USERS.ID IN (SELECT OID FROM PETOWNERS) THEN 'Petowner' ELSE 'Caretaker' END AS USERTYPE
    FROM USERS
    WHERE EMAIL=$1
  `, [email])

    return response.status(200).send({
      status: "success", data: {
        name: table.rows[0].name, email: table.rows[0].email,
        type: table.rows[0].usertype, id: table.rows[0].id
      }
    })
  } catch (e) {
    return response.status(400).send(e);
  }
})

app.post('/user/petowner', async (request, response) => {
  const { id } = request.body;

  try {
    const table = await pool.query(`
    SELECT *
    FROM PETOWNERS LEFT OUTER JOIN PETS ON PETOWNERS.OID=PETS.OID
    WHERE PETOWNERS.OID=$1
    `, [id])

    return response.status(200).send({ status: "success", data: { info: table.rows } })
  } catch(e) {
    return response.status(400).send(e);
  }
})

app.post('/user/caretaker', async (request, response) => {
  const { id } = request.body;

  try {
    const table = await pool.query(`
   SELECT *
   FROM CARETAKER LEFT OUTER JOIN SERVICES ON CARETAKER.CID = SERVICES.CID
   WHERE CARETAKER.CID=$1
    `, [id])

    return response.status(200).send({ status: "success", data: { info: table.rows } })
  } catch(e) {
    return response.status(400).send(e);
  }
})

app.post('/login', (request, response) => {
  const { email, password } = request.body;

  pool.connect((err, db, done) => {
    if (err) {
      return response.status(400).send(err);
    }

    db.query(`
      SELECT * FROM USERS
      WHERE EMAIL=$1
    `, [email], (err, table) => {
        if (err) {
          return response.status(400).send(err);
        }

        if (table.rows.length < 1) {
          return response.status(403).send({ status: "failed", message: "No user found" })
        }

        if (table.rows[0].password === password) {
          console.log("success!")
          return response.status(200).send({ status: "success" });

        } else {
          return response.status(403).send({ status: "failed", message: "Wrong username/password" })
        }
      })
  })
});


app.post('/signup', function(request, response) {
  console.log(request.body);
  var name = request.body.username;
  var email = request.body.email;
  var password = request.body.password;
  var roles = request.body.role;
  var hashedPw, id;

  pool.connect((err, db, done) => {
    if(err) {
      return response.status(400).send(err);
    }
    bcrypt
    .hash(password, 10)
    .then(hash => {
      console.log(`Hash: ${hash}`);
      hashedPw=hash;
      db.query('BEGIN', function(err) {
        if(err) {
          console.log('Problem starting transaction', err);
          response.status(400).send(err);
          return rollback(db);
        }
        db.query(`
          INSERT INTO USERS(name, email, password)
          VALUES($1, $2, $3) RETURNING id`, [name, email, hashedPw], (err, result) => {
          if (err) {
            response.status(400).send(err);
            return rollback(db);
          }
            id = result.rows[0].id;
            console.log("i have been inserted into users");
            if (roles.includes("Caretaker")) {
              db.query(`
                INSERT INTO CARETAKER(cid, name, Preference, Description)
                VALUES($1, $2, $3, $4)`, [id, name, "hi", "hi2"], (err, result) => {
                  if (err) {
                    console.error(err);
                    return rollback(db);
                  }
              })
            }
              if (roles.includes("Pet Owner")) {
                db.query(`
                  INSERT INTO PETOWNERS (oid, owner_name, description, numofpets)
                  VALUES($1, $2, $3, $4)`, [id, name, "hi", 1], (err, result) => {
                    if (err) {
                      console.error(err);
                      return rollback(db);
                    }
                    })
              }
              db.query('COMMIT', (err) => {
                db.end.bind(db);
                if (err) {
                  console.error('Error committing transaction', err.stack)
                }
                response.cookie('username', 'Flavio');
                response.status(200).send({id: id});
              })
              })
            })
          })
        .catch(err => console.error(err.message));
          })

      })



app.post('/addpet', function(request, response) {
  var petname = request.body.petname;
  var petage = request.body.petage;
  var petsize = request.body.petsize;
  var petgender = request.body.petgender;
  var pettype = request.body.pettype;
  var petbreed = request.body.petbreed;
  var petdesc = request.body.petdesc;
  var petmed = request.body.petmed;
  var petoid = 255;
  let values = [petname, petage, petgender, pettype, petbreed, petdesc, petmed, petoid];
  console.log("i am here in serverjs")
  pool.connect((err, db, done) => {
    if(err) {
      return response.status(400).send(err);
    }
    else {
      db.query(`
        INSERT INTO PETS(name, weight, age, breed, typeofpet, gender, descrip, med, oid)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [petname, petsize, petage, petbreed, pettype, petgender, petdesc, petmed, petoid], (err, table) => {
        done();
        if (err) {
          console.log(err)
          return response.status(400).send(err);
        }
        else {
          console.log("i added a new pet");
          response.status(200).send({message:"new pet added"});
        }
      })
    }
  })
})

app.post('/addbid', function(request, response) {
  var bidstartdate = request.body.bidstartdate;
  var bidenddate = request.body.bidenddate;
  var bidtimestamp = request.body.bidtimestamp;
  var bidamt = request.body.bidamt;
  var bidpet = request.body.bidpet;
  var bidowner = request.body.bidowner;
  var bidsitter = request.body.bidsitter;
  var bidservice = request.body.bidservice;
  var bidreq = request.body.bidreq;
  let values = [bidstartdate, bidenddate, bidtimestamp, bidamt, bidpet, bidowner, bidsitter, bidservice, bidreq];
  console.log("i am here in serverjs")
  pool.connect((err, db, done) => {
    if(err) {
      return response.status(400).send(err);
    }
    else {
      db.query(`
        INSERT INTO BID(BidStartDate, BidEndDate, BidTimestamp, BidAmount, PetID, PetOwnerID, CareTakerID, ServiceID, bidrequest)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [bidstartdate, bidenddate, bidtimestamp, bidamt, bidpet, bidowner, bidsitter, bidservice, bidreq], (err, table) => {
        done();
        if (err) {
          console.log(err)
          return response.status(400).send(err);
        }
        else {
          console.log("i added a new bid");
          response.status(200).send({message:"new bid added"});
        }
      })
    }
  })
})

app.post('/getCaretakers', function(request, response) {
  var service = request.body.service;
  var pettype = request.body.pettype;
  var petsize = request.body.petsize;
  var numofpet = request.body.numofpet;
  var marks = request.body.marks;
  var housingopt = request.body.housingopt;
  var miscopt = request.body.miscopt;
  var startdate = request.body.startdate;
  var enddate = request.body.enddate;
  console.log(request.body)
  pool.connect((err, db, done) => {
    if(err) {
      return response.status(400).send(err);
    } else {
      db.query(`SELECT distinct * from caretaker natural join services
                where service = $1 and PetType = $2 and PetSize = $3
                and NumOfPet >= $4 and rate <= $5
                and housingOptions = $6
                and miscOptions = $7
                and StartDate <= $8
                and EndDate >= $9`, [service, pettype, petsize, numofpet, marks, housingopt, miscopt, startdate, enddate], function(err, table) {
        done();
        if (err) {
          return response.status(400).send(err);
        }
        else {
          return response.status(200).send(table.rows);
        }
      })
    }
  })
});

app.get('/getPendingBids', function(request, response) {
  pool.connect((err, db, done) => {
    if(err) {
      return response.status(400).send(err);
    } else {
      db.query("SELECT * from Services S inner join (PetOwners inner join (Bid B inner join Pets P on B.PetID = P.PetID) B2 on PetOwners.oid = B2.PetOwnerID) P2 on S.serviceid = P2.ServiceID where bidstatus = 'pending' ", function(err, table) {
        done();
        if (err) {
          return response.status(400).send(err);
        }
        else {
          return response.status(200).send(table.rows);
        }
      })
    }
  })
});

app.get('/getUpcomingBids', function(request, response) {
  pool.connect((err, db, done) => {
    if(err) {
      return response.status(400).send(err);
    } else {
      db.query("SELECT * from Services S inner join (PetOwners inner join (Bid B inner join Pets P on B.PetID = P.PetID) B2 on PetOwners.oid = B2.PetOwnerID) P2 on S.serviceid = P2.ServiceID where bidstatus = 'accepted' and BidStartDate > now()", function(err, table) {
        done();
        if (err) {
          return response.status(400).send(err);
        }
        else {
          return response.status(200).send(table.rows);
        }
      })
    }
  })
});

app.get('/getPastBids', function(request, response) {
  pool.connect((err, db, done) => {
    if(err) {
      return response.status(400).send(err);
    } else {
      db.query("SELECT * from Services S inner join (PetOwners inner join (Bid B inner join Pets P on B.PetID = P.PetID) B2 on PetOwners.oid = B2.PetOwnerID) P2 on S.serviceid = P2.ServiceID where bidstatus = 'accepted' and BidStartDate < now()", function(err, table) {
        done();
        if (err) {
          return response.status(400).send(err);
        }
        else {
          return response.status(200).send(table.rows);
        }
      })
    }
  })
});

// TO BE COMPLETED
app.delete('/deleteBid', function(request, response) {
  var deletebid = request.body.deletebid;
  pool.connect((err, db, done) => {
    if(err) {
      return response.status(400).send(err);
    } else {
      console.log("I am trying to delete")
      db.query(`DELETE * from Bid B
                where B.BidID = $1`, [deletebid], function(err, table) {
        done();
        if (err) {
          return response.status(400).send(err);
        }
        else {
          return response.status(200).send({message:"bid deleted"});
        }
      })
    }
  })
});

app.post('/acceptBid', function(request, response) {
  console.log(request.body);
  var acceptedbid = request.body.acceptbid;
  console.log("i am here in serverjs")
  pool.connect((err, db, done) => {
    if(err) {
      return response.status(400).send(err);
    }
    else {
      db.query(
        `UPDATE Bid B set bidstatus = 'accepted'
        where B.BidID = $1`, [acceptedbid], (err, table) => {
        done();
        if (err) {
          console.log(err)
          return response.status(400).send(err);
        }
        else {
          console.log("i accepted a new bid");
          response.status(200).send({message:"new bid accepted"});
        }
      })
    }
  })
})

app.listen(PORT, () => console.log("listening on port " + PORT));
