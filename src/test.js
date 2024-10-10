import { PokemonTCG } from '@bosstop/pokemontcgapi';

const pokemonTCG = new PokemonTCG("c3e9b271-2379-4125-ab7d-8bd4100b97e0");

(async () => {
    // let searchData = await pokemonTCG.cards.searchByName("Gardevoir");
    // console.log(searchData);

    let cardData = await pokemonTCG.cards.searchByName("Gardevoir", "ex", "psychic");
    console.log(cardData);
})();

