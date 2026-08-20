# GenInvoice

GenInvoice is a modern web application for generating, managing, and sending professional invoices with ease.  
It features a clean, user-friendly interface, customizable templates, secure authentication, and seamless email delivery, making it ideal for freelancers, small businesses, and professionals.

---

## 🚀 Features

- **Invoice Creation** – Intuitive form to enter company, billing, shipping, and item details.  
- **Template Selection** – Choose from multiple professionally designed invoice templates.  
- **Live Preview** – Instantly preview invoices before saving or sending.  
- **Invoice Management** – Dashboard to view, edit, and delete invoices.  
- **Email Delivery** – Send invoices as PDF attachments directly to clients.  
- **Authentication** – Secure login and user management with Clerk.  
- **Cloud Storage** – Upload and store company logos and invoice thumbnails.  

---

## 🛠️ Tech Stack

### Frontend
- **React (with Vite)** – Fast and modern UI development  
- **Bootstrap** – Responsive styling  
- **Clerk** – Authentication and user management  
- **jsPDF & html2canvas** – PDF generation and export  
- **Axios** – API requests  

### Backend
- **Django- DRF** – REST API backend  
- **PostgreSQL** – NoSQL database for data storage  
- **JWT** – Secure authentication   
- **SMTP** – Email sending with PDF attachments  

---

## 📸 Screenshots
 <img width="1149" height="5124" alt="localhost_5173_" src="https://github.com/user-attachments/assets/6bdb688d-d818-44e3-894a-1dba8fda6ce6" />

- **Invoice Creation Form**
  <img width="1149" height="4424" alt="localhost_5173_generate" src="https://github.com/user-attachments/assets/3a0dd0f2-ea5c-48b5-817a-a538a1c0f16a" />

- **Dashboard View**  
  <img width="1879" height="728" alt="Screenshot 2025-08-17 131249" src="https://github.com/user-attachments/assets/9fee03e7-28ed-4015-b352-d1e78208f857" />

- **Invoice Preview & Templates**

<img width="938" height="868" alt="Screenshot 2025-08-17 131217" src="https://github.com/user-attachments/assets/ffc70f86-5662-4015-8828-b7dfe688e904" />
<img width="933" height="866" alt="Screenshot 2025-08-17 131207" src="https://github.com/user-attachments/assets/56fb1caa-c180-42b2-bcb2-8bc2531582ed" />
<img width="932" height="867" alt="Screenshot 2025-08-17 131158" src="https://github.com/user-attachments/assets/9135235c-c998-4c5e-8c58-08b54aa883cc" />
<img width="902" height="870" alt="Screenshot 2025-08-17 131150" src="https://github.com/user-attachments/assets/b4ba7642-9963-41b6-bb74-d04d3066135a" />
<img width="910" height="864" alt="Screenshot 2025-08-17 131225" src="https://github.com/user-attachments/assets/b3f4ab13-b393-45e1-9c21-584bd80c983b" />

---

## ⚡ Getting Started

Follow these steps to run the project locally:

### 1. Clone the repository
```bash
git clone https://github.com/your-username/GenInvoice.git
cd GenInvoice
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev

Frontend will start at: http://localhost:5173/

```
### 3. Backend Setup
   ```bash
cd backend
./mvnw spring-boot:run


Backend will start at: http://localhost:8080/
```
### 4. Environment Variables

Create a .env file inside frontend/:
```bash

VITE_CLERK_FRONTEND_API=<your-clerk-frontend-api>
```
### 5.Create an application.properties file inside backend/src/main/resources/:
```bash
spring.data.mongodb.uri=<your-mongodb-uri>
clerk.webhook.secret=<your-clerk-secret>
jwt.secret=<your-jwt-secret>
spring.mail.username=<your-email>
spring.mail.password=<your-email-password>
```
