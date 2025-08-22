import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  // Gérer les CORS pour les requêtes depuis base44 et Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Pour le développement, '*' est ok. En prod, mettez l'URL de votre app base44.
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { source_image, target_image } = req.body;

    if (!source_image || !target_image) {
      return res.status(400).json({ error: 'Il manque source_image ou target_image' });
    }

    // ✅ MODÈLE FACESWAP FIABLE ET VÉRIFIÉ
    const output = await replicate.run(
      "omniedgeio/face-swap:c2d783366e8d820a65aa58023d139bde21ba87c67c8733358d3f2d4e06d199e4",
      {
        input: {
          face_to_swap: source_image, // Le visage de l'avatar
          target_image: target_image  // La photo uploadée
        }
      }
    );
    
    // La sortie de ce modèle est directement l'URL de l'image
    res.json({ success: true, output_url: output });

  } catch (error) {
    console.error('Erreur durant le FaceSwap sur Replicate:', error);
    res.status(500).json({ error: `Erreur Replicate: ${error.message}`, success: false });
  }
}
