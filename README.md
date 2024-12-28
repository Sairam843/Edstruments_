Setup Instructions
1. Install Dependencies
To get started, you need to install the necessary dependencies. Run the following command:

npm install

2. Start the Development Server
Once the dependencies are installed, you can start the development server:

npm run dev

This will start the app in development mode. The application will be accessible at http://localhost:5173 (or another port, depending on your configuration).

Usage
1. Login
On the login screen, you can log in with any email and any password.
The login details will be stored in localStorage on your browser.
Important: The next time you visit the app, you need to use the same email and password you logged in with previously, as the details are stored locally.

2. Fill Out the Form
Once logged in, you can fill out the form available in the app.
After filling out the form, you can submit it or save it as a draft.

3. Save Drafts
If you save your draft and reload the page, the data will be automatically retrieved from localStorage and repopulated in the form.

4. Logout
The app includes a logout option. When you log out, the session ends, and you'll need to log in again with your stored credentials.

5. LocalStorage Details
Login Details: The user's login credentials (email and password) are saved in localStorage. You need to use the same email/password combination after the initial login.
Form Data: Form data is also saved in localStorage, and it will persist even after a page reload.