# Simple Tasks app

## Tech stack

**Backend:** PHP 8.3, Laravel 13, SQLite, Pest 4  
**Frontend:** React 19, TypeScript 6, Vite 8, Mantine 9, dnd-kit 6

## Architecture

The backend follows the **service layer** — `TaskController` handles HTTP concerns (request validation, response formatting) while `TaskService` contains the business logic. Business rule violations (e.g. moving a task from a done column) are handled in the service and surface as validation errors.

## Running the app

**Backend**

```bash
cd Backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

**Frontend**

```bash
cd Frontend
npm install
npm run dev
```

## Running tests

```bash
cd Backend
php artisan test
```
