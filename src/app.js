const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    const { title, url, techs } = request.body;

    const respository = { id: uuid(), title, url, techs, likes: 0 };

    repositories.push(respository);

    return response.json(respository);
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    const { title, url, techs } = request.body;

    const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

    if (repositoryIndex < 0) {
        return response.status(400).json({ error: "Repository id does not exists." });
    }

    const repo = {
        id,
        title,
        url,
        techs,
        likes: 0,
    };

    repositories[repositoryIndex] = repo;

    return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;

    const repositoryIndex = repositories.findIndex((repository) => repository.id === id);

    if (repositoryIndex < 0) {
        return response.status(400).json({ error: "Repository id does not exists." });
    }

    repositories.splice(repositoryIndex, 1);

    return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;

    const repo = repositories.find(repository => repository.id === id);

    if (!repo) {
        return response.status(400).json({ error: 'Repository does not exists' });
    }

    repo.likes += 1;

    return response.json(repo);

});

module.exports = app;