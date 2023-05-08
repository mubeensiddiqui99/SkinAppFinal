const express = require("express");
const app = express();
const mysql = require("mysql");
const Stripe = require("stripe");
const cors = require("cors");
const bcrypt = require("bcryptjs");
app.use(cors());
app.use(express.json());
const PUBLISHABLE_KEY = "pk_test_51MYEJyC4jWkBdlUK2Yp7zdKG0H5JQMzLRHkv1GFbOX4Yr27EUNaHF7fx0JkihvaPaPs8tIBo5FaKUkWxcKkCfkZu00SFkSAxK6";
const SECRET_KEY = "sk_test_51MYEJyC4jWkBdlUKYD6NKAz8EYKBqmmU0U4Eht0M9madeLQcvpg4RvM6seAdF8teiXKTonOAbzCmcnV3GdXdKETs00zijFlrSL";
const stripe = Stripe(SECRET_KEY, { apiVersion: "2022-11-15" });
const users = [];
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "skinapp1",
  multipleStatements: true
});

app.post("/create-payment-intent", async (req, res) => {
  console.log(req.body);
  const amount = req.body.amount;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, //lowest denomination of particular currency
      currency: "usd",
      payment_method: 'pm_card_visa', //by default
    });

    const clientSecret = paymentIntent.client_secret;

    res.json({
      clientSecret: clientSecret,
    });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
});

app.post("/doctorIn_signup", async (req, res) => {
  console.log("input", req.body);
  const email = req.body.userEmail;
  const userSpeciality = req.body.userSpeciality
  const userPMDCID = req.body.userPMDCID
  const charges = req.body.userFees;
  const password = req.body.userPassword;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const userTimings =  req.body.userTimings;
  const userExperience =  req.body.userExperience;
  const userQualification = req.body.userQualification;


  const name = req.body.userName;
  db.query(
    "SELECT * FROM doctor_in WHERE email=?",
    [email],
    async (err, result) => {
      console.log({ result })
      if (err) {

        res.send({ err: err });
      }
      else if (result.length > 0) {
        res.send({ message: 'duplicate email' })
      }
      else {
        db.query(
          "SELECT * FROM doctor WHERE email=?",
          [email],
          async (err, result) => {
            if (err) {

              res.send({ err: err });
            }
            else if (result.length > 0) {
              res.send({ message: 'duplicate email' })
            } else {
              db.query(
                "INSERT INTO doctor_in (Name,Password,Email,speciality,qualification,experience,timing,charges,PMDCID,online)Values(?,?,?,?,?,?,?,?,?,?) ",
                [name, hash, email, userSpeciality,userQualification, userExperience, userTimings, charges, userPMDCID, true],
                (err, result) => {
                  if (err) {
                    console.log(err);
                    res.send(err)
                  } else {
                    res.send({ insertId: result.insertId });
                    // res.send("Values Inserted");
                    console.log("CValues Inserted");
                  }
                }
              );
            }
          }
        );

      }
    }
  );

});
app.post("/doctor_signup", async (req, res) => {
  console.log("input", req.body);
  const email = req.body.email;
  const userSpeciality = req.body.speciality
  const userPMDCID = req.body.PMDCID
  const userId = req.body.id
  const userTimings =  req.body.timing;
  const userExperience =  req.body.experience;
  const userQualification = req.body.qualification;
  const charges = req.body.charges;

  const password = req.body.password;
  //const salt = await bcrypt.genSalt(10);
  //const hash = await bcrypt.hash(password, salt);

  const name = req.body.name;


  db.query(
    "INSERT INTO doctor (Name,Password,Email,speciality,qualification,experience,timing,charges,PMDCID,online)Values(?,?,?,?,?,?,?,?,?,?)  ",
    [name, password, email, userSpeciality, userQualification, userExperience, userTimings, charges, userPMDCID, true],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send({ insertId: result.insertId });
        // res.send("Values Inserted");
        console.log("CValues Inserted");
      }
    }

  );


});

app.post("/delete_doctor_in", async (req, res) => {
  console.log("input", req.body);

  const userId = req.body.id
  db.query(
    "DELETE FROM doctor_in where id=? ",
    [userId],
    (err, result) => {
      if (err) {
        console.log({ err });
        res.send(err)
      } else {
        console.log({ result });
        res.status(200).send(result);
        console.log("Values Deleted");
      }
    }
  );
});
app.post("/delete_appointment", async (req, res) => {
  console.log("INFORMATION TO BE DELETED", req.body);

  const appointment_id = req.body.id
  db.query(
    "DELETE FROM appointment where id=? ",
    [appointment_id],
    (err, result) => {
      if (err) {
        console.log({ err });
        res.send(err)
      } else {
        console.log({ result });
        res.status(200).send(result);
        console.log("Values Deleted");
      }
    }
  );
});


app.post("/patient_signup", async (req, res) => {
  console.log("input", req.body);
  const email = req.body.userEmail;
  const password = req.body.userPassword;
  const age = req.body.userAge;
  const gender = req.body.userGender;
  const history = req.body.history;
  const address = req.body.userAddress;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const name = req.body.userName;
  db.query(
    "SELECT * FROM patient WHERE email=?",
    [email],
    async (err, result) => {
      console.log({ result })
      if (err) {

        res.send({ err: err });
      }
      else if (result.length > 0) {
        res.send({ message: 'duplicate email' })
      }
      else {

        db.query(
          "INSERT INTO patient (Name,Password,Email,age,gender,medical_history,address)Values(?,?,?,?,?,?,?) ",
          [name, hash, email, age, gender,history,address],
          (err, result) => {
            if (err) {
              console.log(err);
            } else {
              res.send({ insertId: result.insertId });
              // res.send("Values Inserted");
              console.log("CValues Inserted");
            }
          }
        );



      }
    }
  );

});
app.get("/admin_login", async (req, res) => {

  db.query(
    "SELECT * FROM doctor_in",
    async (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        // console.log(result[0].Password);
        console.log({ result });



        console.log(result);
        // res.send(result).status(200);
        const { id, name, qualification, experience, timing, charges, speciality, pmdcid } = result[0];
        res.status(200).send(result);



      }

    }
  );
});

app.post("/doctor_login", async (req, res) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;
  const hash = await bcrypt.hash(password, 10);
  console.log(email, password, hash);
  db.query(
    "SELECT * FROM doctor WHERE email=?",
    [email],
    async (err, result) => {
      if (err) {

        res.send({ err: err });
      }
      if (result.length > 0) {
        // console.log(result[0].Password);
        console.log({ result });
        const validPass = await bcrypt.compare(password, result[0].password);
        console.log(validPass);
        if (validPass) {
          console.log(result);
          // res.send(result).status(200);
          const { id, name, qualification, experience, timing, charges, speciality, pmdcid } = result[0];
          res.status(200).send({ id, name, qualification, experience, timing, charges, speciality, pmdcid });
        } else {
          console.log("wrong username pass");
          // res.send({ message: "Wrong Username/Password" }).status(404);
          res.status(404).send({ message: "Wrong Username/Password" });
        }
      } else {
        console.log("wrong username table 1");
        // res.send({ message: "Wrong Username/Password" }).status(404);
        res.status(404).send({ message: "Wrong Username/Password" });
      }
    }
  );
});
app.post("/doctorIn_login", async (req, res) => {
  const email = req.body.userEmail;
  const password = req.body.userPassword;
  const hash = await bcrypt.hash(password, 10);
  console.log(email, password, hash);
  db.query(
    "SELECT * FROM doctor_in WHERE email=?",
    [email],
    async (err, result) => {
      if (err) {

        res.send({ err: err });
      }
      else {
        if (result && result.length > 0) {
          // console.log(result[0].Password);
          console.log({ result });
          res.status(200).send({ message: "Under Verificatiom..." });


        } else {
          console.log("wrong username");
          // res.send({ message: "Wrong Username/Password" }).status(404);
          res.status(404).send({ message: "Wrong Username/Password" });
        }
      }

    }
  );
});

app.post("/patient_login", async (req, res) => {
  console.log(req.body)
  const email = req.body.userEmail;
  const password = String(req.body.userPassword);
  const hash = await bcrypt.hash(password, 10);
  console.log(email, password, hash);
  db.query(
    "SELECT * FROM patient WHERE email=?",
    [email],
    async (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      else {
        if (result && result.length > 0) {
          // console.log(result[0].Password);
          console.log({ result });
          const validPass = await bcrypt.compare(password, result[0].password);
          console.log(validPass);
          if (validPass) {
            console.log(result);
            const { name, age, gender, id,email,medical_history,address,disease } = result[0]
            // res.send(result).status(200);
            console.log('login')
            res.status(200).send({ name, age, gender, id: id,email,medical_history,address,disease });
          } else {
            console.log("wrong username pass");
            // res.send({ message: "Wrong Username/Password" }).status(404);
            res.status(404).send({ message: "Wrong Username/Password" });
          }
        } else {
          console.log("wrong username");
          // res.send({ message: "Wrong Username/Password" }).status(404);
          res.status(404).send({ message: "Wrong Username/Password" });
        }
      }

    }
  );
});


  // const user = await db("users").first("*").where({ email: email });
  // // const user = users.find((user) => user.email, email);
  // if (user) {
  //   const validPass = await bcrypt.compare(password, user.hash);
  //   if (validPass) {
  //     // console.log(user.json);
  //     console.log(user);
  //   } else {
  //     console.log("wrong username pass");
  //   }
  // } else {
  //   console.log("user not found");
  // }

app.get("/doctors_for_patient", async (req, res) => {
  console.log("jobs viewing");
  db.query(
    "SELECT id,name,speciality,experience,timing,charges,qualification,email,PMDCID from doctor",

    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        console.log(result);
        res.status(200).send(result);
      }
    }
  );
});
app.post("/patient_appointments", async (req, res) => {
  console.log("jobs viewing");
  const patient_id = req.body.id;
  console.log(req.body)
  db.query(
    "SELECT * from appointment where patient_id=?",
    [patient_id],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        console.log(result);
        res.status(200).send(result);
      }
    }
  );
});

app.post("/get_patient_history", async (req, res) => {
  console.log("jobs viewing");
  const patient_id = req.body.id;
  console.log(req.body)
  db.query(
    "SELECT * from appointment_history where patient_id=?",
    [patient_id],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        console.log(result);
        res.status(200).send(result);
      }
    }
  );
});
app.post("/get_patient_Medicalhistory", async (req, res) => {
  console.log("jobs viewing");
  const patient_id = req.body.id;
  console.log(req.body)
  db.query(
    "SELECT * from patient where id=?",
    [patient_id],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        console.log(result);
        res.status(200).send(result);
      }
    }
  );
});
app.post("/get_patient_Disease", async (req, res) => {
  console.log("jobs viewing");
  const patient_id = req.body.id;
  console.log(req.body)
  db.query(
    "SELECT * from patient where id=?",
    [patient_id],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        console.log(result);
        res.status(200).send(result);
      }
    }
  );
});
app.post("/doctor_appointments", async (req, res) => {
  console.log("jobs viewing");
  const doctor_id = req.body.id;
  console.log(req.body)
  db.query(
    "SELECT * from appointment where doctor_id=?",
    [doctor_id],
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else {
        console.log(result);
        res.status(200).send(result);
      }
    }
  );
});


app.post("/set_appointment", async (req, res) => {
  console.log("data");
  console.log(req.body);
  const patient_id = req.body.patient_id;
  const doctor_id = req.body.doctor_id;
  const disease = req.body.disease;
  const timing = req.body.date;
  const doctor_name = req.body.doctor_name;
  const meeting_type = req.body.meeting_type;
  const patient_name = req.body.patient_name;

  db.query(
    "INSERT INTO appointment (patient_id,doctor_id,disease,timing,taken_place,doctor_name,meeting_type,patient_name)Values(?,?,?,?,?,?,?,?) ",
    [
      patient_id, doctor_id, disease, timing, "false", doctor_name, meeting_type, patient_name
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
        console.log("Values Inserted");
      }
    }
  );
});

app.post("/set_diseasePatient", async (req, res) => {
  console.log("data");
  console.log(req.body);
  
  const disease = req.body.disease;
  const id = req.body.id;

  db.query(
    "UPDATE patient SET disease=? WHERE id=? ",
    [
     disease,id 
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Updated");
        console.log("Values updated");
      }
    }
  );
});
app.post("/update_patient_record", async (req, res) => {
  console.log("data");
  console.log(req.body);
  const id=req.body.id;
  const email = req.body.values.userEmail;
  const password = req.body.values.userPassword;
  const age = req.body.values.userAge;
  const gender = req.body.values.userGender;
  const history = req.body.values.history;
  const address = req.body.values.userAddress;

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const name = req.body.values.userName;

  db.query(
    "UPDATE patient SET email=?,password=?,age=?,gender=?,medical_history=?,address=?,name=? WHERE id=? ",
    [
     email,hash, age,gender,history,address,name,id
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Updated");
        console.log("Values updated");
      }
    }
  );
});
app.post("/update_doctor_record", async (req, res) => {
  console.log("data");
  console.log(req.body);
  const id=req.body.id;
  // const email = req.body.inputs.userEmail;
 
 
  const charges = req.body.inputs.userFees;
  const password = req.body.inputs.userPassword;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const userTimings =  req.body.inputs.userTimings;
  const userExperience =  req.body.inputs.userExperience;
  const userQualification = req.body.inputs.userQualification;

  db.query(
    "UPDATE doctor SET charges=?,password=?,timing=?,experience=?,qualification=? WHERE id=? ",
    [
     charges,hash,userTimings,userExperience,userQualification,id
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Updated");
        console.log("Values updated");
      }
    }
  );
});


app.post("/set_payment", async (req, res) => {
  console.log("data");
  console.log(req.body);
  const patient_id = req.body.patient_id;
  const doctor_id = req.body.doctor_id;
  const doctor_name = req.body.doctor_name;
  const patient_name = req.body.patient_name;
  const amount = req.body.amount;
  db.query(
    "INSERT INTO payment (patient_id,doctor_id,doctor_name,patient_name,amount)Values(?,?,?,?,?) ",
    [
      patient_id, doctor_id, doctor_name, patient_name,amount
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
        console.log("Values Inserted");
      }
    }
  );
});

app.post("/set_appointment_history", async (req, res) => {
  console.log("data");
  console.log(req.body);
  const patient_id = req.body.patient_id;
  const doctor_id = req.body.doctor_id;
  const disease = req.body.disease;
  const time = req.body.timing;
  const doctor_name = req.body.doctor_name;
  const patient_name = req.body.patient_name;

  db.query(
    "INSERT INTO appointment_history (patient_id,doctor_id,disease,time,doctor_name,patient_name)Values(?,?,?,?,?,?) ",
    [
      patient_id, doctor_id, disease, time, doctor_name, patient_name
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
        console.log("Values Inserted");
      }
    }
  );
});



/*
app.use('/a',express.static('/b'));
Above line would serve all files/folders inside of the 'b' directory
And make them accessible through http://localhost:3000/a.
*/
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

app.listen(3001, () => {
  console.log("App is running");
});
