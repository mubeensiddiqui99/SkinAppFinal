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
const Profile = ({ navigation, route }) => {
    console.log(route.params.doctor)
    // const {age,gender,id,name}=route.params.patient
    const {charges,experience,id,name,qualification, speciality,password} =route.params.doctor
    return (
        <View style={styles.container}>
     <Text style={styles.title}>Doctor Information</Text>
     <View style={styles.patientInfo}>
       <Text style={styles.label}>Name:</Text>
       <Text style={styles.value}>{name}</Text>

       <Text style={styles.label}>charges:</Text>
       <Text style={styles.value}>{charges}</Text>

       <Text style={styles.label}>experience::</Text>
       <Text style={styles.value}>{experience}</Text>

       <Text style={styles.label}>qualification:</Text>
       <Text style={styles.value}>{qualification}</Text>

       <Text style={styles.label}>speciality:</Text>
       <Text style={styles.value}>{speciality}</Text>

      

      
     </View>
   </View>
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