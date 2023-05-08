import React, { useState, useEffect, useContext, useRef } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import { useNavigation, useRoute } from '@react-navigation/native';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  Button,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Pressable,
} from 'react-native';
// import Drawer from './Drawer'
import { RNCamera } from 'react-native-camera';
import { AutoFocus, Camera, CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { ListItem, Avatar } from "@react-native-material/core";
import Axios from 'axios'
import Remedies from './Remedies'
import PatientAccountInfo from './PatientAccountInfo'

import {
  Backdrop,
  AppBar,
  IconButton,
  BackdropSubheader
} from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { DiseaseContext, PatientContext, AppointmentsContext } from '../contexts';
import Constants from "expo-constants";
const { manifest } = Constants;

// const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
//   ? manifest.debuggerHost.split(`:`).shift().concat(`:3001`)
//   : `api.example.com`;
// const api2 = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
//   ? manifest.debuggerHost.split(`:`).shift().concat(`:5000`)
//   : `api.example.com`;
import { api2, api } from './Constants'


function HomeScreen({ navigation }) {
  const [done, setDone] = useState(false)

  const takePicture = async () => {
    if (camera) {
      let result
      try {
        const options = { quality: 0.7 };
        result = await camera.takePictureAsync(options);

        console.log('Picture taken:', result.uri);
      } catch (e) {
        console.error('Failed to take picture:', e);
      }
      setDone(false)
      setImage(result.uri);
      if (!result.cancelled) {
        setDone(false)
        setImage(result.uri);

        const formData = new FormData();
        formData.append('image', {
          uri: result.uri,
          name: 'image.jpg',
          type: 'image/jpeg',
        });

        // Send the form data to the server using the fetch method
        fetch(`${api2}/upload`, {
          method: 'POST',
          body: formData,
        })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            setClassified(data)
          })
          .catch(error => console.error(error));

      };
    }
  }
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [classified, setClassified] = useState({});
  const OpenCamera = async () => {
    const cameraStatus = await Camera.requestCameraPermissionsAsync();
    setHasCameraPermission(cameraStatus.status === 'granted');
  };
  useEffect(() => { OpenCamera() }, [])
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const cameraRef = useRef(null);

  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <>
      <View style={done ? styles.heightAuto : styles.fill}>

        {
          !image &&
          <>
            <Button
              title="Flip Image"
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}>
            </Button>
            <View style={styles.cameraContainer}>
              {/* <Camera
                ref={cameraRef}
              style={styles.fixedRatio}
              type={type}
              ratio={'1:1'} /> */}
              <RNCamera
                ref={ref => {
                  setCamera(ref)
                }}
                captureAudio={false}
                style={{ flex: 1 }}
                type={RNCamera.Constants.Type.back}
                androidCameraPermissionOptions={{
                  title: 'Permission to use camera',
                  message: 'We need your permission to use your camera',
                  buttonPositive: 'Ok',
                  buttonNegative: 'Cancel',
                }} />
            </View>
            <Button title='picture' onPress={takePicture}></Button>
          </>}

        {image && !done && (<>
          <Text style={{ fontSize: 20 }}>Your Picture</Text>
          <Image source={{ uri: image }} style={{ marginTop: 100, width: 150, height: 150, }} />
          <Button title="Make appointment" onPress={() => {

            setDone(true)
            navigation.navigate('DoctorsAppointments')

          }} />
          {classified.prob >= 0.2 ? <Text>Found {classified.classname} with 0.9 probability</Text> : classified.prob ? <Text>Could not
            classify among any disease due to poor probability: {classified.prob}</Text> : <Text>Waiting for model prediction</Text>}
          {classified.classname && classified.prob >= 0.2 ? <Remedies disease={`${classified.classname}`} /> : null}
        </>)}
      </View>
      {/* {!done &&  <Remedies disease='Eczema' />}  */}


    </>
  );
}
function GalleryScreen({ navigation}) {
  const [done, setDone] = useState(false)
  const [classified, setClassified] = useState({});
  const [dis,setDis]=useState({});
 
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setDone(false)
    setImage(result.uri);
    if (!result.cancelled) {
      setDone(false)
      setImage(result.uri);

      const formData = new FormData();
      formData.append('image', {
        uri: result.uri,
        name: 'image.jpg',
        type: 'image/jpeg',
      });

      // Send the form data to the server using the fetch method
      fetch(`${api2}/upload`, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          console.log("THIS IS DISEASE",data)
          setClassified(data)
          
          
        })
        .catch(error => console.error(error));
    };
  }
  useEffect(() => { pickImage() }, [])
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);

  return (
    <>
      {image && !done && (<><View style={styles.container}>

        <Text style={{ fontSize: 20 }}>Your Picture</Text>
        <Image source={{ uri: image }} style={{ width: 300, height: 300, }} />
        <Button title="Make appointment" onPress={() => {
          setDone(true)
          console.log("FINALLLL",classified.classname)
          navigation.navigate('DoctorsAppointments',{disease:classified.classname})
        

        }
        } />
        {/* {classified.prob >= 0.5 ? <Text>Found {classified.classname} with {classified.prob} probability</Text> : <Text>Could not
          classify among any disease due to poor probability: {classified.prob}</Text>} */}
      </View>
        {classified.prob >= 0.7 ? <Text>Found {classified.classname} with {classified.prob} probability</Text> : classified.prob ? <Text>Could not
          classify among any disease due to poor probability: {classified.prob}</Text> : <Text>Waiting for model prediction</Text>}
        {classified.classname && classified.prob >= 0.7 ? <Remedies disease={`${classified.classname}`} /> : null}
      </>
      )
      }



    </>
  );
}


export const  DoctorsAppointments=(props)=> {
  const {navigation,route}=props
  const [patient, setPatient] = useContext(PatientContext)
  console.log("PRINTING PATIENT", patient);
  // const route = useRoute();
  
  console.log("THIS IS ROUTE",props);

  const [appointments, setAppointments] = useContext(AppointmentsContext)
  const [doctors, setDoctors] = useState([])
  const [showDoctors, setShowDoctors] = useState(false)
  const disease = props.route.params ? props.route.params.disease || null : null;
  // const disease=props.route.params.disease;
  const set_disease = async ()=>{

    Axios.post(`${api}/set_diseasePatient`, {disease,id:patient.id})
    .then((res) => {
      if (!res.data.message) {
        
      }
      else {
        alert(res.data.message)
      }
      console.log({ res });
      // setemp_id1(res.data.insertId);
    })
    .catch((err) => {
      setErrortext(err.Error);
      console.log("This is error", JSON.stringify(err));
    });
  }
 

  const doctors_for_patient = async () => {
    Axios.get(`${api}/doctors_for_patient`)
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setDoctors(response.data)
        }
      })
      .catch((err) => {
        console.log(err);
      })
    //   setDoctors([

    //     {
    //         "id": 10,
    //         "name": "Mubeen Siddiqui ",
    //         "speciality": "3215",
    //         "experience": 0,
    //         "timing": "timing",
    //         "charges": "charges",
    //         "qualification": "qualification",
    //         "email": "mubeen@gmail.com",
    //         "PMDCID": "52626"
    //     },
    //     {
    //         "id": 11,
    //         "name": "Muaz Abbasi",
    //         "speciality": "Derm",
    //         "experience": 0,
    //         "timing": "timing",
    //         "charges": "charges",
    //         "qualification": "qualification",
    //         "email": "muaz@gmail.com",
    //         "PMDCID": "33332"
    //     },
    //     {
    //       "id": 12,
    //       "name": "Adnan Qazi ",
    //       "speciality": "3215",
    //       "experience": 0,
    //       "timing": "timing",
    //       "charges": "charges",
    //       "qualification": "qualification",
    //       "email": "adnanq@gmail.com",
    //       "PMDCID": "52626"
    //   },
    //   {
    //       "id": 13,
    //       "name": "Umair Siddiqui",
    //       "speciality": "Derm",
    //       "experience": 0,
    //       "timing": "timing",
    //       "charges": "charges",
    //       "qualification": "qualification",
    //       "email": "umairsid@gmail.com",
    //       "PMDCID": "33332"
    //   },
    // ])
  }
  const getAppointments = async () => {
    Axios.post(`${api}/patient_appointments`, { id: patient.id })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data);
          setAppointments(response.data)
        }
      })
      .catch((err) => {
        console.log(err);
      })

    //   setAppointments([
    //     {
    //         "id": 13,
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
    //         "id": 14,
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
  }
  useEffect(() => {
    doctors_for_patient()
    getAppointments()
    set_disease()
    console.log({ appointments })
  }, [])
  return (
    <ScrollView>
      <View style={{ padding: 4 }}>
        <Text>Doctors;</Text>
        {doctors.map((doctor, i) => (

          <ListItem
            // onPress={()=>navigation.navigate('Appointment',{doctor})}
            onPress={() => navigation.navigate('AppointmentBooking', { doctor })}
            key={i}
            leadingMode="avatar"
            leading={
              <Avatar image={{ uri: "https://mui.com/static/images/avatar/3.jpg" }} />
            }
            title={doctor.name}
            secondaryText={"Speciality: " + doctor.speciality + " - Charges: " + doctor.charges + " - Timing: " + doctor.timing}
          />
        ))}
        <Text>
          Your Appointments:
        </Text>
        {appointments.map((app, i) => (
        
            <ListItem
              key={i}
              title={app.doctor_name}
            onPress={()=>{navigation.navigate('VideoCall')}}
              secondaryText={"Meeting type: " + app.meeting_type + " - Timing: " + app.timing + " - Disease: " + app.disease}
            />
        
        ))}
      </View>
    </ScrollView>
  )
}




const PatientHome = ({ navigation, route }) => {


  const Drawer = createDrawerNavigator();



  return (

    //   <Button
    //   onPress={OpenCamera}
    //   title="Scan Skin Area"
    //   color="#841584"
    //   accessibilityLabel="Learn more about this purple button"
    //   style={styles.spaces}
    // />

    // <Button
    //   onPress={pickImage}
    //   title="Pick Image from Gallery"
    //   color="#841584"
    //   accessibilityLabel="Learn more about this purple button"
    // />
    // <Button
    //   title="Flip Image"
    //   onPress={() => {
    //     setType(
    //       type === Camera.Constants.Type.back
    //         ? Camera.Constants.Type.front
    //         : Camera.Constants.Type.back
    //     );
    //   }}>
    // </Button>
    // <Button title="Take Picture" onPress={() => takePicture()} />
    // <Button title="Book an Appointment" onPress={() => setShowDoctors(true)} />
    <View style={{ flex: 1 }}>
      <Drawer.Navigator initialRouteName="Doctors and Appointments">
        <Drawer.Screen name="Scan Skin Area" component={HomeScreen} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Scan Image from Gallery" component={GalleryScreen} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Doctors and Appointments" component={DoctorsAppointments} options={{ unmountOnBlur: true }} />
        <Drawer.Screen name="Change/View Account Info" component={PatientAccountInfo} options={{ unmountOnBlur: true }} />

      </Drawer.Navigator>

    </View>


  );
};
export default PatientHome;
const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
  heightAuto: {
    height: 'auto'
  },
  fill: {
    flex: 1
  },
  spaces: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
