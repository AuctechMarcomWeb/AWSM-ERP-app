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
    DateField,
    GreenButton,
    shared,
} from '../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const CATEGORY_OPTIONS = ['Senior', 'Junior', 'Post Graduate', 'Doctorate'];
const STATUS_OPTIONS = ['Active', 'Suspended', 'Expired'];

const AddScholarshipDateScreen = ({ navigation }) => {
    const [form, setForm] = useState({
        category: 'Senior',
        startDate: null,
        endDate: null,
        remarks: '',
        status: 'Active',
    });

    const updateField = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        if (!form.category.trim()) {
            Alert.alert('Validation Error', 'Please select or enter category.');
            return;
        }
        if (!form.startDate) {
            Alert.alert('Validation Error', 'Please select Start Date.');
            return;
        }
        if (!form.endDate) {
            Alert.alert('Validation Error', 'Please select End Date.');
            return;
        }

        Alert.alert('Success', 'Scholarship Date added successfully!', [
            { text: 'OK', onPress: () => navigation && navigation.goBack() },
        ]);
    };

    return (
        <AppLayout>
            <View style={styles.container}>
                <BackHeader
                    navigation={navigation}
                    title="Add Scholarship Date"
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
                                {/* Category */}
                                <Label text="Category *" />
                                <Dropdown
                                    value={form.category}
                                    options={CATEGORY_OPTIONS}
                                    onSelect={val => updateField('category', val)}
                                    style={styles.mb}
                                    searchable
                                />

                                {/* Start Date & End Date */}
                                <View style={[shared.row, styles.gapRow]}>
                                    <View style={shared.colL}>
                                        <Label text="Start Date *" />
                                        <DateField
                                            value={form.startDate}
                                            onChange={date => updateField('startDate', date)}
                                            placeholder="dd/mm/yyyy"
                                        />
                                    </View>
                                    <View style={shared.col}>
                                        <Label text="End Date *" />
                                        <DateField
                                            value={form.endDate}
                                            onChange={date => updateField('endDate', date)}
                                            placeholder="dd/mm/yyyy"
                                        />
                                    </View>
                                </View>

                                {/* Remarks */}
                                <Label text="Remarks (optional)" />
                                <TextField
                                    placeholder="Enter remarks..."
                                    value={form.remarks}
                                    onChangeText={t => updateField('remarks', t)}
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

                                {/* Submit Button */}
                                <View style={styles.btnContainer}>
                                    <GreenButton
                                        title="Save Scholarship Date"
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

export default AddScholarshipDateScreen;