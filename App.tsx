import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Switch,Alert
} from 'react-native';
import { Colors, Header } from 'react-native/Libraries/NewAppScreen';
import { 
  loginWithBiometrics, 
  checkBiometrics, 
  generateBiometricPublicKey ,
  deleteBiometricPublicKey,
  loginPrompt
} from './util/BiometricsUtils';
import * as Keychain from 'react-native-keychain';

function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';
  const [isDarkMode, setIsDarkMode] = useState(useColorScheme() === 'dark');

  const [biometricType, setBiometricType] = useState<string | null>(null);
  const [user, setUser] = useState('')
 
  useEffect(() => {
    checkBiometrics().then((bt) => {
      console.log('BT: ', bt);
      setBiometricType(bt);
      
    }).catch((error) => {
      console.error('Error checking biometrics:', error);
    });
  }, []);
// handle login with biometrics
const loginroutine = async () => {
  const username = 'a2244220';
  const password = '';
  console.log("in the routine");

  // Store the credentials
  try {
    await Keychain.setGenericPassword(username, password);
    console.log("keychain completed:");
  } catch (error) {
    console.log("error: ", error);
  }

  // Retrieve the credentials
  try {
    const credentials = await Keychain.getGenericPassword();
    console.log("credentials : ", JSON.stringify(credentials, null, 2));
    if (credentials) {
      setUser(credentials.username);
      console.log('Credentials successfully loaded for user ' + credentials.username);
    } else {
      console.log('No credentials stored');
    }
  } catch (error) {
    console.log("Keychain couldn't be accessed!", error);
  }

  await Keychain.resetGenericPassword();
};


const handleLoginWithBiometrics = async () => {
  console.log("handle login with biometrics")
  //const userID = 'a2244220'
  const userID = user;
  console.log("userid: ", userID)
  const success = await loginWithBiometrics(userID);
  console.log("SUCCESS: ", JSON.stringify(success, null, 2))
  if(success){
    Alert.alert("success", 'biometrics login successful')
  } else {
    Alert.alert("Error", 'biometrics login failed')
  }
}


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        
      >
        <Header />
        <View>
        <Switch
  value={isDarkMode}
  onValueChange={(value) => setIsDarkMode(value)}
/>
        </View>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
            paddingHorizontal: 10,paddingVertical: 10
          }}
        >
          <Text>dark or not?: {isDarkMode ? 'yes': 'no'}</Text>
          <Text>Biometric Type: </Text>
          <Text>{biometricType}</Text>
          <Text>User: {user? user: ''}</Text>
         
 
          <View style={{backgroundColor: 'black', marginVertical:5 ,padding: 10}}>
            <Button
            onPress={loginroutine}
            title="Login Routine"
            color='#b30000'
            accessibilityLabel="USERNAME"
            />
          </View> 
          
          <View style={{backgroundColor: 'black', marginVertical:5 ,padding: 10}}>
            <Button
              onPress={
                //() => checkBiometrics().then((bt) => setBiometricType(bt))
                deleteBiometricPublicKey
              }
              title="Delete PKey"
              color='#2196F3'
              accessibilityLabel="Delete Biometrics"
            />
          </View>
        <View style={{backgroundColor: 'black', marginVertical:5 ,padding: 10}}>

          <Button
          onPress={generateBiometricPublicKey}
          title="Generate Public Key"
          color='#2196F3'
          accessibilityLabel="Check biometric support"
          />
        </View>
          <View style={{backgroundColor: 'black', marginVertical:5 ,padding: 10}}>

          <Button
          onPress={checkBiometrics}
          title="Check Biometrics"
          color='#2196F3'
          accessibilityLabel="Check biometric support"
          />
          </View>
          <View style={{backgroundColor: 'black', marginVertical:5 ,padding: 10}}>
          <Button
          onPress={handleLoginWithBiometrics}
          title="Login with Biometrics"
          color='#2196F3'
          accessibilityLabel="login with biometrics"
          />
        </View>
        <View style={{backgroundColor: 'black', marginVertical:5 ,padding: 10}}>
          <Button
          onPress={loginPrompt}
          title="Login Prompt"
          color='#2196F3'
          accessibilityLabel="login with biometrics"
          />
        </View>



        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  buttonStyle: {
    backgroundColor: "#ff6319",
    padding: 10
  }
});

export default App;
