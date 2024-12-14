# Get My Attendance

## Introduction

*Get My Attendance* is a project that came to life out of frustration and a desire to make the tedious task of managing attendance a breeze. What started as a desperate attempt to save myself from the monotony of manually tracking attendance in class evolved into a full-fledged solution. It’s a simple yet effective system to mark attendance, and it all started with a very annoying request from my **DDHDL (Digital Design with HDL)** ma’am during class.

---

## The Spark of Inspiration: The DDHDL Incident

It all started on a regular day in class when my **DDHDL ma’am** asked me to take attendance because she was "too tired" from giving the lecture. I was already struggling to stay awake, and then I was handed the burden of marking attendance manually in a physical ledger. *Seriously? In 2024?* That’s when I thought, *"Why am I still doing this manually? Surely, there's a better way to automate this."*

---

## The Evolution of My Crazy Ideas

### First Attempt: The Web-based Solution

My first idea was simple: Create a website where students could visit and mark their attendance. But after some quick brainstorming, I realized this was a terrible idea. Why? Because anyone could mark their attendance, even if they weren’t in class! So I scratched that idea.

### Second Attempt: Geofencing

Next, I thought of using **geofencing** – basically setting up a geofence around the teacher by capturing the coordinates of the student's browser. But when I tested this, the geofencing accuracy was off by about 20 meters. *Not acceptable.* That was out too.

### Third Attempt: Barcode Scanning

I then considered using a **barcode scanning** system, where students could scan a code to mark their attendance. But the problem with this was that students could easily bring their friend's barcode and mark their attendance. Plus, it would require additional physical components like scanners and tags for every student, which would just make the whole process harder than before. So, that idea was also abandoned.

---

## The Moment of Clarity: Termux to the Rescue

I was about to give up when I had an epiphany: *What if I used my Android phone’s Termux app to run a server and connect my friends to my hotspot?* This way, I could mark attendance by connecting devices over a local network. This was a breakthrough moment! The problem? **Android phones can only handle 10 connections** at a time, and my class had **70 students**.

### The Solution: The Hotspot Chain

Here’s where the magic happened: I realized I could create a **chain of hotspots**. The first 10 students would connect to my hotspot, and the next 10 would connect to their hotspot, and so on. This allowed me to establish over 100 connections using just a few phones in the chain.

---

## Why the Name "Get My Attendance"?

The name was inspired by a random comment I made while brainstorming with a friend. I said, *"If I had to host this, the domain would be getmyattendance.com,"* and thought it was catchy enough to stick with. Even though I never used the domain (because I’m hosting it locally), the name felt just right, so I named the repository **Get My Attendance**.

---

## Initial Stages of Development

At first, I had no clear plan – I was just a "get it done" kind of guy. I started with **Node.js** and **Express** as my tech stack and quickly put together a basic system. The idea was simple: students would visit a URL (like `http://172.29.240.1/`), and the system would track their attendance based on their IP address. *Spoiler alert: This plan was doomed to fail.*

---

## The Struggles: IP Address and Dynamic Allocation

When I started using this approach, I realized that phones dynamically assign IP addresses, and this would create a huge problem when tracking multiple devices. But, being stubborn, I kept pushing forward and found an alternative approach.

---

## The Breakthrough: MAC Addresses (And How They Failed)

I thought, *"What if I use the **MAC address** instead of IP addresses? They’re unique to every device!"* I started working on a new branch to store information based on MAC addresses, but it turned out that Termux on Android doesn’t allow access to the **MAC address table**, so this was another roadblock.

---

## Raspberry Pi Dream

At this point, I knew I needed something more powerful than a phone to support multiple Wi-Fi connections and access MAC addresses. Enter the **Raspberry Pi**. However, acquiring a Raspberry Pi proved to be quite a challenge, as my attempts to get one from the **CCPS (Centre for Cyber Physical Systems)** at my college turned into a comedy of errors. But that’s another story for another day!

---

## The Solution: Cookies for Security

After a few more failed attempts and some brain-storming, I came up with a new idea – **cookies**. By storing a randomly generated key in a user's cookies, I could track attendance. Once students registered once, they could attend any session without needing to sign in again, as long as they didn’t lose their cookies. This approach worked well and was simple enough to implement.

---

## Current State of the Project: Security and Usability

The current **master branch** uses cookies to manage attendance. Students register once, and their attendance is tracked automatically using the cookie key.

### Branches and Features:

1. **security/cookies**: The primary approach where a random key is stored in cookies for user identification.
   - *Pros*: Simple, secure (up to 4 years expiry), and works across devices as long as the cookie isn’t lost.
   - *Cons*: If the student uses **Incognito Mode** or clears cookies, they must re-register.
   
2. **security/canvas**: A more advanced approach using the **HTML canvas element** to generate a fingerprint, which is hashed and used as a unique identifier.
   - *Pros*: Works in incognito mode and doesn’t require re-registration.
   - *Cons*: There’s unpredictability with browser upgrades, and it might not work perfectly across devices with different configurations.
   
3. **pdfGenerator**: Generates attendance PDFs with the date and time, sorted by roll number and attendance status (Present/Absent).
   - The PDF is **pageless** and contains a colored mark for each student’s attendance: Green for present and Red for absent.

---

## New Features and Security Enhancements

- **Password Protection for PDF**: Now, when attendance ends, a random 4-digit password is generated to protect the PDF. Only the host (teacher) can download the PDF using this password.
  
- **Auto-Save PDFs**: PDFs are automatically saved in a specified location, but can also be accessed by visiting the link `eg: http://172.29.240.1/` after the end of attendance process.
  
- **Sorted PDFs**: The attendance report in PDF form is sorted by:
  1. Present and Absent students.
  2. Roll number.
  3. Absent students are marked with a red shade and present students with a green shade.

---

## Conclusion: The Journey So Far

The journey of building *Get My Attendance* has been a rollercoaster. From initial failures with IP addresses to trying and failing with MAC addresses, I eventually found a solid solution with cookies. While there are still some limitations (like using the same browser for each session), the system works well for now.

---

### P.S.

If you’re curious about the **technical details**, be sure to check the [README.md](README.md) of the repo. It’s where all the magic happens – well, the practical magic, at least. Because sometimes, **code** is the real **hero** in a world of deadlines and attendance woes.

---

## Configuration:

- **.env File**: 
  - `OUTPUT_FILE_PATH='./'` — Path where the generated PDF is saved.
  - `STUDENT_DETAILS_PATH_cookie='attendance/info.json'` — Path for storing student details (cookies).
  - `PORT=80` — Port for the service (use `:1111` for Android).
  - `SECRET_KEY='your-secret-key'` — Secret key for generating random IDs in cookies.