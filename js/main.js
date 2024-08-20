const { createApp } = Vue;

createApp({
  data() {
    return {
      ulrApi: "https://pokeapi.co/api/v2/", // URL base per l'API di PokeAPI
      maxnumber: 151, // Numero massimo di Pokémon da ottenere (limite)
      offset: 0, // Offset per l'API, utilizzato per la paginazione
      PokemonList: [], // Lista di tutti i Pokémon ottenuti dall'API
      ListAllPokemon: [], // Lista di tutti i dettagli dei Pokémon ottenuti
      pokemons: [], // Lista dei Pokémon ordinati per ID
      PokemonListType: [], // Lista di Pokémon filtrati per tipo
      typeList: [], // Lista di tutti i tipi di Pokémon ottenuti dall'API
      typeIndex: 0, // Indice del tipo di Pokémon selezionato dall'utente
      loading: true, // Variabile per indicare lo stato di caricamento
      pokemonPerPagina: 20, // Numero di Pokémon per pagina
      Page: 1, // Pagina attuale
    };
  },

  methods: {
    // Metodo per ottenere tutti i Pokémon dalla PokeAPI
    GetAll() {
      const Api = `${this.ulrApi}pokemon/?limit=${this.maxnumber}&offset=${this.offset}`;
      axios.get(Api).then((response) => {
        this.PokemonList = response.data.results;

        if (this.PokemonList.length > 0) {
          const pokemonUrl = this.PokemonList.map((pokemon) =>
            axios.get(pokemon.url)
          );
          Promise.all(pokemonUrl).then((responses) => {
            this.ListAllPokemon = responses.map((response) => response.data);
            this.pokemons = this.ListAllPokemon.sort((a, b) => a.id - b.id);
            this.loading = false;
          });
        }
      });
    },

    // Metodo per ottenere tutti i tipi di Pokémon dalla PokeAPI
    GetAllType() {
      const Apitype = `${this.ulrApi}type/`;
      axios.get(Apitype).then((restype) => {
        this.typeList = restype.data.results;
      });
    },

    // Metodo per filtrare i Pokémon per tipo
    filterByType() {},

    // Metodo per andare alla pagina successiva
    nextPage() {
      if (this.Page < this.pagineTotali) {
        this.Page++;
        console.log("Next Page:", this.Page);
      }
    },

    // Metodo per andare alla pagina precedente
    prevPage() {
      if (this.Page > 1) {
        this.Page--;
        console.log("Previous Page:", this.Page);
      }
    },
  },

  computed: {
    // Calcolo del numero totale di pagine
    pagineTotali() {
      return Math.ceil(this.pokemons.length / this.pokemonPerPagina);
    },

    // Restituisce i Pokémon della pagina corrente
    pokemonInPagina() {
      const start = (this.Page - 1) * this.pokemonPerPagina;
      const end = start + this.pokemonPerPagina;
      return this.pokemons.slice(start, end);
    },
  },

  mounted() {
    this.GetAll();
    this.GetAllType();
  },
}).mount("#app");
