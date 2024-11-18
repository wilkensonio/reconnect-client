/**
 * Availability component
 * 
 * This component allows users to manage their availability schedule. Users can select days of the week,
 * specify start and end times, and create, update, or delete availability entries. The component fetches
 * user data and availability from the server and updates the state accordingly.
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered Availability component.
 * 
 * @typedef {Object} AvailabilityEntry
 * @property {string} day - The day of the week.
 * @property {string} startTime - The start time in HH:MM format.
 * @property {string} endTime - The end time in HH:MM format.
 * @property {string} userId - The ID of the user.
 * @property {string} id - The ID of the availability entry.
 * 
 * @typedef {Object} User
 * @property {string} user_id - The ID of the user.
 * @property {string} email - The email of the user.
 * 
 * @typedef {Object} AvailabilityResponse
 * @property {Array<AvailabilityEntry>} data - The array of availability entries.
 * 
 * @typedef {Object} CreateAvailabilityEntry
 * @property {string} day - The day of the week.
 * @property {string} start_time - The start time in HH:MM format.
 * @property {string} end_time - The end time in HH:MM format.
 * @property {string} user_id - The ID of the user.
 * 
 * @typedef {Object} UpdateAvailabilityEntry
 * @property {string} day - The day of the week.
 * @property {string} start_time - The start time in HH:MM format.
 * @property {string} end_time - The end time in HH:MM format.
 * @property {string} faculty_id - The ID of the user.
 * @property {string} id - The ID of the availability entry.
 * 
 * @typedef {Object} DeleteAvailabilityResponse
 * @property {boolean} data - The success status of the delete operation.
 * 
 * @function handleDayChange
 * @description Toggles the selection state of a specific day.
 * @param {number} index - The index of the day to toggle.
 * 
 * @function handleSelectAll
 * @description Toggles the selection state of all days.
 * 
 * @function validateFields
 * @description Validates the input fields for creating or updating availability.
 * @returns {boolean} True if the fields are valid, false otherwise.
 * 
 * @function handleAddAvailability
 * @description Adds new availability entries based on the selected days and times.
 * @returns {Promise<void>}
 * 
 * @function handleUpdateClick
 * @description Sets the state for updating an existing availability entry.
 * @param {number} index - The index of the availability entry to update.
 * 
 * @function handleUpdateSubmit
 * @description Submits the updated availability entry to the server.
 * @returns {Promise<void>}
 * 
 * @function handleDeleteAvailability
 * @description Deletes an availability entry.
 * @param {number} index - The index of the availability entry to delete.
 * @returns {Promise<void>}
 */
import React, { useEffect, useState } from 'react';
import { CButton, CCard, CCol, CForm, CFormInput, CInputGroup, CInputGroupText, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CRow } from '@coreui/react';
import { getUserByEmail } from '../apiservice/UserService';
import { createAvailability, getAvailability, updateAvailability, deleteAvailability } from '../apiservice/AvailabilityService';
import { Link } from 'react-router-dom';

 
function Availability() {
    const [userId, setUserId] = useState('');
    const [user, setUser] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [availability, setAvailability] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [selectedDays, setSelectedDays] = useState(new Array(7).fill(false));
    const [alertMessage, setAlertMessage] = useState('');
    const [confirmDeletes, setConfirmDeletes] = useState({});

    const [day, setDay] = useState('');
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        const loggedInUser = localStorage.getItem('reconnect_signin_email');
        const getUser = async () => {
            try {
                const user = await getUserByEmail(loggedInUser);
                setUser(user);
                setUserId(user.user_id);
            } catch (error) {
                console.error(error);
            }
        };
        getUser(); 
    }, []);

    
    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await getAvailability(user.user_id); 
                
                const formattedAvailability = response.data.map(entry => ({
                    day: entry.day,
                    startTime: entry.start_time,
                    endTime: entry.end_time,
                    userId: entry.faculty_id,
                    id: entry.id,  
                }));
    
                setAvailability(formattedAvailability);
            } catch (error) {
                console.error('Error fetching availability:', error);
            }
        };
        if (user) {
            fetchAvailability();
        }
    }, [user]);

    const handleDayChange = (index) => {
        const updatedDays = [...selectedDays];
        updatedDays[index] = !updatedDays[index];
        setSelectedDays(updatedDays);
    };

    const handleSelectAll = () => {
        const allSelected = selectedDays.every(Boolean);
        setSelectedDays(new Array(7).fill(!allSelected));
    };

    const validateFields = () => {
        const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/; 
        if (!startTime || !endTime) {
            setAlertMessage('Start time and end time are required.');
            return false;
        }
        if (!timePattern.test(startTime) || !timePattern.test(endTime)) {
            setAlertMessage('Time must be in HH:MM 24-hour format.');
            return false;
        }
        
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        if (end <= start) {
            setAlertMessage('End time must be later than start time.');
            return false;
        }

        if (!selectedDays.some(day => day)) {
            setAlertMessage('Please select at least one day.');
            return false;
        }
        setAlertMessage('');
        return true;
    };

    const checkOverlap = (day, startTime, endTime) => {
        return availability.some(entry => 
            entry.day === day && 
            !(
                (endTime <= entry.startTime) || // New end time is before existing start time
                (startTime >= entry.endTime) // New start time is after existing end time
            )
        );
    };

    /**
     * Add availability to the user's schedule
     * 
     * Add availability to the user's schedule and update the availability state
     * Loop through the selected days and create an availability entry for each selected day
     * Send the formatted data to the server to create the availability
     * 
     * @returns {void}
     */
    const handleAddAvailability = async () => {
        if (!validateFields()) return;

        const newAvailability = selectedDays
            .map((isSelected, index) => isSelected ? { day: daysOfWeek[index], startTime, endTime } : null)
            .filter(Boolean); 

        for (const entry of newAvailability) {
            if (checkOverlap(entry.day, entry.startTime, entry.endTime)) {
                setAlertMessage(`Time slot for ${entry.day} overlaps with existing availability.`);
                return;
            }
        }
    
        setAvailability(prevAvailability => {
            const updatedAvailability = [...prevAvailability, ...newAvailability];
            return updatedAvailability;
        }); 

        try {
            const availabilityEntries = newAvailability.map(entry => ({
                day: entry.day,
                start_time: entry.startTime,
                end_time: entry.endTime,
                user_id: user.user_id, 
            }));
            await Promise.all(availabilityEntries.map(async entry => {
                await createAvailability(entry);
            })); 
            
        } catch (error) {
            console.error('Error creating availability:', error);
        }
     
        
        setSelectedDays(new Array(7).fill(false));
        setStartTime('');
        setEndTime('');
    };

    const handleUpdateClick = (index) => {
        const entry = availability[index];
        setSelectedEntry(index);
        setDay(entry.day);
        setStartTime(entry.startTime);
        setEndTime(entry.endTime);
        setModalVisible(true);
    };

    /**
     * Update availability entry
     * 
     * Update availability entry and update the availability state
     * Chaecking that time is valid and end time is greater than start time
     * Formatted data is sent to the server to update the availability
     * 
     * @returns {void}
     *  
     */ 
    const handleUpdateSubmit = async () => {
        const startHour = parseInt(startTime.split(':')[0], 10);
        const startMinute = parseInt(startTime.split(':')[1], 10);
        const endHour = parseInt(endTime.split(':')[0], 10);
        const endMinute = parseInt(endTime.split(':')[1], 10);

        if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
            setAlertMessage("End time cannot be less than or equal to start time.");
            return; 
        }
 
        setAlertMessage("");
    
        
        const updatedEntry = {
            day,
            start_time:startTime,
            end_time:endTime,
            faculty_id: userId,
            id: availability[selectedEntry].id,
        };
        
         try {
            await updateAvailability(updatedEntry);
            const updatedAvailability = [...availability];
            updatedAvailability[selectedEntry] = {
                ...updatedEntry,
                startTime,
                endTime,
            };
            setAvailability(updatedAvailability);
            setModalVisible(false);
        }catch (error) {
            console.error('Error updating availability:', error);
        } 
    };

    const handleDeleteAvailability = async (index) => {
        if (!confirmDeletes[index]) {
            setConfirmDeletes( prev => ({ ...prev, [index]: true }));
            return;
        }
        const availabilityID = availability[index].id;
        
        try {
            const response = await deleteAvailability(availabilityID);  
            if (response.data === true) {
                const newAvailability = availability.filter((_, i) => i !== index);
                setAvailability(newAvailability);
                console.log(`Availability deleted: ID ${entryId}`);
            }
        } catch (error) {
            console.error('Error deleting availability:', error);
        }
        
        const newAvailability = availability.filter((_, i) => i !== index);
        setAvailability(newAvailability);
        
        setConfirmDeletes((prev) => {
            const newState = { ...prev };
            delete newState[index];  // Reset confirm state for this item after deletion
            return newState;
        });
    };

    return (
        <div>
            <span hidden>testAvailability</span>
            <h1 className='text-white text-center mb-4'>Availability</h1>
            <div className='container mb-3 mt-2'>
                <Link to='/dashboard'>
                    <span className='text-white'>Back to dashboard</span>
                </Link>
            </div>
            <CCard className='shadow' 
                alignment='center'
                style={{ 
                    background: '#e9e9e9',
                    width: '100%',  
                    minHeight: '80vh',
                    filter: modalVisible ? 'blur(5rem)' : 'none',
                    transition: 'filter 0.3s',   
                }}> 
                <div>
                    {alertMessage && <div className="text-danger text-center pt-5 h5">{alertMessage}</div>} 
                </div>
                <div className='m-4'>
                    <CRow> 
                        <CCol md={6}>
                            <h5 className='text-center'>Select Days of the Week</h5>
                            <CForm>
                                <CInputGroup>
                                    <CInputGroupText>
                                        <input
                                            type="checkbox"
                                            checked={selectedDays.every(Boolean)}
                                            onChange={handleSelectAll}
                                        />
                                    </CInputGroupText>
                                    <CFormInput
                                        placeholder="Select All Days"
                                        disabled
                                    />
                                </CInputGroup>
                                {daysOfWeek.map((day, index) => (
                                    <div key={index} className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`day-${index}`}
                                            checked={selectedDays[index]}
                                            onChange={() => handleDayChange(index)}
                                        />
                                        <label className="form-check-label" htmlFor={`day-${index}`}>
                                            {day}
                                        </label>
                                    </div>
                                ))}
                            </CForm>
                        </CCol>
                        <CCol md={6}>
                            <h5 className='text-center'>Availability Entry</h5>
                            <CForm className="row gy-2 gx-3">
                                <CCol xs={12} className='mb-3'>
                                    <CFormInput
                                        placeholder="From what time (e.g., 08:00) *"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        required
                                    />
                                </CCol>
                                <CCol xs={12} className='mb-3'>
                                    <CFormInput
                                        placeholder="To what time (e.g., 16:00) *"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        required
                                    />
                                </CCol>
                                <CCol xs={12} className='mb-3'>
                                    <CButton
                                        className='ccolor'
                                        onClick={handleAddAvailability}
                                    >
                                        Create
                                    </CButton>
                                </CCol>
                            </CForm>
                        </CCol>
                    </CRow>
                        <div className='ms-4 me-4'>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', margin: '20px 0' }}>
                                <div style={{ flex: 1, height: '2px', backgroundColor: '#007bff', marginRight: '10px', position: 'relative' }}>
                                    <div style={{ content: "''", position: 'absolute', width: '20px', height: '2px', backgroundColor: '#007bff', left: '-20px', top: '50%', transform: 'translateY(-50%)' }}></div>
                                </div>
                                <h5
                                 style={{ border: '2px solid #007bff', borderRadius: '15px', padding: '.2rem 1rem', backgroundColor: 'white', position: 'relative', zIndex: 1, margin: 0 }}>
                                    Current Availability
                                </h5>
                                <div style={{ flex: 1, height: '2px', backgroundColor: '#007bff', marginLeft: '10px', position: 'relative' }}>
                                    <div style={{ content: "''", position: 'absolute', width: '20px', height: '2px', backgroundColor: '#007bff', right: '-20px', top: '50%', transform: 'translateY(-50%)' }}></div>
                                </div>
                            </div>

                            {availability.length > 0 ? (
                                <CRow className='row d-flex justify-content-center align-items-center'>
                                    <CCol md={9}>
                                        {availability.map((entry, index) => (
                                            <CRow key={index} className='mb-2 mt-5'>
                                                <CCol md={2}>{entry.day}</CCol>
                                                <CCol md={2}>{`${entry.startTime} - ${entry.endTime}`}</CCol>
                                                <CCol md={3} className='d-flex'>
                                                    <CButton onClick={() => handleUpdateClick(index)} className="ms-2 ccolor mb-2" style={{ width: '50%' }}>Update</CButton>
                                                    <CButton color="danger" onClick={() => handleDeleteAvailability(index)} className="ms-2 mb-2" style={{ width: '50%' }}>
                                                       {confirmDeletes[index] ? 'Confirm' : 'Delete'}
                                                    </CButton>
                                                </CCol>
                                            </CRow>
                                        ))}
                                    </CCol>
                                    <CCol>
                                        <div className="mt-4">
                                            <img src="/assets/logo/scsublueyellow.png" alt="scsu logo"
                                                style={{ maxWidth: '20rem', width: '100%', height: 'auto' }} 
                                            />    
                                        </div>
                                    </CCol> 
                                </CRow> 
                            )  : (
                                <div className="text-center">
                                    <img src="/assets/logo/scsublueyellow.png" alt="scsu logo"
                                        style={{ maxWidth: '20rem', width: '100%', height: 'auto' }} 
                                    />    
                                </div>)}
                        </div>
                </div>
            </CCard>
            <CModal visible={modalVisible} onClose={() =>{ 
                setAlertMessage('');
                setModalVisible(false)}
            }
                alignment='center'
                >
                <CModalHeader className='border-0'>
                    <CModalTitle className='text-ceter'>Update your availability for {day}'s</CModalTitle>
                </CModalHeader>
                <CModalBody className='mb-0'>
                    <CForm>
                        <CCol xs={12} className="mb-2">
                            <CFormInput
                                value={day}
                                readOnly
                                placeholder="Day"
                                // disabled
                            />
                        </CCol>
                        <CCol xs={12} className="mb-3">
                            <CFormInput 
                            value={startTime} onChange={(e) => setStartTime(e.target.value)} 
                            placeholder="Start Time" required />
                        </CCol>
                        <CCol xs={12} className="mb-3">
                            <CFormInput value={endTime} onChange={(e) => 
                                setEndTime(e.target.value)} 
                                placeholder="End Time" required />
                        </CCol>
                    </CForm>
                </CModalBody>
                <CModalFooter className='m-0 border-0'> 
                    <CButton className='ccolor' onClick={handleUpdateSubmit}>Update</CButton> 
                    <CButton color="info" onClick={() => {
                        setAlertMessage('');
                        setModalVisible(false)}}>Cancel</CButton>
                </CModalFooter>
                <div className='text-center mb-4'>
                        {alertMessage && <div className="text-danger text-center pt-5 h5">{alertMessage}</div>}
                </div>
            </CModal>
        </div>
    );
}

export default Availability;
