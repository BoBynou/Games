const { ApolloServer, gql } = require('apollo-server');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'games'
})

// const gamesData = [
//   {
//     id: 1,
//     name: 'Game 1',
//     genres: ['Action', 'Adventure'],
//     publicationDate: 1672531199, // Example timestamp
//     editors: [],
//     studios: [1],
//     platform: ['PC', 'PS4'],
//   },
// ];

// const editorsData = [
//   {
//     id: 1,
//     name: 'Editor 1',
//     games: [1],
//   },
// ];

// const studiosData = [
//   {
//     id: 1,
//     name: 'Studio 1',
//     games: [1],
//   },
// ];


const typeDefs = gql`
  type Query {
    games(
        page: Int
        genre: String
        platform: String
        studio: String
    ): Games
    game(id: ID!): Game
    editors(page: Int): Editors
    editor(id: ID!): Editor
    studios(page: Int): Studios
    studio(id: ID!): Studio
  }

  type Game {
    Id: ID
    Name: String!
    Genres: [String!]!
    PublicationDate: Int
    Editors: [Editor!]!
    Studios: [Studio!]!
    Platform: [String!]!
  }

  type Editor {
    Id: ID
    Name: String!
    Games: [Game]
  }

  type Studio {
    Id: ID
    Name: String!
    Games: [Game]
  }

  type Infos {
    count: Int!
    pages: Int!
    nextPage: Int
    previousPage: Int
  }
  
  type Games {
    infos: Infos
    results: [Game]
  }

  type Editors {
    infos: Infos
    results: [Editor]
  }

  type Studios {
    infos: Infos
    results: [Studio]
  }
`;

const PAGE_SIZE = 20;
const resolvers = {
    Query: {
      games: async (_, { page, genre, platform, studio }) => {               
        try {          
          const [resultss] = await db.promise().query('SELECT * FROM Games');
          const promises = resultss.map(async (item) => {
            const date = new Date(item.PublicationDate);
            const editorId = item.Editors;
            const studioId = item.Studios;
            const editor = await getEditorById(editorId);
            const studio = await getStudioById(studioId);
            return { ...item, Studios: studio, Editors: editor, PublicationDate: date };
          });
          const results = await Promise.all(promises);
          console.log(results);
          const count = results.length;
          const pages = Math.ceil(count / PAGE_SIZE);
          const nextPage = page < pages ? page + 1 : null;
          const previousPage = page > 1 ? page - 1 : null;
  
          return {
            infos: { count, pages, nextPage, previousPage },
            results,
          };
        } catch (error) {
          console.error('Error fetching games:', error);
          throw error;
        }
      },
      game: (_, { id }) => {        
        return gamesData.find(game => game.id === id);
      },
      editors: async (_, { page }) => {
        try {          
          const [resultss] = await db.promise().query('SELECT * FROM Editors');       
          const promises = resultss.map(async (item) => {
            const editorId = item.Id;
            const game = await getGamesByEditorId(editorId);
            return { ...item, Games: game };
          });
          const results = await Promise.all(promises);      
          console.log(results);
          const count = results.length;
          const pages = Math.ceil(count / PAGE_SIZE);
          const nextPage = page < pages ? page + 1 : null;
          const previousPage = page > 1 ? page - 1 : null;
  
          return {
            infos: { count, pages, nextPage, previousPage },
            results,
          };
        } catch (error) {
          console.error('Error fetching editors:', error);
          throw error;
        }
      },
      editor: (_, { id }) => {
        return editorsData.find(editor => editor.id === id);
      },
      studios: async (_, { page }) => {
        try {          
          const [resultss] = await db.promise().query('SELECT * FROM Studios'); 
          const promises = resultss.map(async (item) => {
            const studioId = item.Id;
            const game = await getGamesByStudioId(studioId);
            return { ...item, Games: game };
          });
          const results = await Promise.all(promises);      
          console.log(results);
          const count = results.length;
          const pages = Math.ceil(count / PAGE_SIZE);
          const nextPage = page < pages ? page + 1 : null;
          const previousPage = page > 1 ? page - 1 : null;
  
          return {
            infos: { count, pages, nextPage, previousPage },
            results,
          };
        } catch (error) {
          console.error('Error fetching studios:', error);
          throw error;
        }
      },
      studio: (_, { id }) => {
        return studiosData.find(studio => studio.id === id);
      },
    },
  };
  

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});

const getStudioById = async (studioId) => {
  try {
    const [studioResults] = await db.promise().query('SELECT * FROM Studios WHERE id = ?', [studioId]);
    return studioResults; // Supposons que la requête renvoie un seul résultat
  } catch (error) {
    console.error(`Erreur lors de la récupération du studio avec l'ID ${studioId}:`, error);
    throw error;
  }
};

const getEditorById = async (editorId) => {
  try {
    const [editorResults] = await db.promise().query('SELECT * FROM Editors WHERE id = ?', [editorId]);
    return editorResults; // Supposons que la requête renvoie un seul résultat
  } catch (error) {
    console.error(`Erreur lors de la récupération du editeur avec l'ID ${editorId}:`, error);
    throw error;
  }
};

const getGamesByStudioId = async (gameId) => {
  try {
    const [gameResults] = await db.promise().query('SELECT * FROM Games WHERE Studios = ?', [gameId]);
    return gameResults; // Supposons que la requête renvoie un seul résultat
  } catch (error) {
    console.error(`Erreur lors de la récupération du editeur avec l'ID ${gameId}:`, error);
    throw error;
  }
};

const getGamesByEditorId = async (gameId) => {
  try {
    const [gameResults] = await db.promise().query('SELECT * FROM Games WHERE Editors = ?', [gameId]);
    return gameResults; // Supposons que la requête renvoie un seul résultat
  } catch (error) {
    console.error(`Erreur lors de la récupération du editeur avec l'ID ${gameId}:`, error);
    throw error;
  }
};