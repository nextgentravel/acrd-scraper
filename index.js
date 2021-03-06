var util = require('util')

const rp = require('request-promise');
const cheerio = require('cheerio');
const osmosis = require('osmosis');
const departmentList = 'source';
var cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())

let provinces = {
    "AB": "Alberta",
    "BC": "British Columbia",
    "MB": "Manitoba",
    "NB": "New Brunswick",
    "NL": "Newfoundland and Labrador",
    "NS": "Nova Scotia",
    "NT": "Northwest Territories",
    "NU": "Nunavut",
    "ON": "Ontario",
    "PE": "Prince Edward Island",
    "QC": "Québec",
    "SK": "Saskatchewan",
    "YT": "Yukon"
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

app.get('/', (req, res) => res.send('Unofficial ACRD API'))

app.use('/source', express.static('source'))

app.get('/departments', (req, res) => {
    rp(departmentList)
        .then((html) => {
            const $ = cheerio.load(html)
            let array = []
            $('#wb-main-in > ul:nth-child(352)', html).children().each((i, item) => {
                array.push(item.children[0].data)
            });
            res.send(JSON.stringify(array));
        })
        .catch((err) => {
            //handle error
            res.send({
                "error": err
            });
        })
});

app.get('/province/:provinceCode/cities', (req, res) => {
    let provinceCode = req.params.provinceCode.toUpperCase();
    let province = provinces[provinceCode]

    function getCities() {
        return new Promise((resolve, reject) => {
            let response = [];
            osmosis
                .get(`http://localhost:${port}/source/acrd2020.html`)
                .find(`:contains("${province}") + ul > li`)
                .set({
                    'result': '.',
                })
                .data(res => {
                    response.push(res)
                })
                .error(err => reject(err))
                .done(() => {
                    if (response.length === 0) {
                        res.send({
                            'error': 'no data found'
                        });
                    }
                    let output = []
                    response.forEach((item) => {
                        let list = item.result.split(', ');
                        let splitCity = list[0].split(': ');
                        list.splice(0, 1)
                        let suburb = splitCity.concat(list);
                        suburb.sort();
                        suburb = suburb.map(e => e.trim());
                        let city = "";
                        if (splitCity[1] === "See Ottawa ON") {
                            city = 'Ottawa ON'
                            suburb.splice(1, 1)
                        } else {
                            city = splitCity[0]
                        }
                        let result = {
                            city: city,
                            suburb: suburb,
                        }
                        output.push(result)
                    })
                    resolve(output)
                });
        });
    }
    getCities().then(result => {
        res.send(JSON.stringify(result));
    });
});

app.get('/cities', (req, res) => {
    let cities = {
        citiesList: [
            "100 Mile House BC",
            "Abbotsford BC",
            "Acheson AB",
            "Ahuntsic-Cartierville QC",
            "Airdrie AB",
            "Ajax ON",
            "Aldergrove BC",
            "Alma QC",
            "Amherst NS",
            "Amos QC",
            "Amqui QC",
            "Anjou QC",
            "Antigonish NS",
            "Arnprior ON",
            "Athabasca AB",
            "Baie-Comeau QC",
            "Baie-d’Urfé QC",
            "Balzac AB",
            "Banff AB",
            "Barrie ON",
            "Bathurst NB",
            "Beaconsfield QC",
            "Beauport QC",
            "Belleville ON",
            "Beresford NB",
            "Berthierville QC",
            "Blackfalds AB",
            "Blainville QC",
            "Blue River BC",
            "Boischâtel QC",
            "Bolton ON",
            "Bonaventure QC",
            "Bonnyville AB",
            "Boucherville QC",
            "Bowmanville ON",
            "Bracebridge ON",
            "Brampton ON",
            "Brandon MB",
            "Brantford ON",
            "Bridgewater NS",
            "Brockville ON",
            "Bromont QC",
            "Brooks AB",
            "Brossard QC",
            "Burlington ON",
            "Burnaby BC",
            "Bécancour QC",
            "Cache Creek BC",
            "Calgary AB",
            "Cambridge ON",
            "Campbell River BC",
            "Campbellton NB",
            "Camrose AB",
            "Canmore AB",
            "Cap-Rouge QC",
            "Cap-aux-Meules QC",
            "Caraquet NB",
            "Cardigan PE",
            "Carlyle SK",
            "Casselman ON",
            "Castlegar BC",
            "Charlesbourg QC",
            "Charlottetown PE",
            "Chase BC",
            "Chatham ON",
            "Cherry Grove AB",
            "Chetwynd BC",
            "Chicoutimi QC",
            "Chilliwack BC",
            "Clarenville NL",
            "Clarington ON",
            "Cobourg ON",
            "Cochrane AB",
            "Cochrane ON",
            "Cold Lake AB",
            "Collingwood ON",
            "Colwood BC",
            "Coquitlam BC",
            "Cordova Bay BC",
            "Corner Brook NL",
            "Cornwall ON",
            "Cornwall PE",
            "Courtenay BC",
            "Cranbrook BC",
            "Creek AB",
            "Cumberland ON",
            "Côte-Saint-Luc QC",
            "Dalhousie NB",
            "Dartmouth NS",
            "Dauphin MB",
            "Dawson City YT",
            "Dawson Creek BC",
            "Deauville QC",
            "Deer Lake NL",
            "Delta BC",
            "Dieppe NB",
            "Dollard-des-Ormeaux QC",
            "Dorval QC",
            "Drayton Valley AB",
            "Drumheller AB",
            "Drummondville QC",
            "Dryden ON",
            "Duncan BC",
            "Edmonton AB",
            "Edmunston NB",
            "Edson AB",
            "Emerald Park SK",
            "Enfield NS",
            "Enoch AB",
            "Esquimalt BC",
            "Estevan SK",
            "Etobicoke ON",
            "Fall River NS",
            "Fergus ON",
            "Fleurimont QC",
            "Flin Flon MB",
            "Fort Erie ON",
            "Fort Frances ON",
            "Fort McMurray AB",
            "Fort Nelson BC",
            "Fort Saskatchewan AB",
            "Fort Smith NT",
            "Fort St. John BC",
            "Fox Creek AB",
            "Fredericton NB",
            "Gananoque ON",
            "Gander NL",
            "Gaspé QC",
            "Gatineau (QC) ON",
            "Gatineau QC",
            "Georgetown/Halton Hills ON",
            "Gimli MB",
            "Gloucester ON",
            "Goderich ON",
            "Goffs NS",
            "Golden BC",
            "Goldstream BC",
            "Gouldbourn ON",
            "Grand Bend ON",
            "Grand Falls NB",
            "Grand Falls NL",
            "Grand Forks BC",
            "Grande Prairie AB",
            "Gravenhurst ON",
            "Grimsby ON",
            "Grimshaw AB",
            "Guelph ON",
            "Halifax NS",
            "Hamilton ON",
            "Hawkesbury ON",
            "Headingly MB",
            "High Level AB",
            "High River AB",
            "Hinton AB",
            "Huntsville ON",
            "Iles-de-la-Madeleine QC",
            "Ingersoll ON",
            "Innisfail AB",
            "Inuvik NT",
            "Iqaluit NU",
            "Jonquière QC",
            "Kamloops BC",
            "Kananaskis Village AB",
            "Kanata ON",
            "Kapuskasing ON",
            "Kelowna BC",
            "Kenora ON",
            "Kincardine ON",
            "Kindersley SK",
            "Kingston ON",
            "Kirkland Lake ON",
            "Kirkland QC",
            "Kitchener/Waterloo ON",
            "Kitimat BC",
            "La Baie QC",
            "La Pocatière QC",
            "Lac la Biche AB",
            "Lachenaie QC",
            "Lachine QC",
            "Lacombe AB",
            "Ladysmith BC",
            "Lakeside PE",
            "Langford BC",
            "Langley BC",
            "Lasalle QC",
            "Laterrière QC",
            "Laval QC",
            "Laval-des-Rapides QC",
            "Leamington ON",
            "Leduc AB",
            "Lemoyne QC",
            "Lennoxville QC",
            "Lethbridge AB",
            "Lindsay ON",
            "Liverpool NS",
            "Lloydminster AB",
            "Lloydminster SK",
            "London ON",
            "Longueuil QC",
            "Lorraine QC",
            "Lévis QC",
            "L’Ancienne-Lorette QC",
            "MacKenzie BC",
            "Maniwaki QC",
            "Manning AB",
            "Manotick ON",
            "Maple Ridge BC",
            "Markham ON",
            "Martensville SK",
            "Masset BC",
            "Matane QC",
            "McBride BC",
            "Meadow Lake SK",
            "Medicine Hat AB",
            "Membertou NS",
            "Merritt BC",
            "Middleton NS",
            "Millbrook NS",
            "Milton ON",
            "Mindemoya ON",
            "Miramichi NB",
            "Mission BC",
            "Mississauga ON",
            "Moncton NB",
            "Mont-Bellevue QC",
            "Mont-Laurier QC",
            "Mont-Tremblant QC",
            "Montréal QC",
            "Montréal-Est QC",
            "Montréal-Nord QC",
            "Moose Jaw SK",
            "Moosomin SK",
            "Nanaimo BC",
            "Nelson BC",
            "Nepean ON",
            "New Carlisle QC",
            "New Glasgow NS",
            "New Liskeard ON",
            "New Minas NS",
            "New Westminster BC",
            "Newmarket ON",
            "Niagara Falls ON",
            "Niagara-on-the-Lake,Thorold ON",
            "Nisku AB",
            "North Battleford SK",
            "North Bay ON",
            "North Saanich BC",
            "North Sydney NS",
            "North Vancouver BC",
            "North York ON",
            "O'Leary PE",
            "Oak Bay BC",
            "Oakville ON",
            "Okotoks AB",
            "Olds AB",
            "Orangeville ON",
            "Orford QC",
            "Orillia ON",
            "Orleans ON",
            "Oromocto NB",
            "Oshawa ON",
            "Osoyoos BC",
            "Ottawa ON",
            "Owen Sound ON",
            "Parksville BC",
            "Parry Sound ON",
            "Peace River AB",
            "Pembroke ON",
            "Penticton BC",
            "Percé QC",
            "Perth ON",
            "Petawawa ON",
            "Peterborough ON",
            "Pickering ON",
            "Pictou NS",
            "Pierrefonds QC",
            "Pincher Creek AB",
            "Pitt Meadows BC",
            "Plateau-Mont-Royal QC",
            "Pointe-Aux-Trembles QC",
            "Pointe-Claire QC",
            "Ponoka AB",
            "Pont-Viau QC",
            "Port Alberni BC",
            "Port Coquitlam BC",
            "Port Elgin ON",
            "Port Hawkesbury NS",
            "Port McNeil BC",
            "Port Moody BC",
            "Portage La Prairie MB",
            "Powell River BC",
            "Preston ON",
            "Prince Albert SK",
            "Prince George BC",
            "Prince Rupert BC",
            "Princeton BC",
            "Provost AB",
            "Quesnel BC",
            "Quispamsis NB",
            "Québec QC",
            "Radium Hot Springs BC",
            "Red Deer AB",
            "Red Lake ON",
            "Regina SK",
            "Revelstoke BC",
            "Richmond BC",
            "Richmond Hill ON",
            "Rimbey AB",
            "Rimouski QC",
            "Riverton MB",
            "Rivière-du-Loup QC",
            "Rock Forest QC",
            "Rocky Mountain House AB",
            "Rosemère QC",
            "Rossland BC",
            "Rouyn-Noranda QC",
            "Roxboro QC",
            "Russell MB",
            "Saanich BC",
            "Saanichton BC",
            "Sackville NB",
            "Saguenay QC",
            "Saint John NB",
            "Saint-Albert AB",
            "Saint-André NB",
            "Saint-Apollinaire QC",
            "Saint-Basile NB",
            "Saint-Eustache QC",
            "Saint-George-de-Beauce QC",
            "Saint-Hubert QC",
            "Saint-Hyacinthe QC",
            "Saint-Jean-sur-Richelieu QC",
            "Saint-Jérôme QC",
            "Saint-Lambert QC",
            "Saint-Laurent QC",
            "Saint-Léonard QC",
            "Saint-Élie QC",
            "Sainte-Agathe-des-Monts QC",
            "Sainte-Anne-de-Beaupré QC",
            "Sainte-Anne-des-Monts QC",
            "Sainte-Dorothée QC",
            "Sainte-Foy QC",
            "Sainte-Geneviève QC",
            "Sainte-Julie QC",
            "Sainte-Marthe QC",
            "Sainte-Rose QC",
            "Sainte-Thérèse QC",
            "Salmon Arm BC",
            "Salt Spring Island BC",
            "Sarnia ON",
            "Saskatoon SK",
            "Sault Ste. Marie ON",
            "Scarborough ON",
            "Seguin ON",
            "Selkirk MB",
            "Senneville QC",
            "Sept-Iles QC",
            "Shawinigan QC",
            "Shediac NB",
            "Sherbrooke QC",
            "Sherwood Park AB",
            "Sicamous BC",
            "Sidney BC",
            "Sillery QC",
            "Simcoe ON",
            "Sioux Lookout ON",
            "Slave Lake AB",
            "Slemon Park PE",
            "Smith Falls ON",
            "Smithers BC",
            "Sooke BC",
            "Sorel QC",
            "South Huron ON",
            "Spruce Grove AB",
            "Squamish BC",
            "St. Andrews NB",
            "St. Anthony NL",
            "St. Catharines ON",
            "St. Catherines ON",
            "St. Jacobs ON",
            "St. John's NL",
            "St. Paul AB",
            "St. Stephen NB",
            "Stellarton NS",
            "Stephenville NL",
            "Stettler AB",
            "Stittsville ON",
            "Stony Plain AB",
            "Stratford ON",
            "Strathmore AB",
            "Sturgeon Falls ON",
            "Sudbury ON",
            "Summerside PE",
            "Surrey BC",
            "Sussex NB",
            "Swan River MB",
            "Swift Current SK",
            "Sydney NS",
            "Taber AB",
            "Tecumseh ON",
            "Terrace BC",
            "Terrebonne QC",
            "Thetford Mines QC",
            "Thompson MB",
            "Thornhill ON",
            "Thunder Bay ON",
            "Timmins ON",
            "Toronto ON",
            "Trail BC",
            "Trenton ON",
            "Trois-Rivières QC",
            "Truro NS",
            "Tétreaultville QC",
            "Urbania NS",
            "Val d'Or QC",
            "Valcartier QC",
            "Vancouver BC",
            "Vaudreuil QC",
            "Vaughan ON",
            "Vegreville AB",
            "Vermillion AB",
            "Vernon BC",
            "Victoria BC",
            "Victoriaville QC",
            "View Royal BC",
            "Waasis NB",
            "Wabush NL",
            "Wainwright AB",
            "Walkerton ON",
            "Walnut Grove BC",
            "Watrous SK",
            "Welland ON",
            "Wendake QC",
            "West Vancouver BC",
            "Westaskiwin AB",
            "Westlock AB",
            "Westmount QC",
            "Weyburn SK",
            "Whitby ON",
            "White Point NS",
            "White Rock BC",
            "Whitecourt AB",
            "Whitehorse YT",
            "Williams Lake BC",
            "Windsor NS",
            "Windsor ON",
            "Winkler MB",
            "Winnipeg MB",
            "Wolfville NS",
            "Woodstock NB",
            "Woodstock ON",
            "Yarmouth NS",
            "Yellowknife NT",
            "York ON",
            "Yorkton SK",
            "Îles-de-la Madeleine QC"
        ],
        suburbCityList: {
            "Edmonton AB": "Edmonton AB",
            "Leduc AB": "Edmonton AB",
            "Nisku AB": "Edmonton AB",
            "Saint-Albert AB": "Edmonton AB",
            "Sherwood Park AB": "Edmonton AB",
            "Abbotsford BC": "Vancouver BC",
            "Burnaby BC": "Vancouver BC",
            "Coquitlam BC": "Vancouver BC",
            "Delta BC": "Vancouver BC",
            "Langley BC": "Vancouver BC",
            "Maple Ridge BC": "Vancouver BC",
            "Mission BC": "Vancouver BC",
            "New Westminster BC": "Vancouver BC",
            "North Vancouver BC": "Vancouver BC",
            "Pitt Meadows BC": "Vancouver BC",
            "Port Coquitlam BC": "Vancouver BC",
            "Port Moody BC": "Vancouver BC",
            "Richmond BC": "Vancouver BC",
            "Surrey BC": "Vancouver BC",
            "Vancouver BC": "Vancouver BC",
            "Walnut Grove BC": "Vancouver BC",
            "West Vancouver BC": "Vancouver BC",
            "White Rock BC": "Vancouver BC",
            "Colwood BC": "Victoria BC",
            "Cordova Bay BC": "Victoria BC",
            "Esquimalt BC": "Victoria BC",
            "Goldstream BC": "Victoria BC",
            "Langford BC": "Victoria BC",
            "North Saanich BC": "Victoria BC",
            "Oak Bay BC": "Victoria BC",
            "Saanich BC": "Victoria BC",
            "Saanichton BC": "Victoria BC",
            "Sidney BC": "Victoria BC",
            "Victoria BC": "Victoria BC",
            "View Royal BC": "Victoria BC",
            "Dieppe NB": "Moncton NB",
            "Moncton NB": "Moncton NB",
            "Quispamsis NB": "Saint John NB",
            "Saint John NB": "Saint John NB",
            "Dartmouth NS": "Halifax NS",
            "Enfield NS": "Halifax NS",
            "Fall River NS": "Halifax NS",
            "Goffs NS": "Halifax NS",
            "Halifax NS": "Halifax NS",
            "North Sydney NS": "Sydney NS",
            "Sydney NS": "Sydney NS",
            "Belleville ON": "Belleville ON",
            "Trenton ON": "Belleville ON",
            "Cambridge ON": "Kitchener/Waterloo ON",
            "Guelph ON": "Kitchener/Waterloo ON",
            "Kitchener/Waterloo ON": "Kitchener/Waterloo ON",
            "Preston ON": "Kitchener/Waterloo ON",
            "Cumberland ON": "Ottawa ON",
            "Gatineau (QC) ON": "Ottawa ON",
            "Gloucester ON": "Ottawa ON",
            "Gouldbourn ON": "Ottawa ON",
            "Kanata ON": "Ottawa ON",
            "Manotick ON": "Ottawa ON",
            "Nepean ON": "Ottawa ON",
            "Orleans ON": "Ottawa ON",
            "Ottawa ON": "Ottawa ON",
            "Stittsville ON": "Ottawa ON",
            "Fort Erie ON": "St. Catherines ON",
            "Niagara Falls ON": "St. Catherines ON",
            "Niagara-on-the-Lake,Thorold ON": "St. Catherines ON",
            "St. Catherines ON": "St. Catherines ON",
            "Welland ON": "St. Catherines ON",
            "Mississauga ON": "Toronto ON",
            "Scarborough ON": "Toronto ON",
            "Ajax ON": "Toronto ON",
            "Brampton ON": "Toronto ON",
            "Burlington ON": "Toronto ON",
            "Etobicoke ON": "Toronto ON",
            "Hamilton ON": "Toronto ON",
            "Markham ON": "Toronto ON",
            "Milton ON": "Toronto ON",
            "North York ON": "Toronto ON",
            "Oakville ON": "Toronto ON",
            "Oshawa ON": "Toronto ON",
            "Pickering ON": "Toronto ON",
            "Richmond Hill ON": "Toronto ON",
            "Thornhill ON": "Toronto ON",
            "Toronto ON": "Toronto ON",
            "Vaughan ON": "Toronto ON",
            "Whitby ON": "Toronto ON",
            "York ON": "Toronto ON",
            "Tecumseh ON": "Windsor ON",
            "Windsor ON": "Windsor ON",
            "Slemon Park PE": "Summerside PE",
            "Summerside PE": "Summerside PE",
            "Gatineau QC": "Ottawa ON",
            "Cap-aux-Meules QC": "Îles-de-la Madeleine QC",
            "Îles-de-la Madeleine QC": "Îles-de-la Madeleine QC",
            "Dollard-des-Ormeaux QC": "Montréal QC",
            "Lachine QC": "Montréal QC",
            "Laval QC": "Montréal QC",
            "Pointe-Claire QC": "Montréal QC",
            "Senneville QC": "Montréal QC",
            "Ahuntsic-Cartierville QC": "Montréal QC",
            "Anjou QC": "Montréal QC",
            "Baie-d’Urfé QC": "Montréal QC",
            "Beaconsfield QC": "Montréal QC",
            "Blainville QC": "Montréal QC",
            "Boucherville QC": "Montréal QC",
            "Brossard QC": "Montréal QC",
            "Côte-Saint-Luc QC": "Montréal QC",
            "Dorval QC": "Montréal QC",
            "Kirkland QC": "Montréal QC",
            "Lachenaie QC": "Montréal QC",
            "Lasalle QC": "Montréal QC",
            "Laval-des-Rapides QC": "Montréal QC",
            "Lemoyne QC": "Montréal QC",
            "Longueuil QC": "Montréal QC",
            "Lorraine QC": "Montréal QC",
            "Montréal QC": "Montréal QC",
            "Montréal-Est QC": "Montréal QC",
            "Montréal-Nord QC": "Montréal QC",
            "Pierrefonds QC": "Montréal QC",
            "Plateau-Mont-Royal QC": "Montréal QC",
            "Pointe-Aux-Trembles QC": "Montréal QC",
            "Pont-Viau QC": "Montréal QC",
            "Rosemère QC": "Montréal QC",
            "Roxboro QC": "Montréal QC",
            "Saint-Hubert QC": "Montréal QC",
            "Saint-Lambert QC": "Montréal QC",
            "Saint-Laurent QC": "Montréal QC",
            "Saint-Léonard QC": "Montréal QC",
            "Sainte-Dorothée QC": "Montréal QC",
            "Sainte-Geneviève QC": "Montréal QC",
            "Sainte-Julie QC": "Montréal QC",
            "Sainte-Rose QC": "Montréal QC",
            "Sainte-Thérèse QC": "Montréal QC",
            "Terrebonne QC": "Montréal QC",
            "Tétreaultville QC": "Montréal QC",
            "Vaudreuil QC": "Montréal QC",
            "Westmount QC": "Montréal QC",
            "Sainte-Foy QC": "Québec QC",
            "Beauport QC": "Québec QC",
            "Boischâtel QC": "Québec QC",
            "Cap-Rouge QC": "Québec QC",
            "Charlesbourg QC": "Québec QC",
            "Lévis QC": "Québec QC",
            "L’Ancienne-Lorette QC": "Québec QC",
            "Québec QC": "Québec QC",
            "Sillery QC": "Québec QC",
            "Valcartier QC": "Québec QC",
            "Wendake QC": "Québec QC",
            "Chicoutimi QC": "Saguenay QC",
            "Jonquière QC": "Saguenay QC",
            "La Baie QC": "Saguenay QC",
            "Laterrière QC": "Saguenay QC",
            "Saguenay QC": "Saguenay QC",
            "Deauville QC": "Sherbrooke QC",
            "Fleurimont QC": "Sherbrooke QC",
            "Lennoxville QC": "Sherbrooke QC",
            "Mont-Bellevue QC": "Sherbrooke QC",
            "Rock Forest QC": "Sherbrooke QC",
            "Saint-Élie QC": "Sherbrooke QC",
            "Sherbrooke QC": "Sherbrooke QC"
        }
    }
    res.send(cities);

});



// Below code will get cities with an actual scrape.  
// let provinceCodes = Object.keys(provinces);

// function getCities(provinceCode) {
//     return new Promise((resolve, reject) => {
//         try {
//             let response = [];
//             let province = provinces[provinceCode];
//                 osmosis
//                     .get(`http://localhost:${port}/source/acrd.html`)
//                     .find(`:contains("${province}") + ul > li`)
//                     .set({
//                         'result': '.' || "",
//                     })
//                     .data(result => {
//                         response.push(result)
//                     })
//                     .error(err => resolve(err))
//                     .done(() => {
//                         console.log(province)
//                         if (response.length === 0) {
//                             resolve('no results')
//                         }
//                         let output = []
//                         response.forEach((item) => {
//                             let list = item.result.split(', ');
//                             let splitCity = list[0].split(': ');
//                             list.splice(0,1)
//                             let suburb = splitCity.concat(list);
//                             suburb.sort();
//                             suburb = suburb.map(e => e.trim());
//                             suburb = suburb.map(e => e + " " + provinceCode)
//                             let city = "";
//                             if (splitCity[1] === "See Ottawa ON") {
//                                 city = 'Ottawa ON'
//                                 suburb.splice(1,1)
//                             } else {
//                                 city = splitCity[0] + " " + provinceCode
//                             }
//                             let result = {
//                                 city: city,
//                                 suburb: suburb,
//                             }
//                             output.push(result)
//                         })
//                         resolve(output)
//                     });
//         } catch {
//             resolve('no results')
//         }
//     }).catch((err) => {
//         resolve(err)
//     });
// }



// function getOtherCities(provinceCode) {
//     return new Promise((resolve, reject) => {
//         try {
//             let response = [];
//             let province = provinces[provinceCode];
//                 osmosis
//                     .get(`http://localhost:${port}/source/acrd.html`)
//                     .find(`table > caption:contains("(Canada)") !> table > tbody > tr`)
//                     .set({
//                         'result': 'td[1]' || "",
//                     })
//                     .data(result => {
//                         console.log(result)
//                         response.push(result)
//                     })
//                     .error(err => resolve(err))
//                     .done(() => {
//                         resolve(response);
//                     });
//         } catch {
//             resolve([])
//         }
//     }).catch((err) => {
//         resolve([])
//     });
// }

// let queries = [];

// provinceCodes.forEach((provinceCode) => {
//     queries.push(getCities(provinceCode));
// })

// console.log(queries);

// Promise.all(queries)
//     .then(function(values) {
//         let citiesList = []
//         let suburbCityList = {}

//         getOtherCities()
//         .then(result => {
//             console.log(result)
//             result.forEach(city => {
//                 citiesList.push(city.result);
//             })

//             values.forEach((value => {
//                 if (Array.isArray(value)) {
//                     value.forEach((item) => {
//                         item.suburb.forEach((suburb) => {
//                             citiesList.push(suburb)
//                             suburbCityList[suburb] = item.city
//                         })
//                     })
//                 }
//             }))
//             let uniqueCityList = [...new Set(citiesList)];
//             uniqueCityList.sort()
//             res.send(JSON.stringify({
//                 citiesList: uniqueCityList,
//                 suburbCityList
//             }));
//         })
//         .catch(err => {
//             console.log(err)
//         })


//     })
//     .catch(error => { 
//         console.error(error.message)
//     });

app.get('/old/:city/rules', (req, res) => {
    let cityName = req.params.city.replace('sss','/')
    console.log("City Rules Requested: ", cityName)
    function getRules() {
        return new Promise((resolve, reject) => {
            let response = [];
            osmosis
                .get(`http://localhost:${port}/source/acrd2020.html`)
                .find(`tr:contains("${cityName}")`)
                .set({
                    '01-04': 'td[2]',
                    '05-08': 'td[3]',
                    '09-12': 'td[4]',
                })
                .error(err => reject(err))
                .then(async (context, data) => {
                    resolve(data);
                })
        });
    }

    getRules()
        .then(result => {
            res.send(JSON.stringify(result));
        })
        .catch(err => {
            res.send(JSON.stringify({ error: 'no results' }));
        });
});

app.get('/:city/rules', (req, res) => {
    let cityName = req.params.city.replace('sss', '/')
    console.log("City Rules Requested", cityName)
    function getRules() {
        return new Promise((resolve, reject) => {
            let response = [];
            osmosis
                .get(`http://localhost:${port}/source/acrd2020.html`)
                .find(`tr:contains("${cityName}")`)
                .set({
                    '01-04': 'td[2]',
                    '05-08': 'td[3]',
                    '09-12': 'td[4]',
                })
                .error(err => reject(err))
                .then(async (context, data) => {
                    let monthsArray = [{
                            label: "January",
                            rate: null
                        },
                        {
                            label: "February",
                            rate: null
                        },
                        {
                            label: "March",
                            rate: null
                        },
                        {
                            label: "April",
                            rate: null
                        },
                        {
                            label: "May",
                            rate: null
                        },
                        {
                            label: "June",
                            rate: null
                        },
                        {
                            label: "July",
                            rate: null
                        },
                        {
                            label: "August",
                            rate: null
                        },
                        {
                            label: "September",
                            rate: null
                        },
                        {
                            label: "October",
                            rate: null
                        },
                        {
                            label: "November",
                            rate: null
                        },
                        {
                            label: "December",
                            rate: null
                        },
                    ];

                    function extractValue(data, indexes) {
                        if (data.includes(' and ')) {
                            let splitAndString = data.split(/[—, ]+/);
                            for (let i = parseInt(indexes[0]); i <= parseInt(indexes[1]); i++) {
                                if (splitAndString.includes(monthsArray[i - 1].label)) {
                                    let indexOfLabel = splitAndString.indexOf(monthsArray[i - 1].label)
                                    for (let j = indexOfLabel; j >= 0; j = j - 1) {
                                        if (/^\$(?=.*\d)\d{0,6}(\.\d{1,2})?$/g.test(splitAndString[j])) {
                                            monthsArray[i - 1].rate = splitAndString[j];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                        else if (data.includes(' to ')) {
                            let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
                            let splitAndString = data.split(/[—, ]+/);

                            for (let i = 0; i < splitAndString.length; i++) {
                                if (splitAndString[i] === 'to') {
                                    let lastMonth = i - 1;
                                    let nextMonth = months.indexOf(splitAndString[lastMonth]) + 1
                                    splitAndString.splice(i, 0, months[nextMonth])
                                    i = i + 1
                                }
                            }
   
                            for (let i = parseInt(indexes[0]); i <= parseInt(indexes[1]); i++) {
                                if (splitAndString.includes(monthsArray[i - 1].label)) {
                                    let indexOfLabel = splitAndString.indexOf(monthsArray[i - 1].label)
                                    for (let j = indexOfLabel; j >= 0; j = j - 1) {
                                        if (/^\$(?=.*\d)\d{0,6}(\.\d{1,2})?$/g.test(splitAndString[j])) {
                                            monthsArray[i - 1].rate = splitAndString[j];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    function processMonthlyRate(data) {
                        let keyArray = Object.keys(data);
                        keyArray.forEach(key => {
                            if (/^\$(?=.*\d)\d{0,6}(\.\d{1,2})?$/g.test(data[key])) {
                                let splitKey = key.split('-');
                                for (let i = parseInt(splitKey[0]); i <= parseInt(splitKey[1]); i++) {
                                    monthsArray[i - 1].rate = data[key]
                                }
                            }

                            if (data[key].includes(' and ')) {
                                let splitKey = key.split('-');
                                for (let i = parseInt(splitKey[0]); i <= parseInt(splitKey[1]); i++) {
                                    let value = extractValue(data[key], splitKey)
                                }
                            }

                            if (data[key].includes(' to ')) {
                                let splitKey = key.split('-');
                                for (let i = parseInt(splitKey[0]); i <= parseInt(splitKey[1]); i++) {
                                    let value = extractValue(data[key], splitKey)
                                }
                            }


                        });
                    }

                    processMonthlyRate(data);
                    let response = {};

                    monthsArray.forEach(item => {
                        response[item.label] = item.rate
                    });
                    resolve(response);

                })
        });
    }

    getRules()
        .then(result => {
            res.send(JSON.stringify(result));
        })
        .catch(err => {
            res.send(JSON.stringify({
                error: 'no results'
            }));
        });
});

app.listen(port, () => console.log(`listening on port ${port}!`))