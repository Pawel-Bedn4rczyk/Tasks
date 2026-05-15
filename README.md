# Simple Tasks app

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
composer install
php artisan test
```