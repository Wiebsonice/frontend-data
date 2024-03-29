# Functional Programming

Dit project is een concept uitwerking van een datavisualisatie in D3 in opdracht voor het Tropenmuseum van uit het HvA.

* [Het Concept](https://github.com/Wiebsonice/frontend-data/blob/master/README.md#het-concept)
* [Getting started](https://github.com/Wiebsonice/frontend-data/blob/master/README.md#getting-started)
* [Wiki](https://github.com/Wiebsonice/frontend-data/wiki)

# Het concept
Hoe kun je een simpele maar toch effectieve datavisualisaite laten zien? Ik heb bij de vorrige obracht 3 verschillende concepten bedacht, bij deze opdracht ben ik verder gegaan met de horse race. De horserace laat goed zien hoeveel beelden er per jaar bij de collectie bijkwamen. En dan onderverdeeld per materiaal.
  
## Concept: Horse race!
Een interactieve horse race die laat zien hoeveel beelden van een bepaalde beeldhouwtechniek er elk jaar bijkwamen. Om zo de technieken te kunnen zien per jaar en hoe deze in populairiteit toe- of afnamen. De bar chart begint op een set year, en loopt op tot het nieuwste object in de database.

![timeline schets](https://github.com/Wiebsonice/functional-programming/blob/master/wiki-assets/timeline-schets.png)
  
En Racen maar!

## De eerste uitwerking (statisch)
De eerste statische uitwerking is gedaan tijdens de vorrige opdracht. Dit was een relatief saaie versie die vooral voor kinderen niet echt spannend is. Wel gaf dit goed beeld van alle objecten tot nu toe. In de komende weken ga ik deze visualisaite pimpen en functionaliteiten toevoegen.

![chart](https://github.com/Wiebsonice/functional-programming/raw/master/wiki-assets/chart.png)



## Getting Started
  
Volg deze instructies om het project op je locale machine draaiend te krijgen, voor develoment of test doeleinde.
Bekijk het kopje **deployment** om te lezen hoe je het project kunt deployen op een live systeem.


### Instaleren

Volg deze stappen om het project draaiend te krijgen

1. Open je terminal
2. Clone de repo

```
git clone https://github.com/Wiebsonice/frontend-data.git
```

3. Instaleer de benodigde node medules

```
npm install
```

4. Start de development server

```
npm run dev
```

4. Build het project (voor publishing)

```
npm run build
```

5. Navigate to the localhost of your codeeditor

```
// Default in atom
  - Local:   http://localhost:3000/
  - Network: http://<IP ADRES HERE>:3000/
```

6. Select the right folder
```
    public/index.html
```

## Gebouwd met

* [Node](https://nodejs.org/en/) - Dependency Management
* [Rollup](https://rollupjs.org/) - Pagebuilder
* [NMVW API](https://collectie.wereldculturen.nl/) - API voor data
* [SparQl](https://www.w3.org/TR/rdf-sparql-query/) - SpaQl taal van de database
* [D3](https://d3js.org/) - D3 library voor de datavisualisatie
  
## Features

* [Data manipulatie](https://github.com/Wiebsonice/frontend-applications/wiki/Documentatie-%7C-Data-bewerken-clientside)
* [SparQl Query](https://github.com/Wiebsonice/frontend-applications/wiki/Documentatie-%7C-SparQl-Query)
* [D3 chart]()

  
## API Data

De Data die ik gebruik in de app komt van het endpoint van de NMVW collectie. Hoe ik deze data binnenhaal is te lezen op de pagina [](), dit is met SparQl gedaan. De data die ik terug krijg als object ziet er alsvolgd uit:

```
0: {
        "type": {
          "type": "literal",
          "value": "Beeld"
        },
        "title": {
          "type": "literal",
          "xml:lang": "ned",
          "value": "Gipsen beeld van een indiaan, een Caboclo"
        },
        "mediumLabel": {
          "type": "literal",
          "value": "ijzer"
        },
        "img": {
          "type": "literal",
          "value": "http://collectie.wereldculturen.nl/cc/imageproxy.ashx?server=localhost&port=17581&filename=images/Images/TM//tm-4356-72.jpg"
        },
        "landLabel": {
          "type": "literal",
          "value": "Brazil"
        },
        "date": {
          "type": "literal",
          "value": "voor 1977"
        },
        "lat": {
          "type": "literal",
          "value": "-8.05389"
        },
        "long": {
          "type": "literal",
          "value": "-34.88111"
        }
},
1: {...},
2: {...},


```

De data die je hierboven ziet is binnengehaald door mij en is informatie over alle beelden uit de collectie. De `Type` is het type object, de `Title` geeft de titel, de `mediumLabel` bevat het gebruikte materiaal, de `img` bevat de link naar de image, de `landLabel` verteld uit welk land het object komt, ik heb ook de `date` en ten slotte  de `lat` en `long` de lat en long waarde door..

### DataBewerking
Een aantal waarden die ik binnen krijg heb ik clientside opgelost. Zo heb ik de verschillende formateringen van de jaren en materialen van de beelden gelijk getrokken. Dit valt allemaal te lezen op [Data Opschonen]()
  
## Author

* **Wiebe Kremer** - *Initial work* - [Wiebsonice](https://github.com/Wiebsonice)
  
## Acknowledgements
* Opzetten van rollup [Kris Kuiper]()

### bronnen
* Horizontal bar chart [Blocks example](https://bl.ocks.org/caravinden/eb0e5a2b38c8815919290fa838c6b63b)
* Tooltip [Simple Tooltip d3](http://bl.ocks.org/d3noob/a22c42db65eb00d4e369)
* Img fill [Fill svg el with img](https://stackoverflow.com/questions/25881186/d3-fill-shape-with-image-using-pattern)
* D3.interval() [D3.interval()](https://github.com/d3/d3-timer)
* Sparql Querry [Ivo Zandhuis](#)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details


