import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import
{
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    ScrollView,


} from "react-native";
import { Camera, CameraType, FlashMode } from "expo-camera";
import Icon from "react-native-vector-icons/Feather";
import { addDoc, auth, db, collection, serverTimestamp, getDownloadURL, getStorage, ref, uploadBytes } from '../firebase'
import * as MediaLibrary from "expo-media-library";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";

const { width: wWidth, height: wHeight } = Dimensions.get("screen");

const ImageCapture = () =>
{
    const [permission, requestPermission] = Camera.useCameraPermissions()
    const [permissionMediaLibraryResponse, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
    const [type, setType] = useState(CameraType.back);
    const [flash, setFlash] = useState(FlashMode.off);
    const navigation = useNavigation()
    const { params: { id } } = useRoute()
    const cam = useRef();
    const takePicture = async () =>
    {
        if (cam.current)
        {
            const options = {
                quality: 0.5,
                base64: true,
                skipProcessing: false,
            };
            let photo = await cam.current.takePictureAsync(options);
            //  console.log(cam.current.getSupportedRatioAsync());
            const source = photo.uri;
            if (source)
            {
                cam.current.resumePreview();
                await handleSave(source);
                console.log("picture source       ", source);
                navigation.goBack();
            }
        }
    };

    const handleSave = async (url) =>
    {
        const { status } = permissionMediaLibraryResponse;
        if (status === 'granted')
        {
            const assert = await MediaLibrary.createAssetAsync(url);
            await MediaLibrary.createAlbumAsync('chat/chat images', assert);


            let type = 'image';
            let filename = url.split("/");
            filename = filename[filename.length - 1];
            const response = await fetch(url);
            let blob = await response.blob();
            // remove last slash from local file path
            url = url.substring(url.lastIndexOf('/') + 1);

            // create a file ref
            const fileRef = ref(getStorage(), url);

            //upload image to firebase storage 
            await uploadBytes(fileRef, blob,);

            //get image url
            let fileurl = await getDownloadURL(fileRef);
            //save image url as text in message field
            await sendMessage(fileurl, type, filename)
        } else
        {
            console.log("Oh! You Missed to give permission");
        }

    };
    const sendMessage = async (fileurl = null, type = 'text', filename = undefined) =>
    {
        try
        {

            let doc = {
                message: fileurl,
                type: type,

                timestamp: serverTimestamp(),
                email: auth.currentUser.email,
                username: auth.currentUser.displayName,
                photoURL: auth.currentUser.photoURL
            }
            if (filename)
            {
                doc.filename = filename
            }
            await addDoc(
                collection(
                    db,
                    "chats",
                    id,
                    "messages"
                ),
                doc
            );



        } catch (error)
        {
            console.log(error);
        }

    };
    useEffect(() =>
    {
        (async () =>
        {
            const { status } = await requestPermission();
            console.log(status)
        })();
    }, []);
    useEffect(() =>
    {
        (async () =>
        {
            const { status } = await requestMediaLibraryPermission();
            console.log(status)
        })();
    }, []);

    useLayoutEffect(() =>
    {
        navigation.setOptions({
            headerShown: false,
        })
    }, [])
    if (permission?.status === null)
    {
        return <View />;
    }
    if (permission?.status === false)
    {
        return <Text>No access to camera</Text>;
    }
    const toggleFlash = () =>
    {
        setFlash((current) =>
            current === FlashMode.off
                ? FlashMode.on
                : FlashMode.off
        );
    };

    return (
        <View style={{ flex: 1, paddingTop: 28 }}>
            <StatusBar />
            <Camera
                style={styles.cameraBox}
                type={type}
                ref={cam}
                flashMode={flash}
                autoFocus="on"

            >
                <View style={styles.camContainer}>
                    <View style={styles.camHeader}>
                        <ScrollView>
                            <View>
                                <TouchableOpacity onPress={toggleFlash}>
                                    <Icon
                                        name={
                                            flash === FlashMode.on
                                                ? "zap"
                                                : "zap-off"
                                        }
                                        size={20}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                    <View style={styles.camBottom}>
                        <View style={styles.camBottomInside}>
                            <View>
                                <View>
                                    <TouchableOpacity
                                        onPress={() =>
                                        {
                                            setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
                                        }}
                                    >
                                        <Icon name="refresh-cw" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity onPress={takePicture}>
                                    <Icon name="aperture" size={50} color="white" />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity
                                    onPress={() =>
                                        alert("Clicked", "clicked on Grid button")
                                    }
                                >
                                    <Icon name="grid" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </Camera>
        </View>
    );
};
export default ImageCapture;

const styles = StyleSheet.create({
    cameraBox: {
        flex: 1,
    },
    camContainer: {
        flex: 1,
        backgroundColor: "transparent",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    camHeader: {
        backgroundColor: "black",
        height: wHeight * 0.1 - 10,
        width: wWidth,
        padding: 20,
        justifyContent: "center",
    },
    camBottom: {
        opacity: 0.5,
        backgroundColor: "black",
        height: wHeight * 0.2 - 50,
        width: wWidth,
        flexDirection: "column",
        justifyContent: "center",
        // alignItems: 'center'
    },
    camBottomInside: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
});
