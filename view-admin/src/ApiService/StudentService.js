import axios from 'axios';
const apikey = import.meta.env.VITE_APP_API_KEY;
const token = localStorage.getItem('reconnect_access_token');
const token_type = localStorage.getItem('reconnect_token_type');

console.log(apikey, token); 

const fakeStudents = () => {
    return [
        {
            id: 1,
            studentId: '123456',    
            firstName: 'John',
            lastName: 'Doe',
            email: 'johnd1@southernct.edu'
        },
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'janes1@southernct.edu'
        },
        {
            id: 3,
            firstName: 'Alice',
            lastName: 'Wonderland',
            email: 'Alicew@southernct.edu'
        }
    ]
} 


const headers = {
    'R-API-KEY': `${apikey}`,
    'Authorization': `${token_type} ${token}`
}

const fetchStudents = async () => { 
    try {
        const response = await axios.get('/api/students/', {
            headers: headers
        }); 
        
        return response.data;
                 
    } catch (error) { 
        handleError(error); 
    }      
}

const deleteStudent = async (studentId) => {
    try {
        const response = await axios.delete(`/api/students/${studentId}`, { headers });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

const addStudent = async (student) => {
    try {
        const response = await axios.post('/api/signup-student/', student, { headers });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

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
      throw new Error('Failed to upload CSV file');
    }
  };
  
 

const scheduleMeeting = async (studentId) => {
    try {
        const response = await axios.post(`/api/schedule/${studentId}`, {}, { headers });
        return response.data;
    } catch (error) {
        handleError(error);
    }
}; 

const handleError = (error) => {
    const response = error.response;
    if (response && response.status === 401) {
        localStorage.removeItem('reconnect_access_token');
        localStorage.removeItem('reconnect_token_type');
        window.location.href = '/signin?message=Session expired. Please sign in again.';
    } else {
        console.error("api/studentService", response);
        return response;
    }
};

export {
    fetchStudents, deleteStudent,
    scheduleMeeting, fakeStudents,
    addStudent, uploadCsv  
};