# INSTALLABLES

- [Install VSCODE](https://code.visualstudio.com/download/)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

# Folder Structure

- Core/ - Anything we would load only once in an application like header component, footer component, auth service etc or anything with global effect like auth guard, http interceptors to handle global error responses.
  - Services/
    - auth.service.ts
  - Gaurds/
  - Interceptors/
    - http.interceptor.ts
  - core.module.ts
- Shared/ - Anything that will be used across your application
  - Components/
    - Page/
    - Sub-page/
    - Element/
  - Pipes/
  - Directives/
  - Services/
  - shared.module.ts
- Views/ - Each folder within this folder is a feature module.
  - Feature Module 1/
    - Components/
      - Page/
      - Sub-Page/
      - Element/
    - Services/
    - Pipes/
    - Directives/
    - feature1.module.ts
  - Feature Module 2/
    - feature2.module.ts
