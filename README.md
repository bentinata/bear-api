# Bears API

Taking "Bearmentor" further, this project tries to make an analogy of learning fullstack web development as bear roaming around a forest.

This is **a sleuth of bears**:

![A sleuth of bears](https://www.shutterstock.com/image-photo/brown-bear-ursus-arctos-family-260nw-1677298642.jpg)

# Available Resources

- `/bears`, _self-explanatory_
- `/sleuths`, a group of bears
- `/forests`, where sleuths happen

# Development

To run the web app and database inside containers:

```sh
docker compose up --watch --build
```

Then you can do migrations with:

```sh
bunx drizzle-kit push
```

You can also populate the database with:

```sh
bun src/seed.ts
```

Then visit http://127.1:3000
