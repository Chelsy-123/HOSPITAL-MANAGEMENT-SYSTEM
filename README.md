# Hospital Management System

A full-stack Hospital Management System designed to manage hospital operations efficiently.

The system includes role-based modules for different hospital staff such as doctors, receptionists, pharmacists, and lab technicians. The platform helps streamline hospital workflows such as appointment management, consultations, prescriptions, pharmacy management, and laboratory test management.

---

## Tech Stack

### Backend

- Django
- Django REST Framework
- SQLite / PostgreSQL
- JWT Authentication

### Frontend

- React.js
- Bootstrap

---

## Project Architecture

The system follows a modular Django architecture with separate apps for each hospital role.

Backend Structure

cmsapiproject
│
├── admin_app
├── doctor_app
├── receptionist_app
├── pharmacist_app
├── lab_technician_app
├── common
└── manage.py

Each module handles role-specific operations while sharing common authentication and database layers.

---

## Modules

The system contains the following role-based modules:

### Admin Module

- Manage hospital staff
- Manage system configurations

### Receptionist Module

- Register patients
- Schedule appointments
- Manage patient records

### Doctor Module

- View daily appointments
- Create consultation records
- Generate prescriptions
- Prescribe medicines and lab tests

### Pharmacist Module

- Manage medicine inventory
- Process medicine prescriptions

### Lab Technician Module

- Manage lab tests
- Process lab test prescriptions
- Update test results

---

## My Contribution

This was a **team project** where each team member was responsible for a specific module.

I implemented the **Doctor Module**, which includes:

- Viewing patient appointments
- Creating consultation records
- Generating prescriptions
- Adding multiple medicines in a prescription
- Adding multiple lab test prescriptions
- Linking consultation and prescription records
- Managing consultation history

The Doctor module enables doctors to efficiently manage patient consultations and prescribe medicines and lab tests.

---

## System Workflow

1. Receptionist registers patients and schedules appointments.
2. Doctors view appointments scheduled for the day.
3. Doctors conduct consultations and create consultation records.
4. Doctors generate prescriptions including medicines and lab tests.
5. Pharmacists access medicine prescriptions and manage medicine inventory.
6. Lab technicians access lab test prescriptions and perform laboratory tests.

---

## Features

- Role-based access control
- Secure authentication using JWT
- Appointment management
- Consultation management
- Prescription generation
- Medicine inventory management
- Lab test management
- Modular architecture using Django apps
- RESTful APIs for frontend-backend communication

---

## Installation

### Clone the Repository

git clone https://github.com/Chelsy-123/HOSPITAL-MANAGEMENT-SYSTEM.git

---

### Backend Setup

cd CMD_FINAL_BACKEND/hms_new_full/Backend
python -m venv myvenv
myvenv\Scripts\activate
pip install -r requirements.txt

Run migrations:

cd cmsapiproject
python manage.py migrate

Run the backend server:

python manage.py runserver

---

### Frontend Setup

cd CMS_FINAL_FRONTEND
npm install
npm start

---

## Development Test Credentials

These credentials are used for development and testing purposes only.

Admin
Username: admin
Password: admin123

Doctor
Username: doctor1
Password: doc123

Receptionist
Username: receptionist1
Password: recep123

Pharmacist
Username: pharmacist1
Password: pharm123

Lab Technician
Username: labtech1
Password: lab123

---

## Note

This project was developed as a **team project**, where different modules were implemented by different team members.

My responsibility was implementing the **Doctor Module**, including consultation management and prescription generation using Django REST Framework.

---

## License

This project is for educational and learning purposes.
