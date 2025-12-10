require('dotenv').config({path: ".env"});

const { createServer } = require('node:http');
const { getJson } = require("serpapi");

const hostname = '127.0.0.1';
const port = 3050;

const getJsonAsync = (params) => {
    return new Promise((resolve, reject) => {
        try {
            getJson(params, (json) => {
                resolve(json);
            });
        } catch (error) {
            reject(error);
        }
    });
};

const server = createServer(async (req, res) => {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const query = url.searchParams.get('query');

    const engine = url.searchParams.get('engine') || 'google';

    console.log(`Searching for: ${query} on ${engine}`);

    if (!query) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Missing query" }));
        return;
    }

    try {
        const response = await getJsonAsync({
            engine: engine,
            q: query,
            hl: "en",
            gl: "us",
            api_key: process.env.SERP_API_KEY
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    } catch (error) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: error.message }));
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});