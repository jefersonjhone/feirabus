
import React, { useState, useMemo } from 'react';

const ComponenteA = () => <div >Renderizando proximops onibus</div>;
const ComponenteB = () => <div >Renderizando rota</div>;

const SeuComponente = () => {
  const [historico, setHistorico] = useState([<ComponenteA />]);

  const adicionarComponente = (componente) => {
      if (componente.key !== historico[historico.length -1].key){
          setHistorico([...historico, componente]);
      }
      else{

          console.log("componente é igual ao anterior")
      }
  };

  const voltarComponenteAnterior = () => {
    if (historico.length > 1) {
      const novoHistorico = [...historico];
      novoHistorico.pop(); // Remove o último componente do histórico
      setHistorico(novoHistorico);
    }
  };

  const componenteAtual = useMemo(() => historico[historico.length - 1], [historico]);

  return (
    <div>
      <button onClick={() => adicionarComponente(<ComponenteA key={1}/>)}>
        Adicionar Componente A
      </button>
      <button onClick={() => adicionarComponente(<ComponenteB key={2}/>)}>
        Adicionar Componente B
      </button>
      <button onClick={voltarComponenteAnterior}>Voltar</button>
      {componenteAtual}
    </div>
  );
};

export default SeuComponente;
