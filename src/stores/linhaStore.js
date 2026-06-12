import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLinhasStore = create(
  persist(
    (set, get) => ({
      linhas: {},
      paradas:{},

      setLinha: (linha) =>
        set((state) => ({
          linhas: {
            ...state.linhas,
            [linha.sgl]: {
              ...linha,
              updatedAt: Date.now(),
            },
          },
        })),

      setLinhas: (linhas) =>
        set((state) => {
          const novasLinhas = { ...state.linhas };

          linhas.forEach((linha) => {
            novasLinhas[linha.sgl] = {
              ...linha,
              updatedAt: Date.now(),
            };
          });

          return { linhas: novasLinhas };
        }),
      setParadas: (paradas) => {
        set(state => { 
          const novasParadas = { ...state.paradas };
          Object.values(paradas).forEach(parada => { novasParadas[parada.cod]= {...parada, updatedAt: Date.now()}})
          return {paradas: novasParadas}
        }) 
      },
      getLine: (cod) => get().linhas[cod],
      getStop: (cod) => get().paradas[cod],
      clearLinhas: () => set({ linhas: {} }),
    }),
    {
      name: "feirabus-data",
    }
  )
);