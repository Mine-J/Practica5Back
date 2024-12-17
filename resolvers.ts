import { pokemonModel, abilitiesModel, movesModel} from "./types.ts";

export const resolvers = {

    pokemon: {
        abilities: async (
            parent: pokemonModel,
            _:unknown,
            __:unknown,
        ):Promise<abilitiesModel[]> => {
            return parent.abilities.map(ability => ({
                name: ability.name,
                url: ability.url
            }))
            
        },
        moves: async (
            parent: pokemonModel,
            _:unknown,
            __:unknown,
        ):Promise<movesModel[]> => {
            
            return parent.moves.map((elem) => ({
                name: elem.name,
                url: elem.url,
            }));
        },
    },

    abilities: {
        effect: async (
            parent: abilitiesModel,
            _:unknown,
            __:unknown,
        ):Promise<string> => {
            const response = await fetch(parent.url);
            if (!response.ok) {
                throw new Error(`Error al buscar las abilidades: ${response.statusText}`);
            }
            const data = await response.json();
            return data.effect_entries[0].effect;
        },
    },
    
    moves : {
        power: async (
            parent: movesModel,
            _:unknown,
            __:unknown,
        ):Promise<number> => {
            
            const response = await fetch(parent.url);
            if (!response.ok) {
                throw new Error(`Error al buscar el movimiento: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            return data.power;
            }
        },

    Query: {

        pokemon: async (
            _: unknown,
            { id, name }: { id: number; name: string },
            __: unknown
        ): Promise<pokemonModel> => {
            // Convert the name to lowercase if it exists
            if (name) {
                name = name.toLowerCase();
            }
            // Realiza la solicitud a la API
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id || name}`);
            
            // Verifica si la respuesta fue exitosa
            if (!response.ok) {
                throw new Error(`Error al encontrar al pokémon: ${response.statusText}`);
            }
            
            // Parseamos la respuesta JSON
            const data = await response.json();
            
            // Asegúrate de que abilities y moves sean arrays
            const abilities: abilitiesModel[] = data.abilities.map((elem) => ({
                name: elem.ability.name,
                url: elem.ability.url,
            }));
            console.log(abilities);
            
            const moves: movesModel[] = data.moves.map((elem) => ({
                name: elem.move.name,
                url: elem.move.url,
            }));
            
            // Devuelves el objeto Pokemon con las habilidades y movimientos mapeados
            return {
                id: data.id,
                name: data.name,
                abilities: abilities, // Usa el array mapeado
                moves: moves, // Usa el array mapeado
            };
        }
    }
}