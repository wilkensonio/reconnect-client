# ReConnect

**Office Hours Communication System**

A communication tool for faculty to update students about office hour changes, displayed on LED screens outside offices.
 

---

## Table of Contents
- [Introduction](#introduction)
- [Motivation](#motivation)
- [Features for Faculty](#features-for-faculty)
- [Technical Overview](#technical-overview)
- [Security and Privacy](#security-and-privacy)
- [Installation](#installation)
- [Usage](#usage)
- [Contributors](#contributors)


---

## Introduction

In academic environments, last-minute changes to faculty office hours often cause confusion among students. This system enables faculty to update their office hour status in real time, with information displayed on LED screens near their office doors, ensuring students receive timely and accurate updates.

---

## Motivation

This system is designed to improve communication around office hours by providing faculty with an easy-to-use interface for posting updates. By using this tool, faculty can avoid common communication gaps and ensure that students are promptly informed of any changes to availability.

---

## Features for Faculty

- **Quick Message Posting**: Faculty can update their office hour status with simple messages such as "Running late" or "Office hours canceled."
- **Scheduling**: Faculty can schedule messages for future office hours, simplifying communication around planned adjustments.
- **Secure Login**: Faculty can securely log in using university credentials to prevent unauthorized access.

---

## Technical Overview

- **Raspberry Pi**: Controls the LED screen that displays messages outside faculty offices.
- **Messaging System**: Allows faculty to post real-time updates visible to students.
- **Role-Based Access Control**: Only authorized users, such as faculty or specific admin staff, can post updates.

---

## Security and Privacy

 
- **Access Control**: Only authenticated faculty members can update the display, ensuring information accuracy and security.

---

## Installation

Note : Before doing any of the steps below make sure the API is setup and running.

[API Setup](https://github.com/wilkensonio/reconnect-api)

[Kiosk Setup](https://github.com/wilkensonio/reconnect-pi)

If you prefer to run the application without installing docker go to step 1 (clone repo)

0. Install these tools (if not already install)

    - **Docker** : https://docs.docker.com/engine/install/
    - **Node.js** : https://nodejs.org/en/download/prebuilt-installer/current 

1. Clone the repository.
   ```bash
   git clone https://github.com/wilkensonio/reconnect-client.git

2. Navigate to the root folder
    ```bash
    cd reconnect-client

3. In the root Folder

    - Create a **.env** file and a **.env.production** 
    
        - Add the **.env** file and the **.env.production** them to a .gitignore files
    
        - (the .env.production is need to successfully run the build version)

    - In both the **.env** file and the **.env.production** 
        - Create variable **VITE_APP_API_KEY**=value

            the value is the API key needed to make requests to the API 

            value must be replaced with an actual API KEY.
    

4. Install Dependencies 
    ```bash
    npm install 

5. If step 0 install docker was skip if docker if prefered go to step 6
    - Run command : npm run dev
        
        From the root folder

6. Run application
     
    - Run command : docker build -t react-app
    
        This command will build and image using the dockerfile and the image will be tag with the name react-app. In the terminal verified that the image was built successfully.,
    <img width="1292" alt="Screenshot 2024-11-12 at 3 41 27 PM" src="https://github.com/user-attachments/assets/1450eaf3-95c2-40cb-993c-dcb29ba9177f">

    - Run command : docker run -p 80:80 react-app

        This command will run a docker container using the docker image build from above

        Verify that the container is running in the terminal. 
    
        <img width="1292" alt="Screenshot 2024-11-12 at 3 43 09 PM" src="https://github.com/user-attachments/assets/c99eaf37-1887-41c6-b68c-1e377ae01ff8">


    - visit http://localhost 

## Usage

- Signup up

    Must have a valid SCSU email address to use this application
    <img width="1419" alt="Screenshot signup page" src="https://github.com/user-attachments/assets/76008d43-ccdb-4a02-aa2d-0f3be6a60319">

- Sign in

    Using The SCSU email that was used to create the account sign in 
    <img width="1419" alt="Screenshot 2024-11-12 at 11 55 53 AM" src="https://github.com/user-attachments/assets/c29f5d59-e17b-4270-b326-7469d18c5354">

- Dashboard
    From dashboard signin users can perfomed many tasks
    <img width="1425" alt="Screenshot 2024-11-12 at 11 58 42 AM" src="https://github.com/user-attachments/assets/9d639a85-e585-4fe1-bdff-35e4fa801fe5">

- Calendar

    Sign in users can view and edit the calendar cancel create or update appointments
    <img width="1425" alt="Screenshot 2024-11-12 at 12 01 45 PM" src="https://github.com/user-attachments/assets/27f822aa-1697-4440-a12a-e91909acfa1e">


## Contributors

Meet the team behind the project!

- **[Wilkenson Hilarion](https://github.com/wilkensonio)**  
  Backend Developer and Full-Stack Contributor. Wilkenson built the backend, integrated IFTTT and setup CI/CD using GitHub Actions to automate the build and deployment process, conducted unit tests, and worked on the frontend, focusing on ensuring efficient communication and secure data handling.

- **[Mitchell DeCesare](https://github.com/MitchellDC)**  
  Frontend and Testing Specialist. Mitchell contributed to the faculty dashboard interface, and testing for the PI interface

- **[Escobar J.](https://github.com/Escobarj6)**  
  Pi Frontend Developer. Escobar developed the frontend interface for the Raspberry Pi, enabling clear communication and easy interaction for faculty and students. 3D print the casing to to house the PI

## Acknowledgements

Special thanks to all contributors, supporters, and resources that helped make this project possible.

