# ORDapp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


### Run with Docker

In order to use this project with Docker, first use build command to generate the image, then use the run command to start the container in the 4200 port.</br>

Navigate to http://localhost:4200

```bash
// DEV - construct image and run dev container
docker build -f ./.deploy/Dockerfile -t nld001.frontend.marketplace .
docker run -d -p 803:80 nld001.frontend.marketplace

// PRO - construct image and run pro container
docker build -f ./.deploy/Dockerfile -t nld001.frontend.marketplace .
docker run -d -p 804:80 nld001.frontend.marketplace

// Run container and enter on it
docker run -it --env-file .env -p 803:80 nld001.frontend.marketplace sh

// Run container with azure image
docker run -d --env-file .env -p 803:80 nexxyolabscomanai.azurecr.io/nld001.frontend.marketplace
```

Bulding and running using Docker compose.

For local:
```bash
# The docker-compose.local only includes the frontend service.
docker-compose -f ./.deploy/docker-compose.local.yml up -d
```
For production:
```bash
# The docker-compose.yml includes backend and frontend services.
docker-compose pull 
docker-compose up -d
```
