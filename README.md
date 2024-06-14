Das Repository wurde für die LB-B von dem Modul 295 erstellt.

Die Aufgabe war es eine Rest-API zu machen mit der man Tasks managen kann. Unter dem Endpunkt [[http://localhost:3000/swagger-ui/]] findet man, nachdem man den Server gestartet hat, die ganze Dokumentation zu der API. 

## API Installieren

Um die API zu installieren geben sie folgende Commands ein 

``` ssh
git clone https://github.com/Giu1447/M295.git
```

``` ssh
cd path/to/file/LB
```

``` ssh
npm install
```

## Ordnerstruktur

* `LB` Das ist das Hauptfile des Projekts. Man findet hier auch sämtliche config files und weiteres
	* `server.js` Das ist das Hauptfile für die API, hier wird das Routing geregelt und die /login, /logout und /verify wurden hier implementiert.
	* `endpoints` In diesem Ordner ist der ganze Code. Ausserdem enthält es noch die Swagger-Dokumentation
		* `tasks.js` In diesem File ist alles drin was das Task-Management angeht.


## Nutzung

Um die API zu nutzen gibt man folgenden Command in den `endpoints` Ordner ein und öffne dann folgenden Link [[http://localhost:3000/]]

``` ssh
node server.js
```

## Testen

Um die API zu testen gibt es ein `LB.postman_collection.json` File im Projekt. 

1. Importiere das Test File in Postman
2. Teste die Collection
- ACHTUNG: Es kann sein dass einige Test nicht funktionieren wenn man die ganze Collection auf einmal testet aufgrund dessen dass man bei vorherigen Test bereits Dinge gelöscht hat oder ähnliches.

## Zusätzliche Scripts

Führe folgenden Command aus um den Code auf die Syntax zu überprüfen.

``` ssh
npx eslint .
```

Führe diesen Code aus um ein neues swagger.json zu generieren.

``` ssh
node swagger.js
```
