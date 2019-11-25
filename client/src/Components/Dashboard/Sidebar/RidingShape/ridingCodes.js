const ridingCodes = [
  {
    ridingCode: 10001,
    ridingNameEnglish: 'Avalon',
    ridingNameFrench: 'Avalon',
    population: 86494
  },
  {
    ridingCode: 10002,
    ridingNameEnglish: 'Bonavista--Burin--Trinity',
    ridingNameFrench: 'Bonavista--Burin--Trinity',
    population: 74116
  },
  {
    ridingCode: 10003,
    ridingNameEnglish: 'Coast of Bays--Central--Notre Dame',
    ridingNameFrench: 'Coast of Bays--Central--Notre Dame',
    population: 77680
  },
  {
    ridingCode: 10004,
    ridingNameEnglish: 'Labrador',
    ridingNameFrench: 'Labrador',
    population: 27197
  },
  {
    ridingCode: 10005,
    ridingNameEnglish: 'Long Range Mountains',
    ridingNameFrench: 'Long Range Mountains',
    population: 86553
  },
  {
    ridingCode: 10006,
    ridingNameEnglish: "St. John's East",
    ridingNameFrench: "St. John's-Est",
    population: 85697
  },
  {
    ridingCode: 10007,
    ridingNameEnglish: "St. John's South--Mount Pearl",
    ridingNameFrench: "St. John's-Sud--Mount Pearl",
    population: 81979
  },
  {
    ridingCode: 11001,
    ridingNameEnglish: 'Cardigan',
    ridingNameFrench: 'Cardigan',
    population: 36615
  },
  {
    ridingCode: 11002,
    ridingNameEnglish: 'Charlottetown',
    ridingNameFrench: 'Charlottetown',
    population: 36094
  },
  {
    ridingCode: 11003,
    ridingNameEnglish: 'Egmont',
    ridingNameFrench: 'Egmont',
    population: 34168
  },
  {
    ridingCode: 11004,
    ridingNameEnglish: 'Malpeque',
    ridingNameFrench: 'Malpeque',
    population: 36030
  },
  {
    ridingCode: 12001,
    ridingNameEnglish: 'Cape Breton--Canso',
    ridingNameFrench: 'Cape Breton--Canso',
    population: 71913
  },
  {
    ridingCode: 12002,
    ridingNameEnglish: 'Central Nova',
    ridingNameFrench: 'Nova-Centre',
    population: 71962
  },
  {
    ridingCode: 12003,
    ridingNameEnglish: 'Cumberland--Colchester',
    ridingNameFrench: 'Cumberland--Colchester',
    population: 80590
  },
  {
    ridingCode: 12004,
    ridingNameEnglish: 'Dartmouth--Cole Harbour',
    ridingNameFrench: 'Dartmouth--Cole Harbour',
    population: 92301
  },
  {
    ridingCode: 12005,
    ridingNameEnglish: 'Halifax',
    ridingNameFrench: 'Halifax',
    population: 94610
  },
  {
    ridingCode: 12006,
    ridingNameEnglish: 'Halifax West',
    ridingNameFrench: 'Halifax-Ouest',
    population: 96255
  },
  {
    ridingCode: 12007,
    ridingNameEnglish: 'Kings--Hants',
    ridingNameFrench: 'Kings--Hants',
    population: 83465
  },
  {
    ridingCode: 12008,
    ridingNameEnglish: 'Sackville--Preston--Chezzetcook',
    ridingNameFrench: 'Sackville--Preston--Chezzetcook',
    population: 86498
  },
  {
    ridingCode: 12009,
    ridingNameEnglish: 'South Shore--St. Margarets',
    ridingNameFrench: 'South Shore--St. Margarets',
    population: 91830
  },
  {
    ridingCode: 12010,
    ridingNameEnglish: 'Sydney--Victoria',
    ridingNameFrench: 'Sydney--Victoria',
    population: 72148
  },
  {
    ridingCode: 12011,
    ridingNameEnglish: 'West Nova',
    ridingNameFrench: 'Nova-Ouest',
    population: 82026
  },
  {
    ridingCode: 13001,
    ridingNameEnglish: 'Acadie--Bathurst',
    ridingNameFrench: 'Acadie--Bathurst',
    population: 77791
  },
  {
    ridingCode: 13002,
    ridingNameEnglish: 'Beaus�jour',
    ridingNameFrench: 'Beaus�jour',
    population: 82292
  },
  {
    ridingCode: 13003,
    ridingNameEnglish: 'Fredericton',
    ridingNameFrench: 'Fredericton',
    population: 83303
  },
  {
    ridingCode: 13004,
    ridingNameEnglish: 'Fundy Royal',
    ridingNameFrench: 'Fundy Royal',
    population: 79943
  },
  {
    ridingCode: 13005,
    ridingNameEnglish: 'Madawaska--Restigouche',
    ridingNameFrench: 'Madawaska--Restigouche',
    population: 60378
  },
  {
    ridingCode: 13006,
    ridingNameEnglish: 'Miramichi--Grand Lake',
    ridingNameFrench: 'Miramichi--Grand Lake',
    population: 57405
  },
  {
    ridingCode: 13007,
    ridingNameEnglish: 'Moncton--Riverview--Dieppe',
    ridingNameFrench: 'Moncton--Riverview--Dieppe',
    population: 92666
  },
  {
    ridingCode: 13008,
    ridingNameEnglish: 'New Brunswick Southwest',
    ridingNameFrench: 'Nouveau-Brunswick-Sud-Ouest',
    population: 65287
  },
  {
    ridingCode: 13009,
    ridingNameEnglish: 'Saint John--Rothesay',
    ridingNameFrench: 'Saint John--Rothesay',
    population: 79363
  },
  {
    ridingCode: 13010,
    ridingNameEnglish: 'Tobique--Mactaquac',
    ridingNameFrench: 'Tobique--Mactaquac',
    population: 68673
  },
  {
    ridingCode: 24001,
    ridingNameEnglish: 'Abitibi--Baie-James--Nunavik--Eeyou',
    ridingNameFrench: 'Abitibi--Baie-James--Nunavik--Eeyou',
    population: 87787
  },
  {
    ridingCode: 24002,
    ridingNameEnglish: 'Abitibi--T�miscamingue',
    ridingNameFrench: 'Abitibi--T�miscamingue',
    population: 103491
  },
  {
    ridingCode: 24003,
    ridingNameEnglish: 'Ahuntsic-Cartierville',
    ridingNameFrench: 'Ahuntsic-Cartierville',
    population: 117447
  },
  {
    ridingCode: 24004,
    ridingNameEnglish: 'Alfred-Pellan',
    ridingNameFrench: 'Alfred-Pellan',
    population: 101373
  },
  {
    ridingCode: 24005,
    ridingNameEnglish: 'Argenteuil--La Petite-Nation',
    ridingNameFrench: 'Argenteuil--La Petite-Nation',
    population: 95781
  },
  {
    ridingCode: 24006,
    ridingNameEnglish: 'Avignon--La Mitis--Matane--Matap�dia',
    ridingNameFrench: 'Avignon--La Mitis--Matane--Matap�dia',
    population: 71897
  },
  {
    ridingCode: 24007,
    ridingNameEnglish: 'Beauce',
    ridingNameFrench: 'Beauce',
    population: 108746
  },
  {
    ridingCode: 24008,
    ridingNameEnglish: 'Beauport--Limoilou',
    ridingNameFrench: 'Beauport--Limoilou',
    population: 96029
  },
  {
    ridingCode: 24009,
    ridingNameEnglish: 'B�cancour--Nicolet--Saurel',
    ridingNameFrench: 'B�cancour--Nicolet--Saurel',
    population: 94588
  },
  {
    ridingCode: 24010,
    ridingNameEnglish: 'Bellechasse--Les Etchemins--L�vis',
    ridingNameFrench: 'Bellechasse--Les Etchemins--L�vis',
    population: 114966
  },
  {
    ridingCode: 24011,
    ridingNameEnglish: 'Beloeil--Chambly',
    ridingNameFrench: 'Beloeil--Chambly',
    population: 117343
  },
  {
    ridingCode: 24012,
    ridingNameEnglish: 'Berthier--Maskinong�',
    ridingNameFrench: 'Berthier--Maskinong�',
    population: 100371
  },
  {
    ridingCode: 24013,
    ridingNameEnglish: 'Th�r�se-De Blainville',
    ridingNameFrench: 'Th�r�se-De Blainville',
    population: 101840
  },
  {
    ridingCode: 24014,
    ridingNameEnglish: 'Pierre-Boucher--Les Patriotes--Verch�res',
    ridingNameFrench: 'Pierre-Boucher--Les Patriotes--Verch�res',
    population: 99787
  },
  {
    ridingCode: 24015,
    ridingNameEnglish: 'Bourassa',
    ridingNameFrench: 'Bourassa',
    population: 101032
  },
  {
    ridingCode: 24016,
    ridingNameEnglish: 'Brome--Missisquoi',
    ridingNameFrench: 'Brome--Missisquoi',
    population: 103457
  },
  {
    ridingCode: 24017,
    ridingNameEnglish: 'Brossard--Saint-Lambert',
    ridingNameFrench: 'Brossard--Saint-Lambert',
    population: 107582
  },
  {
    ridingCode: 24018,
    ridingNameEnglish: 'Rimouski-Neigette--T�miscouata--Les Basques',
    ridingNameFrench: 'Rimouski-Neigette--T�miscouata--Les Basques',
    population: 84918
  },
  {
    ridingCode: 24019,
    ridingNameEnglish: 'Charlesbourg--Haute-Saint-Charles',
    ridingNameFrench: 'Charlesbourg--Haute-Saint-Charles',
    population: 107254
  },
  {
    ridingCode: 24020,
    ridingNameEnglish: "Beauport-C�te-de-Beaupr�-�le d'Orl�ans-Charlevoix",
    ridingNameFrench: "Beauport-C�te-de-Beaupr�-�le d'Orl�ans-Charlevoix",
    population: 93674
  },
  {
    ridingCode: 24021,
    ridingNameEnglish: 'Ch�teauguay--Lacolle',
    ridingNameFrench: 'Ch�teauguay--Lacolle',
    population: 97887
  },
  {
    ridingCode: 24022,
    ridingNameEnglish: 'Chicoutimi--Le Fjord',
    ridingNameFrench: 'Chicoutimi--Le Fjord',
    population: 81639
  },
  {
    ridingCode: 24023,
    ridingNameEnglish: 'Compton--Stanstead',
    ridingNameFrench: 'Compton--Stanstead',
    population: 105459
  },
  {
    ridingCode: 24024,
    ridingNameEnglish: 'Dorval--Lachine--LaSalle',
    ridingNameFrench: 'Dorval--Lachine--LaSalle',
    population: 112866
  },
  {
    ridingCode: 24025,
    ridingNameEnglish: 'Drummond',
    ridingNameFrench: 'Drummond',
    population: 103397
  },
  {
    ridingCode: 24026,
    ridingNameEnglish: 'Gasp�sie--Les �les-de-la-Madeleine',
    ridingNameFrench: 'Gasp�sie--Les �les-de-la-Madeleine',
    population: 75850
  },
  {
    ridingCode: 24027,
    ridingNameEnglish: 'Gatineau',
    ridingNameFrench: 'Gatineau',
    population: 107464
  },
  {
    ridingCode: 24028,
    ridingNameEnglish: 'Hochelaga',
    ridingNameFrench: 'Hochelaga',
    population: 106496
  },
  {
    ridingCode: 24029,
    ridingNameEnglish: 'Honor�-Mercier',
    ridingNameFrench: 'Honor�-Mercier',
    population: 103592
  },
  {
    ridingCode: 24030,
    ridingNameEnglish: 'Hull--Aylmer',
    ridingNameFrench: 'Hull--Aylmer',
    population: 105419
  },
  {
    ridingCode: 24031,
    ridingNameEnglish: 'Joliette',
    ridingNameFrench: 'Joliette',
    population: 104136
  },
  {
    ridingCode: 24032,
    ridingNameEnglish: 'Jonqui�re',
    ridingNameFrench: 'Jonqui�re',
    population: 89818
  },
  {
    ridingCode: 24033,
    ridingNameEnglish: "La Pointe-de-l'�le",
    ridingNameFrench: "La Pointe-de-l'�le",
    population: 106336
  },
  {
    ridingCode: 24034,
    ridingNameEnglish: 'La Prairie',
    ridingNameFrench: 'La Prairie',
    population: 105496
  },
  {
    ridingCode: 24035,
    ridingNameEnglish: 'Lac-Saint-Jean',
    ridingNameFrench: 'Lac-Saint-Jean',
    population: 104911
  },
  {
    ridingCode: 24036,
    ridingNameEnglish: 'Lac-Saint-Louis',
    ridingNameFrench: 'Lac-Saint-Louis',
    population: 108579
  },
  {
    ridingCode: 24037,
    ridingNameEnglish: 'LaSalle--�mard--Verdun',
    ridingNameFrench: 'LaSalle--�mard--Verdun',
    population: 106766
  },
  {
    ridingCode: 24038,
    ridingNameEnglish: 'Laurentides--Labelle',
    ridingNameFrench: 'Laurentides--Labelle',
    population: 113815
  },
  {
    ridingCode: 24039,
    ridingNameEnglish: 'Laurier--Sainte-Marie',
    ridingNameFrench: 'Laurier--Sainte-Marie',
    population: 111835
  },
  {
    ridingCode: 24040,
    ridingNameEnglish: 'Laval--Les �les',
    ridingNameFrench: 'Laval--Les �les',
    population: 108003
  },
  {
    ridingCode: 24041,
    ridingNameEnglish: 'Longueuil--Charles-LeMoyne',
    ridingNameFrench: 'Longueuil--Charles-LeMoyne',
    population: 106583
  },
  {
    ridingCode: 24042,
    ridingNameEnglish: 'L�vis--Lotbini�re',
    ridingNameFrench: 'L�vis--Lotbini�re',
    population: 113528
  },
  {
    ridingCode: 24043,
    ridingNameEnglish: 'Longueuil--Saint-Hubert',
    ridingNameFrench: 'Longueuil--Saint-Hubert',
    population: 108703
  },
  {
    ridingCode: 24044,
    ridingNameEnglish: 'Louis-H�bert',
    ridingNameFrench: 'Louis-H�bert',
    population: 103346
  },
  {
    ridingCode: 24045,
    ridingNameEnglish: 'Louis-Saint-Laurent',
    ridingNameFrench: 'Louis-Saint-Laurent',
    population: 117238
  },
  {
    ridingCode: 24046,
    ridingNameEnglish: 'Manicouagan',
    ridingNameFrench: 'Manicouagan',
    population: 92518
  },
  {
    ridingCode: 24047,
    ridingNameEnglish: "M�gantic--L'�rable",
    ridingNameFrench: "M�gantic--L'�rable",
    population: 87233
  },
  {
    ridingCode: 24048,
    ridingNameEnglish: 'Mirabel',
    ridingNameFrench: 'Mirabel',
    population: 117652
  },
  {
    ridingCode: 24049,
    ridingNameEnglish: 'Montarville',
    ridingNameFrench: 'Montarville',
    population: 97811
  },
  {
    ridingCode: 24050,
    ridingNameEnglish: 'Montcalm',
    ridingNameFrench: 'Montcalm',
    population: 107981
  },
  {
    ridingCode: 24051,
    ridingNameEnglish: "Montmagny--L'Islet--Kamouraska--Rivi�re-du-Loup",
    ridingNameFrench: "Montmagny--L'Islet--Kamouraska--Rivi�re-du-Loup",
    population: 95527
  },
  {
    ridingCode: 24052,
    ridingNameEnglish: 'Mount Royal',
    ridingNameFrench: 'Mont-Royal',
    population: 103320
  },
  {
    ridingCode: 24053,
    ridingNameEnglish: 'Notre-Dame-de-Gr�ce--Westmount',
    ridingNameFrench: 'Notre-Dame-de-Gr�ce--Westmount',
    population: 104974
  },
  {
    ridingCode: 24054,
    ridingNameEnglish: 'Outremont',
    ridingNameFrench: 'Outremont',
    population: 102088
  },
  {
    ridingCode: 24055,
    ridingNameEnglish: 'Papineau',
    ridingNameFrench: 'Papineau',
    population: 110750
  },
  {
    ridingCode: 24056,
    ridingNameEnglish: 'Pierrefonds--Dollard',
    ridingNameFrench: 'Pierrefonds--Dollard',
    population: 108587
  },
  {
    ridingCode: 24057,
    ridingNameEnglish: 'Pontiac',
    ridingNameFrench: 'Pontiac',
    population: 115531
  },
  {
    ridingCode: 24058,
    ridingNameEnglish: 'Portneuf--Jacques-Cartier',
    ridingNameFrench: 'Portneuf--Jacques-Cartier',
    population: 115313
  },
  {
    ridingCode: 24059,
    ridingNameEnglish: 'Qu�bec',
    ridingNameFrench: 'Qu�bec',
    population: 97143
  },
  {
    ridingCode: 24060,
    ridingNameEnglish: 'Repentigny',
    ridingNameFrench: 'Repentigny',
    population: 116066
  },
  {
    ridingCode: 24061,
    ridingNameEnglish: 'Richmond--Arthabaska',
    ridingNameFrench: 'Richmond--Arthabaska',
    population: 107242
  },
  {
    ridingCode: 24062,
    ridingNameEnglish: 'Rivi�re-des-Mille-�les',
    ridingNameFrench: 'Rivi�re-des-Mille-�les',
    population: 102346
  },
  {
    ridingCode: 24063,
    ridingNameEnglish: 'Rivi�re-du-Nord',
    ridingNameFrench: 'Rivi�re-du-Nord',
    population: 112156
  },
  {
    ridingCode: 24064,
    ridingNameEnglish: 'Rosemont--La Petite-Patrie',
    ridingNameFrench: 'Rosemont--La Petite-Patrie',
    population: 110677
  },
  {
    ridingCode: 24065,
    ridingNameEnglish: 'Marc-Aur�le-Fortin',
    ridingNameFrench: 'Marc-Aur�le-Fortin',
    population: 101750
  },
  {
    ridingCode: 24066,
    ridingNameEnglish: 'Saint-Hyacinthe--Bagot',
    ridingNameFrench: 'Saint-Hyacinthe--Bagot',
    population: 102693
  },
  {
    ridingCode: 24067,
    ridingNameEnglish: 'Saint-Jean',
    ridingNameFrench: 'Saint-Jean',
    population: 111190
  },
  {
    ridingCode: 24068,
    ridingNameEnglish: 'Saint-Laurent',
    ridingNameFrench: 'Saint-Laurent',
    population: 98828
  },
  {
    ridingCode: 24069,
    ridingNameEnglish: 'Saint-L�onard--Saint-Michel',
    ridingNameFrench: 'Saint-L�onard--Saint-Michel',
    population: 113212
  },
  {
    ridingCode: 24070,
    ridingNameEnglish: 'Saint-Maurice--Champlain',
    ridingNameFrench: 'Saint-Maurice--Champlain',
    population: 110264
  },
  {
    ridingCode: 24071,
    ridingNameEnglish: 'Salaberry--Suro�t',
    ridingNameFrench: 'Salaberry--Suro�t',
    population: 112826
  },
  {
    ridingCode: 24072,
    ridingNameEnglish: 'Shefford',
    ridingNameFrench: 'Shefford',
    population: 111139
  },
  {
    ridingCode: 24073,
    ridingNameEnglish: 'Sherbrooke',
    ridingNameFrench: 'Sherbrooke',
    population: 111176
  },
  {
    ridingCode: 24074,
    ridingNameEnglish: 'Vaudreuil--Soulanges',
    ridingNameFrench: 'Vaudreuil--Soulanges',
    population: 119227
  },
  {
    ridingCode: 24075,
    ridingNameEnglish: 'Terrebonne',
    ridingNameFrench: 'Terrebonne',
    population: 111575
  },
  {
    ridingCode: 24076,
    ridingNameEnglish: 'Trois-Rivi�res',
    ridingNameFrench: 'Trois-Rivi�res',
    population: 110515
  },
  {
    ridingCode: 24077,
    ridingNameEnglish: 'Ville-Marie--Le Sud-Ouest--�le-des-Soeurs',
    ridingNameFrench: 'Ville-Marie--Le Sud-Ouest--�le-des-Soeurs',
    population: 114659
  },
  {
    ridingCode: 24078,
    ridingNameEnglish: 'Vimy',
    ridingNameFrench: 'Vimy',
    population: 111867
  },
  {
    ridingCode: 35001,
    ridingNameEnglish: 'Ajax',
    ridingNameFrench: 'Ajax',
    population: 119677
  },
  {
    ridingCode: 35002,
    ridingNameEnglish: 'Algoma--Manitoulin--Kapuskasing',
    ridingNameFrench: 'Algoma--Manitoulin--Kapuskasing',
    population: 79483
  },
  {
    ridingCode: 35003,
    ridingNameEnglish: 'Aurora--Oak Ridges--Richmond Hill',
    ridingNameFrench: 'Aurora--Oak Ridges--Richmond Hill',
    population: 115227
  },
  {
    ridingCode: 35004,
    ridingNameEnglish: 'Barrie--Innisfil',
    ridingNameFrench: 'Barrie--Innisfil',
    population: 109286
  },
  {
    ridingCode: 35005,
    ridingNameEnglish: 'Barrie--Springwater--Oro-Medonte',
    ridingNameFrench: 'Barrie--Springwater--Oro-Medonte',
    population: 100788
  },
  {
    ridingCode: 35006,
    ridingNameEnglish: 'Bay of Quinte',
    ridingNameFrench: 'Baie de Quinte',
    population: 109735
  },
  {
    ridingCode: 35007,
    ridingNameEnglish: 'Beaches--East York',
    ridingNameFrench: 'Beaches--East York',
    population: 109468
  },
  {
    ridingCode: 35008,
    ridingNameEnglish: 'Brampton Centre',
    ridingNameFrench: 'Brampton-Centre',
    population: 102270
  },
  {
    ridingCode: 35009,
    ridingNameEnglish: 'Brampton East',
    ridingNameFrench: 'Brampton-Est',
    population: 122000
  },
  {
    ridingCode: 35010,
    ridingNameEnglish: 'Brampton North',
    ridingNameFrench: 'Brampton-Nord',
    population: 118180
  },
  {
    ridingCode: 35011,
    ridingNameEnglish: 'Brampton South',
    ridingNameFrench: 'Brampton-Sud',
    population: 121188
  },
  {
    ridingCode: 35012,
    ridingNameEnglish: 'Brampton West',
    ridingNameFrench: 'Brampton-Ouest',
    population: 130000
  },
  {
    ridingCode: 35013,
    ridingNameEnglish: 'Brantford--Brant',
    ridingNameFrench: 'Brantford--Brant',
    population: 130296
  },
  {
    ridingCode: 35014,
    ridingNameEnglish: 'Bruce--Grey--Owen Sound',
    ridingNameFrench: 'Bruce--Grey--Owen Sound',
    population: 107679
  },
  {
    ridingCode: 35015,
    ridingNameEnglish: 'Burlington',
    ridingNameFrench: 'Burlington',
    population: 123180
  },
  {
    ridingCode: 35016,
    ridingNameEnglish: 'Cambridge',
    ridingNameFrench: 'Cambridge',
    population: 115463
  },
  {
    ridingCode: 35017,
    ridingNameEnglish: 'Chatham-Kent--Leamington',
    ridingNameFrench: 'Chatham-Kent--Leamington',
    population: 109619
  },
  {
    ridingCode: 35018,
    ridingNameEnglish: 'Davenport',
    ridingNameFrench: 'Davenport',
    population: 108473
  },
  {
    ridingCode: 35019,
    ridingNameEnglish: 'Don Valley East',
    ridingNameFrench: 'Don Valley-Est',
    population: 94579
  },
  {
    ridingCode: 35020,
    ridingNameEnglish: 'Don Valley North',
    ridingNameFrench: 'Don Valley-Nord',
    population: 110076
  },
  {
    ridingCode: 35021,
    ridingNameEnglish: 'Don Valley West',
    ridingNameFrench: 'Don Valley-Ouest',
    population: 102508
  },
  {
    ridingCode: 35022,
    ridingNameEnglish: 'Dufferin--Caledon',
    ridingNameFrench: 'Dufferin--Caledon',
    population: 128237
  },
  {
    ridingCode: 35023,
    ridingNameEnglish: 'Durham',
    ridingNameFrench: 'Durham',
    population: 130872
  },
  {
    ridingCode: 35024,
    ridingNameEnglish: 'Eglinton--Lawrence',
    ridingNameFrench: 'Eglinton--Lawrence',
    population: 114395
  },
  {
    ridingCode: 35025,
    ridingNameEnglish: 'Elgin--Middlesex--London',
    ridingNameFrench: 'Elgin--Middlesex--London',
    population: 115052
  },
  {
    ridingCode: 35026,
    ridingNameEnglish: 'Essex',
    ridingNameFrench: 'Essex',
    population: 125442
  },
  {
    ridingCode: 35027,
    ridingNameEnglish: 'Etobicoke Centre',
    ridingNameFrench: 'Etobicoke-Centre',
    population: 118022
  },
  {
    ridingCode: 35028,
    ridingNameEnglish: 'Etobicoke--Lakeshore',
    ridingNameFrench: 'Etobicoke--Lakeshore',
    population: 129081
  },
  {
    ridingCode: 35029,
    ridingNameEnglish: 'Etobicoke North',
    ridingNameFrench: 'Etobicoke-Nord',
    population: 118040
  },
  {
    ridingCode: 35030,
    ridingNameEnglish: 'Flamborough--Glanbrook',
    ridingNameFrench: 'Flamborough--Glanbrook',
    population: 111065
  },
  {
    ridingCode: 35031,
    ridingNameEnglish: 'Glengarry--Prescott--Russell',
    ridingNameFrench: 'Glengarry--Prescott--Russell',
    population: 109975
  },
  {
    ridingCode: 35032,
    ridingNameEnglish: 'Guelph',
    ridingNameFrench: 'Guelph',
    population: 131794
  },
  {
    ridingCode: 35033,
    ridingNameEnglish: 'Haldimand--Norfolk',
    ridingNameFrench: 'Haldimand--Norfolk',
    population: 109652
  },
  {
    ridingCode: 35034,
    ridingNameEnglish: 'Haliburton--Kawartha Lakes--Brock',
    ridingNameFrench: 'Haliburton--Kawartha Lakes--Brock',
    population: 113956
  },
  {
    ridingCode: 35035,
    ridingNameEnglish: 'Hamilton Centre',
    ridingNameFrench: 'Hamilton-Centre',
    population: 100103
  },
  {
    ridingCode: 35036,
    ridingNameEnglish: 'Hamilton East--Stoney Creek',
    ridingNameFrench: 'Hamilton-Est--Stoney Creek',
    population: 107848
  },
  {
    ridingCode: 35037,
    ridingNameEnglish: 'Hamilton Mountain',
    ridingNameFrench: 'Hamilton Mountain',
    population: 104877
  },
  {
    ridingCode: 35038,
    ridingNameEnglish: 'Hamilton West--Ancaster--Dundas',
    ridingNameFrench: 'Hamilton-Ouest--Ancaster--Dundas',
    population: 113024
  },
  {
    ridingCode: 35039,
    ridingNameEnglish: 'Hastings--Lennox and Addington',
    ridingNameFrench: 'Hastings--Lennox and Addington',
    population: 94333
  },
  {
    ridingCode: 35040,
    ridingNameEnglish: 'Huron--Bruce',
    ridingNameFrench: 'Huron--Bruce',
    population: 106570
  },
  {
    ridingCode: 35041,
    ridingNameEnglish: 'Kanata--Carleton',
    ridingNameFrench: 'Kanata--Carleton',
    population: 110960
  },
  {
    ridingCode: 35042,
    ridingNameEnglish: 'Kenora',
    ridingNameFrench: 'Kenora',
    population: 62556
  },
  {
    ridingCode: 35043,
    ridingNameEnglish: 'King--Vaughan',
    ridingNameFrench: 'King--Vaughan',
    population: 131995
  },
  {
    ridingCode: 35044,
    ridingNameEnglish: 'Kingston and the Islands',
    ridingNameFrench: 'Kingston et les �les',
    population: 117543
  },
  {
    ridingCode: 35045,
    ridingNameEnglish: 'Kitchener Centre',
    ridingNameFrench: 'Kitchener-Centre',
    population: 105258
  },
  {
    ridingCode: 35046,
    ridingNameEnglish: 'Kitchener--Conestoga',
    ridingNameFrench: 'Kitchener--Conestoga',
    population: 100709
  },
  {
    ridingCode: 35047,
    ridingNameEnglish: 'Kitchener South--Hespeler',
    ridingNameFrench: 'Kitchener-Sud--Hespeler',
    population: 105309
  },
  {
    ridingCode: 35048,
    ridingNameEnglish: 'Lambton--Kent--Middlesex',
    ridingNameFrench: 'Lambton--Kent--Middlesex',
    population: 105331
  },
  {
    ridingCode: 35049,
    ridingNameEnglish: 'Lanark--Frontenac--Kingston',
    ridingNameFrench: 'Lanark--Frontenac--Kingston',
    population: 101630
  },
  {
    ridingCode: 35050,
    ridingNameEnglish: 'Leeds-Grenville-Thousand Islands and Rideau Lakes',
    ridingNameFrench: 'Leeds-Grenville-Thousand Islands et Rideau Lakes',
    population: 100546
  },
  {
    ridingCode: 35051,
    ridingNameEnglish: 'London--Fanshawe',
    ridingNameFrench: 'London--Fanshawe',
    population: 119467
  },
  {
    ridingCode: 35052,
    ridingNameEnglish: 'London North Centre',
    ridingNameFrench: 'London-Centre-Nord',
    population: 125362
  },
  {
    ridingCode: 35053,
    ridingNameEnglish: 'London West',
    ridingNameFrench: 'London-Ouest',
    population: 126110
  },
  {
    ridingCode: 35054,
    ridingNameEnglish: 'Markham--Stouffville',
    ridingNameFrench: 'Markham--Stouffville',
    population: 126064
  },
  {
    ridingCode: 35055,
    ridingNameEnglish: 'Markham--Thornhill',
    ridingNameFrench: 'Markham--Thornhill',
    population: 99078
  },
  {
    ridingCode: 35056,
    ridingNameEnglish: 'Markham--Unionville',
    ridingNameFrench: 'Markham--Unionville',
    population: 123318
  },
  {
    ridingCode: 35057,
    ridingNameEnglish: 'Milton',
    ridingNameFrench: 'Milton',
    population: 114093
  },
  {
    ridingCode: 35058,
    ridingNameEnglish: 'Mississauga Centre',
    ridingNameFrench: 'Mississauga-Centre',
    population: 124849
  },
  {
    ridingCode: 35059,
    ridingNameEnglish: 'Mississauga East--Cooksville',
    ridingNameFrench: 'Mississauga-Est--Cooksville',
    population: 120205
  },
  {
    ridingCode: 35060,
    ridingNameEnglish: 'Mississauga--Erin Mills',
    ridingNameFrench: 'Mississauga--Erin Mills',
    population: 122560
  },
  {
    ridingCode: 35061,
    ridingNameEnglish: 'Mississauga--Lakeshore',
    ridingNameFrench: 'Mississauga--Lakeshore',
    population: 117444
  },
  {
    ridingCode: 35062,
    ridingNameEnglish: 'Mississauga--Malton',
    ridingNameFrench: 'Mississauga--Malton',
    population: 118240
  },
  {
    ridingCode: 35063,
    ridingNameEnglish: 'Mississauga--Streetsville',
    ridingNameFrench: 'Mississauga--Streetsville',
    population: 118301
  },
  {
    ridingCode: 35064,
    ridingNameEnglish: 'Nepean',
    ridingNameFrench: 'Nepean',
    population: 119110
  },
  {
    ridingCode: 35065,
    ridingNameEnglish: 'Newmarket--Aurora',
    ridingNameFrench: 'Newmarket--Aurora',
    population: 117418
  },
  {
    ridingCode: 35066,
    ridingNameEnglish: 'Niagara Centre',
    ridingNameFrench: 'Niagara-Centre',
    population: 109067
  },
  {
    ridingCode: 35067,
    ridingNameEnglish: 'Niagara Falls',
    ridingNameFrench: 'Niagara Falls',
    population: 136292
  },
  {
    ridingCode: 35068,
    ridingNameEnglish: 'Niagara West',
    ridingNameFrench: 'Niagara-Ouest',
    population: 90838
  },
  {
    ridingCode: 35069,
    ridingNameEnglish: 'Nickel Belt',
    ridingNameFrench: 'Nickel Belt',
    population: 93772
  },
  {
    ridingCode: 35070,
    ridingNameEnglish: 'Nipissing--Timiskaming',
    ridingNameFrench: 'Nipissing--Timiskaming',
    population: 88813
  },
  {
    ridingCode: 35071,
    ridingNameEnglish: 'Northumberland--Peterborough South',
    ridingNameFrench: 'Northumberland--Peterborough-Sud',
    population: 112412
  },
  {
    ridingCode: 35072,
    ridingNameEnglish: 'Oakville',
    ridingNameFrench: 'Oakville',
    population: 120923
  },
  {
    ridingCode: 35073,
    ridingNameEnglish: 'Oakville North--Burlington',
    ridingNameFrench: 'Oakville-Nord--Burlington',
    population: 129078
  },
  {
    ridingCode: 35074,
    ridingNameEnglish: 'Oshawa',
    ridingNameFrench: 'Oshawa',
    population: 126764
  },
  {
    ridingCode: 35075,
    ridingNameEnglish: 'Ottawa Centre',
    ridingNameFrench: 'Ottawa-Centre',
    population: 118038
  },
  {
    ridingCode: 35076,
    ridingNameEnglish: 'Orl�ans',
    ridingNameFrench: 'Orl�ans',
    population: 128281
  },
  {
    ridingCode: 35077,
    ridingNameEnglish: 'Ottawa South',
    ridingNameFrench: 'Ottawa-Sud',
    population: 121058
  },
  {
    ridingCode: 35078,
    ridingNameEnglish: 'Ottawa--Vanier',
    ridingNameFrench: 'Ottawa--Vanier',
    population: 111508
  },
  {
    ridingCode: 35079,
    ridingNameEnglish: 'Ottawa West--Nepean',
    ridingNameFrench: 'Ottawa-Ouest--Nepean',
    population: 111837
  },
  {
    ridingCode: 35080,
    ridingNameEnglish: 'Oxford',
    ridingNameFrench: 'Oxford',
    population: 113790
  },
  {
    ridingCode: 35081,
    ridingNameEnglish: 'Parkdale--High Park',
    ridingNameFrench: 'Parkdale--High Park',
    population: 108805
  },
  {
    ridingCode: 35082,
    ridingNameEnglish: 'Parry Sound--Muskoka',
    ridingNameFrench: 'Parry Sound--Muskoka',
    population: 94398
  },
  {
    ridingCode: 35083,
    ridingNameEnglish: 'Perth--Wellington',
    ridingNameFrench: 'Perth--Wellington',
    population: 107908
  },
  {
    ridingCode: 35084,
    ridingNameEnglish: 'Peterborough--Kawartha',
    ridingNameFrench: 'Peterborough--Kawartha',
    population: 118176
  },
  {
    ridingCode: 35085,
    ridingNameEnglish: 'Pickering--Uxbridge',
    ridingNameFrench: 'Pickering--Uxbridge',
    population: 112947
  },
  {
    ridingCode: 35086,
    ridingNameEnglish: 'Renfrew--Nipissing--Pembroke',
    ridingNameFrench: 'Renfrew--Nipissing--Pembroke',
    population: 103495
  },
  {
    ridingCode: 35087,
    ridingNameEnglish: 'Richmond Hill',
    ridingNameFrench: 'Richmond Hill',
    population: 110177
  },
  {
    ridingCode: 35088,
    ridingNameEnglish: 'Carleton',
    ridingNameFrench: 'Carleton',
    population: 102918
  },
  {
    ridingCode: 35089,
    ridingNameEnglish: 'St. Catharines',
    ridingNameFrench: 'St. Catharines',
    population: 111691
  },
  {
    ridingCode: 35090,
    ridingNameEnglish: "Toronto--St. Paul's",
    ridingNameFrench: "Toronto--St. Paul's",
    population: 107900
  },
  {
    ridingCode: 35091,
    ridingNameEnglish: 'Sarnia--Lambton',
    ridingNameFrench: 'Sarnia--Lambton',
    population: 105337
  },
  {
    ridingCode: 35092,
    ridingNameEnglish: 'Sault Ste. Marie',
    ridingNameFrench: 'Sault Ste. Marie',
    population: 80371
  },
  {
    ridingCode: 35093,
    ridingNameEnglish: 'Scarborough--Agincourt',
    ridingNameFrench: 'Scarborough--Agincourt',
    population: 105542
  },
  {
    ridingCode: 35094,
    ridingNameEnglish: 'Scarborough Centre',
    ridingNameFrench: 'Scarborough-Centre',
    population: 112603
  },
  {
    ridingCode: 35095,
    ridingNameEnglish: 'Scarborough--Guildwood',
    ridingNameFrench: 'Scarborough--Guildwood',
    population: 102386
  },
  {
    ridingCode: 35096,
    ridingNameEnglish: 'Scarborough North',
    ridingNameFrench: 'Scarborough-Nord',
    population: 98800
  },
  {
    ridingCode: 35097,
    ridingNameEnglish: 'Scarborough--Rouge Park',
    ridingNameFrench: 'Scarborough--Rouge Park',
    population: 102275
  },
  {
    ridingCode: 35098,
    ridingNameEnglish: 'Scarborough Southwest',
    ridingNameFrench: 'Scarborough-Sud-Ouest',
    population: 110278
  },
  {
    ridingCode: 35099,
    ridingNameEnglish: 'Simcoe--Grey',
    ridingNameFrench: 'Simcoe--Grey',
    population: 129944
  },
  {
    ridingCode: 35100,
    ridingNameEnglish: 'Simcoe North',
    ridingNameFrench: 'Simcoe-Nord',
    population: 111332
  },
  {
    ridingCode: 35101,
    ridingNameEnglish: 'Spadina--Fort York',
    ridingNameFrench: 'Spadina--Fort York',
    population: 115506
  },
  {
    ridingCode: 35102,
    ridingNameEnglish: 'Stormont--Dundas--South Glengarry',
    ridingNameFrench: 'Stormont--Dundas--South Glengarry',
    population: 103320
  },
  {
    ridingCode: 35103,
    ridingNameEnglish: 'Sudbury',
    ridingNameFrench: 'Sudbury',
    population: 91532
  },
  {
    ridingCode: 35104,
    ridingNameEnglish: 'Thornhill',
    ridingNameFrench: 'Thornhill',
    population: 112719
  },
  {
    ridingCode: 35105,
    ridingNameEnglish: 'Thunder Bay--Rainy River',
    ridingNameFrench: 'Thunder Bay--Rainy River',
    population: 82805
  },
  {
    ridingCode: 35106,
    ridingNameEnglish: 'Thunder Bay--Superior North',
    ridingNameFrench: 'Thunder Bay--Sup�rieur-Nord',
    population: 82651
  },
  {
    ridingCode: 35107,
    ridingNameEnglish: 'Timmins--James Bay',
    ridingNameFrench: 'Timmins--Baie James',
    population: 83257
  },
  {
    ridingCode: 35108,
    ridingNameEnglish: 'Toronto Centre',
    ridingNameFrench: 'Toronto-Centre',
    population: 103805
  },
  {
    ridingCode: 35109,
    ridingNameEnglish: 'Toronto--Danforth',
    ridingNameFrench: 'Toronto--Danforth',
    population: 106875
  },
  {
    ridingCode: 35110,
    ridingNameEnglish: 'University--Rosedale',
    ridingNameFrench: 'University--Rosedale',
    population: 104311
  },
  {
    ridingCode: 35111,
    ridingNameEnglish: 'Vaughan--Woodbridge',
    ridingNameFrench: 'Vaughan--Woodbridge',
    population: 105228
  },
  {
    ridingCode: 35112,
    ridingNameEnglish: 'Waterloo',
    ridingNameFrench: 'Waterloo',
    population: 110134
  },
  {
    ridingCode: 35113,
    ridingNameEnglish: 'Wellington--Halton Hills',
    ridingNameFrench: 'Wellington--Halton Hills',
    population: 120981
  },
  {
    ridingCode: 35114,
    ridingNameEnglish: 'Whitby',
    ridingNameFrench: 'Whitby',
    population: 128377
  },
  {
    ridingCode: 35115,
    ridingNameEnglish: 'Willowdale',
    ridingNameFrench: 'Willowdale',
    population: 118801
  },
  {
    ridingCode: 35116,
    ridingNameEnglish: 'Windsor--Tecumseh',
    ridingNameFrench: 'Windsor--Tecumseh',
    population: 117429
  },
  {
    ridingCode: 35117,
    ridingNameEnglish: 'Windsor West',
    ridingNameFrench: 'Windsor-Ouest',
    population: 122988
  },
  {
    ridingCode: 35118,
    ridingNameEnglish: 'York Centre',
    ridingNameFrench: 'York-Centre',
    population: 104319
  },
  {
    ridingCode: 35119,
    ridingNameEnglish: 'York--Simcoe',
    ridingNameFrench: 'York--Simcoe',
    population: 104010
  },
  {
    ridingCode: 35120,
    ridingNameEnglish: 'York South--Weston',
    ridingNameFrench: 'York-Sud--Weston',
    population: 116686
  },
  {
    ridingCode: 35121,
    ridingNameEnglish: 'Humber River--Black Creek',
    ridingNameFrench: 'Humber River--Black Creek',
    population: 108037
  },
  {
    ridingCode: 46001,
    ridingNameEnglish: 'Brandon--Souris',
    ridingNameFrench: 'Brandon--Souris',
    population: 88170
  },
  {
    ridingCode: 46002,
    ridingNameEnglish: 'Charleswood--St. James--Assiniboia--Headingley',
    ridingNameFrench: 'Charleswood--St. James--Assiniboia--Headingley',
    population: 82574
  },
  {
    ridingCode: 46003,
    ridingNameEnglish: 'Churchill--Keewatinook Aski',
    ridingNameFrench: 'Churchill--Keewatinook Aski',
    population: 87027
  },
  {
    ridingCode: 46004,
    ridingNameEnglish: 'Dauphin--Swan River--Neepawa',
    ridingNameFrench: 'Dauphin--Swan River--Neepawa',
    population: 87527
  },
  {
    ridingCode: 46005,
    ridingNameEnglish: 'Elmwood--Transcona',
    ridingNameFrench: 'Elmwood--Transcona',
    population: 92738
  },
  {
    ridingCode: 46006,
    ridingNameEnglish: 'Kildonan--St. Paul',
    ridingNameFrench: 'Kildonan--St. Paul',
    population: 84077
  },
  {
    ridingCode: 46007,
    ridingNameEnglish: 'Portage--Lisgar',
    ridingNameFrench: 'Portage--Lisgar',
    population: 97354
  },
  {
    ridingCode: 46008,
    ridingNameEnglish: 'Provencher',
    ridingNameFrench: 'Provencher',
    population: 99946
  },
  {
    ridingCode: 46009,
    ridingNameEnglish: 'Saint Boniface--Saint Vital',
    ridingNameFrench: 'Saint-Boniface--Saint-Vital',
    population: 89818
  },
  {
    ridingCode: 46010,
    ridingNameEnglish: 'Selkirk--Interlake--Eastman',
    ridingNameFrench: 'Selkirk--Interlake--Eastman',
    population: 94778
  },
  {
    ridingCode: 46011,
    ridingNameEnglish: 'Winnipeg Centre',
    ridingNameFrench: 'Winnipeg-Centre',
    population: 85949
  },
  {
    ridingCode: 46012,
    ridingNameEnglish: 'Winnipeg North',
    ridingNameFrench: 'Winnipeg-Nord',
    population: 95676
  },
  {
    ridingCode: 46013,
    ridingNameEnglish: 'Winnipeg South',
    ridingNameFrench: 'Winnipeg-Sud',
    population: 99678
  },
  {
    ridingCode: 46014,
    ridingNameEnglish: 'Winnipeg South Centre',
    ridingNameFrench: 'Winnipeg-Centre-Sud',
    population: 93053
  },
  {
    ridingCode: 47001,
    ridingNameEnglish: 'Battlefords--Lloydminster',
    ridingNameFrench: 'Battlefords--Lloydminster',
    population: 73506
  },
  {
    ridingCode: 47002,
    ridingNameEnglish: 'Cypress Hills--Grasslands',
    ridingNameFrench: 'Cypress Hills--Grasslands',
    population: 68353
  },
  {
    ridingCode: 47003,
    ridingNameEnglish: 'Desneth�--Missinippi--Churchill River',
    ridingNameFrench: 'Desneth�--Missinippi--Rivi�re Churchill',
    population: 70891
  },
  {
    ridingCode: 47004,
    ridingNameEnglish: 'Carlton Trail--Eagle Creek',
    ridingNameFrench: 'Sentier Carlton--Eagle Creek',
    population: 80662
  },
  {
    ridingCode: 47005,
    ridingNameEnglish: 'Moose Jaw--Lake Centre--Lanigan',
    ridingNameFrench: 'Moose Jaw--Lake Centre--Lanigan',
    population: 79733
  },
  {
    ridingCode: 47006,
    ridingNameEnglish: 'Prince Albert',
    ridingNameFrench: 'Prince Albert',
    population: 79625
  },
  {
    ridingCode: 47007,
    ridingNameEnglish: 'Regina--Lewvan',
    ridingNameFrench: 'Regina--Lewvan',
    population: 92426
  },
  {
    ridingCode: 47008,
    ridingNameEnglish: "Regina--Qu'Appelle",
    ridingNameFrench: "Regina--Qu'Appelle",
    population: 76017
  },
  {
    ridingCode: 47009,
    ridingNameEnglish: 'Regina--Wascana',
    ridingNameFrench: 'Regina--Wascana',
    population: 84153
  },
  {
    ridingCode: 47010,
    ridingNameEnglish: 'Saskatoon--Grasswood',
    ridingNameFrench: 'Saskatoon--Grasswood',
    population: 82946
  },
  {
    ridingCode: 47011,
    ridingNameEnglish: 'Saskatoon--University',
    ridingNameFrench: 'Saskatoon--University',
    population: 82663
  },
  {
    ridingCode: 47012,
    ridingNameEnglish: 'Saskatoon West',
    ridingNameFrench: 'Saskatoon-Ouest',
    population: 83711
  },
  {
    ridingCode: 47013,
    ridingNameEnglish: 'Souris--Moose Mountain',
    ridingNameFrench: 'Souris--Moose Mountain',
    population: 72635
  },
  {
    ridingCode: 47014,
    ridingNameEnglish: 'Yorkton--Melville',
    ridingNameFrench: 'Yorkton--Melville',
    population: 71031
  },
  {
    ridingCode: 48001,
    ridingNameEnglish: 'Banff--Airdrie',
    ridingNameFrench: 'Banff--Airdrie',
    population: 135762
  },
  {
    ridingCode: 48002,
    ridingNameEnglish: 'Battle River--Crowfoot',
    ridingNameFrench: 'Battle River--Crowfoot',
    population: 110223
  },
  {
    ridingCode: 48003,
    ridingNameEnglish: 'Bow River',
    ridingNameFrench: 'Bow River',
    population: 115022
  },
  {
    ridingCode: 48004,
    ridingNameEnglish: 'Calgary Centre',
    ridingNameFrench: 'Calgary-Centre',
    population: 119176
  },
  {
    ridingCode: 48005,
    ridingNameEnglish: 'Calgary Confederation',
    ridingNameFrench: 'Calgary Confederation',
    population: 122023
  },
  {
    ridingCode: 48006,
    ridingNameEnglish: 'Calgary Forest Lawn',
    ridingNameFrench: 'Calgary Forest Lawn',
    population: 111830
  },
  {
    ridingCode: 48007,
    ridingNameEnglish: 'Calgary Heritage',
    ridingNameFrench: 'Calgary Heritage',
    population: 112087
  },
  {
    ridingCode: 48008,
    ridingNameEnglish: 'Calgary Midnapore',
    ridingNameFrench: 'Calgary Midnapore',
    population: 121844
  },
  {
    ridingCode: 48009,
    ridingNameEnglish: 'Calgary Nose Hill',
    ridingNameFrench: 'Calgary Nose Hill',
    population: 115795
  },
  {
    ridingCode: 48010,
    ridingNameEnglish: 'Calgary Rocky Ridge',
    ridingNameFrench: 'Calgary Rocky Ridge',
    population: 131823
  },
  {
    ridingCode: 48011,
    ridingNameEnglish: 'Calgary Shepard',
    ridingNameFrench: 'Calgary Shepard',
    population: 147520
  },
  {
    ridingCode: 48012,
    ridingNameEnglish: 'Calgary Signal Hill',
    ridingNameFrench: 'Calgary Signal Hill',
    population: 121392
  },
  {
    ridingCode: 48013,
    ridingNameEnglish: 'Calgary Skyview',
    ridingNameFrench: 'Calgary Skyview',
    population: 135730
  },
  {
    ridingCode: 48014,
    ridingNameEnglish: 'Edmonton Centre',
    ridingNameFrench: 'Edmonton-Centre',
    population: 109941
  },
  {
    ridingCode: 48015,
    ridingNameEnglish: 'Edmonton Griesbach',
    ridingNameFrench: 'Edmonton Griesbach',
    population: 112287
  },
  {
    ridingCode: 48016,
    ridingNameEnglish: 'Edmonton Manning',
    ridingNameFrench: 'Edmonton Manning',
    population: 121048
  },
  {
    ridingCode: 48017,
    ridingNameEnglish: 'Edmonton Mill Woods',
    ridingNameFrench: 'Edmonton Mill Woods',
    population: 118561
  },
  {
    ridingCode: 48018,
    ridingNameEnglish: 'Edmonton Riverbend',
    ridingNameFrench: 'Edmonton Riverbend',
    population: 120863
  },
  {
    ridingCode: 48019,
    ridingNameEnglish: 'Edmonton Strathcona',
    ridingNameFrench: 'Edmonton Strathcona',
    population: 106066
  },
  {
    ridingCode: 48020,
    ridingNameEnglish: 'Edmonton West',
    ridingNameFrench: 'Edmonton-Ouest',
    population: 121869
  },
  {
    ridingCode: 48021,
    ridingNameEnglish: 'Edmonton--Wetaskiwin',
    ridingNameFrench: 'Edmonton--Wetaskiwin',
    population: 158749
  },
  {
    ridingCode: 48022,
    ridingNameEnglish: 'Foothills',
    ridingNameFrench: 'Foothills',
    population: 113227
  },
  {
    ridingCode: 48023,
    ridingNameEnglish: 'Fort McMurray--Cold Lake',
    ridingNameFrench: 'Fort McMurray--Cold Lake',
    population: 110230
  },
  {
    ridingCode: 48024,
    ridingNameEnglish: 'Grande Prairie--Mackenzie',
    ridingNameFrench: 'Grande Prairie--Mackenzie',
    population: 117327
  },
  {
    ridingCode: 48025,
    ridingNameEnglish: 'Lakeland',
    ridingNameFrench: 'Lakeland',
    population: 108451
  },
  {
    ridingCode: 48026,
    ridingNameEnglish: 'Lethbridge',
    ridingNameFrench: 'Lethbridge',
    population: 117394
  },
  {
    ridingCode: 48027,
    ridingNameEnglish: 'Medicine Hat--Cardston--Warner',
    ridingNameFrench: 'Medicine Hat--Cardston--Warner',
    population: 106896
  },
  {
    ridingCode: 48028,
    ridingNameEnglish: 'Peace River--Westlock',
    ridingNameFrench: 'Peace River--Westlock',
    population: 109965
  },
  {
    ridingCode: 48029,
    ridingNameEnglish: 'Red Deer--Mountain View',
    ridingNameFrench: 'Red Deer--Mountain View',
    population: 119019
  },
  {
    ridingCode: 48030,
    ridingNameEnglish: 'Red Deer--Lacombe',
    ridingNameFrench: 'Red Deer--Lacombe',
    population: 128786
  },
  {
    ridingCode: 48031,
    ridingNameEnglish: 'St. Albert--Edmonton',
    ridingNameFrench: 'St. Albert--Edmonton',
    population: 121313
  },
  {
    ridingCode: 48032,
    ridingNameEnglish: 'Sherwood Park--Fort Saskatchewan',
    ridingNameFrench: 'Sherwood Park--Fort Saskatchewan',
    population: 122193
  },
  {
    ridingCode: 48033,
    ridingNameEnglish: 'Sturgeon River--Parkland',
    ridingNameFrench: 'Sturgeon River--Parkland',
    population: 120784
  },
  {
    ridingCode: 48034,
    ridingNameEnglish: 'Yellowhead',
    ridingNameFrench: 'Yellowhead',
    population: 101979
  },
  {
    ridingCode: 59001,
    ridingNameEnglish: 'Abbotsford',
    ridingNameFrench: 'Abbotsford',
    population: 101814
  },
  {
    ridingCode: 59002,
    ridingNameEnglish: 'Burnaby North--Seymour',
    ridingNameFrench: 'Burnaby-Nord--Seymour',
    population: 102486
  },
  {
    ridingCode: 59003,
    ridingNameEnglish: 'Burnaby South',
    ridingNameFrench: 'Burnaby-Sud',
    population: 111973
  },
  {
    ridingCode: 59004,
    ridingNameEnglish: 'Cariboo--Prince George',
    ridingNameFrench: 'Cariboo--Prince George',
    population: 108907
  },
  {
    ridingCode: 59005,
    ridingNameEnglish: 'Central Okanagan--Similkameen--Nicola',
    ridingNameFrench: 'Central Okanagan--Similkameen--Nicola',
    population: 110293
  },
  {
    ridingCode: 59006,
    ridingNameEnglish: 'Chilliwack--Hope',
    ridingNameFrench: 'Chilliwack--Hope',
    population: 100126
  },
  {
    ridingCode: 59007,
    ridingNameEnglish: 'Cloverdale--Langley City',
    ridingNameFrench: 'Cloverdale--Langley City',
    population: 117640
  },
  {
    ridingCode: 59008,
    ridingNameEnglish: 'Coquitlam--Port Coquitlam',
    ridingNameFrench: 'Coquitlam--Port Coquitlam',
    population: 123576
  },
  {
    ridingCode: 59009,
    ridingNameEnglish: 'Courtenay--Alberni',
    ridingNameFrench: 'Courtenay--Alberni',
    population: 114647
  },
  {
    ridingCode: 59010,
    ridingNameEnglish: 'Cowichan--Malahat--Langford',
    ridingNameFrench: 'Cowichan--Malahat--Langford',
    population: 108052
  },
  {
    ridingCode: 59011,
    ridingNameEnglish: 'Delta',
    ridingNameFrench: 'Delta',
    population: 103064
  },
  {
    ridingCode: 59012,
    ridingNameEnglish: 'Fleetwood--Port Kells',
    ridingNameFrench: 'Fleetwood--Port Kells',
    population: 116958
  },
  {
    ridingCode: 59013,
    ridingNameEnglish: 'Kamloops--Thompson--Cariboo',
    ridingNameFrench: 'Kamloops--Thompson--Cariboo',
    population: 124358
  },
  {
    ridingCode: 59014,
    ridingNameEnglish: 'Kelowna--Lake Country',
    ridingNameFrench: 'Kelowna--Lake Country',
    population: 119388
  },
  {
    ridingCode: 59015,
    ridingNameEnglish: 'Kootenay--Columbia',
    ridingNameFrench: 'Kootenay--Columbia',
    population: 112354
  },
  {
    ridingCode: 59016,
    ridingNameEnglish: 'Langley--Aldergrove',
    ridingNameFrench: 'Langley--Aldergrove',
    population: 117017
  },
  {
    ridingCode: 59017,
    ridingNameEnglish: 'Mission--Matsqui--Fraser Canyon',
    ridingNameFrench: 'Mission--Matsqui--Fraser Canyon',
    population: 94825
  },
  {
    ridingCode: 59018,
    ridingNameEnglish: 'Nanaimo--Ladysmith',
    ridingNameFrench: 'Nanaimo--Ladysmith',
    population: 122710
  },
  {
    ridingCode: 59019,
    ridingNameEnglish: 'New Westminster--Burnaby',
    ridingNameFrench: 'New Westminster--Burnaby',
    population: 115340
  },
  {
    ridingCode: 59020,
    ridingNameEnglish: 'North Okanagan--Shuswap',
    ridingNameFrench: 'North Okanagan--Shuswap',
    population: 124605
  },
  {
    ridingCode: 59021,
    ridingNameEnglish: 'North Vancouver',
    ridingNameFrench: 'North Vancouver',
    population: 115344
  },
  {
    ridingCode: 59022,
    ridingNameEnglish: 'Pitt Meadows--Maple Ridge',
    ridingNameFrench: 'Pitt Meadows--Maple Ridge',
    population: 101101
  },
  {
    ridingCode: 59023,
    ridingNameEnglish: 'Port Moody--Coquitlam',
    ridingNameFrench: 'Port Moody--Coquitlam',
    population: 110817
  },
  {
    ridingCode: 59024,
    ridingNameEnglish: 'Prince George--Peace River--Northern Rockies',
    ridingNameFrench: 'Prince George--Peace River--Northern Rockies',
    population: 110995
  },
  {
    ridingCode: 59025,
    ridingNameEnglish: 'Richmond Centre',
    ridingNameFrench: 'Richmond-Centre',
    population: 98396
  },
  {
    ridingCode: 59026,
    ridingNameEnglish: 'Esquimalt--Saanich--Sooke',
    ridingNameFrench: 'Esquimalt--Saanich--Sooke',
    population: 120834
  },
  {
    ridingCode: 59027,
    ridingNameEnglish: 'Saanich--Gulf Islands',
    ridingNameFrench: 'Saanich--Gulf Islands',
    population: 107339
  },
  {
    ridingCode: 59028,
    ridingNameEnglish: 'Skeena--Bulkley Valley',
    ridingNameFrench: 'Skeena--Bulkley Valley',
    population: 88920
  },
  {
    ridingCode: 59029,
    ridingNameEnglish: 'South Okanagan--West Kootenay',
    ridingNameFrench: 'Okanagan-Sud--Kootenay-Ouest',
    population: 114695
  },
  {
    ridingCode: 59030,
    ridingNameEnglish: 'South Surrey--White Rock',
    ridingNameFrench: 'Surrey-Sud--White Rock',
    population: 104051
  },
  {
    ridingCode: 59031,
    ridingNameEnglish: 'Steveston--Richmond East',
    ridingNameFrench: 'Steveston--Richmond-Est',
    population: 99913
  },
  {
    ridingCode: 59032,
    ridingNameEnglish: 'Surrey Centre',
    ridingNameFrench: 'Surrey-Centre',
    population: 120172
  },
  {
    ridingCode: 59033,
    ridingNameEnglish: 'Surrey--Newton',
    ridingNameFrench: 'Surrey--Newton',
    population: 114605
  },
  {
    ridingCode: 59034,
    ridingNameEnglish: 'Vancouver Centre',
    ridingNameFrench: 'Vancouver-Centre',
    population: 116443
  },
  {
    ridingCode: 59035,
    ridingNameEnglish: 'Vancouver East',
    ridingNameFrench: 'Vancouver-Est',
    population: 115724
  },
  {
    ridingCode: 59036,
    ridingNameEnglish: 'Vancouver Granville',
    ridingNameFrench: 'Vancouver Granville',
    population: 103456
  },
  {
    ridingCode: 59037,
    ridingNameEnglish: 'North Island--Powell River',
    ridingNameFrench: 'North Island--Powell River',
    population: 105466
  },
  {
    ridingCode: 59038,
    ridingNameEnglish: 'Vancouver Kingsway',
    ridingNameFrench: 'Vancouver Kingsway',
    population: 104870
  },
  {
    ridingCode: 59039,
    ridingNameEnglish: 'Vancouver Quadra',
    ridingNameFrench: 'Vancouver Quadra',
    population: 105608
  },
  {
    ridingCode: 59040,
    ridingNameEnglish: 'Vancouver South',
    ridingNameFrench: 'Vancouver-Sud',
    population: 102927
  },
  {
    ridingCode: 59041,
    ridingNameEnglish: 'Victoria',
    ridingNameFrench: 'Victoria',
    population: 117133
  },
  {
    ridingCode: 59042,
    ridingNameEnglish: 'West Vancouver--Sunshine Coast--Sea to Sky Country',
    ridingNameFrench: 'West Vancouver--Sunshine Coast--Sea to Sky Country',
    population: 119113
  },
  {
    ridingCode: 60001,
    ridingNameEnglish: 'Yukon',
    ridingNameFrench: 'Yukon',
    population: 35874
  },
  {
    ridingCode: 61001,
    ridingNameEnglish: 'Northwest Territories',
    ridingNameFrench: 'Territoires du Nord-Ouest',
    population: 41786
  },
  {
    ridingCode: 62001,
    ridingNameEnglish: 'Nunavut',
    ridingNameFrench: 'Nunavut',
    population: 35944
  }
]

module.exports = ridingCodes
