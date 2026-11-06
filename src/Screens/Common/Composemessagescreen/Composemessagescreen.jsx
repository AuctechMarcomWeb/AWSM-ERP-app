import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import colors from '../../../themes/colors';
import { FontFamily, FontSize } from '../../../themes/typography';

import BottomNav from '../../../components/BottomNav/BottomNav';
import AppLayout from '../../../components/AppLayout/AppLayout';
import BackHeader from '../../../components/BackHeader/BackHeader';
const PRIORITIES = ['Normal', 'Urgent'];
const TYPES = ['Outbound', 'Inbound'];

const RADIO_OPTIONS = [
  {
    key: 'all',
    label: 'All Office Bearer, Executive Member & Local Secretary',
  },
  { key: 'office', label: 'All Office Bearer' },
  { key: 'executive', label: 'All Executive Member' },
  { key: 'local', label: 'All Local Secretary' },
];

const CHECK_OPTIONS = [
  { key: 'specificOffice', label: 'Specific Office Bearer' },
  { key: 'specificExecutive', label: 'Specific Executive Member' },
  { key: 'specificLocal', label: 'Specific Local Secretary' },
];

// ---------------------------------------------------------------
// Dropdown (modal list)
// ---------------------------------------------------------------
const Dropdown = ({ value, placeholder, options, onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.select}
        activeOpacity={0.8}
        onPress={() => setOpen(true)}
      >
        <Text
          style={value ? styles.selectText : styles.selectPlaceholder}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Icon name="chevron-down" size={22} color="#374151" />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.sheet}>
            {options.map(o => (
              <TouchableOpacity
                key={o}
                style={[
                  styles.sheetItem,
                  o === value && styles.sheetItemActive,
                ]}
                onPress={() => {
                  onSelect(o);
                  setOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.sheetText,
                    o === value && styles.sheetTextActive,
                  ]}
                >
                  {o}
                </Text>
                {o === value && (
                  <Icon name="check" size={18} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// ---------------------------------------------------------------
// Screen
// ---------------------------------------------------------------
const ComposeMessageScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [priority, setPriority] = useState('');
  const [type, setType] = useState('Outbound');
  const [target, setTarget] = useState('all');
  const [specific, setSpecific] = useState([]);
  const [sending, setSending] = useState(false);

  const selectRadio = key => {
    setTarget(key);
    setSpecific([]);
  };

  const toggleSpecific = key => {
    setTarget(null);
    setSpecific(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key],
    );
  };

  const handleAttach = async () => {
    // Plug in your picker here, e.g. react-native-document-picker:
    // const res = await DocumentPicker.pickSingle({
    //   type: [DocumentPicker.types.images, DocumentPicker.types.pdf, DocumentPicker.types.doc, DocumentPicker.types.docx],
    // });
    // setFileName(res.name);
    Alert.alert('Attach file', 'Connect your file picker in handleAttach().');
  };

  const handleSend = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter message title');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Required', 'Please enter message description');
      return;
    }

    if (!target && specific.length === 0) {
      Alert.alert('Required', 'Please select who to send to');
      return;
    }

    setSending(true);

    try {
      // Connect your send-message API here.
      console.log('Send message:', {
        title,
        description,
        fileName,
        priority,
        type,
        target,
        specific,
      });

      navigation && navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <AppLayout>
      <View style={styles.container}>
        <BackHeader
          navigation={navigation}
          title="Compose Message"
          onBack={() => navigation && navigation.goBack()}
        />

        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Title */}
            <Text style={styles.label}>
              Title <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Message title"
              placeholderTextColor={colors.placeHolderColor}
              value={title}
              onChangeText={setTitle}
              editable={!sending}
            />

            {/* Description */}
            <Text style={[styles.label, styles.labelGap]}>
              Description <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter message description..."
              placeholderTextColor={colors.placeHolderColor}
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              editable={!sending}
            />

            {/* Attach */}
            <TouchableOpacity
              style={styles.attach}
              activeOpacity={0.8}
              onPress={handleAttach}
            >
              <Icon name="upload-outline" size={22} color="#2E8B3E" />
              <Text style={styles.attachText} numberOfLines={1}>
                {fileName || 'Click to attach file'}
              </Text>
              {!fileName && (
                <Text style={styles.attachHint}>JPG, PNG, PDF, DOC, DOCX</Text>
              )}
            </TouchableOpacity>

            {/* Priority & Type */}
            <View style={styles.twoCol}>
              <View style={styles.colLeft}>
                <Text style={styles.label}>Priority</Text>
                <Dropdown
                  value={priority}
                  placeholder="Select priority"
                  options={PRIORITIES}
                  onSelect={setPriority}
                />
              </View>

              <View style={styles.colRight}>
                <Text style={styles.label}>Type</Text>
                <Dropdown
                  value={type}
                  placeholder="Select type"
                  options={TYPES}
                  onSelect={setType}
                />
              </View>
            </View>

            {/* Send To */}
            <Text style={[styles.label, styles.labelGap]}>
              Send To <Text style={styles.required}>*</Text>
            </Text>

            {RADIO_OPTIONS.map(o => {
              const selected = target === o.key;

              return (
                <TouchableOpacity
                  key={o.key}
                  style={styles.optionRow}
                  activeOpacity={0.7}
                  onPress={() => selectRadio(o.key)}
                >
                  <View style={[styles.radio, selected && styles.radioActive]}>
                    {selected && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.optionText}>{o.label}</Text>
                </TouchableOpacity>
              );
            })}

            <View style={styles.optionGap} />

            {CHECK_OPTIONS.map(o => {
              const checked = specific.includes(o.key);

              return (
                <TouchableOpacity
                  key={o.key}
                  style={styles.optionRow}
                  activeOpacity={0.7}
                  onPress={() => toggleSpecific(o.key)}
                >
                  <View
                    style={[styles.checkbox, checked && styles.checkboxActive]}
                  >
                    {checked && (
                      <Icon name="check" size={16} color={colors.white} />
                    )}
                  </View>
                  <Text style={styles.optionText}>{o.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelButton}
              activeOpacity={0.8}
              onPress={() => navigation && navigation.goBack()}
              disabled={sending}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sendButton}
              activeOpacity={0.85}
              onPress={handleSend}
              disabled={sending}
            >
              <Icon name="send" size={20} color={colors.white} />
              <Text style={styles.sendText}>
                {sending ? 'Sending...' : 'Send Message'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    paddingHorizontal: wp('5%'),
    paddingTop: 22,
    paddingBottom: 16,
  },

  label: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: colors.TitleColor,
    marginBottom: 8,
  },

  labelGap: {
    marginTop: 18,
  },

  required: {
    color: colors.requiredColor,
  },

  input: {
    height: 52,
    backgroundColor: '#FBFCFB',
    borderWidth: 1,
    borderColor: '#E2E8E4',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: colors.SecondTitleColor,
  },

  textArea: {
    height: 120,
    paddingTop: 12,
  },

  // Attach
  attach: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    marginTop: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#5DBB6E',
    borderRadius: 12,
    backgroundColor: '#F6FCF8',
    paddingHorizontal: 12,
  },

  attachText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.semiBold,
    color: '#2E8B3E',
    marginLeft: 8,
    flexShrink: 1,
  },

  attachHint: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
    marginLeft: 8,
  },

  // Priority & Type
  twoCol: {
    flexDirection: 'row',
    marginTop: 18,
  },

  colLeft: {
    flex: 1,
    marginRight: 12,
  },

  colRight: {
    flex: 1,
  },

  select: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FBFCFB',
    borderWidth: 1,
    borderColor: '#E2E8E4',
    borderRadius: 12,
    paddingHorizontal: 14,
  },

  selectText: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.medium,
    color: '#111827',
  },

  selectPlaceholder: {
    flex: 1,
    fontSize: FontSize.md,
    fontFamily: FontFamily.regular,
    color: '#6B7280',
  },

  // Send to
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  optionText: {
    flex: 1,
    fontSize: FontSize.base,
    fontFamily: FontFamily.regular,
    color: '#1F2937',
    marginLeft: 12,
  },

  optionGap: {
    height: 6,
  },

  radio: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },

  radioActive: {
    borderColor: '#2E8B3E',
  },

  radioDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2E8B3E',
  },

  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 1,
  },

  checkboxActive: {
    backgroundColor: '#2E8B3E',
    borderColor: '#2E8B3E',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    paddingHorizontal: wp('5%'),
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    borderTopWidth: 1,
    borderTopColor: '#EEF1EF',
    backgroundColor: colors.white,
  },

  cancelButton: {
    flex: 0.8,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  cancelText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.semiBold,
    color: '#1F2937',
  },

  sendButton: {
    flex: 1.5,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#2E8B3E',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  sendText: {
    fontSize: FontSize.md,
    fontFamily: FontFamily.bold,
    color: colors.white,
    marginLeft: 8,
  },

  // Dropdown modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sheet: {
    width: wp('65%'),
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 8,
    elevation: 8,
  },

  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 13,
  },

  sheetItemActive: {
    backgroundColor: colors.primaryLight,
  },

  sheetText: {
    fontSize: FontSize.base,
    fontFamily: FontFamily.medium,
    color: colors.SecondTitleColor,
  },

  sheetTextActive: {
    fontFamily: FontFamily.bold,
    color: colors.primary,
  },
});

export default ComposeMessageScreen;
