# Linkedin job scraper

project is live at:
https://v0-linkedin-job-scraper-seven.vercel.app/

Youtube video- https://youtu.be/fnO97TZvsgg?si=17GuKju-OTKQeMFG
---
🔍 FIND-YOUR-INTERNSHIP (AI-Powered Job Application Platform)
An AI-powered web application that helps users discover, tailor, and apply to the latest LinkedIn "Easy Apply" jobs—all with a swipe.

🚀 Features
🔄 Real-Time Job Fetching: Replaces stale job results by modifying LinkedIn URLs (e.g., r86400 ➝ r3600) to fetch the latest job postings.

📄 Resume Upload: Users can upload their resume (PDF/DOCX), which is parsed to extract relevant information.

🧠 AI Resume Tailoring: Resume is tailored to each job description using Groq LLM, enhancing skills, experience, and phrasing.

💼 LinkedIn Job Scraper: Scrapes job data including title, company, location, and requirements using Playwright and BeautifulSoup.

👉 Swipe to Apply: Users can right swipe to apply with a tailored resume or left swipe to skip using a Tinder-style card interface.

✉️ Cold Email Generator: Generates custom cold emails for selected job roles using portfolio matches and LLM assistance.

🔒 Authentication & Secure Deployment: API keys managed via .env, deployed on Streamlit Cloud/Vercel.

📸 Demo
[Insert Screenshots or Loom/Youtube Demo Here]

🧱 Tech Stack
Component	Technology
Frontend	React + react-tinder-card or Streamlit
Backend API	FastAPI
Resume Parsing	pdfminer.six, docx, spaCy
Web Scraping	BeautifulSoup, Playwright, Requests
AI & LLM	Groq API, LangChain
Vector Search	Pinecone / FAISS (optional)
Automation	Puppeteer / Selenium
Storage	MongoDB / PostgreSQL
Deployment	Streamlit Cloud / Vercel

🧪 Cold Email Pipeline (Overview)
Input: User enters a careers page URL.

Scraping: Extracts job info using Playwright/BeautifulSoup.

Job Understanding: Groq LLM summarizes and identifies role expectations.

Portfolio Match: Matches user projects from a vector DB.

Email Creation: Writes personalized cold emails.

Display: Email + job details + matched projects shown in the app.

📂 Folder Structure
bash
Copy
Edit
├── app/
│   ├── components/         # React components or Streamlit scripts
│   ├── api/                # FastAPI routes
│   ├── utils/              # Scraping, parsing, LLM prompts
│   └── main.py             # Entry point
├── public/                 # Static assets
├── .env.example            # Template for environment variables
├── requirements.txt
├── README.md
└── package.json
⚙️ Installation
bash
Copy
Edit
git clone https://github.com/adityas777/FIND-YOUR-INTERNSHIP.git
cd FIND-YOUR-INTERNSHIP

# Python backend
pip install -r requirements.txt

# React frontend (if applicable)
npm install
npm run dev
Create a .env file:

env
Copy
Edit
GROQ_API_KEY=your_groq_api_key
PINECONE_API_KEY=your_pinecone_api_key
LINKEDIN_SESSION_COOKIE=your_cookie_for_testing
🧪 Example LLM Prompt
txt
Copy
Edit
Given the resume: {resume_text} and the job description: {job_description}, generate a tailored resume in the same format emphasizing the candidate's relevance to this job. Improve phrasing, prioritize job-matching skills, and highlight relevant experience.
⚠️ Legal & Ethical Disclaimer
LinkedIn scraping may violate their Terms of Service.

Use stealth browsers for educational/research purposes only.

Prefer using LinkedIn APIs or official data sources for production usage.

📌 Future Enhancements
✅ Analytics dashboard for swipe activity

🧠 GPT-4 or Claude Integration

📤 Auto-email tracking (sent, replied, opened)

📆 Job reminder and save-for-later queue

🧬 Resume benchmarking against similar candidates

👤 Author
Aditya Singh
🔗 LinkedIn |
💻 GitHub |
🌐 Portfolio

⭐️ Show Your Support
If you found this project useful or inspiring, feel free to give it a ⭐ on GitHub and share your feedback!

