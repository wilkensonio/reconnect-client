import axios from 'axios'; 
import { handleUnauthorizedError } from './ErrorService';

const apikey = import.meta.env.VITE_APP_API_KEY;
const token = localStorage.getItem('reconnect_access_token');
const token_type = localStorage.getItem('reconnect_token_type');

const headers = {
    'R-API-KEY': `${apikey}`,
    'Authorization': `${token_type} ${token}`
}

/**
 * Get all students
 * 
 * @returns {JSON}
 */
const fetchStudents = async () => { 
    try {
        const response = await axios.get('/api/students/', {
            headers: headers
        }); 
        
        return response.data;
                 
    } catch (error) { 
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to get students');
    }      
} 

/**
 * Add a student 
 * 
 * @param {JSON} student
 * @returns {JSON}
 */
const addStudent = async (student) => {
    try {
        const response = await axios.post('/api/signup-student/', student, { headers });
        return response.data;
    } catch (error) {
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to add student');
    }
};

/**
 * Add students in bulk from a CSV file
 * 
 * @param {File} csvFile
 * @returns {JSON}
 */
const uploadCsv = async (csvFile) => {
    const formData = new FormData();
    formData.append('file', csvFile);
  
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to upload csv');
    }
};
  
 
/**
 * Schedule a meeting with a student 
 * 
 * @param {String} studentId
 * @returns {JSON}
 */
const scheduleMeeting = async (studentId) => {
    try {
        const response = await axios.post(`/api/schedule/${studentId}`, {}, { headers });
        return response.data;
    } catch (error) {
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to schedule meeting');
    }
}; 

/**
 * Delete a student
 * 
 * @param {String} studentId hootloot id of the student
 * @returns {JSON}
 */
const deleteStudent = async (studentId) => { 
    try {
        const response = await axios.delete(`/api/delete/student/${studentId}`,{ headers });
        return response.data;
    } catch (error) {
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to delete student');
    }

} 

export {
    fetchStudents, scheduleMeeting, 
    addStudent, uploadCsv, deleteStudent 
};