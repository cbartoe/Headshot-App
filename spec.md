# Professional Headshot AI App - Technical Specification

## Overview
A web application that transforms user-uploaded photos into professional headshots using AI image generation. Users can select from three distinct professional styles and compare the AI-generated result with their original photo side-by-side.

## Features

### Core Functionality
- **Photo Upload**: Drag-and-drop or click-to-upload interface for user photos
- **Style Selection**: Three professional headshot styles to choose from:
  - **Corporate Classic**: Traditional business headshot with neutral background
  - **Creative Professional**: Modern, approachable style with subtle creative elements
  - **Executive Portrait**: Premium, high-end professional portrait style
- **AI Generation**: Transform uploaded photo using Google's Imagen 3 (nano banana) API
- **Side-by-Side Comparison**: Interactive comparison view showing original vs. AI-generated headshot
- **Download**: Save the generated professional headshot

### User Experience
- Clean, intuitive interface
- Real-time preview of uploaded photo
- Loading states during AI generation
- Responsive design for desktop and mobile devices

## Technical Requirements

### Functional Requirements
1. Support common image formats (JPEG, PNG, WEBP)
2. Maximum upload file size: 10MB
3. Image preprocessing for optimal API results
4. Error handling for failed uploads or API requests
5. Session-based image storage (no permanent user data storage initially)

### Non-Functional Requirements
1. Fast upload and processing times (<30 seconds total)
2. Secure API key management
3. Mobile-responsive UI
4. Accessibility compliance (WCAG 2.1 Level AA)
5. Clear user feedback during processing

## Tech Stack

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API / useState
- **UI Components**:
  - React Dropzone (file upload)
  - React Compare Image (side-by-side comparison)
  - Custom components for style selection

### Backend
- **Framework**: Express.js
- **Runtime**: Node.js 18+
- **File Handling**: Multer (multipart form data)
- **API Integration**: Google Generative AI SDK (@google/generative-ai)
- **Environment Variables**: dotenv
- **CORS**: cors middleware

### AI/ML
- **Image Generation**: Google Imagen 3 (nano banana model)
- **API**: Gemini API with image-to-image generation
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict`

### Development Tools
- **Version Control**: Git
- **Package Manager**: npm
- **Code Quality**: ESLint, Prettier
- **API Testing**: Postman/Thunder Client

## Architecture

```
┌─────────────────┐
│  React Frontend │
│   (Port 5173)   │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│ Express Backend │
│   (Port 3000)   │
└────────┬────────┘
         │
         │ API Call
         │
┌────────▼────────┐
│  Google Imagen  │
│   API (Gemini)  │
└─────────────────┘
```

## API Endpoints

### Backend Routes
- `POST /api/upload` - Upload and store image temporarily
- `POST /api/generate-headshot` - Generate professional headshot
  - Request body: `{ imageData: base64, style: string }`
  - Response: `{ generatedImage: base64, originalImage: base64 }`
- `GET /health` - Health check endpoint

## Project Milestones

### Milestone 1: UI Development & Core Frontend
**Goal**: Build complete user interface and frontend functionality without AI integration

**Deliverables**:
- [ ] Project setup (React + Vite, Express server scaffolding)
- [ ] File upload component with drag-and-drop functionality
- [ ] Image preview display after upload
- [ ] Style selection interface with three style options
- [ ] Side-by-side comparison component (using mock data)
- [ ] Download button functionality
- [ ] Responsive design implementation
- [ ] Basic Express server with file upload endpoint
- [ ] Frontend-backend communication for file uploads
- [ ] Error handling and user feedback (toasts/alerts)
- [ ] Loading states and animations

**Success Criteria**:
- User can upload an image and see it displayed
- User can select between three styles (UI only)
- Mock comparison view works with test images
- Application is responsive on mobile and desktop
- All UI components are polished and functional

**Estimated Duration**: 1-2 weeks

---

### Milestone 2: AI Integration with Google Imagen API
**Goal**: Integrate Google's Imagen 3 API for actual headshot generation

**Deliverables**:
- [ ] Google Cloud project setup and API key configuration
- [ ] Backend integration with Gemini API SDK
- [ ] Image-to-image generation endpoint implementation
- [ ] Style-specific prompt engineering for each headshot type:
  - Corporate Classic prompts
  - Creative Professional prompts
  - Executive Portrait prompts
- [ ] Image preprocessing (resize, format conversion)
- [ ] Base64 encoding/decoding for image transmission
- [ ] Replace mock data with real AI-generated images
- [ ] API error handling and retry logic
- [ ] Rate limiting and cost management
- [ ] Security: API key protection and validation
- [ ] Performance optimization (caching, compression)
- [ ] End-to-end testing with real images

**Success Criteria**:
- API successfully generates professional headshots
- Each style produces distinctly different results
- Generated images meet quality standards
- Error handling gracefully manages API failures
- Response times are acceptable (<30 seconds)
- API costs are tracked and optimized

**Estimated Duration**: 2-3 weeks

---

## Environment Variables

```env
# Backend (.env)
PORT=3000
GOOGLE_API_KEY=your_gemini_api_key_here
NODE_ENV=development
MAX_FILE_SIZE=10485760
ALLOWED_ORIGINS=http://localhost:5173
```

```env
# Frontend (.env)
VITE_API_URL=http://localhost:3000
```

## Security Considerations
1. API keys stored in environment variables (never committed)
2. Input validation on file uploads (type, size)
3. CORS configuration for frontend-backend communication
4. Rate limiting on API endpoints
5. Sanitization of user inputs
6. HTTPS in production

## Future Enhancements (Post-MVP)
- User authentication and image history
- Additional style options
- Batch processing for multiple photos
- Fine-tuning controls (background color, lighting)
- Social media sharing integration
- Payment integration for premium features
