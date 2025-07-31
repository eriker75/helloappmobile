import CameraIcon from "@/assets/images/camera-icon.svg";
import { OnboardingScreenLayout } from "@/components/layouts/OnboardingScreenLayout";
import { Text } from "@/components/ui/text";
import { useOnboardingStore } from "@/src/modules/onboarding/onboarding.store";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";

const AddYourPicturesScreen = () => {
  // Obtener propiedades del estado
  const mainPicture = useOnboardingStore((state) => state.mainPicture);
  const secondaryPictures = useOnboardingStore(
    (state) => state.secondaryPictures
  );

  // Obtener acciones del store
  const setMainPicture = useOnboardingStore((state) => state.setMainPicture);
  const addSecondaryPicture = useOnboardingStore(
    (state) => state.addSecondaryPicture
  );
  const setSecondaryPictures = useOnboardingStore(
    (state) => state.setSecondaryPictures
  );
  const validateCurrentStep = useOnboardingStore(
    (state) => state.validateCurrentStep
  );
  const [isValidStep, setIsValidStep] = useState(false);

  const requestPermissions = async (type: "camera" | "gallery") => {
    try {
      if (type === "camera") {
        const { status: cameraStatus } =
          await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== "granted") {
          Alert.alert(
            "Permisos requeridos",
            "Necesitamos permisos para acceder a la cámara"
          );
          return false;
        }
        return true;
      } else {
        const { status: libraryStatus } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (libraryStatus !== "granted") {
          Alert.alert(
            "Permisos requeridos",
            "Necesitamos permisos para acceder a la galería"
          );
          return false;
        }
        return true;
      }
    } catch (error) {
      console.error("Error al solicitar permisos:", error);
      Alert.alert("Error", "Ocurrió un error al solicitar los permisos");
      return false;
    }
  };

  const showImagePickerOptions = (
    isMainPhoto: boolean,
    photoIndex?: number
  ) => {
    Alert.alert("Seleccionar imagen", "Elige una opción", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cámara",
        onPress: () => pickImage("camera", isMainPhoto, photoIndex),
      },
      {
        text: "Galería",
        onPress: () => pickImage("gallery", isMainPhoto, photoIndex),
      },
    ]);
  };

  const pickImage = async (
    source: "camera" | "gallery",
    isMainPhoto: boolean,
    photoIndex?: number
  ) => {
    const hasPermission = await requestPermissions(source);
    if (!hasPermission) return;

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    };

    let result;
    if (source === "camera") {
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const onboardingImage = { uri: asset.uri, file: asset };

      if (isMainPhoto) {
        setMainPicture(onboardingImage);
      } else {
        if (photoIndex !== undefined) {
          // Reemplazar foto existente
          const updatedPhotos = [...secondaryPictures];
          updatedPhotos[photoIndex] = onboardingImage;
          setSecondaryPictures(updatedPhotos);
        } else {
          // Agregar nueva foto
          if (secondaryPictures.length < 4) {
            addSecondaryPicture(onboardingImage);
          }
        }
      }
    }
  };

  const handleRemoveSecondaryPhoto = (index: number) => {
    setSecondaryPictures(secondaryPictures.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const checkValidation = async () => {
      const isValid = await validateCurrentStep(2);
      setIsValidStep(isValid);
    };
    checkValidation();
  }, [mainPicture, secondaryPictures, validateCurrentStep]);

  const handleContinue = async () => {
    const isValid = await validateCurrentStep(3);
    if (isValid) {
      router.push("/onboarding/location");
    } else {
      Alert.alert(
        "Fotos requeridas",
        "Debes seleccionar al menos una foto principal para continuar"
      );
    }
  };

  // SUBMIT HANDLER for onboarding with images
  const handleSubmitOnboarding = async (profileFields: any) => {
    try {
      if (!mainPicture || !mainPicture.file) {
        Alert.alert("Error", "Debes seleccionar una foto principal.");
        return;
      }
      if (secondaryPictures.length !== 4 || secondaryPictures.some(img => !img.file)) {
        Alert.alert("Error", "Debes seleccionar 4 fotos secundarias.");
        return;
      }

      const formData = new FormData();
      // Profile fields
      Object.entries(profileFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      // Images
      formData.append("mainImage", {
        uri: mainPicture.file.uri,
        name: mainPicture.file.fileName || "main.jpg",
        type: mainPicture.file.mimeType || "image/jpeg",
      } as any);
      secondaryPictures.forEach((img, idx) => {
        formData.append("secondaryImages", {
          uri: img.file.uri,
          name: img.file.fileName || `secondary${idx + 1}.jpg`,
          type: img.file.mimeType || "image/jpeg",
        } as any);
      });

      // Import repository dynamically to avoid circular deps
      const { OnboardingRepository } = await import("@/src/features/users/repositories/onboarding.repository");
      await OnboardingRepository.submitOnboardingWithImages(formData);

      Alert.alert("Éxito", "Onboarding completado con imágenes.");
      router.push("/dashboard/radar");
    } catch (error) {
      Alert.alert("Error", "No se pudo completar el onboarding.");
      console.error(error);
    }
  };

  return (
    <OnboardingScreenLayout
      showProgress
      progressValue={75}
      showBackButton
      isStepValidated={isValidStep}
      footerButtonText="Listo, conocer amigos"
      onFooterButtonPress={handleContinue}
    >
      <View className="flex-1 h-full items-center pb-10">
        <View className="flex flex-1 justify-between h-full gap-10">
          {/* Título */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-black text-left mb-2">
              ¡Que se vea ese flow! ✨
            </Text>
            <Text className="text-gray-600 text-left text-xl">
              Elige una o varias fotos que te represente.
            </Text>
            <Text className="text-gray-600 text-left text-xl">
              Tranquilo, nada formal 😉
            </Text>
          </View>

          {/* Foto principal */}
          <View className="items-center mb-8">
            <TouchableOpacity
              onPress={() => showImagePickerOptions(true)}
              className="w-64 h-64 rounded-full bg-[#7CDAF9] items-center justify-center relative"
              style={{
                elevation: 2,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              {mainPicture ? (
                <Image
                  source={{ uri: mainPicture?.uri }}
                  className="w-full h-full rounded-full"
                />
              ) : (
                <CameraIcon />
              )}
              <View className="absolute bottom-2 right-2 bg-[#1E1E1E] rounded-full w-12 h-12 items-center justify-center">
                <Ionicons name="add" size={20} color="white" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Fotos secundarias */}
          <View className="bg-[#EAF9FE] rounded-3xl p-6">
            <View className="flex-row justify-between">
              {[...Array(4)].map((_, index) => {
                const secondaryPhotoUri = secondaryPictures[index];
                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      if (secondaryPhotoUri) {
                        Alert.alert("Foto secundaria", "Elige una opción", [
                          { text: "Cancelar", style: "cancel" },
                          {
                            text: "Cambiar",
                            onPress: () => showImagePickerOptions(false, index),
                          },
                          {
                            text: "Eliminar",
                            onPress: () => handleRemoveSecondaryPhoto(index),
                            style: "destructive",
                          },
                        ]);
                      } else {
                        showImagePickerOptions(false);
                      }
                    }}
                    className="w-16 h-16 rounded-full bg-sky-300 items-center justify-center"
                    style={{
                      elevation: 1,
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                    }}
                  >
                    {secondaryPhotoUri ? (
                      <Image
                        source={{ uri: secondaryPhotoUri?.uri }}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      <Ionicons
                        name="add"
                        size={24}
                        color="white"
                        className="font-bold"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </OnboardingScreenLayout>
  );
};

export default AddYourPicturesScreen;
