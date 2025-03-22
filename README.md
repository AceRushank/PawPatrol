#PawPatrol - Animal Incident Reporting Platform
PawPatrol is a platform designed to help users report incidents involving stray dogs and other animals to NGOs for prompt assistance.

Features:
1. Easy Access & Secure Data: Users can quickly submit reports, with data securely stored in MongoDB Atlas.
2. Simple Reporting: An intuitive form allows users to describe incidents, pinpoint exact locations using an interactive map, and upload relevant images.
3. Accurate Location Mapping: Ensures precise coordinates for faster NGO response.
4. Immediate Alerts: Utilizes Twilio to send instant SMS alerts to connected NGOs for swift action.
5. Transparency & Follow-Up: Users can track report status, and NGOs can provide updates to keep everyone informed.

Working Methodology: 

![image](https://github.com/user-attachments/assets/0d94cfe4-f069-418f-a8bd-c8d0ad6f6ff7)

Main Page : 

![image](https://github.com/user-attachments/assets/55e0e8fc-5ab4-4da1-816b-868940c44d4c)

Reporting Page with GEO-Location: 

![image](https://github.com/user-attachments/assets/b1f03b48-0eef-4f17-aa4f-bc4e68f57c90)




All rights are reserved. Open issues to Contact us.




Getting Started: 


# PawPatrol
Only For Niggus
C:\Users\Admin>node -v
v20.15.1

C:\Users\Admin>
C:\Users\Admin>npm -v
10.7.0

C:\Users\Admin>mkdir PawPatrol

C:\Users\Admin>cd PawPatrol

C:\Users\Admin\PawPatrol>npm init -y
Wrote to C:\Users\Admin\PawPatrol\package.json:

{
  "name": "stray-dog-report",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.20.2",
    "cors": "^2.8.5",
    "express": "^4.19.2"
  },
  "description": ""
}




C:\Users\Admin\PawPatrol>npm install body-parser cors express

added 66 packages, and audited 67 packages in 1s

12 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities

C:\Users\Admin\PawPatrol>node server.js
Server running at http://localhost:3000
Form Data saved to form-data.json 
..
