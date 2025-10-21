const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenAI } = require('@google/genai');
const { getPromptForStyle } = require('./prompts');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Google Generative AI with the new SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173'
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, PNG, WEBP)'));
    }
  }
});

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// List available models to debug
app.get('/api/list-models', async (req, res) => {
  try {
    console.log('Listing available models...');
    const models = await ai.models.list();
    console.log('Models found:', models);
    res.json({ models });
  } catch (error) {
    console.error('Error listing models:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload image endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Generate headshot endpoint with Google Gemini AI
app.post('/api/generate-headshot', async (req, res) => {
  try {
    const { imageData, style } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    if (!style) {
      return res.status(400).json({ error: 'No style selected' });
    }

    console.log(`Generating headshot with style: ${style}`);

    // Get the appropriate prompt for the selected style
    const prompt = getPromptForStyle(style);

    // Extract base64 data and mime type from data URL
    const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid image data format' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    console.log('Using model: gemini-2.5-flash-image');
    console.log('Calling Gemini API...');

    // Use the new Gemini 2.5 Flash Image model for image generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        { text: prompt },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
      ],
    });

    console.log('Gemini API response received');

    // Extract the generated image from the response
    let generatedImageBase64 = null;

    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];

      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            // Found the generated image
            const generatedMimeType = part.inlineData.mimeType || 'image/png';
            generatedImageBase64 = `data:${generatedMimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    }

    if (!generatedImageBase64) {
      console.error('No image generated in response');
      console.log('Full response:', JSON.stringify(response, null, 2));
      return res.status(500).json({
        error: 'No image was generated. Please try again.',
        details: 'The AI did not return an image in the response'
      });
    }

    console.log('Successfully generated headshot');

    res.json({
      message: 'Headshot generated successfully',
      originalImage: imageData,
      generatedImage: generatedImageBase64,
      style: style
    });

  } catch (error) {
    console.error('Error generating headshot:', error);
    res.status(500).json({
      error: 'Failed to generate headshot',
      details: error.message
    });
  }
});

// Revise headshot endpoint with iterative editing
app.post('/api/revise-headshot', async (req, res) => {
  try {
    const { imageData, revisionPrompt, style } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    if (!revisionPrompt) {
      return res.status(400).json({ error: 'No revision prompt provided' });
    }

    console.log(`Revising headshot with style: ${style}`);
    console.log(`Revision prompt: ${revisionPrompt}`);

    // Extract base64 data and mime type from data URL
    const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid image data format' });
    }

    const mimeType = matches[1];
    const base64Data = matches[2];

    console.log('Using model: gemini-2.5-flash-image');
    console.log('Calling Gemini API for revision...');

    // Get the base prompt for the style and combine with revision instructions
    const basePrompt = getPromptForStyle(style);
    const revisionFullPrompt = `${basePrompt}

REVISION REQUEST: ${revisionPrompt}

Apply this specific revision while maintaining all other aspects of the professional headshot. Keep the person's exact facial identity unchanged.`;

    // Use Gemini 2.5 Flash Image for iterative editing
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: [
        { text: revisionFullPrompt },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Data,
          },
        },
      ],
    });

    console.log('Gemini API response received');

    // Extract the revised image from the response
    let revisedImageBase64 = null;

    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];

      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData && part.inlineData.data) {
            // Found the revised image
            const revisedMimeType = part.inlineData.mimeType || 'image/png';
            revisedImageBase64 = `data:${revisedMimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    }

    if (!revisedImageBase64) {
      console.error('No image generated in response');
      console.log('Full response:', JSON.stringify(response, null, 2));
      return res.status(500).json({
        error: 'No image was generated. Please try again.',
        details: 'The AI did not return an image in the response'
      });
    }

    console.log('Successfully revised headshot');

    res.json({
      message: 'Headshot revised successfully',
      originalImage: imageData,
      generatedImage: revisedImageBase64,
      style: style,
      revisionApplied: revisionPrompt
    });

  } catch (error) {
    console.error('Error revising headshot:', error);
    res.status(500).json({
      error: 'Failed to revise headshot',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Max 10MB allowed.' });
    }
  }
  res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
