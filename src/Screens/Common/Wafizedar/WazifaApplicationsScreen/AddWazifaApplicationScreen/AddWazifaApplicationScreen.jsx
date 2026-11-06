import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../../../../themes/colors';
import { FontFamily, FontSize } from '../../../../../themes/typography';

import AppLayout from '../../../../../components/AppLayout/AppLayout';
import BackHeader from '../../../../../components/BackHeader/BackHeader';
import {
  Body,
  Label,
  TextField,
  DateField,
  Dropdown,
  GreenButton,
  GrayButton,
  shared,
} from '../../../../../components/Formparts';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const STEPS = [
  { no: 1, title: 'Personal Info' },
  { no: 2, title: 'Academic Info' },
  { no: 3, title: 'Family Info' },
  { no: 4, title: 'Bank Details' },
  { no: 5, title: 'Education History' },
  { no: 6, title: 'Siblings' },
];

const COURSE_OPTIONS = [
  '-- Select Course --',
  'B.Tech',
  'B.A.',
  'B.Sc.',
  'M.Tech',
  'MBA',
  'Other',
];

const AddWazifaApplicationScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // 1. Personal Info State
  const [studentName, setStudentName] = useState('');
  const [dob, setDob] = useState(null);
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pincode, setPincode] = useState('');
  const [permAddress, setPermAddress] = useState('');
  const [presAddress, setPresAddress] = useState('');

  // 2. Academic Info State
  const [courseOfStudy, setCourseOfStudy] = useState('-- Select Course --');
  const [courseDuration, setCourseDuration] = useState('');
  const [semesterYear, setSemesterYear] = useState('');
  const [presentClass, setPresentClass] = useState('');
  const [institutionName, setInstitutionName] = useState('');
  const [admissionFees, setAdmissionFees] = useState('');
  const [annualFees, setAnnualFees] = useState('');

  // 3. Family Info State
  const [fatherName, setFatherName] = useState('');
  const [fatherIncome, setFatherIncome] = useState('');
  const [motherName, setMotherName] = useState('');
  const [motherIncome, setMotherIncome] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('');

  // 4. Bank Details State
  const [accHolderName, setAccHolderName] = useState('');
  const [accNumber, setAccNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [bankBranch, setBankBranch] = useState('');

  // 5. Education History State
  const [eduRecords, setEduRecords] = useState([
    {
      id: '1',
      board: '',
      course: '',
      passingYear: '',
      division: '',
      percentage: '',
    },
  ]);

  const addEduRecord = () => {
    setEduRecords(prev => [
      ...prev,
      {
        id: String(Date.now()),
        board: '',
        course: '',
        passingYear: '',
        division: '',
        percentage: '',
      },
    ]);
  };

  const updateEduRecord = (id, field, value) => {
    setEduRecords(prev =>
      prev.map(r => (r.id === id ? { ...r, [field]: value } : r)),
    );
  };

  // 6. Siblings State
  const [siblings, setSiblings] = useState([
    { id: '1', name: '', classCourse: '', institute: '', wazifaGranted: 'No' },
  ]);

  const addSibling = () => {
    setSiblings(prev => [
      ...prev,
      {
        id: String(Date.now()),
        name: '',
        classCourse: '',
        institute: '',
        wazifaGranted: 'No',
      },
    ]);
  };

  const updateSibling = (id, field, value) => {
    setSiblings(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s)),
    );
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final Submit / Success
      navigation && navigation.navigate('WazifaApplicationSubmittedScreen');
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigation && navigation.goBack();
    }
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Add Wazifa "
          onBack={() => navigation && navigation.goBack()}
        />

        <View style={styles.body}>
          <Body>
            <KeyboardAvoidingView
              style={styles.flex}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {/* Multi-step Header Indicator */}
                <View style={styles.stepperRow}>
                  {STEPS.map(s => {
                    const isActive = currentStep === s.no;
                    const isPassed = currentStep > s.no;
                    return (
                      <View key={s.no} style={styles.stepItem}>
                        <View
                          style={[
                            styles.stepCircle,
                            isActive && styles.stepCircleActive,
                            isPassed && styles.stepCirclePassed,
                          ]}
                        >
                          {isPassed ? (
                            <Icon name="check" size={14} color={colors.white} />
                          ) : (
                            <Text
                              style={[
                                styles.stepNoText,
                                (isActive || isPassed) &&
                                  styles.stepNoTextActive,
                              ]}
                            >
                              {s.no}
                            </Text>
                          )}
                        </View>
                        <Text
                          style={[
                            styles.stepTitleText,
                            isActive && styles.stepTitleTextActive,
                          ]}
                          numberOfLines={1}
                        >
                          {s.title}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* ================= STEP 1: PERSONAL INFO ================= */}
                {currentStep === 1 && (
                  <View>
                    <Text style={styles.sectionHeading}>Student Details</Text>

                    <View style={shared.row}>
                      <View style={shared.colL}>
                        <Label text="Student Name *" />
                        <TextField
                          placeholder="Enter student name"
                          value={studentName}
                          onChangeText={setStudentName}
                        />
                      </View>
                      <View style={shared.col}>
                        <Label text="Date of Birth" />
                        <DateField
                          value={dob}
                          onChange={setDob}
                          leftIcon="calendar-month-outline"
                          hideRightIcon
                        />
                      </View>
                    </View>

                    <View style={shared.row}>
                      <View style={shared.colL}>
                        <Label text="Contact Number *" />
                        <TextField
                          placeholder="10 digits number"
                          value={contact}
                          onChangeText={setContact}
                          keyboardPhone
                        />
                      </View>
                      <View style={shared.col}>
                        <Label text="Email" />
                        <TextField
                          placeholder="Enter email address"
                          value={email}
                          onChangeText={setEmail}
                          keyboardType="email-address"
                        />
                      </View>
                    </View>

                    <View style={shared.row}>
                      <View style={shared.colL}>
                        <Label text="Aadhaar Number" />
                        <TextField
                          placeholder="12 digits number"
                          value={aadhaar}
                          onChangeText={setAadhaar}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={shared.col}>
                        <Label text="Pin Code" />
                        <TextField
                          placeholder="6 digits pin code"
                          value={pincode}
                          onChangeText={setPincode}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    <Label text="Permanent Address" />
                    <TextField
                      placeholder="E.g. House No., Street, Area, City, State"
                      value={permAddress}
                      onChangeText={setPermAddress}
                      multiline
                      style={styles.textArea}
                    />

                    <Label text="Present Address" />
                    <TextField
                      placeholder="E.g. House No., Street, Area, City, State"
                      value={presAddress}
                      onChangeText={setPresAddress}
                      multiline
                      style={styles.textArea}
                    />
                  </View>
                )}

                {/* ================= STEP 2: ACADEMIC INFO ================= */}
                {currentStep === 2 && (
                  <View>
                    <Text style={styles.sectionHeading}>Academic Details</Text>

                    <Label text="Course of Study *" />
                    <Dropdown
                      value={courseOfStudy}
                      options={COURSE_OPTIONS}
                      onSelect={setCourseOfStudy}
                      style={styles.inputGap}
                    />

                    <View style={shared.row}>
                      <View style={shared.colL}>
                        <Label text="Course Duration" />
                        <TextField
                          placeholder="e.g. 4 Years"
                          value={courseDuration}
                          onChangeText={setCourseDuration}
                        />
                      </View>
                      <View style={shared.col}>
                        <Label text="Semester / Year" />
                        <TextField
                          placeholder="e.g. 3rd Semester"
                          value={semesterYear}
                          onChangeText={setSemesterYear}
                        />
                      </View>
                    </View>

                    <View style={shared.row}>
                      <View style={shared.colL}>
                        <Label text="Present Class" />
                        <TextField
                          placeholder="e.g. 2nd Year"
                          value={presentClass}
                          onChangeText={setPresentClass}
                        />
                      </View>
                      <View style={shared.col}>
                        <Label text="Institution Name *" />
                        <TextField
                          placeholder="Name of institution"
                          value={institutionName}
                          onChangeText={setInstitutionName}
                        />
                      </View>
                    </View>

                    <View style={shared.row}>
                      <View style={shared.colL}>
                        <Label text="Admission Fees (Rs.)" />
                        <TextField
                          placeholder="e.g. 25000"
                          value={admissionFees}
                          onChangeText={setAdmissionFees}
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={shared.col}>
                        <Label text="Total Annual Fees (₹)" />
                        <TextField
                          placeholder="e.g. 85000"
                          value={annualFees}
                          onChangeText={setAnnualFees}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>
                )}

                {/* ================= STEP 3: FAMILY INFO ================= */}
                {currentStep === 3 && (
                  <View>
                    <Text style={styles.sectionHeading}>Family Details</Text>

                    <View style={shared.row}>
                      <View style={shared.colL}>
                        <Label text="Father Name" />
                        <TextField
                          placeholder="Enter father's name"
                          value={fatherName}
                          onChangeText={setFatherName}
                        />
                      </View>
                      <View style={shared.col}>
                        <Label text="Father Annual Income (Rs)" />
                        <TextField
                          placeholder="Enter annual income"
                          value={fatherIncome}
                          onChangeText={setFatherIncome}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    <View style={shared.row}>
                      <View style={shared.colL}>
                        <Label text="Mother Name" />
                        <TextField
                          placeholder="Enter mother's name"
                          value={motherName}
                          onChangeText={setMotherName}
                        />
                      </View>
                      <View style={shared.col}>
                        <Label text="Mother Annual Income (Rs)" />
                        <TextField
                          placeholder="Enter annual income"
                          value={motherIncome}
                          onChangeText={setMotherIncome}
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    <View style={shared.row}>
                      <View style={shared.colL}>
                        <Label text="Guardian Name" />
                        <TextField
                          placeholder="Enter guardian's name"
                          value={guardianName}
                          onChangeText={setGuardianName}
                        />
                      </View>
                      <View style={shared.col}>
                        <Label text="Guardian Relationship" />
                        <TextField
                          placeholder="Relationship"
                          value={guardianRelation}
                          onChangeText={setGuardianRelation}
                        />
                      </View>
                    </View>
                  </View>
                )}

                {/* ================= STEP 4: BANK DETAILS ================= */}
                {currentStep === 4 && (
                  <View>
                    <Text style={styles.sectionHeading}>
                      Bank Account Details
                    </Text>

                    <Label text="Account Holder Name" />
                    <TextField
                      placeholder="Enter account holder's name"
                      value={accHolderName}
                      onChangeText={setAccHolderName}
                      style={styles.inputGap}
                    />

                    <Label text="Account Number" />
                    <TextField
                      placeholder="Enter bank account number"
                      value={accNumber}
                      onChangeText={setAccNumber}
                      keyboardType="numeric"
                      style={styles.inputGap}
                    />

                    <Label text="IFSC Code" />
                    <TextField
                      placeholder="Enter IFSC code"
                      value={ifscCode}
                      onChangeText={setIfscCode}
                      style={styles.inputGap}
                    />

                    <Label text="Bank Name & Branch" />
                    <TextField
                      placeholder="Enter bank name and branch"
                      value={bankBranch}
                      onChangeText={setBankBranch}
                      style={styles.inputGap}
                    />
                  </View>
                )}

                {/* ================= STEP 5: EDUCATION HISTORY ================= */}
                {currentStep === 5 && (
                  <View>
                    <View style={styles.subHeaderRow}>
                      <Text style={styles.sectionHeading}>
                        Education History
                      </Text>
                      <TouchableOpacity
                        style={styles.addRecordBtn}
                        onPress={addEduRecord}
                      >
                        <Icon name="plus" size={16} color={colors.white} />
                        <Text style={styles.addRecordText}>Add Record</Text>
                      </TouchableOpacity>
                    </View>

                    {eduRecords.map((rec, index) => (
                      <View key={rec.id} style={styles.dynamicCard}>
                        <Text style={styles.cardIndexTitle}>
                          Record {index + 1}
                        </Text>

                        <Label text="Board / University" />
                        <TextField
                          placeholder="Enter board or university name"
                          value={rec.board}
                          onChangeText={v =>
                            updateEduRecord(rec.id, 'board', v)
                          }
                          style={styles.inputGap}
                        />

                        <Label text="Class / Course" />
                        <TextField
                          placeholder="Enter class or course name"
                          value={rec.course}
                          onChangeText={v =>
                            updateEduRecord(rec.id, 'course', v)
                          }
                          style={styles.inputGap}
                        />

                        <View style={shared.row}>
                          <View style={shared.colL}>
                            <Label text="Passing Year" />
                            <TextField
                              placeholder="Passing year"
                              value={rec.passingYear}
                              onChangeText={v =>
                                updateEduRecord(rec.id, 'passingYear', v)
                              }
                              keyboardType="numeric"
                            />
                          </View>
                          <View style={shared.col}>
                            <Label text="Division" />
                            <TextField
                              placeholder="Division"
                              value={rec.division}
                              onChangeText={v =>
                                updateEduRecord(rec.id, 'division', v)
                              }
                            />
                          </View>
                        </View>

                        <Label text="Percentage / CGPA" />
                        <TextField
                          placeholder="Enter percentage or CGPA"
                          value={rec.percentage}
                          onChangeText={v =>
                            updateEduRecord(rec.id, 'percentage', v)
                          }
                          style={styles.inputGap}
                        />
                      </View>
                    ))}
                  </View>
                )}

                {/* ================= STEP 6: SIBLINGS / STRINGS ================= */}
                {currentStep === 6 && (
                  <View>
                    <View style={styles.subHeaderRow}>
                      <Text style={styles.sectionHeading}>
                        Siblings Details
                      </Text>
                      <TouchableOpacity
                        style={styles.addRecordBtn}
                        onPress={addSibling}
                      >
                        <Icon name="plus" size={16} color={colors.white} />
                        <Text style={styles.addRecordText}>Add Sibling</Text>
                      </TouchableOpacity>
                    </View>

                    {siblings.map((sib, index) => (
                      <View key={sib.id} style={styles.dynamicCard}>
                        <Text style={styles.cardIndexTitle}>
                          Sibling {index + 1}
                        </Text>

                        <Label text="Name" />
                        <TextField
                          placeholder="Enter sibling's name"
                          value={sib.name}
                          onChangeText={v => updateSibling(sib.id, 'name', v)}
                          style={styles.inputGap}
                        />

                        <Label text="Class" />
                        <TextField
                          placeholder="Enter class or course"
                          value={sib.classCourse}
                          onChangeText={v =>
                            updateSibling(sib.id, 'classCourse', v)
                          }
                          style={styles.inputGap}
                        />

                        <Label text="Institute" />
                        <TextField
                          placeholder="Institute name"
                          value={sib.institute}
                          onChangeText={v =>
                            updateSibling(sib.id, 'institute', v)
                          }
                          style={styles.inputGap}
                        />

                        <Label text="Wazifa Granted?" />
                        <Dropdown
                          value={sib.wazifaGranted}
                          options={['No', 'Yes']}
                          onSelect={v =>
                            updateSibling(sib.id, 'wazifaGranted', v)
                          }
                        />
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>

              {/* Footer Buttons */}
              <View style={shared.footer}>
                <GrayButton
                  title={currentStep === 1 ? 'Cancel' : '← Back'}
                  onPress={handleBackStep}
                  style={styles.cancelBtn}
                />
                <GreenButton
                  title={currentStep === 6 ? 'Submit Application' : 'Next →'}
                  onPress={handleNext}
                  style={styles.nextBtn}
                />
              </View>
            </KeyboardAvoidingView>
          </Body>
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
  flex: { flex: 1 },
  scrollContent: {
    paddingHorizontal: wp('4%'),
    paddingTop: 14,
    paddingBottom: 24,
    marginTop: 30,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  stepItem: { alignItems: 'center', flex: 1 },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepCircleActive: { backgroundColor: colors.primary },
  stepCirclePassed: { backgroundColor: colors.success },
  stepNoText: { fontSize: 10, fontFamily: FontFamily.bold, color: '#6B7280' },
  stepNoTextActive: { color: colors.white },
  stepTitleText: {
    fontSize: 9,
    fontFamily: FontFamily.medium,
    color: '#6B7280',
    textAlign: 'center',
  },
  stepTitleTextActive: { fontFamily: FontFamily.bold, color: colors.primary },
  sectionHeading: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.bold,
    color: colors.TitleColor,
    marginBottom: 10,
  },
  textArea: { height: 72, paddingTop: 8, alignItems: 'flex-start' },
  inputGap: { marginBottom: 12 },
  subHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  addRecordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addRecordText: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.semiBold,
    color: colors.white,
    marginLeft: 4,
  },
  dynamicCard: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  cardIndexTitle: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.bold,
    color: colors.primary,
    marginBottom: 8,
  },
  cancelBtn: { flex: 1, marginRight: 10 },
  nextBtn: { flex: 1.5 },
});

export default AddWazifaApplicationScreen;
