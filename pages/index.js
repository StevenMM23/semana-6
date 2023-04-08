import PublicoYCara from "@/components/actoPublico";
import CedulaValidator from "@/components/cedulaRekog";
import ImageRecognition from "@/components/noVIdentes";

export default function Home() {
  return (
    <div>
      <h1>Ejercicio 1</h1>
      <CedulaValidator />
      <div style={{ borderStyle: "solid", color: "red" }}>
        <p>
          Por motivos de que la clave de Amazon Recognition se cambio no es
          posible visualizar el ejemplo
        </p>
        <p>
          Sin embargo, simplemente es ir al codigo y ponerlo y todo funcionara
          correctamente
        </p>
        <p>
          <strong>NOTA IMPORTANTE</strong> Next.js es por componentes al igual
          que react para que se visulice los resultados deben de cambiar de
          State el componente, una vez usted ponga una imagen valida y le de al
          boton Validar Cedula, el componente se renderiza para mostrar el
          resultado que desea
        </p>
      </div>

      <h1>Ejercicio 2</h1>
      <PublicoYCara />

      <h1>Ejercicio 3</h1>
      <ImageRecognition />
    </div>
  );
}
