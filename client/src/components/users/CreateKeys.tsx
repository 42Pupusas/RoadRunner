import { ECPairFactory } from "ecpair";
import { useState } from "react";
import * as tinysecp from "tiny-secp256k1";

const ECPair = ECPairFactory(tinysecp);

const CreateKeys = () => {
  const [privateKey, setPrivateKey] = useState("");

  function generatePrivateKey() {
    // Creamos un par aleatorio de llaves
    const newPrivateKeyPair = ECPair.makeRandom();
    // Actualizamos el estado con la llave privada
    setPrivateKey(newPrivateKeyPair.privateKey!.toString("hex"));
  }

  // Mostramos la llave privada y la hacemos seleccionable
  return (
    <>
      <div className="relative flex w-80 flex-col rounded-xl bg-white bg-clip-border text-dark shadow-md">
        <div className="p-6">
          <button 
          onClick={generatePrivateKey}
          className="block w-full select-none rounded-lg bg-gradient-to-tr  py-3 px-6 text-center align-middle text-xs font-bold uppercase text-dark shadow-md shadow--500/20 transition-all hover:shadow-lg hover:shadow-dark active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Generate New Keys
          </button>
          <br/>
          {privateKey ? (
            <p className="block font-sans text-sm font-light leading-relaxed text-inherit select-all break-all uppercase antialiased">
              {privateKey}
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default CreateKeys;
