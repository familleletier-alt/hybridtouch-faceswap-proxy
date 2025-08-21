import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { source_image, target_image } = req.body;

    const output = await replicate.run(
      "yan-ops/face_swap:d5900f9ebed33e7ae6ba2e2fdcfe3ef1c7c8c10a4e2000f6e8e3d5a8e3d5a8e3",
      {
        input: {
          target_image: target_image,
          swap_image: source_image,
        }
      }
    );
    
    // Replicate retourne directement l'URL de l'image
    res.json({ success: true, output_url: output });

  } catch (error) {
    console.error('Erreur FaceSwap:', error);
    res.status(500).json({ error: error.message, success: false });
  }
}
