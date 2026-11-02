const REGION_DATA = {
  "Республика Адыгея": {
    type: "Республика",
    capital: "Майкоп",
    population: 453376,
    area: 7792,
    gdp: null,
    law: "Конституция Республики Адыгея",
    federalDistrict: "Южный",
    timezone: "UTC+3"
  },
  "Республика Алтай": {
    type: "Республика",
    capital: "Горно-Алтайск",
    population: 218063,
    area: 92903,
    gdp: null,
    law: "Конституция Республики Алтай",
    federalDistrict: "Сибирский",
    timezone: "UTC+7"
  },
  "Республика Башкортостан": {
    type: "Республика",
    capital: "Уфа",
    population: 4063293,
    area: 142947,
    gdp: null,
    law: "Конституция Республики Башкортостан",
    federalDistrict: "Приволжский",
    timezone: "UTC+5"
  },
  "Республика Бурятия": {
    type: "Республика",
    capital: "Улан-Удэ",
    population: 984511,
    area: 351334,
    gdp: null,
    law: "Конституция Республики Бурятия",
    federalDistrict: "Дальневосточный",
    timezone: "UTC+8"
  },
  "Республика Дагестан": {
    type: "Республика",
    capital: "Махачкала",
    population: 3063885,
    area: 50270,
    gdp: null,
    law: "Конституция Республики Дагестан",
    federalDistrict: "Северо-Кавказский",
    timezone: "UTC+3"
  },
  "Республика Ингушетия": {
    type: "Республика",
    capital: "Магас",
    population: 488043,
    area: 3123,
    gdp: null,
    law: "Конституция Республики Ингушетия",
    federalDistrict: "Северо-Кавказский",
    timezone: "UTC+3"
  },
  "Кабардино-Балкарская Республика": {
    type: "Республика",
    capital: "Нальчик",
    population: 865828,
    area: 12470,
    gdp: null,
    law: "Конституция Кабардино-Балкарской Республики",
    federalDistrict: "Северо-Кавказский",
    timezone: "UTC+3"
  },
  "Республика Калмыкия": {
    type: "Республика",
    capital: "Элиста",
    population: 275413,
    area: 74731,
    gdp: null,
    law: "Степное Уложение (Конституция) Республики Калмыкия",
    federalDistrict: "Южный",
    timezone: "UTC+3"
  },
  "Карачаево-Черкесская Республика": {
    type: "Республика",
    capital: "Черкесск",
    population: 466305,
    area: 14277,
    gdp: null,
    law: "Конституция Карачаево-Черкесской Республики",
    federalDistrict: "Северо-Кавказский",
    timezone: "UTC+3"
  },
  "Республика Карелия": {
    type: "Республика",
    capital: "Петрозаводск",
    population: 622484,
    area: 180520,
    gdp: null,
    law: "Конституция Республики Карелия",
    federalDistrict: "Северо-Западный",
    timezone: "UTC+3"
  },
  "Республика Коми": {
    type: "Республика",
    capital: "Сыктывкар",
    population: 840873,
    area: 416774,
    gdp: null,
    law: "Конституция Республики Коми",
    federalDistrict: "Северо-Западный",
    timezone: "UTC+3"
  },
  "Республика Крым": {
    type: "Республика",
    capital: "Симферополь",
    population: 1913731,
    area: 26081,
    gdp: null,
    law: "Конституция Республики Крым",
    federalDistrict: "Южный",
    timezone: "UTC+3"
  },
  "Республика Марий Эл": {
    type: "Республика",
    capital: "Йошкар-Ола",
    population: 682333,
    area: 23375,
    gdp: null,
    law: "Конституция Республики Марий Эл",
    federalDistrict: "Приволжский",
    timezone: "UTC+3"
  },
  "Республика Мордовия": {
    type: "Республика",
    capital: "Саранск",
    population: 805056,
    area: 26128,
    gdp: null,
    law: "Конституция Республики Мордовия",
    federalDistrict: "Приволжский",
    timezone: "UTC+3"
  },
  "Республика Саха (Якутия)": {
    type: "Республика",
    capital: "Якутск",
    population: 964330,
    area: 3083523,
    gdp: null,
    law: "Конституция (Основной Закон) Республики Саха (Якутия)",
    federalDistrict: "Дальневосточный",
    timezone: "UTC+9"
  },
  "Республика Северная Осетия — Алания": {
    type: "Республика",
    capital: "Владикавказ",
    population: 701765,
    area: 7987,
    gdp: null,
    law: "Конституция Республики Северная Осетия-Алания",
    federalDistrict: "Северо-Кавказский",
    timezone: "UTC+3"
  },
  "Республика Татарстан": {
    type: "Республика",
    capital: "Казань",
    population: 3894284,
    area: 67847,
    gdp: null,
    law: "Конституция Республики Татарстан",
    federalDistrict: "Приволжский",
    timezone: "UTC+3"
  },
  "Республика Тыва": {
    type: "Республика",
    capital: "Кызыл",
    population: 321722,
    area: 168604,
    gdp: null,
    law: "Конституция Республики Тыва",
    federalDistrict: "Сибирский",
    timezone: "UTC+7"
  },
  "Удмуртская Республика": {
    type: "Республика",
    capital: "Ижевск",
    population: 1513044,
    area: 42061,
    gdp: null,
    law: "Конституция Удмуртской Республики",
    federalDistrict: "Приволжский",
    timezone: "UTC+4"
  },
  "Республика Хакасия": {
    type: "Республика",
    capital: "Абакан",
    population: 537513,
    area: 61569,
    gdp: null,
    law: "Конституция Республики Хакасия",
    federalDistrict: "Сибирский",
    timezone: "UTC+7"
  },
  "Чеченская Республика": {
    type: "Республика",
    capital: "Грозный",
    population: 1436981,
    area: 16171,
    gdp: null,
    law: "Конституция Чеченской Республики",
    federalDistrict: "Северо-Кавказский",
    timezone: "UTC+3"
  },
  "Чувашская Республика": {
    type: "Республика",
    capital: "Чебоксары",
    population: 1231117,
    area: 18343,
    gdp: null,
    law: "Конституция Чувашской Республики",
    federalDistrict: "Приволжский",
    timezone: "UTC+3"
  },

  "Ненецкий автономный округ": {
    type: "Автономный округ",
    capital: "Нарьян-Мар",
    population: 41900,
    area: 176700,
    gdp: null,
    law: "Устав Ненецкого автономного округа",
    federalDistrict: "Северо-Западный",
    timezone: "UTC+3"
  },
  "Ханты-Мансийский автономный округ — Югра": {
    type: "Автономный округ",
    capital: "Ханты-Мансийск",
    population: 1781800,
    area: 534801,
    gdp: null,
    law: "Устав (Основной закон) Ханты-Мансийского автономного округа — Югры",
    federalDistrict: "Уральский",
    timezone: "UTC+5"
  },
  "Чукотский автономный округ": {
    type: "Автономный округ",
    capital: "Анадырь",
    population: 47800,
    area: 721481,
    gdp: null,
    law: "Устав Чукотского автономного округа",
    federalDistrict: "Дальневосточный",
    timezone: "UTC+12"
  },
  "Ямало-Ненецкий автономный округ": {
    type: "Автономный округ",
    capital: "Салехард",
    population: null,
    area: 769250,
    gdp: null,
    law: "Устав (Основной закон) Ямало-Ненецкого автономного округа",
    federalDistrict: "Уральский",
    timezone: "UTC+5"
  },
  "Еврейская автономная область": {
    type: "Автономная область",
    capital: "Биробиджан",
    population: 144400,
    area: 36266,
    gdp: null,
    law: "Устав Еврейской автономной области",
    federalDistrict: "Дальневосточный",
    timezone: "UTC+10"
  },
  "Забайкальский край": {
    type: "Край",
    capital: "Чита",
    population: 983800,
    area: 431892,
    gdp: null,
    law: "Устав Забайкальского края",
    federalDistrict: "Дальневосточный",
    timezone: "UTC+9"
  },
  "Пермский край": {
    type: "Край",
    capital: "Пермь",
    population: 2623122,
    area: 160236,
    gdp: null,
    law: "Устав Пермского края",
    federalDistrict: "Приволжский",
    timezone: "UTC+5"
  },

  // Примеры для остальных типов регионов (заполни по аналогии)
  "Москва": {
    type: "Город федерального значения",
    capital: "Москва",
    population: 13149803,
    area: 2561,
    gdp: null,
    law: "Устав города Москвы",
    federalDistrict: "Центральный",
    timezone: "UTC+3"
  },
  "Санкт-Петербург": {
    type: "Город федерального значения",
    capital: "Санкт-Петербург",
    population: 5652922,
    area: 1439,
    gdp: null,
    law: "Устав Санкт-Петербурга",
    federalDistrict: "Северо-Западный",
    timezone: "UTC+3"
  },
  "Московская область": {
    type: "Область",
    capital: "Красногорск",
    population: 8775735,
    area: 44300,
    gdp: null,
    law: "Устав Московской области",
    federalDistrict: "Центральный",
    timezone: "UTC+3"
  },
  "Краснодарский край": {
    type: "Край",
    capital: "Краснодар",
    population: 5842238,
    area: 75485,
    gdp: null,
    law: "Устав Краснодарского края",
    federalDistrict: "Южный",
    timezone: "UTC+3"
  },
  "Свердловская область": {
    type: "Область",
    capital: "Екатеринбург",
    population: 4221000,
    area: 194307,
    gdp: null,
    law: "Устав Свердловской области",
    federalDistrict: "Уральский",
    timezone: "UTC+5"
  }
};
