# League of Legends API

Welkom bij de League of Legends API! Deze API biedt toegang tot informatie over champions en builds in League of Legends. Hieronder vind je alle informatie die nodig is om dit project te installeren en te gebruiken.

## Installatie-instructies

Volg deze stappen om het project lokaal op te zetten:

1. **Clone de repository**:
   ```bash
   git clone <URL-NAAR-JOUW-REPO>
   cd league-api
   ```

2. **Installeer de vereiste pakketten**:
   ```bash
   npm install
   ```

3. **Maak een `.env`-bestand aan**:
   Voeg een `.env`-bestand toe in de rootmap van het project met de volgende inhoud:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=league
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret
   ```

4. **Maak de database aan**:
   Zorg ervoor dat de database correct is ingesteld. Gebruik het volgende SQL-script als referentie:
   ```sql
   CREATE DATABASE league;
   USE league;

   CREATE TABLE champions (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       role VARCHAR(50) NOT NULL,
       difficulty INT NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
       description TEXT
   );

   CREATE TABLE builds (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       description TEXT,
       champion_id INT,
       FOREIGN KEY (champion_id) REFERENCES champions(id)
   );
   ```

5. **Start de server**:
   ```bash
   npm start
   ```
   Of gebruik Nodemon (wat ik heb gebruikt) voor live reload:
   ```bash
   npx nodemon server.js
   ```

De API draait nu op `http://localhost:3000`.

## Endpoints

Zie de volledige documentatie op de `/` route van de API (open `http://localhost:3000` in je browser). Hieronder een korte samenvatting:

### Champions
- **GET /champions**: Haal alle champions op met filters, paginatie en sortering.
  - **Query Parameters**:
    - `limit`: Resultaten per pagina (default: 10).
    - `offset`: Aantal resultaten overslaan (default: 0).
    - `name`: Filteren op naam.
    - `role`: Filteren op rol (bijv. "Mage", "Marksman").
    - `difficulty`: Filteren op moeilijkheidsgraad.
    - `sortBy`: Sorteren op veld (bijv. "name").
    - `order`: Sorteervolgorde ("ASC" of "DESC").

- **GET /champions/:id**: Haal een specifieke champion op via ID.
- **POST /champions**: Voeg een nieuwe champion toe (vereist authenticatie).
  - **Body (JSON)**:
    ```json
    {
      "name": "Ashe",
      "role": "Marksman",
      "difficulty": 3,
      "description": "A ranged champion with crowd control abilities."
    }
    ```

- **PUT /champions/:id**: Werk een bestaande champion bij (vereist authenticatie).
  - **Body (JSON)**:
    ```json
    {
      "name": "Ashe",
      "role": "Marksman",
      "difficulty": 4,
      "description": "Updated description of Ashe."
    }
    ```

- **DELETE /champions/:id**: Verwijder een champion (vereist authenticatie).

### Builds
- **GET /champions/:championId/builds**: Haal alle builds op die gekoppeld zijn aan een specifieke champion.
- **POST /champions/:championId/builds**: Voeg een nieuwe build toe aan een champion (vereist authenticatie).
  - **Body (JSON)**:
    ```json
    {
      "name": "Attack Build",
      "description": "A powerful attack-based build."
    }
    ```

## Authenticatie

Authenticatie wordt uitgevoerd met **JWT-tokens**. Gebruik de `Authorization` header als volgt:
```
Authorization: Bearer <JWT_TOKEN>
```

JWT-tokens worden gegenereerd met een geheime sleutel (`JWT_SECRET`), die is opgegeven in het `.env`-bestand.

## Bronvermelding

De volgende bronnen zijn gebruikt voor het ontwikkelen van dit project:
- [Express.js Documentatie](https://expressjs.com/)
- [MySQL2 NPM Package](https://www.npmjs.com/package/mysql2)
- [JWT Handleiding](https://jwt.io/)
- [Nodemon voor live server reloads](https://nodemon.io/)
- [chatgpt](https://chatgpt.com/) (Aangezien ik met afbeeldingen heb gewerkt in chatgpt kan ik mijn chats niet delen.)
- [youtube]Channel: Fireship (https://www.youtube.com/watch?v=-MTSQjw5DrM)

## Belangrijke informatie

- **Database**: Zorg ervoor dat de MySQL-database correct is ingesteld en dat de tabellen `champions` en `builds` bestaan (zie SQL-script in de installatie-instructies).
- **Git**: Voeg de map `node_modules` toe aan `.gitignore` om te voorkomen dat deze wordt opgenomen in de repository.