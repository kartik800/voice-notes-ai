# 🎙 Voice Notes App

Record, transcribe, and summarize your meetings or calls with ease.

<img width="1918" height="956" alt="voice_notes_1" src="https://github.com/user-attachments/assets/51f66a4d-d94c-40e2-89b6-d8150ceb8ef0" />
<img width="1908" height="947" alt="voice_notes_2" src="https://github.com/user-attachments/assets/6f118ddc-ab4e-4b44-a136-6f37281e4d87" />


---

## 🚀 Features

* 🎤 **Record Audio Notes** directly from your browser.
* 📝 **Automatic Transcription** using Gemini.
* ✏️ **Edit Transcripts** inline.
* 📚 **Generate Summaries** with Gemini.
* 🗑 **Delete Notes** you no longer need.

---

## 🛠 Tech Stack

* **Frontend**: React
* **Backend**: Node.js, Express
* **Database**: MongoDB
* **AI APIs**: Gemini (transcription, summarization)

---

## 📊 Data Flow

### Diagram
<img width="936" height="743" alt="flow_diagram" src="https://github.com/user-attachments/assets/068ed7f5-1afb-44a6-94e0-eb22c3bd1430" />



### Flow Steps

1. **Record** audio → saved as `.webm`.
2. **Upload** audio to backend (`/notes`).
3. **Backend saves** file + creates MongoDB note.
4. **Transcription** using Gemini.
5. **Frontend** updates with transcript.
6. User can:

   * ✏️ Edit note → `PUT /notes/:id`
   * 📚 Summarize note → `POST /notes/:id/summarize`
   * 🗑 Delete note → `DELETE /notes/:id`

---

## 📦 Setup

### 1. Clone the repo

```bash
git clone https://github.com/kartik800/voice-notes-ai.git
cd voice-notes-ai
```

### 2. Install dependencies

For Frontend
```bash
cd frontend
npm install
```

For Backend
```bash
cd backend
npm install
```


### 3. Create `.env` file

```env
MONGO_URI=your-mongo-uri
GEMINI_API_KEY=your-gemini-api-key
```

### 4. Run backend

```bash
npm start
```

### 5. Run frontend

```bash
npm start
```

### 6. Run inngest
```bash
cd backend
npx inngest-cli@latest dev -u http://localhost:5000/api/inngest
```

---

## 📸 Screenshots

### Recording and Notes



---
