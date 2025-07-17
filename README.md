# LinkVault - Link Saver + Auto-Summary

This project is a full-stack web application built for the OmVad Take-Home Assignment (Internship Edition). It allows users to sign up, log in, save URL bookmarks, and automatically view an AI-generated summary of the link's content.

**Live Demo:** [https://link-saver-auto-summary-chi.vercel.app/](https://link-saver-auto-summary-chi.vercel.app/)

---

## Screenshots

*(Here you can add the 2-5 screenshots or a GIF as required by the submission checklist. I recommend showing off the light mode, dark mode, and mobile responsiveness.)*

**Light Mode Dashboard**

<img width="1915" height="986" alt="Screenshot 2025-07-17 172144" src="https://github.com/user-attachments/assets/b0cabab5-1742-4326-9fa6-9b6fdabffc02" />
<img width="1903" height="516" alt="Screenshot 2025-07-17 172220" src="https://github.com/user-attachments/assets/25b4bdd2-9958-4a03-a6a9-9a7c17f1ea76" />
<img width="1790" height="793" alt="Screenshot 2025-07-17 172230" src="https://github.com/user-attachments/assets/744082f0-4f88-4548-9bd5-eaa627867961" />

**Dark Mode Dashboard**
<img width="1883" height="548" alt="Screenshot 2025-07-17 161532" src="https://github.com/user-attachments/assets/34af0424-a48b-44ce-a580-34e137201d81" />
<img width="1897" height="933" alt="Screenshot 2025-07-17 161518" src="https://github.com/user-attachments/assets/6eecd913-b315-4db5-b0bb-da2d42bcac70" />
<img width="1743" height="876" alt="Screenshot 2025-07-17 161447" src="https://github.com/user-attachments/assets/5f39cd52-a52b-4cb2-80fe-242e985fd8ec" />

**Mobile View**
![WhatsApp Image 2025-07-17 at 17 42 27_cedd8194](https://github.com/user-attachments/assets/c81968fd-a0cb-425d-b50a-cca364b8c092)

![WhatsApp Image 2025-07-17 at 17 42 28_2c7bdaab](https://github.com/user-attachments/assets/fa20bf54-ee2e-48b8-9152-b3856e3c8810)
![WhatsApp Image 2025-07-17 at 17 42 28_a2052447](https://github.com/user-attachments/assets/d475ba68-0ff4-446c-abaf-f5f8eeb8cb56)


---

## Features

This project successfully implements all "must-have" and "nice-to-have" features from the assignment brief.

### Core Functionality (Must-Haves)
- **User Authentication:** Secure user sign-up and login functionality with JWTs and hashed passwords (`bcryptjs`).
- **Bookmark Management:** Users can create, view, and delete their own private bookmarks.
- **Auto-Summarization:** Pasting a URL automatically fetches the page content, calls the Jina AI API, and runs an advanced text-processing algorithm to generate a clean, readable, bullet-point summary.
- **Favicon & Title Fetching:** Automatically stores the favicon and a cleaned-up title for each bookmark.
- **Data Persistence:** User and bookmark data is stored securely in a MongoDB database.
- **Responsive Design:** The UI is fully responsive and usable on all screen sizes.

### Advanced Features (Nice-to-Haves)
- **Dark Mode:** A complete, beautiful dark theme with smooth transitions and persistence via local storage.
- **Tagging & Filtering:** Users can add comma-separated tags to bookmarks and filter their view by selecting a tag.
- **Drag-and-Drop Reordering:** Users can reorder their bookmarks by dragging and dropping them. The new order is saved to the database.
- **Modern UI/UX:** A polished, modern interface featuring a glassmorphism header, modals with backdrop blur, and a responsive grid/list view toggle.

---

## Tech Stack

- **Framework:** Next.js 14
- **Frontend:** React 18
- **Database:** MongoDB (via MongoDB Atlas)
- **Authentication:** JWT (JSON Web Tokens) with `bcryptjs`
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Drag & Drop:** dnd-kit
- **Deployment:** Vercel

---

## Local Setup

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/link-saver-auto-summary.git](https://github.com/your-username/link-saver-auto-summary.git)
    cd link-saver-auto-summary
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env.local` file in the root of the project and add the following variables:
    ```
    MONGODB_URI="your_mongodb_connection_string"
    JWT_SECRET="your_super_secret_jwt_key"
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


---

## What I'd Do Next

Given more time, I would focus on these additional features to further enhance the application:

- **User Profiles:** A dedicated page where users can change their password or delete their account.
- **Search Highlighting:** Highlight the search query within the bookmark titles and summaries for better visibility.
- **More Robust Error Handling:** Display more specific, user-friendly error messages (e.g., "This URL could not be reached") instead of generic alerts.
- **End-to-End Testing:** Add a framework like Cypress for comprehensive end-to-end testing of user flows.

---

## Time Spent

I spent approximately **6-8 hours** of focused work on this assignment, from initial setup and debugging to implementing all core and advanced features and final deployment.
