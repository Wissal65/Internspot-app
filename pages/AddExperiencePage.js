import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity , ScrollView , Alert } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNavigation } from '@react-navigation/native';
import { getFirestore, collection, addDoc, where, query, getDocs, getDoc, doc, updateDoc, setDoc } from 'firebase/firestore/lite'; // Import where, query, getDocs, doc, updateDoc, setDoc
import { db } from '../config/firebase';


export default function AddExperiencePage({route}) {
    const userID = route.params?.userID;
    const profileRedirect = route.params?.profileRedirect;
    const [company, setCompany] = useState('');
    const [postTitle, setPostTitle] = useState('');
    const [specialization, setSpecialization] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');
    const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
    const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

    const showStartDatePicker = () => {
        setStartDatePickerVisibility(true);
    };

    const hideStartDatePicker = () => {
        setStartDatePickerVisibility(false);
    };

    const handleStartDateConfirm = (selectedDate) => {
        setStartDate(selectedDate.toDateString());
        hideStartDatePicker();
    };

    const showEndDatePicker = () => {
        setEndDatePickerVisibility(true);
    };

    const hideEndDatePicker = () => {
        setEndDatePickerVisibility(false);
    };

    const handleEndDateConfirm = (selectedDate) => {
        setEndDate(selectedDate.toDateString());
        hideEndDatePicker();
    };

    const navigation = useNavigation();

    const handleCancel = () => {
        navigation.goBack();
    };

    const handleSubmit = async () => {
        if (!company || !postTitle || !specialization || !location || !startDate || !endDate || !description) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }

        const newExperience = {
            company,
            post_title: postTitle,
            specialization,
            location,
            start_date: startDate,
            end_date: endDate,
            description,
        };
        const userDocRef = doc(db, 'users', userID);
    
        try {
            const userDocSnapshot = await getDoc(userDocRef);
            
            if (userDocSnapshot.exists()) {
                const userData = userDocSnapshot.data();
                const experiences = userData.experiences || [];
                experiences.push(newExperience);
                await updateDoc(userDocRef, {
                    experiences: experiences,
                });
            } else {
                console.error("User document does not exist!");
            }
        } catch (error) {
            console.error("Error fetching user document:", error);
        }

        if (profileRedirect) {
            navigation.navigate('EditProfilePage');
        }else {
            navigation.navigate('ExperiencePage', { userID, addedNewExperience: true });
        }
    };

    return (
        <ScrollView style={styles.scrollViewStyle}>
        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Company</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Google"
                    value={company}
                    onChangeText={setCompany}
                />

                <Text style={styles.label}>Post Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Full Stack Developer"
                    value={postTitle}
                    onChangeText={setPostTitle}
                />

                <Text style={styles.label}>Specialization</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Web development"
                    value={specialization}
                    onChangeText={setSpecialization}
                />

                <Text style={styles.label}>Location</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Rabat - Salé"
                    value={location}
                    onChangeText={setLocation}
                />

                <View style={styles.datePickerContainer}>
                    <Text style={styles.label}>Start Date</Text>
                    <TouchableOpacity onPress={showStartDatePicker}>
                        <Text style={styles.dateText}>{startDate || 'Select start date'}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isStartDatePickerVisible}
                        mode="date"
                        onConfirm={handleStartDateConfirm}
                        onCancel={hideStartDatePicker}
                    />
                </View>

                <View style={styles.datePickerContainer}>
                    <Text style={[styles.label, { marginBottom: 5 }]}>End Date</Text>
                    <TouchableOpacity onPress={showEndDatePicker}>
                        <Text style={styles.dateText}>{endDate || 'Select end date'}</Text>
                    </TouchableOpacity>
                    <DateTimePickerModal
                        isVisible={isEndDatePickerVisible}
                        mode="date"
                        onConfirm={handleEndDateConfirm}
                        onCancel={hideEndDatePicker}
                    />
                </View>

                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={[styles.input, { height: 100 }]}
                    multiline
                    value={description}
                    onChangeText={setDescription}
                />

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#e8f0ff' }]} onPress={handleCancel}>
                        <Text style={[styles.buttonText, { color: "#0047D2" }]}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, { backgroundColor: '#0047D2' }]} onPress={handleSubmit}>
                        <Text style={[styles.buttonText, { color: 'white' }]}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollViewStyle: {
        flex: 1,
        backgroundColor: 'white',  // Match the background color for consistency
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: 'white',
    },
    form: {
        marginTop: 60,
    },
    label: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    datePickerContainer: {
        marginBottom: 15,
    },
    dateText: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        textAlignVertical: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        borderRadius: 30,
        paddingVertical: 10,
        marginHorizontal: 5,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
