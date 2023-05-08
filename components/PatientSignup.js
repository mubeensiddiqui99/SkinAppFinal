import React, { useState, createRef } from 'react';
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
} from 'react-native';
import Axios from 'axios'
import Constants from "expo-constants";
const { manifest } = Constants;

// const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
//   ? manifest.debuggerHost.split(`:`).shift().concat(`:3001`)
//   : `api.example.com`;
import {api2,api} from './Constants'


const PatientSignup = ({ navigation }) => {
  const [values, setValues] = useState({ userName: '', userEmail: '', userPassword: '', ConfirmUserPassword: '', userAge: '', userAddress: '',history:'',userGender:'' });

  const [errortext, setErrortext] = useState('');
  const [
    isRegistraionSuccess,
    setIsRegistraionSuccess
  ] = useState(false);

  const handleChange = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmitButton = () => {
    setErrortext('');
    console.log("Values:", values);
    const strongRegex = new RegExp("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$");
    if (!strongRegex.test(values.userEmail)) {
      alert('enter valid email')
      return;
    }

    if (!/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+*!=]).*$/.test(values.userPassword)) {
      alert('Must be atleast 8 characters and contains atleast 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.');
      return;
    }
    if (!values.userName) {
      alert('Please fill Name');
      return;
    }
    if (!values.userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!values.userAge) {
      alert('Please fill Age');
      return;
    }
   
    if (!values.userPassword) {
      alert('Please fill Password');
      return;
    }
    if (!values.history) {
      alert('Please fill History');
      return;
    }
    if (!values.userGender) {
      alert('Please fill Gender Value');
      return;
    }
    if (!values.userAddress) {
      alert('Please fill Address Value');
      return;
    }
    if (!values.ConfirmUserPassword) {
      alert('Please fill Password Again');
      return;
    }
    if (values.userPassword != values.ConfirmUserPassword) {
      alert('Passwords Does not match!!');
      return;
    }
    Axios.post(`${api}/patient_signup`, values)
      .then((res) => {
        if (!res.data.message) {
          setIsRegistraionSuccess(true)
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
      // setIsRegistraionSuccess(true)

  };
  if (isRegistraionSuccess) {
    // setIsRegistraionSuccess(false)
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: '#307ecc',
          justifyContent: 'center',

        }}>
        <Text style={styles.successTextStyle}>
          Registration Successful
        </Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => { navigation.navigate('PatientLogin') }}>
          <Text style={styles.buttonTextStyle}>Login Now</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: 'blue', width: '100%', paddingTop: 50 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <KeyboardAvoidingView enabled>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => handleChange('userName', text)}
              underlineColorAndroid="#f000"
              placeholder="Enter Name"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => handleChange('userEmail', text)}
              underlineColorAndroid="#f000"
              placeholder="Enter Email"
              placeholderTextColor="#8b9cb5"
              keyboardType="email-address"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => handleChange('userPassword', text)}
              underlineColorAndroid="#f000"
              placeholder="Enter Password"
              placeholderTextColor="#8b9cb5"

              returnKeyType="next"
              secureTextEntry={true}

              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => handleChange('ConfirmUserPassword', text)}
              underlineColorAndroid="#f000"
              placeholder="Confirm Password"
              placeholderTextColor="#8b9cb5"
              returnKeyType="next"
              secureTextEntry={true}
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => handleChange('userAge', text)}
              underlineColorAndroid="#f000"
              placeholder="Enter Age"
              placeholderTextColor="#8b9cb5"
              keyboardType="numeric"

              returnKeyType="next"

              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => handleChange('history', text)}
              underlineColorAndroid="#f000"
              placeholder="Enter Medical History"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => handleChange('userGender', text)}
              underlineColorAndroid="#f000"
              placeholder="Enter Gender"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(text) => handleChange('userAddress', text)}
              underlineColorAndroid="#f000"
              placeholder="Enter Address"
              placeholderTextColor="#8b9cb5"
              autoCapitalize="sentences"
              returnKeyType="next"
              blurOnSubmit={false}
            />
          </View>
          {errortext != '' ? (
            <Text style={styles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitButton}>
            <Text style={styles.buttonTextStyle}>REGISTER</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default PatientSignup;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,

    width: '100%'
  },
  buttonStyle: {
    backgroundColor: '#7DE24E',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'white',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#dadae8',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successTextStyle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
});

