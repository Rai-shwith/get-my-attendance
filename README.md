# Get My Attendance  
**A smarter, semi-automated way to manage classroom attendance without the hassle!**  

---

## Table of Contents  
1. [Introduction](#introduction)  
2. [Features](#features)  
3. [Installation](#installation)  
4. [Network Setup Guidelines](#network-setup-guidelines)  
5. [Usage](#usage)  
   - [Registration Phase](#registration-phase)  
   - [Attendance Phase](#attendance-phase)  
6. [PDF Report](#pdf-report)  
7. [Known Issues & Limitations](#known-issues--limitations)  
8. [Future Plans](#future-plans)  
9. [Contributing](#contributing)  
10. [License](#license)  
11. [Story Behind the Project](#story-behind-the-project)  

---

## Introduction  
Tired of managing attendance manually? **Get My Attendance** is here to save the day!  
With an innovative, browser-based solution, this project lets students register once and automates attendance tracking while ensuring security with cookies.  

> **Curious about the story behind this project?** [Read the full journey here](STORY.md).  

---

## Features  
- **Easy Registration:** Students register just once.  
- **Automated Attendance:** Attendance is marked automatically when the link is accessed.  
- **Secure System:**  
  - Uses cookies to ensure unique identification.  
  - Only the teacher can download attendance with a secure PIN.  
- **Real-Time Updates:** See who has registered, attended, or attempted invalid actions live.  
- **Custom Attendance Window:** Set attendance duration (e.g., 1, 2, or 5 minutes).  
- **Downloadable Reports:** Generates attendance details in a sorted, color-coded PDF.  
- **Failsafe Mechanisms:** Prevents duplicate entries, proxies, and unauthorized access.  

---

## Installation  

### For Android Users  
1. **Install Termux**  
   - Download and install [Termux](https://f-droid.org/packages/com.termux/) on your Android device.  

2. **Set Up Git in Termux**  
   Run the following commands to install Git:  
   ```bash  
   pkg update  
   pkg install git  
   ```  

3. **Clone the Repository**  
   ```bash  
   git clone https://github.com/<your-username>/get-my-attendance.git  
   cd get-my-attendance  
   git checkout security/cookies  
   ```  

4. **Install Node.js**  
   Run the following commands:  
   ```bash  
   pkg install nodejs  
   ```  

5. **Install Dependencies**  
   ```bash  
   npm install  
   ```  

6. **Set Up the Environment**  
   Create a `.env` file in the root directory and configure the following variables:  
   ```env  
   OUTPUT_FILE_PATH='./'  
   STUDENT_DETAILS_PATH_cookie='attendance/info.json'  
   PORT=1111  # Use 1111 or any other port for Android  
   SECRET_KEY='your-secret-key'  
   ```  

---

## Network Setup Guidelines  

### For the Host  
- **Enable Mobile Hotspot:**  
  Before running the scripts, **turn on your mobile hotspot**. This ensures students can connect to your network for attendance.  

- **Limitations on Android Hotspot:**  
  Android devices generally allow only **10 connections**.  
  - The first **10 students** should connect directly to your hotspot.  
  - For larger classrooms, these 10 students should enable their **own mobile hotspots** to allow others to connect to them in a chain.  

- **Avoid Connecting to Other Wi-Fi Networks:**  
  If the host connects to any external Wi-Fi network (e.g., college Wi-Fi), anyone on that network can access the attendance link.  
  - **For testing purposes:** You can connect to an external Wi-Fi network.  
  - **During attendance:** Ensure the host **only uses their mobile hotspot** for security.  

---

## Usage  

### Registration Phase  
1. **Start the Registration Server**  
   ```bash  
   node register.js  
   ```  

2. **Set the Time Window**  
   Enter the duration (in minutes) for registration or press Enter to use the default (5 minutes).  

3. **Share the Link**  
   Share the link (e.g., `http://192.168.43.1:1111/`) with students.  

4. **Student Registration**  
   - Students connect to the host's hotspot and access the link.  
   - They enter their name and roll number (USN) on the page.  
   - The system validates and stores their details securely.  

---

### Attendance Phase  
1. **Start the Attendance Server**  
   ```bash  
   node attendance.js  
   ```  

2. **Set the Time Window**  
   Enter the duration (in minutes) for attendance.  

3. **Secure PIN**  
   Note the 4-digit PIN displayed. It’s required to download the PDF report.  

4. **Share the Link**  
   Share the same link (e.g., `http://192.168.43.1:1111/`) with students. Attendance will be auto-marked upon accessing the page.  

5. **Download Attendance Report**  
   After the attendance window ends, visit the link to download the PDF by entering the secure PIN.  

---

## PDF Report  
The generated PDF includes:  
- Sorted attendance details (present and absent).  
- Roll numbers in ascending order.  
- Color-coded entries:  
  - **Green:** Present  
  - **Red:** Absent  

> The file is saved in the specified `OUTPUT_FILE_PATH` and named with the timestamp (e.g., `Dec 06, 2024, 03-04 PM.pdf`).  

---

## Known Issues & Limitations  
- **Cookie Dependency:** Users must use the same browser and avoid incognito mode to retain cookies.  
- **Network Limitation:** Android hotspots allow only 10 direct connections.  
- **Browser Updates:** May cause unpredictable behavior with hashed keys.  
- **Security Risk on Public Wi-Fi:** Ensure the host uses a private mobile hotspot for attendance.  

---

## Future Plans  
- Explore using MAC addresses for unique identification with Raspberry Pi.  
- Implement the `security/canvas` branch for cross-browser compatibility.  
- Optimize scalability for larger classrooms.  

---

## Contributing  
Contributions are welcome! Feel free to fork this repository and submit a pull request.  

---

## License
This project is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/).  

You are free to:  
- Share and adapt the work for non-commercial purposes, as long as you provide proper attribution.  
- If you build upon this work, you must distribute your contributions under the same license.  

For commercial use, please contact me at [ashwithrai0404@gmail.com](mailto:ashwithrai0404@gmail.com).
---

## Story Behind the Project  
Want to know how this idea came to life? Read the full backstory and evolution in [STORY.md](STORY.md).  