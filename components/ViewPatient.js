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
  import Axios from 'axios'
  import Constants from "expo-constants";
  import {api2,api} from './Constants'
const Profile = ({ navigation, route,patient }) => {

    console.log("PRINT HOJA BHAI",route.params.patient)
    const {age,gender,name,email,history,address}=route.params.patient
    return (
      <>
  
     <View style={styles.container}>
     <Text style={styles.title}>Patient Information</Text>
     <View style={styles.patientInfo}>
       <Text style={styles.label}>Name:</Text>
       <Text style={styles.value}>{name}</Text>

       <Text style={styles.label}>Age:</Text>
       <Text style={styles.value}>{age}</Text>

       <Text style={styles.label}>Gender:</Text>
       <Text style={styles.value}>{gender}</Text>

       <Text style={styles.label}>Email:</Text>
       <Text style={styles.value}>{email}</Text>

       <Text style={styles.label}>Medical History:</Text>
       <Text style={styles.value}>{history}</Text>

      

      
     </View>
   </View>
   </>
    );
  };
  export default Profile;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    patientInfo: {
      backgroundColor: '#f0f0f0',
      padding: 20,
      borderRadius: 10,
      width: '80%',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    value: {
      fontSize: 16,
      marginBottom: 10,
    },
  });