import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import Axios from "axios";
import { DiseaseContext, PatientContext, AppointmentsContext } from '../contexts';
import { Card, Button, Icon } from "react-native-elements";
import RadioButtonRN from "radio-buttons-react-native";
import Constants from "expo-constants";
import { format } from "date-fns";
import ModalPopUp from "../consts/ModalPopup";
import meetings from "../consts/meetings";
import DateTimePicker from "@react-native-community/datetimepicker";
// import { auth, db } from "../../firebase";
const { manifest } = Constants;
// const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
//   ? manifest.debuggerHost.split(`:`).shift().concat(`:3001`)
//   : `api.example.com`;
import { api2, api } from './Constants'


const MedicalAppointment = ({ navigation, route }) => {
  const [patient, setPatient] = useContext(PatientContext)

  // console.log(route);

  const doctor = route.params.doctor;
  // console.log({ doctor })
  // console.log("Patient Info...", patient);
  const [appointment, setAppointment] = useState({
    doctor: `${doctor.name}`,
    date: new Date(),
    meetings: "",

  });
  console.log({ appointment })
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const selectedTimestamp = event.nativeEvent.timestamp;
    setShow(false);
    const selectedDateObject = new Date(selectedTimestamp);

    setAppointment({ ...appointment, date: selectedDateObject });
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = () => {
    showMode("time");
  };

  const [visible, setVisible] = useState(false);

  const saveAppointments = (appointment) => {
    db.ref("appointments/" + auth.currentUser?.uid).push({
      ...appointment,
      date: format(appointment.date, "EEEE, MMM dd HH:mm aaa"),
    });
  };



  return (
    <View style={styles.headerContainer}>
      <View style={styles.bookingContainer}>
        <View>
          <Text style={styles.headerText}>Make an Appointment</Text>
          <Text style={styles.appointmentTime}>
            {format(appointment.date, "EEE, MMM dd HH:mm aaa")}
          </Text>
        </View>
        <View style={{ marginTop: 10 }}>
          <Button
            type="clear"
            onPress={showDatepicker}
            title="Change Date"
            titleStyle={styles.changeDateContainer}
          />
          <Button
            type="clear"
            onPress={showTimepicker}
            title="Change Time"
            titleStyle={styles.changeDateContainer}
          />
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={appointment.date}
              mode={mode}
              is24Hour={true}
              themeVariant="light"
              onChange={onChange}
            />
          )}
        </View>
      </View>

      <View style={styles.panel}>
        <Card containerStyle={styles.card}>
          <RadioButtonRN
            data={meetings}
            boxStyle={{ borderWidth: 0 }}
            textStyle={{ fontSize: 18 }}
            circleStyle={{ size: 18 }}
            selectedBtn={(meetings) =>
              setAppointment({ ...appointment, meetings: meetings.label })
            }
            icon={<Icon name="check-circle" size={25} color="#2c9dd1" />}
          />
        </Card>
      </View>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ModalPopUp visible={visible}>
          <View style={{ alignItems: "center" }}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <Text>OK</Text>
                </View>

              </TouchableOpacity>
            </View>
          </View>



          <Text
            style={{ marginVertical: 30, fontSize: 20, textAlign: "center" }}

          >
            Congratulations! Your booking was successful
          </Text>
        </ModalPopUp>

        <Button
          containerStyle={styles.button}
          title="Book"
          onPress={() => {
            navigation.navigate('StripePayment', { doctor, appointment: { ...appointment, date: appointment.date.toJSON() } });
            setVisible(true);

          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flex: 1,
    marginTop: 18,
  },
  headerText: {
    fontSize: 18,
    color: "gray",
  },
  bookingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 14,
    marginLeft: 20,
  },
  changeDateContainer: {
    fontSize: 16,
    color: "#CD853F",
  },
  appointmentTime: {
    fontSize: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  panel: {
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    marginTop: 80,
  },
  card: {
    width: Dimensions.get("window").width,
    borderTopWidth: 1,
    borderBottomWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: "transparent",
  },
  button: {
    right: 20,
    left: 20,
    bottom: 20,
    position: "absolute",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    color: "#1E90FF",
  },
  header: {
    width: "100%",
    height: 40,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});

export default MedicalAppointment;
