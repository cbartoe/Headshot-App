// Headshot style prompts for AI generation
// Based on headshots-prompts.md

const HEADSHOT_PROMPTS = {
  'corporate-classic': `IMPORTANT: Keep this person's exact facial identity, likeness, and all distinctive features completely unchanged. Preserve their exact face shape, eye shape and color, nose shape, mouth shape, facial structure, skin tone, and hair color/texture identical to the source image. Only modify the background, lighting, and clothing.

Transform this photo into a professional corporate headshot suitable for LinkedIn and business profiles. The person should be wearing professional business attire. Use a clean, neutral background (soft gray or light blue gradient). Ensure even, flattering studio lighting that eliminates harsh shadows. The subject should be centered with body positioned at a slight 15-20 degree angle from the camera while head turns naturally toward the camera for an engaged, three-quarter pose. Confident, approachable expression with natural smile. Professional photography quality with sharp focus on the face. Corporate, formal, trustworthy aesthetic. High resolution, professional headshot photography style. Natural skin texture with visible hair detail. Bright, airy feel.

CRITICAL: This must look like the same exact person - maintain 100% facial identity and likeness from the source image.`,

  'creative-professional': `IMPORTANT: Keep this person's exact facial identity, likeness, and all distinctive features completely unchanged. Preserve their exact face shape, eye shape and color, nose shape, mouth shape, facial structure, skin tone, and hair color/texture identical to the source image. Only modify the background, lighting, and clothing.

Transform this photo into a creative professional portrait with an artistic touch. Use a soft bokeh background with warm, blurred colors (amber, cream, or soft pastels). Natural, window-style lighting with a gentle glow. The subject should wear modern professional attire with a creative edge. Body positioned at a relaxed angle with shoulders slightly turned, creating a natural three-quarter pose while maintaining eye contact with the camera. Close-up framing that captures personality and warmth. Slightly off-center composition following the rule of thirds. Professional yet approachable aesthetic with artistic depth of field. High-end portrait photography with natural color grading. Preserve natural skin texture and authentic features. Modern, approachable creative professional aesthetic.

CRITICAL: This must look like the same exact person - maintain 100% facial identity and likeness from the source image.`,

  'executive-portrait': `IMPORTANT: Keep this person's exact facial identity, likeness, and all distinctive features completely unchanged. Preserve their exact face shape, eye shape and color, nose shape, mouth shape, facial structure, skin tone, and hair color/texture identical to the source image. Only modify the background, lighting, and clothing.

Transform this photo into a dramatic editorial-style executive portrait. Black and white photography with high contrast and rich tonal range. Use dramatic side lighting (Rembrandt or split lighting) to create depth and dimension. Body positioned at a confident angle with shoulders turned to create depth and executive presence, three-quarter pose composition. The subject should exude confidence and authority, wearing premium executive attire. Strong, defined shadows that add gravitas. Magazine editorial quality with sharp details and professional retouching. Sophisticated, powerful, timeless aesthetic. High-end fashion photography meets corporate executive portraiture.

CRITICAL: This must look like the same exact person - maintain 100% facial identity and likeness from the source image.`
};

const NEGATIVE_PROMPT = "distorted features, blurry, low quality, amateur, casual snapshots, multiple people, cropped face, disfigured, deformed, altered face, different person, changed facial features, morphed face, face swap, different identity, unrealistic face, cartoon, anime style, painting";

/**
 * Get the prompt for a specific headshot style
 * @param {string} styleId - The style identifier
 * @returns {string} The full prompt for that style
 */
function getPromptForStyle(styleId) {
  const prompt = HEADSHOT_PROMPTS[styleId];

  if (!prompt) {
    throw new Error(`Unknown style: ${styleId}`);
  }

  // Identity preservation is now built into each prompt
  return prompt;
}

/**
 * Get the negative prompt to avoid unwanted elements
 * @returns {string} The negative prompt
 */
function getNegativePrompt() {
  return NEGATIVE_PROMPT;
}

/**
 * Get all available style IDs
 * @returns {string[]} Array of style IDs
 */
function getAvailableStyles() {
  return Object.keys(HEADSHOT_PROMPTS);
}

module.exports = {
  getPromptForStyle,
  getNegativePrompt,
  getAvailableStyles,
  HEADSHOT_PROMPTS
};
