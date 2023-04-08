import { useState } from "react";
import AWS from "aws-sdk";

const rekognitionClient = new AWS.Rekognition({
  region: "us-east-1",
  credentials: {
    accessKeyId: "XXXXXX",
    secretAccessKey: "XXXXX",
  },
});

export default function PublicoYCara() {
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [isImageValid, setIsImageValid] = useState(false);

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
      setIsImageValid(false);
      return;
    }

    // Verificar si hay más de una cara en la imagen
    const faceParams = {
      Image: {
        Bytes: content,
      },
      Attributes: ["ALL"],
    };
    const faceResponse = await rekognitionClient
      .detectFaces(faceParams)
      .promise();
    if (faceResponse.FaceDetails.length !== 1) {
      setError("La imagen debe tener solo una cara");
      setIsImageValid(false);
      return;
    }

    setImage(file);
    setError(null);
    setIsImageValid(true);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {error && <p>{error}</p>}
      {isImageValid && <p>La imagen es apta para todo público y tiene solo una cara.</p>}
    </div>
  );
}
