import {Alert} from 'react-native'
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

export const checkBiometrics = async () => {
  try {
    const resultObject = await rnBiometrics.isSensorAvailable();
    const { available, biometryType } = resultObject;

    console.log('Available: ', available);
    console.log('Biometry Type: ', biometryType);

    if (available && biometryType === BiometryTypes.TouchID) {
      Alert.alert('TouchID', 'Would you like to enable TouchID authentication for the next time?', [
        {
          text: 'Yes please',
          onPress: async () => {
            
            Alert.alert('Success!', 'TouchID authentication enabled successfully!');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
      console.log('TouchID is supported');
    } else if (available && biometryType === BiometryTypes.FaceID) {
      Alert.alert('FaceID', 'Would you like to enable FaceID authentication for the next time?', [
        {
          text: 'Yes please',
          onPress: async () => {
            
            Alert.alert('Success!', 'FaceID authentication enabled successfully!');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
      console.log('FaceID is supported');
    } else if (available && biometryType === BiometryTypes.Biometrics) {
      Alert.alert('Device Supported Biometrics', 'Biometrics authentication is supported.');
      console.log('Biometrics is supported');
    } else {
      Alert.alert('Biometrics not supported', 'This device does not support biometric authentication.');
      console.log('Biometrics not supported');
      return null;
    }
    return biometryType;
  } catch (error) {
    Alert.alert('Error', 'An error occurred while checking biometrics availability.');
    console.error('Error checking biometrics:', error);
    return null;
  }
};

export const getPublicKey = async () => {
  const { keysExist } = await rnBiometrics.biometricKeysExist();
  console.log("keyExist: ", true)
};

export const generateBiometricPublicKey = async () => {
  try {
    const { keysExist } = await rnBiometrics.biometricKeysExist();
    
    if (keysExist) {
        console.log("key exist: ", keysExist)
        console.log(publicKey, ': public key exist');
      throw new Error('Biometric Key exists.');
    }
    const { publicKey } = await rnBiometrics.createKeys();
    console.log(publicKey, 'send this to the server');
  } catch (error) {
    console.error('Error generating biometric public key:', error);
  }
};

export const deleteBiometricPublicKey = async () => {
  try {
    const { keysDeleted } = await rnBiometrics.deleteKeys();
    if (!keysDeleted) {
      throw new Error('Cannot remove biometrics');
    }
    console.log(keysDeleted);
  } catch (error) {
    console.error('Error deleting biometric public key:', error);
  }
};

export const loginWithBiometrics = async (dispatch:string,userID: string) => {
  const epochTimeSeconds = Math.round((new Date()).getTime() / 1000).toString();
  const payload = `${epochTimeSeconds} userLogin`;
  console.log("Payload: ", payload)
  try {
    const isBiometricAvailable = await checkBiometrics();
    if (!isBiometricAvailable) {
      throw new Error('Biometric not available');
    }
    const { keysExist } = await rnBiometrics.biometricKeysExist();
    //console.log("Key Exist: ", keyExist)
    if (!keysExist) {
      const { publicKey } = await rnBiometrics.createKeys();
      console.log('PublicKey: ', publicKey);
    }
    const { success, signature } = await rnBiometrics.createSignature({
      promptMessage: 'Sign In',
      payload: payload,
    });
    console.log("signature: ", signature)
    if (!success) {
      throw new Error('Biometrics authentication failed');
    } else {
      await dispatch(loginWithBiometrics(userID, payload, signature));
    }
    
    return !!signature;
  } catch (error) {
    console.error('Error logging in with biometrics:', error);
    return false;
  }
};

export const loginPrompt = async ()=>{
  
 
  console.log("JSON RESPONSE: ", JSON.stringify(rnBiometrics, null, 2))
  try {
    rnBiometrics.simplePrompt({promptMessage: 'Authenticate to continue'})
    .then((resultObject) => {
      const { success } = resultObject

      if (success) {
        console.log("JSON RESPONSE: ", JSON.stringify(resultObject, null, 2))
        console.log('successful biometrics provided')
      } else {
        console.log('user cancelled biometric prompt')
      }
    })
    .catch((error) => {
      console.log('biometrics failed::', error)
    })
  } catch (error) {
    console.error('Error With Prompt:', error);
    return false;
  }
  
}

export default {
  checkBiometrics,
  generateBiometricPublicKey,
  deleteBiometricPublicKey,
  loginWithBiometrics,
  loginPrompt,
};
