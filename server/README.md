# Proyecto para analizar la data de fecha estimada "processlog" vs SOMS y Sterling

## Backend

## Requerimientos del proyecto
- NodeJs >= 10.14.2
- NPM >= 6.4.1
- MongoDB >= 4

# Instalación

Ejecute los siguientes comandos en su terminal

```
  npm install
  npm run start
```

# Documentación API

### URL

```
    http://localhost:5000/api/cleandatalogs
```

### Método GET

```
Extrae solo la data que necesitamos de processlogs
```
### URL

```
    http://localhost:5000/api/dashboardJson
```

### Método GET

```
Convierte el dashboard.csv a JSON
```

### URL
```
    http://localhost:5000/api/tiendas
```
### Método GET
```
Trae todas las tiendas analizadas por el algorimto genético por cada sku

