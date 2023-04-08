import React, { useState } from "react";
import AWS from "aws-sdk";
import axios from "axios";

const rekognitionClient = new AWS.Rekognition({
  region: "us-east-1",
  credentials: {
    accessKeyId: "XXXXXX",
    secretAccessKey: "XXXXX",
  },
});

export default function CedulaValidator() {
  const [image, setImage] = useState(null);
  const [cedulaValida, setCedulaValida] = useState(false);
  const [datosCedula, setDatosCedula] = useState(null);

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleValidateCedula = async () => {
    if (!image) {
      return;
    }

    try {
      const params = {
        Image: {
          Bytes: await image.arrayBuffer(),
        },
        Filters: {
          RegionsOfInterest: [
            {
              BoundingBox: {
                Width: 0.7,
                Height: 0.2,
                Left: 0.15,
                Top: 0.4,
              },
            },
          ],
        },
      };

      const response = await rekognitionClient.detectText(params).promise();

      if (response.TextDetections && response.TextDetections.length > 0) {
        const cedulaRegex = /([0-9]{3}-?[0-9]{7}-?[0-9]{1})/;
        const cedula =
          response.TextDetections[0].DetectedText.match(cedulaRegex);

        if (cedula) {
          const cedulaString = cedula[0].replace(/-/g, "");
          const url = `https://compulaboratoriomendez.com/lib/?Key=DESARROLLOWEB&MUN_CED=${cedulaString.substring(
            0,
            3
          )}&SEQ_CED=${cedulaString.substring(
            3,
            10
          )}&VER_CED=${cedulaString.substring(10, 11)}`;

          const result = await axios.get(url);

          if (result.status === 200) {
            setCedulaValida(true);
            setDatosCedula(result.data);
          } else {
            setCedulaValida(false);
            setDatosCedula(null);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      <button onClick={handleValidateCedula}>Validar Cedula</button>
      {cedulaValida ? (
        <div>
          <p>La cedula es válida</p>
          {datosCedula ? (
            <div>
              <p>Nombre: {datosCedula.nombre}</p>
              <p>Apellido: {datosCedula.apellido}</p>
              <p>Cedula: {datosCedula.cedula}</p>
            </div>
          ) : null}
        </div>
      ) : (
        <p>La cedula es inválida</p>
      )}
    </div>
  );
}
