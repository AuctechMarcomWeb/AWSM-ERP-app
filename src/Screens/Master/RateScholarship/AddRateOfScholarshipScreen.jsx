import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

import colors from '../../../../themes/colors';
import AppLayout from '../../../../components/AppLayout/AppLayout';
import BackHeader from '../../../../components/BackHeader/BackHeader';
import {
    Body,
    Label,
    TextField,
    Dropdown,
    GreenButton,
    shared,
} from '../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const COURSE_TYPES = ['Senior', 'Junior', 'Post Graduate', 'Doctorate'];
const SESSIONS = ['2026-2027', '2025-2026', '2024-2025'];
const STATUS_OPTIONS = ['Active', 'Suspended', 'Expired'];

const AddRateOfScholarshipScreen = ({ navigation }) => {
    const [form, setForm] = useState({
        courseType: 'Senior',
        className: '',
        ratePerMonth: '',
        amountPerYear: '',
        session: '2026-2027',
        status: 'Active',
    });

    const updateField = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        if (!form.className.trim()) {
            Alert.alert('Validation Error', 'Please enter class name.');
            return;
        }
        if (!form.ratePerMonth.trim()) {
            Alert.alert('Validation Error', 'Please enter rate per month.');
            return;
        }
        if (!form.amountPerYear.trim()) {
            Alert.alert('Validation Error', 'Please enter amount per year.');
            return;
        }

        Alert.alert('Success', 'Scholarship rate added successfully!', [
            { text: 'OK', onPress: () => navigation && navigation.goBack() },
        ]);
    };

    return (
        <AppLayout>
            <View style={styles.container}>
                <BackHeader
                    navigation={navigation}
                    title="Add Rate of Scholarship"
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
                                {/* Course Type & Session */}
                                <View style={[shared.row, styles.gapRow]}>
                                    <View style={shared.colL}>
                                        <Label text="Course Type *" />
                                        <Dropdown
                                            value={form.courseType}
                                            options={COURSE_TYPES}
                                            onSelect={val => updateField('courseType', val)}
                                        />
                                    </View>
                                    <View style={shared.col}>
                                        <Label text="Session *" />
                                        <Dropdown
                                            value={form.session}
                                            options={SESSIONS}
                                            onSelect={val => updateField('session', val)}
                                        />
                                    </View>
                                </View>

                                {/* Name of Class */}
                                <Label text="Name of Class *" />
                                <TextField
                                    placeholder="Enter class name..."
                                    value={form.className}
                                    onChangeText={t => updateField('className', t)}
                                    style={styles.mb}
                                />

                                {/* Rate Per Month & Amount Per Year */}
                                <View style={[shared.row, styles.gapRow]}>
                                    <View style={shared.colL}>
                                        <Label text="Rate Per Month *" />
                                        <TextField
                                            placeholder="Enter rate per month..."
                                            keyboardType="numeric"
                                            value={form.ratePerMonth}
                                            onChangeText={t => updateField('ratePerMonth', t)}
                                        />
                                    </View>
                                    <View style={shared.col}>
                                        <Label text="Amount Per Year (Rs.) *" />
                                        <TextField
                                            placeholder="Enter amount per year..."
                                            keyboardType="numeric"
                                            value={form.amountPerYear}
                                            onChangeText={t => updateField('amountPerYear', t)}
                                        />
                                    </View>
                                </View>

                                {/* Status */}
                                <Label text="Status" />
                                <Dropdown
                                    value={form.status}
                                    options={STATUS_OPTIONS}
                                    onSelect={val => updateField('status', val)}
                                    style={styles.mb}
                                />

                                {/* Submit Button */}
                                <View style={styles.btnContainer}>
                                    <GreenButton
                                        title="Save Scholarship Rate"
                                        icon="check"
                                        onPress={handleSave}
                                        style={styles.submitBtn}
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
    container: { flex: 1, backgroundColor: colors.primary },
    body: { flex: 1, backgroundColor: colors.white, overflow: 'hidden' },
    scrollContent: {
        paddingHorizontal: wp('4%'),
        paddingTop: 16,
        paddingBottom: 30,
    },
    gapRow: {
        marginBottom: 12,
    },
    mb: {
        marginBottom: 12,
    },
    btnContainer: {
        marginTop: 20,
    },
    submitBtn: {
        height: 50,
    },
});

export default AddRateOfScholarshipScreen;