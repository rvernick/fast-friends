import React, { useState, useRef } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import TextRecognition from 'react-native-text-recognition';
import { Box } from '../ui/box';
import { HStack } from '../ui/hstack';
import { Text } from "../ui/text";
import { Button, ButtonText } from "../ui/button";
import { VStack } from '../ui/vstack';
import { Spinner } from '../ui/spinner';
import { Image } from '../ui/image';
import { Alert } from 'react-native';
import { AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader } from '../ui/alert-dialog';

type SericalNumberCameraOCRProps = {
  open: boolean;
  closeCamera: () => void;
  setSerialNumber: (serialNumber: string) => void;
};

const SerialNumberOCRDialog: React.FC<SericalNumberCameraOCRProps> = ({open, closeCamera, setSerialNumber}) => {
  const [serialNumber, setCurrentSerialNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [capturedImage, setCapturedImage] = useState('');
  const [showCamera, setShowCamera] = useState(true);
  const [facing, setFacing] = useState<CameraType>('back');

  const cameraRef = useRef<CameraView>(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  // Request camera permissions
  const handleCameraPermission = async () => {
    if (!cameraPermission) {
      return false;
    }

    if (!cameraPermission.granted) {
      const permission = await requestCameraPermission();
      return permission.granted;
    }

    return true;
  };

  // Process image with OCR
  const processImageForOCR = async (imageUri: string) => {
    setIsProcessing(true);
    console.log('Processing Image:', imageUri);
    try {
      const results = await TextRecognition.recognize(imageUri);

      console.log('Detected Text:', results);
      // Extract potential serial numbers (customize this regex based on your format)
      const serialNumberPattern = /[A-Z0-9]{8,20}/g; // Adjust pattern as needed
      const matches = results.filter((match) => match.match(serialNumberPattern));

      if (matches && matches.length > 0) {
        // Filter and validate matches
        const validatedMatches = matches
          .map(cleanSerialNumber)
          .filter(validateSerialNumber);

        if (validatedMatches.length > 0) {
          const detectedSerial = validatedMatches[0];
          setSerialNumber(detectedSerial);
          Alert.alert('Serial Number Detected', `Found: ${detectedSerial}`);
        } else {
          // Show best match even if validation fails
          const bestMatch = cleanSerialNumber(matches[0]);
          setSerialNumber(bestMatch);
          Alert.alert('Serial Number Detected', `Found: ${bestMatch}\n(Please verify format)`);
        }
      } if (results && results.length > 0) {
        // Fallback: clean and show all detected text
        const cleanedText = cleanSerialNumber(results[0]);
        setSerialNumber(cleanedText);
        Alert.alert('Text Detected', 'No clear serial number found. Please verify the detected text.');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Take photo with camera
  const takePhoto = async () => {
    const hasPermission = await handleCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Required', 'Camera permission is needed to take photos');
      return;
    }

    if (!cameraRef.current) {
      Alert.alert('Error', 'Camera not ready');
      return;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        exif: false,
      });
      if (photo) {
        setCapturedImage(photo.uri);
        setShowCamera(false);
        closeCamera();
        console.log('Captured Image:', photo.uri);
        await processImageForOCR(photo.uri);
      }
    } catch (error) {
      console.error('Camera Error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  // Select image from gallery
  const selectFromGallery = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Gallery access permission is needed');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setCapturedImage(imageUri);
        console.log('Selected Image:', imageUri);
        await processImageForOCR(imageUri);
      }
    } catch (error) {
      console.error('Gallery Error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  // Enhanced serial number validation and formatting
  const validateSerialNumber = (text: string) => {
    if (!text || text.length < 6) return false;

    // Common serial number patterns - customize based on your needs
    const patterns = [
      /^[A-Z]{2}\d{8}$/, // 2 letters + 8 digits
      /^[A-Z0-9]{8,15}$/, // 8-15 alphanumeric
      /^\d{8,12}$/, // 8-12 digits
      /^[A-Z]{1,3}\d{6,10}$/, // 1-3 letters + 6-10 digits
    ];

    const cleanText = text.toUpperCase().trim();
    return patterns.some(pattern => pattern.test(cleanText));
  };

  // Clean and format detected text
  const cleanSerialNumber = (text: string) => {
    if (!text) return '';

    return text
      .replace(/[^A-Z0-9]/gi, '') // Remove special characters and spaces
      .replace(/[O]/g, '0') // Replace O with 0 (common OCR mistake)
      .replace(/[I]/g, '1') // Replace I with 1 (common OCR mistake)
      .toUpperCase()
      .trim();
  };

  // Toggle camera facing
  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back')? 'front' : 'back');
  };

  // Camera view
  if (open) {
    if (!cameraPermission?.granted) {
      return (
        <Box className="flex-1 justify-center items-center p-5">
          <Text className="text-lg text-center mb-5 text-gray-600">Camera permission is required</Text>
          <Button onPress={requestCameraPermission}>
            <Text>Grant Permission</Text>
          </Button>
        </Box>
      );
    }

    return (
      <Box className="flex-1">
        <CameraView
          ref={cameraRef}
          className="flex-1"
          facing={facing}
        >
          <Box className="absolute inset-0 justify-center items-center">
            <Box className="w-4/5 h-24 border-2 border-white border-dashed rounded-lg justify-center items-center bg-black bg-opacity-10">
              <Text className="text-white text-base font-bold text-center bg-black bg-opacity-50 px-2.5 py-1 rounded">
                Position serial number here
              </Text>
            </Box>
          </Box>

          <HStack className="absolute bottom-12 left-0 right-0 justify-around items-center">
            <Button onPress={toggleCameraFacing} className="bg-black bg-opacity-60 w-15 h-15 rounded-full justify-center items-center">
              <Text className="text-2xl">🔄</Text>
            </Button>

            <Button onPress={takePhoto} className="bg-blue-500 w-20 h-20 rounded-full justify-center items-center">
              <Text className="text-3xl">📷</Text>
            </Button>

            <Button onPress={() => closeCamera()} className="bg-black bg-opacity-60 w-15 h-15 rounded-full justify-center items-center">
              <Text className="text-white text-2xl font-bold">✕</Text>
            </Button>
          </HStack>
        </CameraView>
      </Box>
    );
  } else {
    return null;
  }

  // return (
  //   <Box className="flex-1 p-5 bg-gray-100">
  //     <Text className="text-2xl font-bold text-center mb-7 text-gray-800">Serial Number OCR Scanner</Text>

  //     {capturedImage && (
  //       <Box className="items-center mb-5">
  //         <Image source={{ uri: capturedImage }} className="w-full h-50 rounded-lg" resizeMode="contain" />
  //       </Box>
  //     )}

  //     {isProcessing && (
  //       <VStack className="items-center my-7">
  //         <Spinner size="large" color="blue" />
  //         <Text className="mt-2 text-gray-600 text-base">Processing image...</Text>
  //       </VStack>
  //     )}

  //     {serialNumber && !isProcessing && (
  //       <Box className="bg-white p-5 rounded-xl mb-5 items-center shadow-md">
  //         <Text className="text-base text-gray-600 mb-2">Detected Serial Number:</Text>
  //         <Text className="text-2xl font-bold text-gray-800 font-mono mb-2 text-center">{serialNumber}</Text>
  //         <Text className="text-sm font-semibold mb-4">
  //           {validateSerialNumber(serialNumber) ? '✅ Valid Format' : '⚠️ Please Verify'}
  //         </Text>

  //         <Button onPress={() => Alert.alert('Copied', 'Serial number copied to clipboard')} className="bg-green-500 px-4 py-2 rounded-lg">
  //           <Text className="text-white text-sm font-semibold">📋 Copy</Text>
  //         </Button>
  //       </Box>
  //     )}

  //     <VStack space="md">
  //       <Button onPress={() => setShowCamera(true)} disabled={isProcessing} className={`bg-blue-500 p-4 rounded-lg ${isProcessing ? 'opacity-50' : ''}`}>
  //         <Text className="text-white text-base font-semibold">📷 Take Photo</Text>
  //       </Button>

  //       <Button onPress={selectFromGallery} disabled={isProcessing} className={`bg-blue-500 p-4 rounded-lg ${isProcessing ? 'opacity-50' : ''}`}>
  //         <Text className="text-white text-base font-semibold">🖼️ Select from Gallery</Text>
  //       </Button>
  //     </VStack>

  //     {serialNumber && (
  //       <Button onPress={() => { setSerialNumber(''); setCapturedImage(''); }} className="mt-5 p-4 bg-white rounded-lg">
  //         <Text className="text-red-500 text-base font-semibold">🗑️ Clear Result</Text>
  //       </Button>
  //     )}

  //     <Box className="mt-5 p-4 bg-blue-100 rounded-lg">
  //       <Text className="text-blue-500 text-sm text-center italic">
  //         💡 For best results, ensure good lighting and clear focus on the serial number
  //       </Text>
  //     </Box>
  //   </Box>
  // );
};

export default SerialNumberOCRDialog;