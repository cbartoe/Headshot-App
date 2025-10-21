# Professional Headshot Prompts for AI Generation

This document contains the prompt engineering for each headshot style, optimized for Google's Imagen 3 API.

## Style 1: Corporate Classic (LinkedIn-Style)

**Style ID:** `corporate-classic`

**Display Name:** Corporate Classic

**Icon:** 💼

**Description:** Standard LinkedIn-style headshot with neutral background

### Prompt Template

```
Transform this photo into a professional corporate headshot suitable for LinkedIn and business profiles. The person should be wearing professional business attire. Use a clean, neutral background (soft gray or light blue gradient). Ensure even, flattering studio lighting that eliminates harsh shadows. The subject should be centered, facing forward with a confident, approachable expression. Professional photography quality with sharp focus on the face. Corporate, formal, trustworthy aesthetic. High resolution, professional headshot photography style. Natural skin texture with visible hair detail. Bright, airy feel. Make subject look great and accurate to their original appearance.
```

### Key Elements
- **Background:** Neutral gray, soft blue, or white gradient
- **Lighting:** Even, studio-quality lighting
- **Attire:** Business professional (suit, blazer, dress shirt)
- **Expression:** Confident, approachable, professional smile
- **Framing:** Head and shoulders, centered
- **Style Keywords:** corporate, professional, formal, trustworthy, LinkedIn

---

## Style 2: Creative Professional

**Style ID:** `creative-professional`

**Display Name:** Creative Professional

**Icon:** 🎨

**Description:** Close-up with soft bokeh background and natural lighting

### Prompt Template

```
Transform this photo into a creative professional portrait with an artistic touch. Use a soft bokeh background with warm, blurred colors (amber, cream, or soft pastels). Natural, window-style lighting with a gentle glow. The subject should wear modern professional attire with a creative edge. Close-up framing that captures personality and warmth. Slightly off-center composition following the rule of thirds. Professional yet approachable aesthetic with artistic depth of field. High-end portrait photography with natural color grading. Preserve natural skin texture and authentic features. Modern, approachable creative professional aesthetic. Make subject look great and accurate to their original appearance.
```

### Key Elements
- **Background:** Soft bokeh effect with warm, blurred tones
- **Lighting:** Natural, window-style with soft shadows
- **Attire:** Modern professional, creative casual
- **Expression:** Warm, genuine, personable
- **Framing:** Close-up, slightly off-center
- **Style Keywords:** creative, warm, approachable, modern, artistic bokeh

---

## Style 3: Editorial Portrait

**Style ID:** `executive-portrait`

**Display Name:** Executive Portrait

**Icon:** 👔

**Description:** Dramatic black and white portrait with artistic lighting

### Prompt Template

```
Transform this photo into a dramatic editorial-style executive portrait. Black and white photography with high contrast and rich tonal range. Use dramatic side lighting (Rembrandt or split lighting) to create depth and dimension. The subject should exude confidence and authority, wearing premium executive attire. Strong, defined shadows that add gravitas. Magazine editorial quality with sharp details and professional retouching. Sophisticated, powerful, timeless aesthetic. High-end fashion photography meets corporate executive portraiture. Make subject look great and accurate to their original appearance.
```

### Key Elements
- **Background:** Dark, gradient background (black to dark gray)
- **Lighting:** Dramatic side lighting (Rembrandt/split lighting)
- **Color:** Black and white, high contrast
- **Attire:** Premium executive attire
- **Expression:** Confident, authoritative, strong
- **Framing:** Classic portrait composition
- **Style Keywords:** editorial, dramatic, executive, black and white, high contrast, premium

---

## Implementation Notes

### Using with Google Imagen API

When implementing these prompts with the Imagen API:

1. **Combine with source image:** Use the image-to-image generation mode
2. **Adjust strength parameter:** Start with 0.6-0.8 for good balance between preserving identity and applying style
3. **Negative prompts:** Consider adding negative prompts to avoid unwanted elements:
   - "distorted features, blurry, low quality, amateur, casual snapshots, multiple people, cropped face"

### Dynamic Prompt Construction

```javascript
const constructPrompt = (basePrompt, userImage) => {
  return `${basePrompt}

Maintain the person's facial features, identity, and likeness from the source image. Professional photography quality, 4K resolution, studio-grade result.`;
};
```

### API Parameters (Recommended)

```javascript
{
  prompt: "[Selected style prompt]",
  negativePrompt: "distorted, blurry, low quality, amateur, multiple people, cropped",
  strength: 0.7,
  guidance_scale: 7.5,
  num_inference_steps: 30,
  seed: Math.floor(Math.random() * 1000000)
}
```

---

## Testing Checklist

When testing each style:

- [ ] Identity preservation - Does the person still look like themselves?
- [ ] Style accuracy - Does it match the intended aesthetic?
- [ ] Professional quality - Is it suitable for professional use?
- [ ] Lighting consistency - Is the lighting flattering and appropriate?
- [ ] Background quality - Is the background clean and professional?
- [ ] Expression - Is the facial expression appropriate for the style?

---

## Future Style Ideas (Post-MVP)

- **Cinematic Portrait:** Film-style with shallow depth of field
- **Startup Founder:** Casual yet professional with modern tech aesthetic
- **Academic:** Scholarly, approachable, with subtle book-lined background
- **Healthcare Professional:** Clean, trustworthy, with medical setting hints
- **Creative Director:** Bold, artistic with high-fashion influence
