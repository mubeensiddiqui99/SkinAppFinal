import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import StripeApp from "./StripeApp";
import { StripeProvider } from "@stripe/stripe-react-native";
export default function StripePayment({navigation,route}) {

  const doctor=route.params.doctor
  
  const appointment=route.params.appointment
  return (
    <StripeProvider publishableKey="pk_test_51MYEJyC4jWkBdlUK2Yp7zdKG0H5JQMzLRHkv1GFbOX4Yr27EUNaHF7fx0JkihvaPaPs8tIBo5FaKUkWxcKkCfkZu00SFkSAxK6">
      <StripeApp doctor={doctor} appointment={appointment} />
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
