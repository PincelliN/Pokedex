const { createApp } = Vue;

createApp({
  data() {
    return {
      ulrApi: "https://pokeapi.co/api/v2/", // URL base per l'API di PokeAPI
      maxnumber: 151, // Numero massimo di Pokémon da ottenere (limite a 151 per la prima generazione)
      offset: 0, // Offset per l'API, utilizzato per la paginazione
      PokemonList: [], // Lista di tutti i Pokémon ottenuti dall'API (solo nomi e URL)
      ListAllPokemon: [], // Lista di tutti i dettagli dei Pokémon ottenuti
      pokemons: [], // Lista dei Pokémon ordinati per ID
      PokemonListType: [], // Lista di Pokémon filtrati per tipo
      typeList: [], // Lista di tutti i tipi di Pokémon ottenuti dall'API
      typeIndex: 0, // Indice del tipo di Pokémon selezionato dall'utente
      loading: true, // Variabile per indicare lo stato di caricamento
      pokemonPerPagina: 20, // Numero di Pokémon da visualizzare per pagina
      Page: 1, // Pagina attuale
      Pokename: "", // Nome del Pokémon per la ricerca filtrata
      PokemonListName: [], // Lista di Pokémon filtrati per nome
      PokemonSelect: null, // Pokémon attualmente selezionato
      PokemonSpecisUrl: null, // URL delle specie del Pokémon selezionato
      PokemonDescrizione: "", // Descrizione del Pokémon selezionato
      CatenaEvolutiva: "", // Catena evolutiva del Pokémon selezionato
    };
  },

  methods: {
    // Metodo per ottenere tutti i Pokémon dalla PokeAPI
    GetAll() {
      const Api = `${this.ulrApi}pokemon/?limit=${this.maxnumber}&offset=${this.offset}`;
      axios.get(Api).then((response) => {
        this.PokemonList = response.data.results; // Ottiene la lista dei Pokémon (nomi e URL)

        if (this.PokemonList.length > 0) {
          // Per ogni Pokémon, effettua una richiesta per ottenere i dettagli completi
          const pokemonUrl = this.PokemonList.map((pokemon) =>
            axios.get(pokemon.url)
          );
          // Attende che tutte le richieste siano completate
          Promise.all(pokemonUrl).then((responses) => {
            // Memorizza i dettagli completi dei Pokémon
            this.ListAllPokemon = responses.map((response) => response.data);
            // Ordina i Pokémon per ID
            this.pokemons = this.ListAllPokemon.sort((a, b) => a.id - b.id);

            this.loading = false;
            /* console.log(this.pokemons); */
          });
        }
      });
    },

    // Metodo per ottenere tutti i tipi di Pokémon dalla PokeAPI
    GetAllType() {
      const Apitype = `${this.ulrApi}type/`;
      axios.get(Apitype).then((restype) => {
        // Salva la lista dei tipi di Pokémon
        this.typeList = restype.data.results;
        console.log(this.typeList);
      });
    },

    // Metodo per filtrare i Pokémon per tipo
    filterByType() {
      this.pokemons = this.ListAllPokemon.sort((a, b) => a.id - b.id);
      // Se è stato selezionato un tipo (diverso da "All")
      if (this.typeIndex !== "0") {
        this.PokemonListType = this.pokemons.filter((pokemon) => {
          // Filtra i Pokémon per il tipo selezionato
          return pokemon.types.some(
            (type) => type.type.name === this.typeIndex
          );
        });
        // Aggiorna la lista dei Pokémon filtrati
        this.pokemons = this.PokemonListType;

        this.Page = 1;
        /* console.log(this.PokemonListType, this.ListAllPokemon); */
      }
    },

    // Metodo per filtrare i Pokémon per nome
    filterName() {
      // Se è stato inserito un nome nel campo di ricerca
      if (this.Pokename != "" && this.typeIndex == "0") {
        this.pokemons = this.ListAllPokemon.sort((a, b) => a.id - b.id);
        this.PokemonListName = this.pokemons.filter((pokemon) => {
          // Filtra i Pokémon per nome
          return pokemon.name.includes(this.Pokename.toLowerCase());
        });
        // Aggiorna la lista dei Pokémon filtrati per nome
        this.pokemons = this.PokemonListName;

        this.Page = 1;
      } else if (this.Pokename != "" && this.typeIndex != "0") {
        this.pokemons = this.PokemonListType;
        this.PokemonListName = this.pokemons.filter((pokemon) => {
          // Filtra i Pokémon per nome
          return pokemon.name.includes(this.Pokename.toLowerCase());
        });
        // Aggiorna la lista dei Pokémon filtrati per nome
        this.pokemons = this.PokemonListName;

        this.Page = 1;
      }
    },

    // Metodo per andare alla pagina successiva
    nextPage() {
      if (this.Page < this.pagineTotali) {
        this.Page++;
        /* console.log("Next Page:", this.Page); */
      }
    },

    // Metodo per andare alla pagina precedente
    prevPage() {
      if (this.Page > 1) {
        this.Page--;
        /* console.log("Previous Page:", this.Page); */
      }
    },

    // Metodo per selezionare un Pokémon e visualizzare i dettagli
    ChoosePokemon(id) {
      // Trova il Pokémon selezionato per ID
      this.PokemonSelect = this.pokemons.find((pokemon) => pokemon.id === id);

      console.log(this.PokemonSelect, "Parti da qui");

      // Se un Pokémon è stato selezionato
      if (this.PokemonSelect != null) {
        console.log(this.PokemonSelect.species);

        var urlSpecis = this.PokemonSelect.species.url;

        // Effettua una richiesta per ottenere i dettagli della specie del Pokémon
        axios.get(urlSpecis).then((responsespiecie) => {
          console.log(responsespiecie.data.flavor_text_entries[51].flavor_text);
          // Salva la descrizione del Pokémon
          this.PokemonDescrizione =
            responsespiecie.data.flavor_text_entries[51].flavor_text;
          // Salva l'URL della catena evolutiva
          this.PokemonSpecisUrl = responsespiecie.data.evolution_chain.url;

          if (this.PokemonSpecisUrl != null) {
            // Effettua una richiesta per ottenere la catena evolutiva del Pokémon
            axios.get(this.PokemonSpecisUrl).then((resptoevol) => {
              console.log(resptoevol.data.chain, "qui");

              let evoluzioni = [];
              // Se la specie non è una forma "baby"
              if (resptoevol.data.chain.is_baby != true) {
                evoluzioni = this.ottieniEvoluzioni(resptoevol.data.chain);
              } else {
                // Se la specie è una forma "baby", parte dalla prima evoluzione
                evoluzioni = this.ottieniEvoluzioni(
                  resptoevol.data.chain.evolves_to[0]
                );
              }

              // Filtra la lista dei Pokémon per includere solo quelli nella catena evolutiva
              this.CatenaEvolutiva = this.pokemons.filter((pokemon) => {
                return evoluzioni.includes(pokemon.name);
              });
            });
          }
        });
      }
    },
    // Funzione ricorsiva per ottenere tutte le evoluzioni
    ottieniEvoluzioni(catenaEvo) {
      let evoluzioni = [];
      let nomeSpecie = catenaEvo.species.name;
      evoluzioni.push(nomeSpecie);

      // Verifica se ci sono evoluzioni successive
      if (catenaEvo.evolves_to.length > 0) {
        catenaEvo.evolves_to.forEach((evoluzione) => {
          evoluzioni = evoluzioni.concat(this.ottieniEvoluzioni(evoluzione));
        });
      }
      return evoluzioni;
    },
  },

  computed: {
    // Calcola il numero totale di pagine
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
    this.GetAll(); // Ottiene tutti i Pokémon
    this.GetAllType(); // Ottiene tutti i tipi di Pokémon
  },
}).mount("#app");
