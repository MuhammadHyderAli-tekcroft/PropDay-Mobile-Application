import { useMemo, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Pressable,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
    ADDRESS_FIELD_ROWS,
    CREATE_PROPERTY_STEPS,
    CREATE_PROPERTY_TOTAL_STEPS,
    DEFAULT_PROPERTY_COUNTRY,
    PROPERTY_LICENSE_OPTIONS,
    SPECS_FIELD_ROWS,
    SPECS_PICKER_CONFIG,
} from '../constants/createProperty';
import { useCreatePropertyLookups } from '../queries/createPropertyQueries';
import { createPropertyStyles as styles, wizardColors } from '../styles/createProperty.styles';

const INITIAL_FORM = {
    postcode: '',
    addressLine1: '',
    addressLine2: '',
    country: DEFAULT_PROPERTY_COUNTRY,
    countyCouncil: '',
    city: '',
    area: '',
    areaId: '',
    propertyType: '',
    propertyTypeId: '',
    licenseType: '',
    licenseTypeId: '',
    maxOccupancy: '',
    maxOccupancyId: '',
    bedrooms: '',
    bedroomsId: '',
    bathrooms: '',
    bathroomsId: '',
    reception: '',
    receptionId: '',
    councilTaxBanding: '',
    councilTaxBandingId: '',
    monthlyRent: '',
    statusLabel: 'Vacant',
};

function getStepSummary(stepId, form) {
    switch (stepId) {
        case 1: {
            const line = form.addressLine1.trim();
            if (!line) {
                return 'Address not provided';
            }
            const tail = [form.city.trim(), form.postcode.trim()].filter(Boolean).join(', ');
            return tail ? `${line}, ${tail}` : line;
        }
        case 2: {
            const parts = [form.propertyType, form.licenseType].filter(Boolean);
            return parts.length > 0 ? parts.join(' · ') : 'Type not selected';
        }
        case 3: {
            const parts = [
                form.maxOccupancy ? `${form.maxOccupancy} occ.` : null,
                form.bedrooms ? `${form.bedrooms} bed` : null,
                form.bathrooms ? `${form.bathrooms} bath` : null,
                form.reception ? `${form.reception} rec.` : null,
                form.councilTaxBanding ? `Band ${form.councilTaxBanding}` : null,
            ].filter(Boolean);
            return parts.length > 0 ? parts.join(' · ') : 'Specs not set';
        }
        case 4:
            return form.monthlyRent.trim() ? `£${form.monthlyRent}/mo` : 'Rent not set';
        case 5:
            return form.statusLabel;
        case 6:
            return 'No files yet';
        default:
            return '';
    }
}

function isStepValid(stepId, form) {
    switch (stepId) {
        case 1:
            return Boolean(
                form.postcode.trim() &&
                    form.addressLine1.trim() &&
                    form.country.trim() &&
                    form.city.trim() &&
                    form.areaId
            );
        case 2:
            return Boolean(form.propertyTypeId && form.licenseTypeId);
        case 3:
            return Boolean(
                form.maxOccupancyId &&
                    form.bedroomsId &&
                    form.bathroomsId &&
                    form.receptionId &&
                    form.councilTaxBandingId
            );
        case 4:
            return form.monthlyRent.trim().length > 0;
        default:
            return true;
    }
}

function OptionPicker({ visible, title, options, selectedId, onSelect, onClose, emptyMessage }) {
    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.pickerOverlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={styles.pickerSheet}>
                    <View style={styles.pickerHeader}>
                        <Text style={styles.pickerTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Feather name="x" size={20} color="#111" />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={options}
                        keyExtractor={(item) => item.id}
                        style={styles.pickerList}
                        keyboardShouldPersistTaps="handled"
                        ListEmptyComponent={
                            <View style={styles.pickerEmpty}>
                                <Text style={styles.pickerEmptyText}>{emptyMessage}</Text>
                            </View>
                        }
                        renderItem={({ item }) => {
                            const isSelected = item.id === selectedId;
                            return (
                                <TouchableOpacity
                                    style={[styles.pickerRow, isSelected && styles.pickerRowSelected]}
                                    onPress={() => onSelect(item)}
                                    activeOpacity={0.85}
                                >
                                    <Text
                                        style={[
                                            styles.pickerRowLabel,
                                            isSelected && styles.pickerRowLabelSelected,
                                        ]}
                                        numberOfLines={2}
                                    >
                                        {item.label}
                                    </Text>
                                    {isSelected ? (
                                        <Feather name="check" size={18} color="#111" />
                                    ) : null}
                                </TouchableOpacity>
                            );
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
}

function LabeledInput({ label, required, value, onChangeText, placeholder, ...props }) {
    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel} numberOfLines={2}>
                {label}
                {required ? <Text style={styles.fieldRequired}> *</Text> : null}
            </Text>
            <TextInput
                style={styles.fieldInput}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#9A9A9A"
                {...props}
            />
        </View>
    );
}

function LabeledSelect({ label, value, placeholder, onPress }) {
    const hasValue = Boolean(value);
    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel} numberOfLines={2}>
                {label}
            </Text>
            <TouchableOpacity style={styles.selectControl} onPress={onPress} activeOpacity={0.75}>
                <Text
                    style={[styles.selectValue, !hasValue && styles.selectPlaceholder]}
                    numberOfLines={1}
                >
                    {hasValue ? value : placeholder}
                </Text>
                <View style={styles.selectChevron}>
                    <Feather name="chevron-down" size={16} color={wizardColors.subtle} />
                </View>
            </TouchableOpacity>
        </View>
    );
}

function AreaField({ value, loading, onPress, onClear, onAdd }) {
    const hasValue = Boolean(value);
    const displayText = loading ? 'Loading…' : hasValue ? value : 'Select area';

    return (
        <View style={styles.field}>
            <Text style={styles.fieldLabel}>Area</Text>
            <View style={styles.areaControlRow}>
                <TouchableOpacity
                    style={[styles.areaSelectControl, hasValue && styles.areaSelectControlFilled]}
                    onPress={onPress}
                    activeOpacity={0.75}
                    disabled={loading}
                >
                    <Text
                        style={[
                            styles.areaSelectValue,
                            !hasValue && !loading && styles.selectPlaceholder,
                        ]}
                        numberOfLines={2}
                    >
                        {displayText}
                    </Text>
                    <Feather name="chevron-down" size={18} color={wizardColors.subtle} />
                </TouchableOpacity>
                {hasValue ? (
                    <TouchableOpacity
                        style={styles.areaActionBtn}
                        onPress={onClear}
                        accessibilityLabel="Clear area"
                    >
                        <Feather name="x" size={18} color={wizardColors.subtle} />
                    </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                    style={styles.areaActionBtn}
                    onPress={onAdd}
                    accessibilityLabel="Add area"
                >
                    <Feather name="plus" size={20} color={wizardColors.dark} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

function StackedInput({ label, icon, value, onChangeText, ...props }) {
    return (
        <View style={styles.stackedField}>
            <View style={styles.stackedBody}>
                <Text style={styles.stackedLabel}>{label}</Text>
                <TextInput
                    style={styles.stackedText}
                    value={value}
                    placeholderTextColor={wizardColors.subtle}
                    onChangeText={onChangeText}
                    {...props}
                />
            </View>
            {icon ? <Feather name={icon} size={18} color="#888" style={styles.stackedIcon} /> : null}
        </View>
    );
}

function StackedSelect({ label, value, placeholder, onPress }) {
    return (
        <TouchableOpacity style={styles.stackedField} onPress={onPress} activeOpacity={0.85}>
            <View style={styles.stackedBody}>
                <Text style={styles.stackedLabel}>{label}</Text>
                <Text style={[styles.stackedText, !value && styles.stackedPlaceholder]}>
                    {value || placeholder}
                </Text>
            </View>
            <Feather name="chevron-down" size={18} color="#888" style={styles.stackedIcon} />
        </TouchableOpacity>
    );
}

function AddressFields({ form, onChange, onOpenAreaPicker, onClearArea, areasLoading }) {
    return (
        <View style={styles.panel}>
            {ADDRESS_FIELD_ROWS.map((row, rowIndex) => (
                <View
                    key={row.map((f) => f.key).join('-')}
                    style={[styles.panelRow, rowIndex === ADDRESS_FIELD_ROWS.length - 1 && styles.panelRowTight]}
                >
                    {row.map((field) => (
                        <View key={field.key} style={styles.panelCol}>
                            <LabeledInput
                                label={field.label}
                                required={field.required}
                                placeholder={field.placeholder}
                                value={form[field.key]}
                                onChangeText={(text) => onChange({ [field.key]: text })}
                            />
                        </View>
                    ))}
                </View>
            ))}
            <View style={[styles.panelRow, styles.panelRowLast, styles.areaRowFull]}>
                <AreaField
                    value={form.area}
                    loading={areasLoading}
                    onPress={onOpenAreaPicker}
                    onClear={onClearArea}
                    onAdd={onOpenAreaPicker}
                />
            </View>
        </View>
    );
}

function SpecsFields({ form, onOpenPicker }) {
    return (
        <View style={styles.panel}>
            {SPECS_FIELD_ROWS.map((row, rowIndex) => {
                const isLastRow = rowIndex === SPECS_FIELD_ROWS.length - 1;
                return (
                    <View key={row.map((f) => f.key).join('-')} style={[styles.panelRow, isLastRow && styles.panelRowLast]}>
                        {row.map((field) => (
                            <View key={field.key} style={styles.panelCol}>
                                <LabeledSelect
                                    label={field.label}
                                    value={form[field.key]}
                                    placeholder="Select"
                                    onPress={() => onOpenPicker(field.key)}
                                />
                            </View>
                        ))}
                        {row.length === 1 ? <View style={styles.panelColSpacer} pointerEvents="none" /> : null}
                    </View>
                );
            })}
        </View>
    );
}

export default function CreatePropertyWizard({ visible, onClose }) {
    const insets = useSafeAreaInsets();
    const [currentStep, setCurrentStep] = useState(1);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [form, setForm] = useState(INITIAL_FORM);
    const [isPropertyTypePickerOpen, setIsPropertyTypePickerOpen] = useState(false);
    const [isLicensePickerOpen, setIsLicensePickerOpen] = useState(false);
    const [activeSpecsPicker, setActiveSpecsPicker] = useState(null);
    const [isAreaPickerOpen, setIsAreaPickerOpen] = useState(false);

    const { propertyTypes, propertyTypesLoading, areas, areasLoading } =
        useCreatePropertyLookups(visible);

    const propertyTypeOptions = useMemo(
        () =>
            propertyTypes.map((item) => ({
                id: item.id,
                label: item.name,
            })),
        [propertyTypes]
    );

    const areaOptions = useMemo(
        () =>
            areas.map((item) => ({
                id: item.id,
                label: item.name,
            })),
        [areas]
    );

    const activeSpecsPickerConfig = activeSpecsPicker
        ? SPECS_PICKER_CONFIG[activeSpecsPicker]
        : null;

    const canCompleteCurrent = isStepValid(currentStep, form);
    const isLastStep = currentStep === CREATE_PROPERTY_TOTAL_STEPS;

    const updateForm = (patch) => {
        setForm((prev) => ({ ...prev, ...patch }));
    };

    const handleClose = () => {
        setCurrentStep(1);
        setCompletedSteps([]);
        setForm(INITIAL_FORM);
        setIsPropertyTypePickerOpen(false);
        setIsLicensePickerOpen(false);
        setActiveSpecsPicker(null);
        setIsAreaPickerOpen(false);
        onClose();
    };

    const handleSelectPropertyType = (option) => {
        updateForm({
            propertyTypeId: option.id,
            propertyType: option.label,
        });
        setIsPropertyTypePickerOpen(false);
    };

    const handleSelectLicense = (option) => {
        updateForm({
            licenseTypeId: option.id,
            licenseType: option.label,
        });
        setIsLicensePickerOpen(false);
    };

    const handleSelectArea = (option) => {
        updateForm({
            areaId: option.id,
            area: option.label,
        });
        setIsAreaPickerOpen(false);
    };

    const handleClearArea = () => {
        updateForm({ areaId: '', area: '' });
    };

    const handleSelectSpecs = (option) => {
        if (!activeSpecsPickerConfig) {
            return;
        }

        updateForm({
            [activeSpecsPickerConfig.formValueKey]: option.label,
            [activeSpecsPickerConfig.formIdKey]: option.id,
        });
        setActiveSpecsPicker(null);
    };

    const handlePrimary = () => {
        if (!canCompleteCurrent) {
            return;
        }

        if (!completedSteps.includes(currentStep)) {
            setCompletedSteps((prev) => [...prev, currentStep]);
        }

        if (isLastStep) {
            handleClose();
            return;
        }

        setCurrentStep((step) => step + 1);
    };

    const renderStepFields = (stepId) => {
        switch (stepId) {
            case 1:
                return (
                    <AddressFields
                        form={form}
                        onChange={updateForm}
                        onOpenAreaPicker={() => setIsAreaPickerOpen(true)}
                        onClearArea={handleClearArea}
                        areasLoading={areasLoading}
                    />
                );
            case 2:
                return (
                    <View style={styles.fields}>
                        <StackedSelect
                            label="Property type"
                            value={
                                propertyTypesLoading && !form.propertyType
                                    ? 'Loading types…'
                                    : form.propertyType
                            }
                            placeholder="Select type"
                            onPress={() => setIsPropertyTypePickerOpen(true)}
                        />
                        <StackedSelect
                            label="License"
                            value={form.licenseType}
                            placeholder="Select license"
                            onPress={() => setIsLicensePickerOpen(true)}
                        />
                    </View>
                );
            case 3:
                return <SpecsFields form={form} onOpenPicker={setActiveSpecsPicker} />;
            case 4:
                return (
                    <View style={styles.fields}>
                        <StackedInput
                            label="Monthly rent (£)"
                            icon="file-text"
                            placeholder="e.g. 2,850"
                            keyboardType="number-pad"
                            value={form.monthlyRent}
                            onChangeText={(text) => updateForm({ monthlyRent: text })}
                        />
                    </View>
                );
            case 5:
                return (
                    <View style={styles.fields}>
                        <StackedSelect
                            label="Status"
                            value={form.statusLabel}
                            placeholder="Select status"
                            onPress={() =>
                                updateForm({
                                    statusLabel:
                                        form.statusLabel === 'Tenanted' ? 'Vacant' : 'Tenanted',
                                })
                            }
                        />
                    </View>
                );
            case 6:
                return (
                    <View style={styles.fields}>
                        <TouchableOpacity style={styles.mediaBox} activeOpacity={0.85}>
                            <Feather name="upload-cloud" size={24} color="#888" />
                            <Text style={styles.mediaBoxText}>Tap to upload files</Text>
                        </TouchableOpacity>
                    </View>
                );
            default:
                return null;
        }
    };

    const primaryLabel = useMemo(() => {
        if (isLastStep) {
            return 'Finish';
        }
        return `Complete step ${currentStep}`;
    }, [currentStep, isLastStep]);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={handleClose}
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} accessibilityLabel="Dismiss" />

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={{ width: '100%' }}
                >
                <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 8) }]}>
                    <View style={styles.dragHandle} />

                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>New property</Text>
                            <Text style={styles.stepIndicator}>
                                Step {currentStep} of {CREATE_PROPERTY_TOTAL_STEPS}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={handleClose}
                            accessibilityLabel="Close"
                        >
                            <Feather name="x" size={20} color="#111" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.progressRow}>
                        {CREATE_PROPERTY_STEPS.map((step) => {
                            const isFilled =
                                completedSteps.includes(step.id) || step.id === currentStep;
                            return (
                                <View
                                    key={step.id}
                                    style={[
                                        styles.progressSegment,
                                        isFilled && styles.progressSegmentActive,
                                    ]}
                                />
                            );
                        })}
                    </View>

                    <ScrollView
                        contentContainerStyle={styles.body}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {CREATE_PROPERTY_STEPS.map((step) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = completedSteps.includes(step.id);

                            if (isActive) {
                                return (
                                    <View key={step.id} style={styles.stepCardActive}>
                                        <View style={styles.stepHeaderRow}>
                                            <View
                                                style={[
                                                    styles.stepCircleActive,
                                                    isCompleted && styles.stepCircleActiveDone,
                                                ]}
                                            >
                                                {isCompleted ? (
                                                    <Feather name="check" size={14} color="#FFF" />
                                                ) : (
                                                    <Text style={styles.stepCircleTextActive}>
                                                        {step.id}
                                                    </Text>
                                                )}
                                            </View>
                                            <View style={styles.stepHeaderText}>
                                                <Text style={styles.stepTitleActive}>{step.title}</Text>
                                                <Text style={styles.stepSubtitleActive}>
                                                    {step.subtitle}
                                                </Text>
                                            </View>
                                        </View>
                                        <View
                                            style={
                                                step.id === 1 || step.id === 3
                                                    ? styles.stepBodyFlush
                                                    : undefined
                                            }
                                        >
                                            {renderStepFields(step.id)}
                                        </View>
                                    </View>
                                );
                            }

                            if (isCompleted && !isActive) {
                                return (
                                    <View key={step.id} style={styles.stepCardSummary}>
                                        <View style={styles.stepCircleCompleted}>
                                            <Feather name="check" size={14} color="#FFF" />
                                        </View>
                                        <View style={styles.stepSummaryText}>
                                            <Text style={styles.stepSummaryLabel}>
                                                {step.title.toUpperCase()}
                                            </Text>
                                            <Text style={styles.stepSummaryValue}>
                                                {getStepSummary(step.id, form)}
                                            </Text>
                                        </View>
                                        <TouchableOpacity onPress={() => setCurrentStep(step.id)}>
                                            <Text style={styles.editBtn}>Edit</Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            }

                            return (
                                <TouchableOpacity
                                    key={step.id}
                                    style={styles.stepCardInactive}
                                    onPress={() => setCurrentStep(step.id)}
                                    activeOpacity={0.85}
                                >
                                    <View style={styles.stepCircleInactive}>
                                        <Text style={styles.stepCircleTextInactive}>{step.id}</Text>
                                    </View>
                                    <Text style={styles.stepTitleInactive}>{step.title}</Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[
                                styles.primaryBtn,
                                canCompleteCurrent && styles.primaryBtnEnabled,
                            ]}
                            onPress={handlePrimary}
                            activeOpacity={canCompleteCurrent ? 0.85 : 1}
                            disabled={!canCompleteCurrent}
                        >
                            <Text
                                style={[
                                    styles.primaryBtnText,
                                    canCompleteCurrent && styles.primaryBtnTextEnabled,
                                ]}
                            >
                                {primaryLabel}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                </KeyboardAvoidingView>
            </View>

            <OptionPicker
                visible={isAreaPickerOpen}
                title="Area"
                options={areaOptions}
                selectedId={form.areaId}
                onSelect={handleSelectArea}
                onClose={() => setIsAreaPickerOpen(false)}
                emptyMessage={areasLoading ? 'Loading areas…' : 'No areas found.'}
            />

            <OptionPicker
                visible={isPropertyTypePickerOpen}
                title="Property type"
                options={propertyTypeOptions}
                selectedId={form.propertyTypeId}
                onSelect={handleSelectPropertyType}
                onClose={() => setIsPropertyTypePickerOpen(false)}
                emptyMessage={
                    propertyTypesLoading
                        ? 'Loading property types…'
                        : 'No property types found. Open Types to verify the API.'
                }
            />

            <OptionPicker
                visible={isLicensePickerOpen}
                title="License"
                options={PROPERTY_LICENSE_OPTIONS}
                selectedId={form.licenseTypeId}
                onSelect={handleSelectLicense}
                onClose={() => setIsLicensePickerOpen(false)}
            />

            <OptionPicker
                visible={Boolean(activeSpecsPickerConfig)}
                title={activeSpecsPickerConfig?.title ?? ''}
                options={activeSpecsPickerConfig?.options ?? []}
                selectedId={
                    activeSpecsPickerConfig ? form[activeSpecsPickerConfig.formIdKey] : ''
                }
                onSelect={handleSelectSpecs}
                onClose={() => setActiveSpecsPicker(null)}
            />
        </Modal>
    );
}
