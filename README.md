Running locally:

navigate to backend/db
run both scripts(initial_script.sql first then dummy_db_data.sql)


Backend:
cd backend
dotnet set user-secrets "Grok:ApiKey" {grok api-key}
[console.x.ai](https://console.x.ai/) for api-key
dotnet run



Frontend:
cd frontend
npm install
ng serve