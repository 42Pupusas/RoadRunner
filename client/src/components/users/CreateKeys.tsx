import { KeyIcon } from '@heroicons/react/24/solid';
import { ECPairFactory } from 'ecpair';
import { useState } from 'react';
import * as tinysecp from 'tiny-secp256k1';

const ECPair = ECPairFactory(tinysecp);

const CreateKeys = () => {
  const [privateKey, setPrivateKey] = useState('');

  function generatePrivateKey() {
    // Creamos un par aleatorio de llaves
    const newPrivateKeyPair = ECPair.makeRandom();
    // Actualizamos el estado con la llave privada
    setPrivateKey(newPrivateKeyPair.privateKey!.toString('hex'));
  }

  // Mostramos la llave privada y la hacemos seleccionable
  return (
    <>
      <h2>New Keys</h2>
      <p>Create a new private key here. Remember to keep it safe!</p>
      <br />
      <div className="flex flex-row">
        <KeyIcon
          className="m-2 h-10 w-10 rounded-full bg-dark p-2 text-white hover:bg-light "
          onClick={generatePrivateKey}
        />

        <div className="w-48 rounded-lg bg-light p-2">
          <h4 className="block font-bold uppercase text-white">Private Key:</h4>
          {privateKey ? (
            <span className="select-all break-all font-bold uppercase text-black">
              {privateKey}
            </span>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default CreateKeys;
