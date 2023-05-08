import React, { useState,useContext,useEffect } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import Axios from "axios";
//ADD localhost address of your server
// const API_URL = "http://localhost:3000";
import Constants from "expo-constants";
const { manifest } = Constants;
import { DiseaseContext, PatientContext,AppointmentsContext } from '../contexts';

// const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
//   ? manifest.debuggerHost.split(`:`).shift().concat(`:3001`)
//   : `api.example.com`;
// const api2 = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
//   ? manifest.debuggerHost.split(`:`).shift().concat(`:5000`)
//   : `api.example.com`;
import { api2, api } from './Constants'


const StripeApp = ({ doctor,appointment, navigation }) => {
  const amount = doctor.charges
  console.log("FINAL AMOUNTTTTTTTTTTTT",amount)
  console.log({ appointment })
  const [patient,setPatient]=useContext(PatientContext)
  console.log({doctor})
  const [disease, setDisease] = useContext(DiseaseContext)
  const [appointments, setAppointments] = useContext(AppointmentsContext)
  const [email, setEmail] = useState();
  const [patient_dis, setpatient_dis] = useState();
  // const [amount,setAmount]=useState();
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();
  useEffect(() => {
    
    getPatientDisease()
}, [])

const getPatientDisease = async () => {
  Axios.post(`${api}/get_patient_Disease`,{id:patient.id})
  .then((response) => {
    if (response.status === 200) {
      console.log("HELOOOOOOOOOO",response.data[0].disease);
      setpatient_dis(response.data[0].disease)
    }
  })
  .catch((err) => {
    console.log(err);
  })
}

  const setPaymentDB = async ()=>{
   
    Axios.post(`${api}/set_payment`, {
      doctor_id: doctor.id,
      patient_id: patient.id,
      doctor_name: appointment.doctor,
      patient_name: patient.name,
      amount:amount
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(response);

        }
      })
      .catch((err) => {
        console.log(err);
      })
  }
  const setAppointmentDB = async () => {
    console.log("This is Appointment", appointment);
    const prob = disease.prob;
    let dis = '';
    if (prob >= 0.5) {
      dis = disease.prob
    }
    console.log({ doctor })
    console.log({ disease })
    const dataCopy = [...appointments, {
      "id": appointments.length,
      "patient_id": patient.id,
      "doctor_id": doctor.id,
      "timing": appointment.date,
      "taken_place": 0,
      // "disease": disease.classname || "",
      // "disease":patient.disease,
      "disease":patient_dis,
      "doctor_name": appointment.doctor,
      "meeting_type": appointment.meetings,
      "patient_name": patient.name
    }];
    console.log({
      "id": appointments.length,
      "patient_id": patient.id,
      "doctor_id": doctor.id,
      "timing": appointment.date,
      "taken_place": 0,
      // "disease": disease.classname || "",
      // "disease":patient.disease,
      "disease":patient_dis,
      "doctor_name": appointment.doctor,
      "meeting_type": appointment.meetings,
      "patient_name": patient.name
    })
    setAppointments(dataCopy);
    Axios.post(`${api}/set_appointment`, {
      doctor_id: doctor.id,
      patient_id: patient.id,
      // disease: dis,
      // disease:patient.disease,
      "disease":patient_dis,
      timing: "timing",
      date: appointment.date,
      doctor_name: appointment.doctor,
      meeting_type: appointment.meetings,
      patient_name: patient.name
    })
      .then((response) => {
        if (response.status === 200) {
          console.log(response);

        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${api}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount }),
    });
    const { clientSecret, error } = await response.json();
    return { clientSecret, error };


  };

  const handlePayPress = async () => {
    //1.Gather the customer's billing information (e.g., email)
    if (!cardDetails || !email || !amount) {
      Alert.alert("Please enter Complete card details and Email");
      return;
    }
    const billingDetails = {
      email: email,
      amount: amount,
    };
    //2.Fetch the intent client secret from the backend
    try {
      const { clientSecret, error } = await fetchPaymentIntentClientSecret();
      //2. confirm the payment
      if (error) {
        console.log("Unable to process payment");
      } else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          paymentMethodType: 'Card',
          billingDetails: billingDetails,
          amount: amount,
        });
        if (error) {
          alert(`Payment Confirmation Error ${error.message}`);
        } else if (paymentIntent) {
          alert("Payment Successful");
          console.log("Amount is", amount);
          console.log("Payment successful ", paymentIntent);
          setAppointmentDB();
          setPaymentDB();
        }
      }
    } catch (e) {
      console.log(e);
    }
    //3.Confirm the payment with the card details
  };

  return (
    <View style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="E-mail"
        keyboardType="email-address"
        onChange={value => setEmail(value.nativeEvent.text)}
        style={styles.input}
      />
      {/* <TextInput
        autoCapitalize="none"
        placeholder="Amount"
        keyboardType="email-address"
        onChange={value => setAmount(value.nativeEvent.text)}
        style={styles.input}
      /> */}
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={cardDetails => {
          setCardDetails(cardDetails);
        }}
      />
      <Button onPress={handlePayPress} title="Pay" disabled={loading} />
    </View>
  );
};
export default StripeApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 20,
  },
  input: {
    backgroundColor: "#efefefef",

    borderRadius: 8,
    fontSize: 20,
    height: 50,
    padding: 10,
  },
  card: {
    backgroundColor: "#efefefef",
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
});
