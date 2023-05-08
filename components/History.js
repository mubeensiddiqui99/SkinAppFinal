import { useEffect, useState, useContext } from 'react';
import Axios from 'axios'
import {
    StyleSheet,
    TextInput,
    View,
    Text,
    Image,
    KeyboardAvoidingView,
    Keyboard,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Button, Dimensions, FlatList
} from 'react-native';

import { DoctorContext, PatientContext } from '../contexts';
import { ListItem } from "@react-native-material/core";
import Constants from "expo-constants";
const { manifest } = Constants;

// const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
//     ? manifest.debuggerHost.split(`:`).shift().concat(`:3001`)
//     : `api.example.com`;
import {api2,api} from './Constants'


const History = ({ navigation, route }) => {
    const [appointments, setAppointments] = useState([])
    const [medhis, setmedhis] = useState()
    const [history,setHistory]=useState({6:"Cancer,eczema",14:"Eczema",15:"Herpes",
    16:"",17:""
})
    const [doctor, setDoctor] = useContext(DoctorContext)
    const [patient,setPatient]=useContext(PatientContext)
    console.log("THIS MUBEEEN PATIENT",patient);
    console.log("RoutePArams1123:", route.params)
    const getAppointments = async () => {
        Axios.post(`${api}/get_patient_history`,{id:route.params.item.patient_id})
        .then((response) => {
          if (response.status === 200) {
            console.log(response);
            setAppointments(response.data)
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
    const getMedicalHistory = async () => {
        Axios.post(`${api}/get_patient_Medicalhistory`,{id:route.params.item.patient_id})
        .then((response) => {
          if (response.status === 200) {
            console.log("HELOOOOOOOOOO",response.data[0].medical_history);
            setmedhis(response.data[0].medical_history)
          }
        })
        .catch((err) => {
          console.log(err);
        })
    }
    
    const setupCall = async () =>{
        var flag = 0;
        console.log("THIS IS APPOINTMENT ID TO BE DELETED",route.params.item.id);
       await Axios.post(`${api}/set_appointment_history`, route.params.item)
        .then((response) => {
            if (response.status === 200) {
                console.log(response);
                flag=1
                
            }
        })
        .catch((err) => {
            console.log(err);
        })
        console.log("THISSS IS FLAG",flag);
        if(flag===1)
        {
            Axios.post(`${api}/delete_appointment`, {id:route.params.item.id})
            .then((res) => {

              console.log(res,"Deleted Successfully...")
            })
            .catch((err) => {
              setErrortext(err.Error);
              console.log("This is error", JSON.stringify(err));
            });
        }
        navigation.navigate(`VideoCall`)
    }
        
        // setAppointments([
        //     {
        //         "id": 13,
        //         "patient_id": 6,
        //         "doctor_id": 11,
        //         "timing": "2022-12-10T17:32:07.",
        //         "taken_place": 0,
        //         "disease": "",
        //         "doctor_name": "Muaz Abbasi",
        //         "meeting_type": "Video Conference",
        //         "patient_name": "A",
         
        //     },
        //     {
        //         "id": 14,
        //         "patient_id": 6,
        //         "doctor_id": 11,
        //         "timing": "2022-12-10T17:32:07.",
        //         "taken_place": 0,
        //         "disease": "",
        //         "doctor_name": "Muaz Abbasi",
        //         "meeting_type": "Video Conference",
        //         "patient_name": "A",
        //     },
        //     {
        //         "id": 15,
        //         "patient_id": 6,
        //         "doctor_id": 11,
        //         "timing": "2022-12-10T17:32:07.",
        //         "taken_place": 0,
        //         "disease": "",
        //         "doctor_name": "Muaz Abbasi",
        //         "meeting_type": "Video Conference",
        //         "patient_name": "A"
        //     },
        //     {
        //         "id": 16,
        //         "patient_id": 6,
        //         "doctor_id": 11,
        //         "timing": "2022-12-10T17:32:07.",
        //         "taken_place": 0,
        //         "disease": "",
        //         "doctor_name": "Muaz Abbasi",
        //         "meeting_type": "Video Conference",
        //         "patient_name": "A"
        //     },
        //     {
        //         "id": 17,
        //         "patient_id": 6,
        //         "doctor_id": 11,
        //         "timing": "2022-12-10T17:33:06.",
        //         "taken_place": 0,
        //         "disease": "",
        //         "doctor_name": "Muaz Abbasi",
        //         "meeting_type": "",
        //         "patient_name": "A"
        //     }
        // ])

    
    useEffect(() => {
        getAppointments()
        getMedicalHistory()
    }, [])
    return (
        //      <View>
        //         <Text>
        //   Your Appointments {route.params.name}  :
        //   </Text>
        // {appointments.map((app,i)=>(
        //   <ListItem
        //         key={i}
        //         title={app.id}
        //      />
        // ))}
        //   </View>
        <View style={styles.container}>
             <Button
            // containerStyle={styles.loginContainer}
            // style={styles.loginText}
            title={'Meet patient'}
            onPress={() => setupCall()}>
          </Button>
          <Text style={styles.header}>Patient History</Text>
            {/* <Text>{history[route.params.item.patient_id]}</Text> */}
             <Text>{medhis}</Text>
          <Text style={styles.header}>Appointment History</Text>
            {
                appointments.length ? <FlatList
                    data={appointments}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        if (item.patient_id == route.params.item.patient_id) {
                            return (
                                <View style={styles.cardContainer}>
                                    <View style={styles.headerContainer}>
                                        <Text style={styles.header}>Doctor: {item.doctor_name}</Text>
                                        {/* <Text>Meeting type: {item.meeting_type}</Text> */}
                                        <Text onPress={()=>{

                                        }}>Patient Name: {item.patient_name}</Text>
                                        <Text>Disease : {item.disease}</Text>
                                        <Text>Meeting time: {item.time}</Text>
                                    </View>
                                </View>
                            )
                        }
                        else {
                            return null
                        }
                    }}
                /> :
                    <View>
                        <Text>This Patient Has no Appointment History...</Text>
                    </View>
            }

        </View>

    )

};

export default History;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
    },
    cardContainer: {
        marginVertical: 30,
        flexDirection: "row",
        borderWidth: 0.5,
        borderRadius: 12,
        width: Dimensions.get("window").width * 0.8,
    },
    headerContainer: {
        margin: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
    },
    button: {
        paddingRight: 20,
    },
});