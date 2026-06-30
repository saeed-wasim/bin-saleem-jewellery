# ⚡ Get Google Client ID in 2 Minutes

## Step 1: Go to Google Cloud Console
https://console.cloud.google.com/

## Step 2: Create a New Project (if needed)
- Click the project selector at the top
- Click "NEW PROJECT"
- Name: `bin-saleem-jewellery`
- Click CREATE

## Step 3: Create OAuth Credentials
1. In the left menu, click **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. If prompted to configure consent screen:
   - Choose **External**
   - Enter app name: `Bin Saleem Jewellery`
   - Enter your email
   - Click **Save and Continue**
   - Click **Save and Continue** again
   - Click **Back to Credentials**

4. Click **+ CREATE CREDENTIALS** → **OAuth client ID** again
5. Select **Web application**
6. Under "Authorized redirect URIs" add:
   - `http://localhost:3000/`

7. Click **CREATE**

## Step 4: Copy Your Client ID
- A popup will show your credentials
- Copy the **Client ID** value

## Step 5: Paste into .env
Open `.env` file and replace:

```env
GOOGLE_CLIENT_ID="REPLACE_ME_WITH_YOUR_GOOGLE_CLIENT_ID"
```

With your actual Client ID, like:

```env
GOOGLE_CLIENT_ID="123456789-abc123def456.apps.googleusercontent.com"
```

## Step 6: Test It
Run the app:
```bash
npm run server    # Terminal 1
npm run dev       # Terminal 2
```

Go to http://localhost:3000 and click "Sign in with Google"!

---

**Note:** You don't need the Client Secret for the new popup-based flow. The frontend uses Google's Sign-In library directly!
