const ridingCodes = [
  {
    code: 10001,
    nameEnglish: 'Avalon',
    nameFrench: 'Avalon',
    population: 86494
  },
  {
    code: 10002,
    nameEnglish: 'Bonavista--Burin--Trinity',
    nameFrench: 'Bonavista--Burin--Trinity',
    population: 74116
  },
  {
    code: 10003,
    nameEnglish: 'Coast of Bays--Central--Notre Dame',
    nameFrench: 'Coast of Bays--Central--Notre Dame',
    population: 77680
  },
  {
    code: 10004,
    nameEnglish: 'Labrador',
    nameFrench: 'Labrador',
    population: 27197
  },
  {
    code: 10005,
    nameEnglish: 'Long Range Mountains',
    nameFrench: 'Long Range Mountains',
    population: 86553
  },
  {
    code: 10006,
    nameEnglish: "St. John's East",
    nameFrench: "St. John's-Est",
    population: 85697
  },
  {
    code: 10007,
    nameEnglish: "St. John's South--Mount Pearl",
    nameFrench: "St. John's-Sud--Mount Pearl",
    population: 81979
  },
  {
    code: 11001,
    nameEnglish: 'Cardigan',
    nameFrench: 'Cardigan',
    population: 36615
  },
  {
    code: 11002,
    nameEnglish: 'Charlottetown',
    nameFrench: 'Charlottetown',
    population: 36094
  },
  {
    code: 11003,
    nameEnglish: 'Egmont',
    nameFrench: 'Egmont',
    population: 34168
  },
  {
    code: 11004,
    nameEnglish: 'Malpeque',
    nameFrench: 'Malpeque',
    population: 36030
  },
  {
    code: 12001,
    nameEnglish: 'Cape Breton--Canso',
    nameFrench: 'Cape Breton--Canso',
    population: 71913
  },
  {
    code: 12002,
    nameEnglish: 'Central Nova',
    nameFrench: 'Nova-Centre',
    population: 71962
  },
  {
    code: 12003,
    nameEnglish: 'Cumberland--Colchester',
    nameFrench: 'Cumberland--Colchester',
    population: 80590
  },
  {
    code: 12004,
    nameEnglish: 'Dartmouth--Cole Harbour',
    nameFrench: 'Dartmouth--Cole Harbour',
    population: 92301
  },
  {
    code: 12005,
    nameEnglish: 'Halifax',
    nameFrench: 'Halifax',
    population: 94610
  },
  {
    code: 12006,
    nameEnglish: 'Halifax West',
    nameFrench: 'Halifax-Ouest',
    population: 96255
  },
  {
    code: 12007,
    nameEnglish: 'Kings--Hants',
    nameFrench: 'Kings--Hants',
    population: 83465
  },
  {
    code: 12008,
    nameEnglish: 'Sackville--Preston--Chezzetcook',
    nameFrench: 'Sackville--Preston--Chezzetcook',
    population: 86498
  },
  {
    code: 12009,
    nameEnglish: 'South Shore--St. Margarets',
    nameFrench: 'South Shore--St. Margarets',
    population: 91830
  },
  {
    code: 12010,
    nameEnglish: 'Sydney--Victoria',
    nameFrench: 'Sydney--Victoria',
    population: 72148
  },
  {
    code: 12011,
    nameEnglish: 'West Nova',
    nameFrench: 'Nova-Ouest',
    population: 82026
  },
  {
    code: 13001,
    nameEnglish: 'Acadie--Bathurst',
    nameFrench: 'Acadie--Bathurst',
    population: 77791
  },
  {
    code: 13002,
    nameEnglish: 'Beauséjour',
    nameFrench: 'Beauséjour',
    population: 82292
  },
  {
    code: 13003,
    nameEnglish: 'Fredericton',
    nameFrench: 'Fredericton',
    population: 83303
  },
  {
    code: 13004,
    nameEnglish: 'Fundy Royal',
    nameFrench: 'Fundy Royal',
    population: 79943
  },
  {
    code: 13005,
    nameEnglish: 'Madawaska--Restigouche',
    nameFrench: 'Madawaska--Restigouche',
    population: 60378
  },
  {
    code: 13006,
    nameEnglish: 'Miramichi--Grand Lake',
    nameFrench: 'Miramichi--Grand Lake',
    population: 57405
  },
  {
    code: 13007,
    nameEnglish: 'Moncton--Riverview--Dieppe',
    nameFrench: 'Moncton--Riverview--Dieppe',
    population: 92666
  },
  {
    code: 13008,
    nameEnglish: 'New Brunswick Southwest',
    nameFrench: 'Nouveau-Brunswick-Sud-Ouest',
    population: 65287
  },
  {
    code: 13009,
    nameEnglish: 'Saint John--Rothesay',
    nameFrench: 'Saint John--Rothesay',
    population: 79363
  },
  {
    code: 13010,
    nameEnglish: 'Tobique--Mactaquac',
    nameFrench: 'Tobique--Mactaquac',
    population: 68673
  },
  {
    code: 24001,
    nameEnglish: 'Abitibi--Baie-James--Nunavik--Eeyou',
    nameFrench: 'Abitibi--Baie-James--Nunavik--Eeyou',
    population: 87787
  },
  {
    code: 24002,
    nameEnglish: 'Abitibi--Témiscamingue',
    nameFrench: 'Abitibi--Témiscamingue',
    population: 103491
  },
  {
    code: 24003,
    nameEnglish: 'Ahuntsic-Cartierville',
    nameFrench: 'Ahuntsic-Cartierville',
    population: 117447
  },
  {
    code: 24004,
    nameEnglish: 'Alfred-Pellan',
    nameFrench: 'Alfred-Pellan',
    population: 101373
  },
  {
    code: 24005,
    nameEnglish: 'Argenteuil--La Petite-Nation',
    nameFrench: 'Argenteuil--La Petite-Nation',
    population: 95781
  },
  {
    code: 24006,
    nameEnglish: 'Avignon--La Mitis--Matane--Matapédia',
    nameFrench: 'Avignon--La Mitis--Matane--Matapédia',
    population: 71897
  },
  {
    code: 24007,
    nameEnglish: 'Beauce',
    nameFrench: 'Beauce',
    population: 108746
  },
  {
    code: 24008,
    nameEnglish: 'Beauport--Limoilou',
    nameFrench: 'Beauport--Limoilou',
    population: 96029
  },
  {
    code: 24009,
    nameEnglish: 'Bécancour--Nicolet--Saurel',
    nameFrench: 'Bécancour--Nicolet--Saurel',
    population: 94588
  },
  {
    code: 24010,
    nameEnglish: 'Bellechasse--Les Etchemins--Lévis',
    nameFrench: 'Bellechasse--Les Etchemins--Lévis',
    population: 114966
  },
  {
    code: 24011,
    nameEnglish: 'Beloeil--Chambly',
    nameFrench: 'Beloeil--Chambly',
    population: 117343
  },
  {
    code: 24012,
    nameEnglish: 'Berthier--Maskinongé',
    nameFrench: 'Berthier--Maskinongé',
    population: 100371
  },
  {
    code: 24013,
    nameEnglish: 'Thérèse-De Blainville',
    nameFrench: 'Thérèse-De Blainville',
    population: 101840
  },
  {
    code: 24014,
    nameEnglish: 'Pierre-Boucher--Les Patriotes--Verchères',
    nameFrench: 'Pierre-Boucher--Les Patriotes--Verchères',
    population: 99787
  },
  {
    code: 24015,
    nameEnglish: 'Bourassa',
    nameFrench: 'Bourassa',
    population: 101032
  },
  {
    code: 24016,
    nameEnglish: 'Brome--Missisquoi',
    nameFrench: 'Brome--Missisquoi',
    population: 103457
  },
  {
    code: 24017,
    nameEnglish: 'Brossard--Saint-Lambert',
    nameFrench: 'Brossard--Saint-Lambert',
    population: 107582
  },
  {
    code: 24018,
    nameEnglish: 'Rimouski-Neigette--Témiscouata--Les Basques',
    nameFrench: 'Rimouski-Neigette--Témiscouata--Les Basques',
    population: 84918
  },
  {
    code: 24019,
    nameEnglish: 'Charlesbourg--Haute-Saint-Charles',
    nameFrench: 'Charlesbourg--Haute-Saint-Charles',
    population: 107254
  },
  {
    code: 24020,
    nameEnglish: "Beauport-Côte-de-Beaupré-Île d'Orléans-Charlevoix",
    nameFrench: "Beauport-Côte-de-Beaupré-Île d'Orléans-Charlevoix",
    population: 93674
  },
  {
    code: 24021,
    nameEnglish: 'Châteauguay--Lacolle',
    nameFrench: 'Châteauguay--Lacolle',
    population: 97887
  },
  {
    code: 24022,
    nameEnglish: 'Chicoutimi--Le Fjord',
    nameFrench: 'Chicoutimi--Le Fjord',
    population: 81639
  },
  {
    code: 24023,
    nameEnglish: 'Compton--Stanstead',
    nameFrench: 'Compton--Stanstead',
    population: 105459
  },
  {
    code: 24024,
    nameEnglish: 'Dorval--Lachine--LaSalle',
    nameFrench: 'Dorval--Lachine--LaSalle',
    population: 112866
  },
  {
    code: 24025,
    nameEnglish: 'Drummond',
    nameFrench: 'Drummond',
    population: 103397
  },
  {
    code: 24026,
    nameEnglish: 'Gaspésie--Les Îles-de-la-Madeleine',
    nameFrench: 'Gaspésie--Les Îles-de-la-Madeleine',
    population: 75850
  },
  {
    code: 24027,
    nameEnglish: 'Gatineau',
    nameFrench: 'Gatineau',
    population: 107464
  },
  {
    code: 24028,
    nameEnglish: 'Hochelaga',
    nameFrench: 'Hochelaga',
    population: 106496
  },
  {
    code: 24029,
    nameEnglish: 'Honoré-Mercier',
    nameFrench: 'Honoré-Mercier',
    population: 103592
  },
  {
    code: 24030,
    nameEnglish: 'Hull--Aylmer',
    nameFrench: 'Hull--Aylmer',
    population: 105419
  },
  {
    code: 24031,
    nameEnglish: 'Joliette',
    nameFrench: 'Joliette',
    population: 104136
  },
  {
    code: 24032,
    nameEnglish: 'Jonquière',
    nameFrench: 'Jonquière',
    population: 89818
  },
  {
    code: 24033,
    nameEnglish: "La Pointe-de-l'Île",
    nameFrench: "La Pointe-de-l'Île",
    population: 106336
  },
  {
    code: 24034,
    nameEnglish: 'La Prairie',
    nameFrench: 'La Prairie',
    population: 105496
  },
  {
    code: 24035,
    nameEnglish: 'Lac-Saint-Jean',
    nameFrench: 'Lac-Saint-Jean',
    population: 104911
  },
  {
    code: 24036,
    nameEnglish: 'Lac-Saint-Louis',
    nameFrench: 'Lac-Saint-Louis',
    population: 108579
  },
  {
    code: 24037,
    nameEnglish: 'LaSalle--Émard--Verdun',
    nameFrench: 'LaSalle--Émard--Verdun',
    population: 106766
  },
  {
    code: 24038,
    nameEnglish: 'Laurentides--Labelle',
    nameFrench: 'Laurentides--Labelle',
    population: 113815
  },
  {
    code: 24039,
    nameEnglish: 'Laurier--Sainte-Marie',
    nameFrench: 'Laurier--Sainte-Marie',
    population: 111835
  },
  {
    code: 24040,
    nameEnglish: 'Laval--Les Îles',
    nameFrench: 'Laval--Les Îles',
    population: 108003
  },
  {
    code: 24041,
    nameEnglish: 'Longueuil--Charles-LeMoyne',
    nameFrench: 'Longueuil--Charles-LeMoyne',
    population: 106583
  },
  {
    code: 24042,
    nameEnglish: 'Lévis--Lotbinière',
    nameFrench: 'Lévis--Lotbinière',
    population: 113528
  },
  {
    code: 24043,
    nameEnglish: 'Longueuil--Saint-Hubert',
    nameFrench: 'Longueuil--Saint-Hubert',
    population: 108703
  },
  {
    code: 24044,
    nameEnglish: 'Louis-Hébert',
    nameFrench: 'Louis-Hébert',
    population: 103346
  },
  {
    code: 24045,
    nameEnglish: 'Louis-Saint-Laurent',
    nameFrench: 'Louis-Saint-Laurent',
    population: 117238
  },
  {
    code: 24046,
    nameEnglish: 'Manicouagan',
    nameFrench: 'Manicouagan',
    population: 92518
  },
  {
    code: 24047,
    nameEnglish: "Mégantic--L'Érable",
    nameFrench: "Mégantic--L'Érable",
    population: 87233
  },
  {
    code: 24048,
    nameEnglish: 'Mirabel',
    nameFrench: 'Mirabel',
    population: 117652
  },
  {
    code: 24049,
    nameEnglish: 'Montarville',
    nameFrench: 'Montarville',
    population: 97811
  },
  {
    code: 24050,
    nameEnglish: 'Montcalm',
    nameFrench: 'Montcalm',
    population: 107981
  },
  {
    code: 24051,
    nameEnglish: "Montmagny--L'Islet--Kamouraska--Rivière-du-Loup",
    nameFrench: "Montmagny--L'Islet--Kamouraska--Rivière-du-Loup",
    population: 95527
  },
  {
    code: 24052,
    nameEnglish: 'Mount Royal',
    nameFrench: 'Mont-Royal',
    population: 103320
  },
  {
    code: 24053,
    nameEnglish: 'Notre-Dame-de-Grâce--Westmount',
    nameFrench: 'Notre-Dame-de-Grâce--Westmount',
    population: 104974
  },
  {
    code: 24054,
    nameEnglish: 'Outremont',
    nameFrench: 'Outremont',
    population: 102088
  },
  {
    code: 24055,
    nameEnglish: 'Papineau',
    nameFrench: 'Papineau',
    population: 110750
  },
  {
    code: 24056,
    nameEnglish: 'Pierrefonds--Dollard',
    nameFrench: 'Pierrefonds--Dollard',
    population: 108587
  },
  {
    code: 24057,
    nameEnglish: 'Pontiac',
    nameFrench: 'Pontiac',
    population: 115531
  },
  {
    code: 24058,
    nameEnglish: 'Portneuf--Jacques-Cartier',
    nameFrench: 'Portneuf--Jacques-Cartier',
    population: 115313
  },
  {
    code: 24059,
    nameEnglish: 'Québec',
    nameFrench: 'Québec',
    population: 97143
  },
  {
    code: 24060,
    nameEnglish: 'Repentigny',
    nameFrench: 'Repentigny',
    population: 116066
  },
  {
    code: 24061,
    nameEnglish: 'Richmond--Arthabaska',
    nameFrench: 'Richmond--Arthabaska',
    population: 107242
  },
  {
    code: 24062,
    nameEnglish: 'Rivière-des-Mille-Îles',
    nameFrench: 'Rivière-des-Mille-Îles',
    population: 102346
  },
  {
    code: 24063,
    nameEnglish: 'Rivière-du-Nord',
    nameFrench: 'Rivière-du-Nord',
    population: 112156
  },
  {
    code: 24064,
    nameEnglish: 'Rosemont--La Petite-Patrie',
    nameFrench: 'Rosemont--La Petite-Patrie',
    population: 110677
  },
  {
    code: 24065,
    nameEnglish: 'Marc-Aurèle-Fortin',
    nameFrench: 'Marc-Aurèle-Fortin',
    population: 101750
  },
  {
    code: 24066,
    nameEnglish: 'Saint-Hyacinthe--Bagot',
    nameFrench: 'Saint-Hyacinthe--Bagot',
    population: 102693
  },
  {
    code: 24067,
    nameEnglish: 'Saint-Jean',
    nameFrench: 'Saint-Jean',
    population: 111190
  },
  {
    code: 24068,
    nameEnglish: 'Saint-Laurent',
    nameFrench: 'Saint-Laurent',
    population: 98828
  },
  {
    code: 24069,
    nameEnglish: 'Saint-Léonard--Saint-Michel',
    nameFrench: 'Saint-Léonard--Saint-Michel',
    population: 113212
  },
  {
    code: 24070,
    nameEnglish: 'Saint-Maurice--Champlain',
    nameFrench: 'Saint-Maurice--Champlain',
    population: 110264
  },
  {
    code: 24071,
    nameEnglish: 'Salaberry--Suroît',
    nameFrench: 'Salaberry--Suroît',
    population: 112826
  },
  {
    code: 24072,
    nameEnglish: 'Shefford',
    nameFrench: 'Shefford',
    population: 111139
  },
  {
    code: 24073,
    nameEnglish: 'Sherbrooke',
    nameFrench: 'Sherbrooke',
    population: 111176
  },
  {
    code: 24074,
    nameEnglish: 'Vaudreuil--Soulanges',
    nameFrench: 'Vaudreuil--Soulanges',
    population: 119227
  },
  {
    code: 24075,
    nameEnglish: 'Terrebonne',
    nameFrench: 'Terrebonne',
    population: 111575
  },
  {
    code: 24076,
    nameEnglish: 'Trois-Rivières',
    nameFrench: 'Trois-Rivières',
    population: 110515
  },
  {
    code: 24077,
    nameEnglish: 'Ville-Marie--Le Sud-Ouest--Île-des-Soeurs',
    nameFrench: 'Ville-Marie--Le Sud-Ouest--Île-des-Soeurs',
    population: 114659
  },
  {
    code: 24078,
    nameEnglish: 'Vimy',
    nameFrench: 'Vimy',
    population: 111867
  },
  {
    code: 35001,
    nameEnglish: 'Ajax',
    nameFrench: 'Ajax',
    population: 119677
  },
  {
    code: 35002,
    nameEnglish: 'Algoma--Manitoulin--Kapuskasing',
    nameFrench: 'Algoma--Manitoulin--Kapuskasing',
    population: 79483
  },
  {
    code: 35003,
    nameEnglish: 'Aurora--Oak Ridges--Richmond Hill',
    nameFrench: 'Aurora--Oak Ridges--Richmond Hill',
    population: 115227
  },
  {
    code: 35004,
    nameEnglish: 'Barrie--Innisfil',
    nameFrench: 'Barrie--Innisfil',
    population: 109286
  },
  {
    code: 35005,
    nameEnglish: 'Barrie--Springwater--Oro-Medonte',
    nameFrench: 'Barrie--Springwater--Oro-Medonte',
    population: 100788
  },
  {
    code: 35006,
    nameEnglish: 'Bay of Quinte',
    nameFrench: 'Baie de Quinte',
    population: 109735
  },
  {
    code: 35007,
    nameEnglish: 'Beaches--East York',
    nameFrench: 'Beaches--East York',
    population: 109468
  },
  {
    code: 35008,
    nameEnglish: 'Brampton Centre',
    nameFrench: 'Brampton-Centre',
    population: 102270
  },
  {
    code: 35009,
    nameEnglish: 'Brampton East',
    nameFrench: 'Brampton-Est',
    population: 122000
  },
  {
    code: 35010,
    nameEnglish: 'Brampton North',
    nameFrench: 'Brampton-Nord',
    population: 118180
  },
  {
    code: 35011,
    nameEnglish: 'Brampton South',
    nameFrench: 'Brampton-Sud',
    population: 121188
  },
  {
    code: 35012,
    nameEnglish: 'Brampton West',
    nameFrench: 'Brampton-Ouest',
    population: 130000
  },
  {
    code: 35013,
    nameEnglish: 'Brantford--Brant',
    nameFrench: 'Brantford--Brant',
    population: 130296
  },
  {
    code: 35014,
    nameEnglish: 'Bruce--Grey--Owen Sound',
    nameFrench: 'Bruce--Grey--Owen Sound',
    population: 107679
  },
  {
    code: 35015,
    nameEnglish: 'Burlington',
    nameFrench: 'Burlington',
    population: 123180
  },
  {
    code: 35016,
    nameEnglish: 'Cambridge',
    nameFrench: 'Cambridge',
    population: 115463
  },
  {
    code: 35017,
    nameEnglish: 'Chatham-Kent--Leamington',
    nameFrench: 'Chatham-Kent--Leamington',
    population: 109619
  },
  {
    code: 35018,
    nameEnglish: 'Davenport',
    nameFrench: 'Davenport',
    population: 108473
  },
  {
    code: 35019,
    nameEnglish: 'Don Valley East',
    nameFrench: 'Don Valley-Est',
    population: 94579
  },
  {
    code: 35020,
    nameEnglish: 'Don Valley North',
    nameFrench: 'Don Valley-Nord',
    population: 110076
  },
  {
    code: 35021,
    nameEnglish: 'Don Valley West',
    nameFrench: 'Don Valley-Ouest',
    population: 102508
  },
  {
    code: 35022,
    nameEnglish: 'Dufferin--Caledon',
    nameFrench: 'Dufferin--Caledon',
    population: 128237
  },
  {
    code: 35023,
    nameEnglish: 'Durham',
    nameFrench: 'Durham',
    population: 130872
  },
  {
    code: 35024,
    nameEnglish: 'Eglinton--Lawrence',
    nameFrench: 'Eglinton--Lawrence',
    population: 114395
  },
  {
    code: 35025,
    nameEnglish: 'Elgin--Middlesex--London',
    nameFrench: 'Elgin--Middlesex--London',
    population: 115052
  },
  {
    code: 35026,
    nameEnglish: 'Essex',
    nameFrench: 'Essex',
    population: 125442
  },
  {
    code: 35027,
    nameEnglish: 'Etobicoke Centre',
    nameFrench: 'Etobicoke-Centre',
    population: 118022
  },
  {
    code: 35028,
    nameEnglish: 'Etobicoke--Lakeshore',
    nameFrench: 'Etobicoke--Lakeshore',
    population: 129081
  },
  {
    code: 35029,
    nameEnglish: 'Etobicoke North',
    nameFrench: 'Etobicoke-Nord',
    population: 118040
  },
  {
    code: 35030,
    nameEnglish: 'Flamborough--Glanbrook',
    nameFrench: 'Flamborough--Glanbrook',
    population: 111065
  },
  {
    code: 35031,
    nameEnglish: 'Glengarry--Prescott--Russell',
    nameFrench: 'Glengarry--Prescott--Russell',
    population: 109975
  },
  {
    code: 35032,
    nameEnglish: 'Guelph',
    nameFrench: 'Guelph',
    population: 131794
  },
  {
    code: 35033,
    nameEnglish: 'Haldimand--Norfolk',
    nameFrench: 'Haldimand--Norfolk',
    population: 109652
  },
  {
    code: 35034,
    nameEnglish: 'Haliburton--Kawartha Lakes--Brock',
    nameFrench: 'Haliburton--Kawartha Lakes--Brock',
    population: 113956
  },
  {
    code: 35035,
    nameEnglish: 'Hamilton Centre',
    nameFrench: 'Hamilton-Centre',
    population: 100103
  },
  {
    code: 35036,
    nameEnglish: 'Hamilton East--Stoney Creek',
    nameFrench: 'Hamilton-Est--Stoney Creek',
    population: 107848
  },
  {
    code: 35037,
    nameEnglish: 'Hamilton Mountain',
    nameFrench: 'Hamilton Mountain',
    population: 104877
  },
  {
    code: 35038,
    nameEnglish: 'Hamilton West--Ancaster--Dundas',
    nameFrench: 'Hamilton-Ouest--Ancaster--Dundas',
    population: 113024
  },
  {
    code: 35039,
    nameEnglish: 'Hastings--Lennox and Addington',
    nameFrench: 'Hastings--Lennox and Addington',
    population: 94333
  },
  {
    code: 35040,
    nameEnglish: 'Huron--Bruce',
    nameFrench: 'Huron--Bruce',
    population: 106570
  },
  {
    code: 35041,
    nameEnglish: 'Kanata--Carleton',
    nameFrench: 'Kanata--Carleton',
    population: 110960
  },
  {
    code: 35042,
    nameEnglish: 'Kenora',
    nameFrench: 'Kenora',
    population: 62556
  },
  {
    code: 35043,
    nameEnglish: 'King--Vaughan',
    nameFrench: 'King--Vaughan',
    population: 131995
  },
  {
    code: 35044,
    nameEnglish: 'Kingston and the Islands',
    nameFrench: 'Kingston et les Îles',
    population: 117543
  },
  {
    code: 35045,
    nameEnglish: 'Kitchener Centre',
    nameFrench: 'Kitchener-Centre',
    population: 105258
  },
  {
    code: 35046,
    nameEnglish: 'Kitchener--Conestoga',
    nameFrench: 'Kitchener--Conestoga',
    population: 100709
  },
  {
    code: 35047,
    nameEnglish: 'Kitchener South--Hespeler',
    nameFrench: 'Kitchener-Sud--Hespeler',
    population: 105309
  },
  {
    code: 35048,
    nameEnglish: 'Lambton--Kent--Middlesex',
    nameFrench: 'Lambton--Kent--Middlesex',
    population: 105331
  },
  {
    code: 35049,
    nameEnglish: 'Lanark--Frontenac--Kingston',
    nameFrench: 'Lanark--Frontenac--Kingston',
    population: 101630
  },
  {
    code: 35050,
    nameEnglish: 'Leeds-Grenville-Thousand Islands and Rideau Lakes',
    nameFrench: 'Leeds-Grenville-Thousand Islands et Rideau Lakes',
    population: 100546
  },
  {
    code: 35051,
    nameEnglish: 'London--Fanshawe',
    nameFrench: 'London--Fanshawe',
    population: 119467
  },
  {
    code: 35052,
    nameEnglish: 'London North Centre',
    nameFrench: 'London-Centre-Nord',
    population: 125362
  },
  {
    code: 35053,
    nameEnglish: 'London West',
    nameFrench: 'London-Ouest',
    population: 126110
  },
  {
    code: 35054,
    nameEnglish: 'Markham--Stouffville',
    nameFrench: 'Markham--Stouffville',
    population: 126064
  },
  {
    code: 35055,
    nameEnglish: 'Markham--Thornhill',
    nameFrench: 'Markham--Thornhill',
    population: 99078
  },
  {
    code: 35056,
    nameEnglish: 'Markham--Unionville',
    nameFrench: 'Markham--Unionville',
    population: 123318
  },
  {
    code: 35057,
    nameEnglish: 'Milton',
    nameFrench: 'Milton',
    population: 114093
  },
  {
    code: 35058,
    nameEnglish: 'Mississauga Centre',
    nameFrench: 'Mississauga-Centre',
    population: 124849
  },
  {
    code: 35059,
    nameEnglish: 'Mississauga East--Cooksville',
    nameFrench: 'Mississauga-Est--Cooksville',
    population: 120205
  },
  {
    code: 35060,
    nameEnglish: 'Mississauga--Erin Mills',
    nameFrench: 'Mississauga--Erin Mills',
    population: 122560
  },
  {
    code: 35061,
    nameEnglish: 'Mississauga--Lakeshore',
    nameFrench: 'Mississauga--Lakeshore',
    population: 117444
  },
  {
    code: 35062,
    nameEnglish: 'Mississauga--Malton',
    nameFrench: 'Mississauga--Malton',
    population: 118240
  },
  {
    code: 35063,
    nameEnglish: 'Mississauga--Streetsville',
    nameFrench: 'Mississauga--Streetsville',
    population: 118301
  },
  {
    code: 35064,
    nameEnglish: 'Nepean',
    nameFrench: 'Nepean',
    population: 119110
  },
  {
    code: 35065,
    nameEnglish: 'Newmarket--Aurora',
    nameFrench: 'Newmarket--Aurora',
    population: 117418
  },
  {
    code: 35066,
    nameEnglish: 'Niagara Centre',
    nameFrench: 'Niagara-Centre',
    population: 109067
  },
  {
    code: 35067,
    nameEnglish: 'Niagara Falls',
    nameFrench: 'Niagara Falls',
    population: 136292
  },
  {
    code: 35068,
    nameEnglish: 'Niagara West',
    nameFrench: 'Niagara-Ouest',
    population: 90838
  },
  {
    code: 35069,
    nameEnglish: 'Nickel Belt',
    nameFrench: 'Nickel Belt',
    population: 93772
  },
  {
    code: 35070,
    nameEnglish: 'Nipissing--Timiskaming',
    nameFrench: 'Nipissing--Timiskaming',
    population: 88813
  },
  {
    code: 35071,
    nameEnglish: 'Northumberland--Peterborough South',
    nameFrench: 'Northumberland--Peterborough-Sud',
    population: 112412
  },
  {
    code: 35072,
    nameEnglish: 'Oakville',
    nameFrench: 'Oakville',
    population: 120923
  },
  {
    code: 35073,
    nameEnglish: 'Oakville North--Burlington',
    nameFrench: 'Oakville-Nord--Burlington',
    population: 129078
  },
  {
    code: 35074,
    nameEnglish: 'Oshawa',
    nameFrench: 'Oshawa',
    population: 126764
  },
  {
    code: 35075,
    nameEnglish: 'Ottawa Centre',
    nameFrench: 'Ottawa-Centre',
    population: 118038
  },
  {
    code: 35076,
    nameEnglish: 'Orléans',
    nameFrench: 'Orléans',
    population: 128281
  },
  {
    code: 35077,
    nameEnglish: 'Ottawa South',
    nameFrench: 'Ottawa-Sud',
    population: 121058
  },
  {
    code: 35078,
    nameEnglish: 'Ottawa--Vanier',
    nameFrench: 'Ottawa--Vanier',
    population: 111508
  },
  {
    code: 35079,
    nameEnglish: 'Ottawa West--Nepean',
    nameFrench: 'Ottawa-Ouest--Nepean',
    population: 111837
  },
  {
    code: 35080,
    nameEnglish: 'Oxford',
    nameFrench: 'Oxford',
    population: 113790
  },
  {
    code: 35081,
    nameEnglish: 'Parkdale--High Park',
    nameFrench: 'Parkdale--High Park',
    population: 108805
  },
  {
    code: 35082,
    nameEnglish: 'Parry Sound--Muskoka',
    nameFrench: 'Parry Sound--Muskoka',
    population: 94398
  },
  {
    code: 35083,
    nameEnglish: 'Perth--Wellington',
    nameFrench: 'Perth--Wellington',
    population: 107908
  },
  {
    code: 35084,
    nameEnglish: 'Peterborough--Kawartha',
    nameFrench: 'Peterborough--Kawartha',
    population: 118176
  },
  {
    code: 35085,
    nameEnglish: 'Pickering--Uxbridge',
    nameFrench: 'Pickering--Uxbridge',
    population: 112947
  },
  {
    code: 35086,
    nameEnglish: 'Renfrew--Nipissing--Pembroke',
    nameFrench: 'Renfrew--Nipissing--Pembroke',
    population: 103495
  },
  {
    code: 35087,
    nameEnglish: 'Richmond Hill',
    nameFrench: 'Richmond Hill',
    population: 110177
  },
  {
    code: 35088,
    nameEnglish: 'Carleton',
    nameFrench: 'Carleton',
    population: 102918
  },
  {
    code: 35089,
    nameEnglish: 'St. Catharines',
    nameFrench: 'St. Catharines',
    population: 111691
  },
  {
    code: 35090,
    nameEnglish: "Toronto--St. Paul's",
    nameFrench: "Toronto--St. Paul's",
    population: 107900
  },
  {
    code: 35091,
    nameEnglish: 'Sarnia--Lambton',
    nameFrench: 'Sarnia--Lambton',
    population: 105337
  },
  {
    code: 35092,
    nameEnglish: 'Sault Ste. Marie',
    nameFrench: 'Sault Ste. Marie',
    population: 80371
  },
  {
    code: 35093,
    nameEnglish: 'Scarborough--Agincourt',
    nameFrench: 'Scarborough--Agincourt',
    population: 105542
  },
  {
    code: 35094,
    nameEnglish: 'Scarborough Centre',
    nameFrench: 'Scarborough-Centre',
    population: 112603
  },
  {
    code: 35095,
    nameEnglish: 'Scarborough--Guildwood',
    nameFrench: 'Scarborough--Guildwood',
    population: 102386
  },
  {
    code: 35096,
    nameEnglish: 'Scarborough North',
    nameFrench: 'Scarborough-Nord',
    population: 98800
  },
  {
    code: 35097,
    nameEnglish: 'Scarborough--Rouge Park',
    nameFrench: 'Scarborough--Rouge Park',
    population: 102275
  },
  {
    code: 35098,
    nameEnglish: 'Scarborough Southwest',
    nameFrench: 'Scarborough-Sud-Ouest',
    population: 110278
  },
  {
    code: 35099,
    nameEnglish: 'Simcoe--Grey',
    nameFrench: 'Simcoe--Grey',
    population: 129944
  },
  {
    code: 35100,
    nameEnglish: 'Simcoe North',
    nameFrench: 'Simcoe-Nord',
    population: 111332
  },
  {
    code: 35101,
    nameEnglish: 'Spadina--Fort York',
    nameFrench: 'Spadina--Fort York',
    population: 115506
  },
  {
    code: 35102,
    nameEnglish: 'Stormont--Dundas--South Glengarry',
    nameFrench: 'Stormont--Dundas--South Glengarry',
    population: 103320
  },
  {
    code: 35103,
    nameEnglish: 'Sudbury',
    nameFrench: 'Sudbury',
    population: 91532
  },
  {
    code: 35104,
    nameEnglish: 'Thornhill',
    nameFrench: 'Thornhill',
    population: 112719
  },
  {
    code: 35105,
    nameEnglish: 'Thunder Bay--Rainy River',
    nameFrench: 'Thunder Bay--Rainy River',
    population: 82805
  },
  {
    code: 35106,
    nameEnglish: 'Thunder Bay--Superior North',
    nameFrench: 'Thunder Bay--Supérieur-Nord',
    population: 82651
  },
  {
    code: 35107,
    nameEnglish: 'Timmins--James Bay',
    nameFrench: 'Timmins--Baie James',
    population: 83257
  },
  {
    code: 35108,
    nameEnglish: 'Toronto Centre',
    nameFrench: 'Toronto-Centre',
    population: 103805
  },
  {
    code: 35109,
    nameEnglish: 'Toronto--Danforth',
    nameFrench: 'Toronto--Danforth',
    population: 106875
  },
  {
    code: 35110,
    nameEnglish: 'University--Rosedale',
    nameFrench: 'University--Rosedale',
    population: 104311
  },
  {
    code: 35111,
    nameEnglish: 'Vaughan--Woodbridge',
    nameFrench: 'Vaughan--Woodbridge',
    population: 105228
  },
  {
    code: 35112,
    nameEnglish: 'Waterloo',
    nameFrench: 'Waterloo',
    population: 110134
  },
  {
    code: 35113,
    nameEnglish: 'Wellington--Halton Hills',
    nameFrench: 'Wellington--Halton Hills',
    population: 120981
  },
  {
    code: 35114,
    nameEnglish: 'Whitby',
    nameFrench: 'Whitby',
    population: 128377
  },
  {
    code: 35115,
    nameEnglish: 'Willowdale',
    nameFrench: 'Willowdale',
    population: 118801
  },
  {
    code: 35116,
    nameEnglish: 'Windsor--Tecumseh',
    nameFrench: 'Windsor--Tecumseh',
    population: 117429
  },
  {
    code: 35117,
    nameEnglish: 'Windsor West',
    nameFrench: 'Windsor-Ouest',
    population: 122988
  },
  {
    code: 35118,
    nameEnglish: 'York Centre',
    nameFrench: 'York-Centre',
    population: 104319
  },
  {
    code: 35119,
    nameEnglish: 'York--Simcoe',
    nameFrench: 'York--Simcoe',
    population: 104010
  },
  {
    code: 35120,
    nameEnglish: 'York South--Weston',
    nameFrench: 'York-Sud--Weston',
    population: 116686
  },
  {
    code: 35121,
    nameEnglish: 'Humber River--Black Creek',
    nameFrench: 'Humber River--Black Creek',
    population: 108037
  },
  {
    code: 46001,
    nameEnglish: 'Brandon--Souris',
    nameFrench: 'Brandon--Souris',
    population: 88170
  },
  {
    code: 46002,
    nameEnglish: 'Charleswood--St. James--Assiniboia--Headingley',
    nameFrench: 'Charleswood--St. James--Assiniboia--Headingley',
    population: 82574
  },
  {
    code: 46003,
    nameEnglish: 'Churchill--Keewatinook Aski',
    nameFrench: 'Churchill--Keewatinook Aski',
    population: 87027
  },
  {
    code: 46004,
    nameEnglish: 'Dauphin--Swan River--Neepawa',
    nameFrench: 'Dauphin--Swan River--Neepawa',
    population: 87527
  },
  {
    code: 46005,
    nameEnglish: 'Elmwood--Transcona',
    nameFrench: 'Elmwood--Transcona',
    population: 92738
  },
  {
    code: 46006,
    nameEnglish: 'Kildonan--St. Paul',
    nameFrench: 'Kildonan--St. Paul',
    population: 84077
  },
  {
    code: 46007,
    nameEnglish: 'Portage--Lisgar',
    nameFrench: 'Portage--Lisgar',
    population: 97354
  },
  {
    code: 46008,
    nameEnglish: 'Provencher',
    nameFrench: 'Provencher',
    population: 99946
  },
  {
    code: 46009,
    nameEnglish: 'Saint Boniface--Saint Vital',
    nameFrench: 'Saint-Boniface--Saint-Vital',
    population: 89818
  },
  {
    code: 46010,
    nameEnglish: 'Selkirk--Interlake--Eastman',
    nameFrench: 'Selkirk--Interlake--Eastman',
    population: 94778
  },
  {
    code: 46011,
    nameEnglish: 'Winnipeg Centre',
    nameFrench: 'Winnipeg-Centre',
    population: 85949
  },
  {
    code: 46012,
    nameEnglish: 'Winnipeg North',
    nameFrench: 'Winnipeg-Nord',
    population: 95676
  },
  {
    code: 46013,
    nameEnglish: 'Winnipeg South',
    nameFrench: 'Winnipeg-Sud',
    population: 99678
  },
  {
    code: 46014,
    nameEnglish: 'Winnipeg South Centre',
    nameFrench: 'Winnipeg-Centre-Sud',
    population: 93053
  },
  {
    code: 47001,
    nameEnglish: 'Battlefords--Lloydminster',
    nameFrench: 'Battlefords--Lloydminster',
    population: 73506
  },
  {
    code: 47002,
    nameEnglish: 'Cypress Hills--Grasslands',
    nameFrench: 'Cypress Hills--Grasslands',
    population: 68353
  },
  {
    code: 47003,
    nameEnglish: 'Desnethé--Missinippi--Churchill River',
    nameFrench: 'Desnethé--Missinippi--Rivière Churchill',
    population: 70891
  },
  {
    code: 47004,
    nameEnglish: 'Carlton Trail--Eagle Creek',
    nameFrench: 'Sentier Carlton--Eagle Creek',
    population: 80662
  },
  {
    code: 47005,
    nameEnglish: 'Moose Jaw--Lake Centre--Lanigan',
    nameFrench: 'Moose Jaw--Lake Centre--Lanigan',
    population: 79733
  },
  {
    code: 47006,
    nameEnglish: 'Prince Albert',
    nameFrench: 'Prince Albert',
    population: 79625
  },
  {
    code: 47007,
    nameEnglish: 'Regina--Lewvan',
    nameFrench: 'Regina--Lewvan',
    population: 92426
  },
  {
    code: 47008,
    nameEnglish: "Regina--Qu'Appelle",
    nameFrench: "Regina--Qu'Appelle",
    population: 76017
  },
  {
    code: 47009,
    nameEnglish: 'Regina--Wascana',
    nameFrench: 'Regina--Wascana',
    population: 84153
  },
  {
    code: 47010,
    nameEnglish: 'Saskatoon--Grasswood',
    nameFrench: 'Saskatoon--Grasswood',
    population: 82946
  },
  {
    code: 47011,
    nameEnglish: 'Saskatoon--University',
    nameFrench: 'Saskatoon--University',
    population: 82663
  },
  {
    code: 47012,
    nameEnglish: 'Saskatoon West',
    nameFrench: 'Saskatoon-Ouest',
    population: 83711
  },
  {
    code: 47013,
    nameEnglish: 'Souris--Moose Mountain',
    nameFrench: 'Souris--Moose Mountain',
    population: 72635
  },
  {
    code: 47014,
    nameEnglish: 'Yorkton--Melville',
    nameFrench: 'Yorkton--Melville',
    population: 71031
  },
  {
    code: 48001,
    nameEnglish: 'Banff--Airdrie',
    nameFrench: 'Banff--Airdrie',
    population: 135762
  },
  {
    code: 48002,
    nameEnglish: 'Battle River--Crowfoot',
    nameFrench: 'Battle River--Crowfoot',
    population: 110223
  },
  {
    code: 48003,
    nameEnglish: 'Bow River',
    nameFrench: 'Bow River',
    population: 115022
  },
  {
    code: 48004,
    nameEnglish: 'Calgary Centre',
    nameFrench: 'Calgary-Centre',
    population: 119176
  },
  {
    code: 48005,
    nameEnglish: 'Calgary Confederation',
    nameFrench: 'Calgary Confederation',
    population: 122023
  },
  {
    code: 48006,
    nameEnglish: 'Calgary Forest Lawn',
    nameFrench: 'Calgary Forest Lawn',
    population: 111830
  },
  {
    code: 48007,
    nameEnglish: 'Calgary Heritage',
    nameFrench: 'Calgary Heritage',
    population: 112087
  },
  {
    code: 48008,
    nameEnglish: 'Calgary Midnapore',
    nameFrench: 'Calgary Midnapore',
    population: 121844
  },
  {
    code: 48009,
    nameEnglish: 'Calgary Nose Hill',
    nameFrench: 'Calgary Nose Hill',
    population: 115795
  },
  {
    code: 48010,
    nameEnglish: 'Calgary Rocky Ridge',
    nameFrench: 'Calgary Rocky Ridge',
    population: 131823
  },
  {
    code: 48011,
    nameEnglish: 'Calgary Shepard',
    nameFrench: 'Calgary Shepard',
    population: 147520
  },
  {
    code: 48012,
    nameEnglish: 'Calgary Signal Hill',
    nameFrench: 'Calgary Signal Hill',
    population: 121392
  },
  {
    code: 48013,
    nameEnglish: 'Calgary Skyview',
    nameFrench: 'Calgary Skyview',
    population: 135730
  },
  {
    code: 48014,
    nameEnglish: 'Edmonton Centre',
    nameFrench: 'Edmonton-Centre',
    population: 109941
  },
  {
    code: 48015,
    nameEnglish: 'Edmonton Griesbach',
    nameFrench: 'Edmonton Griesbach',
    population: 112287
  },
  {
    code: 48016,
    nameEnglish: 'Edmonton Manning',
    nameFrench: 'Edmonton Manning',
    population: 121048
  },
  {
    code: 48017,
    nameEnglish: 'Edmonton Mill Woods',
    nameFrench: 'Edmonton Mill Woods',
    population: 118561
  },
  {
    code: 48018,
    nameEnglish: 'Edmonton Riverbend',
    nameFrench: 'Edmonton Riverbend',
    population: 120863
  },
  {
    code: 48019,
    nameEnglish: 'Edmonton Strathcona',
    nameFrench: 'Edmonton Strathcona',
    population: 106066
  },
  {
    code: 48020,
    nameEnglish: 'Edmonton West',
    nameFrench: 'Edmonton-Ouest',
    population: 121869
  },
  {
    code: 48021,
    nameEnglish: 'Edmonton--Wetaskiwin',
    nameFrench: 'Edmonton--Wetaskiwin',
    population: 158749
  },
  {
    code: 48022,
    nameEnglish: 'Foothills',
    nameFrench: 'Foothills',
    population: 113227
  },
  {
    code: 48023,
    nameEnglish: 'Fort McMurray--Cold Lake',
    nameFrench: 'Fort McMurray--Cold Lake',
    population: 110230
  },
  {
    code: 48024,
    nameEnglish: 'Grande Prairie--Mackenzie',
    nameFrench: 'Grande Prairie--Mackenzie',
    population: 117327
  },
  {
    code: 48025,
    nameEnglish: 'Lakeland',
    nameFrench: 'Lakeland',
    population: 108451
  },
  {
    code: 48026,
    nameEnglish: 'Lethbridge',
    nameFrench: 'Lethbridge',
    population: 117394
  },
  {
    code: 48027,
    nameEnglish: 'Medicine Hat--Cardston--Warner',
    nameFrench: 'Medicine Hat--Cardston--Warner',
    population: 106896
  },
  {
    code: 48028,
    nameEnglish: 'Peace River--Westlock',
    nameFrench: 'Peace River--Westlock',
    population: 109965
  },
  {
    code: 48029,
    nameEnglish: 'Red Deer--Mountain View',
    nameFrench: 'Red Deer--Mountain View',
    population: 119019
  },
  {
    code: 48030,
    nameEnglish: 'Red Deer--Lacombe',
    nameFrench: 'Red Deer--Lacombe',
    population: 128786
  },
  {
    code: 48031,
    nameEnglish: 'St. Albert--Edmonton',
    nameFrench: 'St. Albert--Edmonton',
    population: 121313
  },
  {
    code: 48032,
    nameEnglish: 'Sherwood Park--Fort Saskatchewan',
    nameFrench: 'Sherwood Park--Fort Saskatchewan',
    population: 122193
  },
  {
    code: 48033,
    nameEnglish: 'Sturgeon River--Parkland',
    nameFrench: 'Sturgeon River--Parkland',
    population: 120784
  },
  {
    code: 48034,
    nameEnglish: 'Yellowhead',
    nameFrench: 'Yellowhead',
    population: 101979
  },
  {
    code: 59001,
    nameEnglish: 'Abbotsford',
    nameFrench: 'Abbotsford',
    population: 101814
  },
  {
    code: 59002,
    nameEnglish: 'Burnaby North--Seymour',
    nameFrench: 'Burnaby-Nord--Seymour',
    population: 102486
  },
  {
    code: 59003,
    nameEnglish: 'Burnaby South',
    nameFrench: 'Burnaby-Sud',
    population: 111973
  },
  {
    code: 59004,
    nameEnglish: 'Cariboo--Prince George',
    nameFrench: 'Cariboo--Prince George',
    population: 108907
  },
  {
    code: 59005,
    nameEnglish: 'Central Okanagan--Similkameen--Nicola',
    nameFrench: 'Central Okanagan--Similkameen--Nicola',
    population: 110293
  },
  {
    code: 59006,
    nameEnglish: 'Chilliwack--Hope',
    nameFrench: 'Chilliwack--Hope',
    population: 100126
  },
  {
    code: 59007,
    nameEnglish: 'Cloverdale--Langley City',
    nameFrench: 'Cloverdale--Langley City',
    population: 117640
  },
  {
    code: 59008,
    nameEnglish: 'Coquitlam--Port Coquitlam',
    nameFrench: 'Coquitlam--Port Coquitlam',
    population: 123576
  },
  {
    code: 59009,
    nameEnglish: 'Courtenay--Alberni',
    nameFrench: 'Courtenay--Alberni',
    population: 114647
  },
  {
    code: 59010,
    nameEnglish: 'Cowichan--Malahat--Langford',
    nameFrench: 'Cowichan--Malahat--Langford',
    population: 108052
  },
  {
    code: 59011,
    nameEnglish: 'Delta',
    nameFrench: 'Delta',
    population: 103064
  },
  {
    code: 59012,
    nameEnglish: 'Fleetwood--Port Kells',
    nameFrench: 'Fleetwood--Port Kells',
    population: 116958
  },
  {
    code: 59013,
    nameEnglish: 'Kamloops--Thompson--Cariboo',
    nameFrench: 'Kamloops--Thompson--Cariboo',
    population: 124358
  },
  {
    code: 59014,
    nameEnglish: 'Kelowna--Lake Country',
    nameFrench: 'Kelowna--Lake Country',
    population: 119388
  },
  {
    code: 59015,
    nameEnglish: 'Kootenay--Columbia',
    nameFrench: 'Kootenay--Columbia',
    population: 112354
  },
  {
    code: 59016,
    nameEnglish: 'Langley--Aldergrove',
    nameFrench: 'Langley--Aldergrove',
    population: 117017
  },
  {
    code: 59017,
    nameEnglish: 'Mission--Matsqui--Fraser Canyon',
    nameFrench: 'Mission--Matsqui--Fraser Canyon',
    population: 94825
  },
  {
    code: 59018,
    nameEnglish: 'Nanaimo--Ladysmith',
    nameFrench: 'Nanaimo--Ladysmith',
    population: 122710
  },
  {
    code: 59019,
    nameEnglish: 'New Westminster--Burnaby',
    nameFrench: 'New Westminster--Burnaby',
    population: 115340
  },
  {
    code: 59020,
    nameEnglish: 'North Okanagan--Shuswap',
    nameFrench: 'North Okanagan--Shuswap',
    population: 124605
  },
  {
    code: 59021,
    nameEnglish: 'North Vancouver',
    nameFrench: 'North Vancouver',
    population: 115344
  },
  {
    code: 59022,
    nameEnglish: 'Pitt Meadows--Maple Ridge',
    nameFrench: 'Pitt Meadows--Maple Ridge',
    population: 101101
  },
  {
    code: 59023,
    nameEnglish: 'Port Moody--Coquitlam',
    nameFrench: 'Port Moody--Coquitlam',
    population: 110817
  },
  {
    code: 59024,
    nameEnglish: 'Prince George--Peace River--Northern Rockies',
    nameFrench: 'Prince George--Peace River--Northern Rockies',
    population: 110995
  },
  {
    code: 59025,
    nameEnglish: 'Richmond Centre',
    nameFrench: 'Richmond-Centre',
    population: 98396
  },
  {
    code: 59026,
    nameEnglish: 'Esquimalt--Saanich--Sooke',
    nameFrench: 'Esquimalt--Saanich--Sooke',
    population: 120834
  },
  {
    code: 59027,
    nameEnglish: 'Saanich--Gulf Islands',
    nameFrench: 'Saanich--Gulf Islands',
    population: 107339
  },
  {
    code: 59028,
    nameEnglish: 'Skeena--Bulkley Valley',
    nameFrench: 'Skeena--Bulkley Valley',
    population: 88920
  },
  {
    code: 59029,
    nameEnglish: 'South Okanagan--West Kootenay',
    nameFrench: 'Okanagan-Sud--Kootenay-Ouest',
    population: 114695
  },
  {
    code: 59030,
    nameEnglish: 'South Surrey--White Rock',
    nameFrench: 'Surrey-Sud--White Rock',
    population: 104051
  },
  {
    code: 59031,
    nameEnglish: 'Steveston--Richmond East',
    nameFrench: 'Steveston--Richmond-Est',
    population: 99913
  },
  {
    code: 59032,
    nameEnglish: 'Surrey Centre',
    nameFrench: 'Surrey-Centre',
    population: 120172
  },
  {
    code: 59033,
    nameEnglish: 'Surrey--Newton',
    nameFrench: 'Surrey--Newton',
    population: 114605
  },
  {
    code: 59034,
    nameEnglish: 'Vancouver Centre',
    nameFrench: 'Vancouver-Centre',
    population: 116443
  },
  {
    code: 59035,
    nameEnglish: 'Vancouver East',
    nameFrench: 'Vancouver-Est',
    population: 115724
  },
  {
    code: 59036,
    nameEnglish: 'Vancouver Granville',
    nameFrench: 'Vancouver Granville',
    population: 103456
  },
  {
    code: 59037,
    nameEnglish: 'North Island--Powell River',
    nameFrench: 'North Island--Powell River',
    population: 105466
  },
  {
    code: 59038,
    nameEnglish: 'Vancouver Kingsway',
    nameFrench: 'Vancouver Kingsway',
    population: 104870
  },
  {
    code: 59039,
    nameEnglish: 'Vancouver Quadra',
    nameFrench: 'Vancouver Quadra',
    population: 105608
  },
  {
    code: 59040,
    nameEnglish: 'Vancouver South',
    nameFrench: 'Vancouver-Sud',
    population: 102927
  },
  {
    code: 59041,
    nameEnglish: 'Victoria',
    nameFrench: 'Victoria',
    population: 117133
  },
  {
    code: 59042,
    nameEnglish: 'West Vancouver--Sunshine Coast--Sea to Sky Country',
    nameFrench: 'West Vancouver--Sunshine Coast--Sea to Sky Country',
    population: 119113
  },
  {
    code: 60001,
    nameEnglish: 'Yukon',
    nameFrench: 'Yukon',
    population: 35874
  },
  {
    code: 61001,
    nameEnglish: 'Northwest Territories',
    nameFrench: 'Territoires du Nord-Ouest',
    population: 41786
  },
  {
    code: 62001,
    nameEnglish: 'Nunavut',
    nameFrench: 'Nunavut',
    population: 35944
  }
]

module.exports = ridingCodes
