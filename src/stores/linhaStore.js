import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLinhasStore = create(
  persist(
    (set, get) => ({
      linhas: {},
      paradas: {},

      favoritosLinhas: [],
      favoritosParadas: [],
      preferencias: {},

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

      toggleFavLinha: (linha) =>
        set((state) => {
          const exists = state.favoritosLinhas.find((l) => l.sgl === linha.sgl)
          if (exists) {
            return { favoritosLinhas: state.favoritosLinhas.filter((l) => l.sgl !== linha.sgl) }
          }
          return { favoritosLinhas: [...state.favoritosLinhas, { sgl: linha.sgl, nom: linha.nom, cod: linha.cod }] }
        }),

      toggleFavParada: (parada) =>
        set((state) => {
          const exists = state.favoritosParadas.find((p) => p.cod === parada.cod)
          if (exists) {
            return { favoritosParadas: state.favoritosParadas.filter((p) => p.cod !== parada.cod) }
          }
          return { favoritosParadas: [...state.favoritosParadas, { cod: parada.cod, desc: parada.desc, end: parada.end }] }
        }),

      isFavLinha: (sgl) => get().favoritosLinhas.some((l) => l.sgl === sgl),
      isFavParada: (cod) => get().favoritosParadas.some((p) => p.cod === cod),
    }),
    {
      name: "feirabus-data",
    }
  )
);
