import { useState } from "react";
import AWS from "aws-sdk";

const rekognitionClient = new AWS.Rekognition({
  region: "us-east-1",
  credentials: {
    accessKeyId: "XXXXXX",
    secretAccessKey: "XXXXX",
  },
});

const ImageRecognition = () => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [description, setDescription] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];

    // Verificar si la imagen es apta para todo público
    const content = await file.arrayBuffer();
    const params = {
      Image: {
        Bytes: content,
      },
      MinConfidence: 80,
    };
    const response = await rekognitionClient
      .detectModerationLabels(params)
      .promise();
    if (response.ModerationLabels.length > 0) {
      setError("La imagen no es apta para todo público");
      return;
    }

    setImage(file);
    setError(null);
    setDescription(null);
  };

  const handleValidateImage = async () => {
    if (!image) {
      return;
    }

    try {
      const content = await image.arrayBuffer();

      const params = {
        Image: {
          Bytes: content,
        },
      };

      const response = await rekognitionClient.detectLabels(params).promise();

      const labels = response.Labels.map((label) => label.Name);
      setDescription(labels.join(", "));
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageLoad = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL();
      const utterance = new SpeechSynthesisUtterance(description);
      const voices = window.speechSynthesis.getVoices();
      utterance.voice = voices.find((voice) => voice.lang === "es-ES");
      window.speechSynthesis.speak(utterance);
    };
    img.src = URL.createObjectURL(image);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {error && <p>{error}</p>}
      {description && <p>{description}</p>}
      <button onClick={handleValidateImage}>Validar Imagen</button>
      {description && (
        <button onClick={handleImageLoad}>Leer descripción</button>
      )}
    </div>
  );
};

export default ImageRecognition;
