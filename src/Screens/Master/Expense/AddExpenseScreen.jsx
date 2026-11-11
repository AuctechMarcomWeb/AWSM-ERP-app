import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import colors from '../../../themes/colors';
import AppLayout from '../../../components/AppLayout/AppLayout';
import BackHeader from '../../../components/BackHeader/BackHeader';
import {
    Body,
    Label,
    TextField,
    Dropdown,
    GreenButton,
    GrayButton,
    shared,
} from '../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const STATUS_OPTIONS = ['Active', 'Suspended', 'Expired'];

const AddExpenseScreen = ({ navigation }) => {
    const [form, setForm] = useState({
        title: '',
        status: 'Active',
    });

    const updateField = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        if (!form.title.trim()) {
            Alert.alert('Validation Error', 'Please enter Expense Title.');
            return;
        }

        Alert.alert('Success', 'Expense added successfully!', [
            { text: 'OK', onPress: () => navigation && navigation.goBack() },
        ]);
    };

    return (
        <AppLayout>
            <View style={styles.container}>
                <BackHeader
                    navigation={navigation}
                    title="Add Expense"
                    onBack={() => navigation && navigation.goBack()}
                />

                <View style={styles.body}>
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    >
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            <Body>
                                {/* Expense Title */}
                                <Label text="Expense Title *" />
                                <TextField
                                    placeholder="e.g. Electricity Bill"
                                    value={form.title}
                                    onChangeText={t => updateField('title', t)}
                                    style={styles.mb}
                                />

                                {/* Status */}
                                <Label text="Status" />
                                <Dropdown
                                    value={form.status}
                                    options={STATUS_OPTIONS}
                                    onSelect={val => updateField('status', val)}
                                    style={styles.mb}
                                />

                                {/* Action Buttons Row (Cancel & Save) */}
                                <View style={[styles.btnRow, { marginTop: 20 }]}>
                                    <GrayButton
                                        title="Cancel"
                                        onPress={() => navigation && navigation.goBack()}
                                        style={styles.cancelBtn}
                                    />
                                    <GreenButton
                                        title="Save Expense"
                                        icon="check"
                                        onPress={handleSave}
                                        style={styles.saveBtn}
                                    />
                                </View>
                            </Body>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </View>
            </View>
        </AppLayout>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F6F3',
  },
  body: {
    flex: 1,
    marginTop: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: 'hidden',
  },
    scrollContent: {
        paddingHorizontal: wp('4%'),
        paddingTop: 16,
        paddingBottom: 30,
             marginTop: 25,
    },
    mb: {
        marginBottom: 12,
    },
    btnRow: {
        flexDirection: 'row',
        gap: 10,
    },
    cancelBtn: {
        flex: 1,
        height: 50,
    },
    saveBtn: {
        flex: 1,
        height: 50,
    },
});

export default AddExpenseScreen;