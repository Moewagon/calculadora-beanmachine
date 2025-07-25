
![Logo](https://static.wikia.nocookie.net/gtawiki/images/f/fc/TheBeanMachine-GTA4-logo.png/revision/latest?cb=20150506225838)


# Calculadora Bean Machine

App web para calcular precios y almacenar temporalmente recuento de caja y stock.

## Screenshots

![Main](https://i.ibb.co/qmNSGHB/image.png)
![Full Page](https://i.ibb.co/KWbNqg3/image.png)

## Authors

- [@Moewagon](https://github.com/Moewagon)


## URL

You can check it out here --> https://main.derjm7nkzo0no.amplifyapp.com

## Backend

Se añadió un servidor Express sencillo para manejar autenticación de usuarios y persistencia de tickets.

### Comandos

```bash
npm install
npm start
```

El servidor expone las siguientes rutas:

- `POST /login` con `username` y `password` para iniciar sesión (si el usuario no existe se crea automáticamente).
- `POST /logout` para cerrar la sesión.
- `GET /tickets` obtiene los tickets del usuario autenticado.
- `POST /tickets` guarda un ticket del usuario autenticado enviando `{ items: [], total: 0 }`.

Los tickets se persisten en el archivo `users.json`.
