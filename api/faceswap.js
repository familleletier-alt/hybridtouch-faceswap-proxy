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

    // ✅ MODÈLE CORRIGÉ - Utilisation d'un vrai modèle FaceSwap
    const output = await replicate.run(
      "lucataco/faceswap:9a4038fbfb7c48b48f9e34de29eaef8e33b59d6afd6358e8059c1b851befb7f3",
      {
        input: {
          target_image: target_image,
          swap_image: source_image,
        }
      }
    );
    
    res.json({ success: true, output_url: output });

  } catch (error) {
    console.error('Erreur FaceSwap:', error);
    res.status(500).json({ error: error.message, success: false });
  }
}
