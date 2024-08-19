const { createApp } = Vue;

createApp({
  data() {
    return {
      ulrApi: "https://pokeapi.co/api/v2/", // URL base per l'API di PokeAPI
      maxnumber: 151, // Numero massimo di Pokémon da ottenere (limite)
      offset: 0, // Offset per l'API, utilizzato per la paginazione
      PokemonList: [], // Lista di tutti i Pokémon ottenuti dall'API
      PokemonListType: [], // Lista di Pokémon filtrati per tipo
      typeList: [], // Lista di tutti i tipi di Pokémon ottenuti dall'API
      typeIndex: 0, // Indice del tipo di Pokémon selezionato dall'utente
    };
  },
  methods: {
    // Metodo per ottenere tutti i Pokémon dalla PokeAPI
    GetAll() {
      Api =
        this.ulrApi +
        "pokemon/?limit=" +
        this.maxnumber +
        "&offset=" +
        this.offset;
      console.log(Api);

      // Chiamata GET all'API per ottenere la lista dei Pokémon
      axios.get(Api).then((res) => {
        // console.log(res.data.results);  Stampa i risultati nel console
        this.PokemonList = res.data.results; // Salva i risultati nella lista dei Pokémon
        // console.log(this.PokemonList);  Stampa la lista dei Pokémon nel console
      });
    },

    // Metodo per ottenere tutti i tipi di Pokémon dalla PokeAPI
    GetAllType() {
      Apitype = this.ulrApi + "type/";

      // console.log(Apitype);

      // Chiamata GET all'API per ottenere la lista dei tipi di Pokémon
      axios.get(Apitype).then((restype) => {
        this.typeList = restype.data.results; // Salva i risultati nella lista dei tipi
      });
    },

    // Metodo per filtrare i Pokémon per tipo
    filterByType() {
      if (this.typeIndex > 0) {
        this.PokemonListType = [];
        ApitypeFilter = this.ulrApi + "type/" + this.typeIndex;

        console.log(ApitypeFilter);

        // Chiamata GET all'API per ottenere i Pokémon di un determinato tipo
        axios.get(ApitypeFilter).then((res) => {
          filterType = res.data.pokemon; // Salva i Pokémon filtrati per tipo

          // Itera su ogni Pokémon ottenuto dal filtro
          filterType.forEach((element) => {
            const pokeName = element.pokemon.name; // Nome del Pokémon corrente

            // Utilizza il metodo some() per controllare se c'è una corrispondenza nel nome
            if (this.PokemonList.some((pokemon) => pokemon.name === pokeName)) {
              this.PokemonListType.push(element.pokemon); // Aggiunge il Pokémon filtrato alla lista
            }
          });
          console.log(this.PokemonListType); // Stampa la lista filtrata dei Pokémon
        });
      }
    },
  },

  // Hook del ciclo di vita: eseguito quando il componente è montato
  mounted() {
    console.log("Ciao"); // Stampa un messaggio nel console per indicare che il componente è montato
    this.GetAll(); // Chiama il metodo per ottenere tutti i Pokémon
    this.GetAllType(); // Chiama il metodo per ottenere tutti i tipi di Pokémon
  },
}).mount("#app"); // Monta il componente nell'elemento con id "app"
