# Real-Time Fake Medicine Detection System

## Core Idea
A system to verify whether a medicine is REAL or FAKE by checking official open-source drug databases, validating batch numbers, and monitoring recall reports.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL (PERN Stack)
- **Database**: PostgreSQL
- **APIs**: openFDA, WHO GSMS, NDC Directory

## Setup

### Prerequisites
- Node.js
- PostgreSQL

### Installation

1. **Client**
   ```bash
   cd client
   npm install
   npm run dev
   ```

2. **Server**
   ```bash
   cd server
   # Setup .env file with DATABASE_URL
   npm install
   npm run dev
   ```

## Features
- Medicine Verification (Name, Batch, Manufacturer)
- Qr/Barcode Scanner
- Real-time Recall Monitoring
- Analytics Dashboard
