import { AppError, NotFoundError } from "../errors/app.error";

//Variables para la url de steam y tambien definir el tiempo de espera maximo (8 segundos)
const STEAM_API_BASE_URL = "https://api.steampowered.com";
const STEAM_TIMEOUT_MS = 8000;

//Creamos una interface, porque sera el molde de los datos json que quiero recibir,
//ademas, pongo "?" al final de cada variable ya que es opcional.
//¿porque asi?  Porque si el usuario no existe, steam puede responder sin incluirlo.
interface ResolveVanityResponse {
  response: {
    steamid?: string; //Es un string o undefined
    success: number; //Aca siempreb v a adevolver 1 para exito o 42 para no encontrado
    message?: string; //Posible mensaje de error que envie steam (opcional)
  };
}

interface SteamOwnedGame {
  appid: number;
  name: string;
  playtime_forever: number; //este sera cantidad de minutos jugados
}

interface GetOwnedGamesResponse {
  response: {
    game_count?: number; //en caso no salga, el perfil esta en privado
    games?: SteamOwnedGame[];
  };
}

//Esta sera la funcion para leer la llave api de forma segura (del archivo .env)
function getSteamApiKey(): string {
  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) {
    //En caso la llave de steam no esta colocada , se envia un mensaje de error
    throw new Error("STEAM_API_KEY is not defined in enviroment variables");
  }
  return apiKey;
}

//Aca hare las peticiones a steam de forma generica
//<T> sirve para indicarle a la funcion que siempre debe devolver una promesa tipo T
async function fetchFromSteam<T>(
  endpoint: string,
  //Record <string,string> es un tipo de Typescript para un objeto diccionario
  //donde las llaves y valores son textos; (ej: {vanityurl: "pewavocado"})
  params: Record<string, string>,
): Promise<T> {
  // 1. Construyo la URL completa, con el endpoint y el url base
  const url = new URL(endpoint, STEAM_API_BASE_URL);
  // 2. URLSearchParams sirve para crear la cadena "?key=TU_KEY&vanityurl=..."
  // y el spread operatos de params copia las propiedades que se han pasado
  url.search = new URLSearchParams({
    key: getSteamApiKey(),
    ...params,
  }).toString();

  // 3. Aca defino el controlador de tiempo, para que no espere permanentemente
  const controller = new AbortController();

  // Aca lo defino, que si pasa el tiempo yo he dado antes, se aborte todo y corta la peticion
  const timeoutId = setTimeout(() => controller.abort(), STEAM_TIMEOUT_MS);

  try {
    const response = await fetch(url.toString(), {
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new AppError(502, `Steam API responded with status ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    console.error("Steam fetch error:", error instanceof Error ? error.message : error);
    throw new AppError(502, "Failed  to communicate with steam API");
  } finally {
    clearTimeout(timeoutId);
  }
}

export const steamClient = {
  async resolveVanityUrl(vanity: string): Promise<string> {
    const data = await fetchFromSteam<ResolveVanityResponse>("/ISteamUser/ResolveVanityURL/v1", {
      vanityurl: vanity,
    });

    if (data.response.success !== 1 || !data.response.steamid) {
      throw new NotFoundError(`Steam user "${vanity}" not found`);
    }
    return data.response.steamid;
  },

  async getOwnedGames(steamId: string): Promise<SteamOwnedGame[]> {
    const data = await fetchFromSteam<GetOwnedGamesResponse>("/IPlayerService/GetOwnedGames/v1", {
      steamid: steamId,
      include_appinfo: "1",
      include_played_free_games: "1",
    });

    if (data.response.game_count === undefined) {
      throw new AppError(
        403,
        "Steam profile or game details are private. Set game details to public in privacy settings",
      );
    }
    return data.response.games ?? [];
  },
};
