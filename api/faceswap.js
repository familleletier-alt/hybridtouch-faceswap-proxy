import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  // Gérer les CORS pour les requêtes depuis base44
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { source_image, target_image } = req.body;

    if (!source_image || !target_image) {
      return res.status(400).json({ error: 'Missing source_image or target_image' });
    }

    // ✅ NOUVEAU MODÈLE STABLE + CORRECTION DES NOMS D'INPUTS
    const output = await replicate.run(
      "yan-ops/face_swap:d5900f9ebed33e7ae6ba2e2fdcfe3ef1c7c8c10a4e2000f6e8e3d5a8e3d5a8e3",
      {
        input: {
          target_image: target_image, // L'image sur laquelle on applique le visage
          swap_image: source_image,    // Le visage à utiliser
        }
      }
    );
    
    res.json({ success: true, output_url: output });

  } catch (error) {
    console.error('Erreur FaceSwap:', error);
    res.status(500).json({ error: error.message, success: false });
  }
}
