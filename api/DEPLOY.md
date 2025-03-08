# API Server - Staging Deployment

This directory contains the API server application for the staging environment.

## Server Requirements

- **PHP:** 8.2 or higher (as specified in `composer.json`)
- **Extensions:** `mbstring`, `intl` (as configured in the deployment workflow)
- **Composer:** 2.0 or higher
- **Database:** PostgreSQL (Supabase)
- **SMTP Server:** Required for email functionality

## Deployment Instructions

This application is deployed using a GitHub Actions workflow that is triggered on pushes to the `dev` branch.

### Steps:

1.  **Code Checkout:** The latest code from the `dev` branch is checked out.
2.  **PHP Setup:** PHP 8.2 with `mbstring` and `intl` extensions is set up.
3.  **Composer Installation:** Composer dependencies are installed using `composer install --optimize-autoloader`.
4.  **Static Analysis:** PHPStan analysis is performed using `composer stan`.
5.  **Testing:** Pest tests are executed using `composer test`.
6.  **.env File Creation:** Environment variables are populated from GitHub secrets.
7.  **FTP Deployment:** The application is deployed to the staging FTP server.

### Environment Variables

The following environment variables are required:

- `APP_BASE_URL`
- `SUPABASE_URL`
- `SUPABASE_JWT_SECRET`
- `SUPABASE_HOST`
- `SUPABASE_PORT`
- `SUPABASE_DBNAME`
- `SUPABASE_USER`
- `SUPABASE_PASSWORD`
- `STRIPE_SECRET_KEY`
- `STRIPE_SIGNATURE`
- `SMTP_HOST`
- `SMTP_USERNAME`
- `SMTP_PASSWORD`
- `FTP_API_SERVER`
- `FTP_API_USERNAME`
- `FTP_API_PASSWORD`

These variables are configured as GitHub secrets in the repository settings.

## Notes

- Ensure that the staging FTP server has PHP 8.2 installed and configured.
- The deployment workflow automatically installs the necessary PHP extensions.
- Database and SMTP server configurations are managed through environment variables.
- The FTP Server credentials are also configured as GitHub Secrets.
