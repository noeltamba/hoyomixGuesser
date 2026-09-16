import { GameId, GameInfo, TimeContext } from './types';

export const TIME_CONTEXTS: TimeContext[] = [
  { id: 'day', name: 'Day', desc: 'Daytime exploration' },
  { id: 'night', name: 'Night', desc: 'Nighttime atmosphere' },
  { id: 'battle', name: 'Combat', desc: 'Battle / boss theme' },
  { id: 'indoor', name: 'Indoor', desc: 'Tavern, palace, domain' }
];

export const GAMES_DATA: Record<GameId, GameInfo> = {
  genshin: {
    id: 'genshin',
    name: 'Genshin Impact',
    tagline: 'Teyvat Soundtracks',
    themeColor: '#e0a96d',
    regions: [
      {
        id: 'mondstadt',
        name: 'Mondstadt',
        logo: '/logo/Mondstadt_Emblem_Night.webp',
        subAreas: [
          { id: 'city_of_mondstadt', name: 'City of Mondstadt', image: '/area/mondstat/city_of_mondstadt.webp' },
          { id: 'dawn_winery', name: 'Dawn Winery', image: '/area/mondstat/dawn_winery.webp' },
          { id: 'springvale', name: 'Springvale & Windrise', image: '/area/mondstat/Springvale.webp' },
          { id: 'dragonspine', name: 'Dragonspine', image: '/area/mondstat/Dragonspine.webp' },
          { id: 'stormterror_lair', name: "Stormterror's Lair", image: "/area/mondstat/Stormterror's_Lair.webp" }
        ]
      },
      {
        id: 'liyue',
        name: 'Liyue',
        logo: '/logo/Liyue_Emblem_Night.webp',
        subAreas: [
          { id: 'liyue_harbor', name: 'Liyue Harbor' },
          { id: 'wangshu_inn', name: 'Wangshu Inn' },
          { id: 'qingce_village', name: 'Qingce Village' },
          { id: 'jueyun_karst', name: 'Jueyun Karst & Guyun' },
          { id: 'chasm', name: 'The Chasm' },
          { id: 'chenyu_vale', name: 'Chenyu Vale' }
        ]
      },
      {
        id: 'inazuma',
        name: 'Inazuma',
        logo: '/logo/Inazuma_Emblem_Night.webp',
        subAreas: [
          { id: 'inazuma_city', name: 'Inazuma City & Tenshukaku' },
          { id: 'narukami_shrine', name: 'Grand Narukami Shrine' },
          { id: 'watatsumi_island', name: 'Watatsumi Island' },
          { id: 'seirai_island', name: 'Seirai Island' },
          { id: 'tsurumi_island', name: 'Tsurumi Island' },
          { id: 'yashiori_kannazuka', name: 'Yashiori Island & Tatarasuna' }
        ]
      },
      {
        id: 'sumeru',
        name: 'Sumeru',
        logo: '/logo/Sumeru_Emblem_Night.webp',
        subAreas: [
          { id: 'sumeru_city', name: 'Sumeru City & Akademiya' },
          { id: 'port_ormos', name: 'Port Ormos' },
          { id: 'apam_woods', name: 'Apam Woods & Avidya' },
          { id: 'vanarana', name: 'Vanarana' },
          { id: 'desert_of_hadramaveth', name: 'Hadramaveth Desert' },
          { id: 'orchard_of_pairidaeza', name: 'Eternal Oasis' }
        ]
      },
      {
        id: 'serenitea_pot',
        name: 'Serenitea Pot',
        subtitle: 'Realm Inside',
        logo: '/logo/Simulanka_Emblem_Night.webp',
        subAreas: [
          { id: 'serenitea_pot_mansion', name: 'Adeptal Mansion & Grounds' }
        ]
      },
      {
        id: 'fontaine',
        name: 'Fontaine',
        logo: '/logo/Fontaine_Emblem_Night.webp',
        subAreas: [
          { id: 'court_of_fontaine', name: 'Court of Fontaine & Opera' },
          { id: 'meropide', name: 'Fortress of Meropide' },
          { id: 'erinnyes', name: 'Erinnyes Forest' },
          { id: 'sea_of_bygone_eras', name: 'Sea of Bygone Eras' }
        ]
      },
      {
        id: 'natlan',
        name: 'Natlan',
        logo: '/logo/Natlan_Emblem_Night.webp',
        subAreas: [
          { id: 'stadium_of_the_sacred_flame', name: 'Stadium of Sacred Flame' },
          { id: 'people_of_the_springs', name: 'People of the Springs' },
          { id: 'children_of_echoes', name: 'Children of Echoes' },
          { id: 'ochkanatlan', name: 'Ochkanatlan' }
        ]
      },
      {
        id: 'nod_krai',
        name: 'Nod-Krai',
        logo: '/logo/Nod-Krai_Emblem_Night.webp',
        subAreas: [
          { id: 'nod_krai_main', name: 'Nod-Krai Settlement' }
        ]
      },
      {
        id: 'snezhnaya',
        name: 'Snezhnaya',
        logo: '/logo/Snezhnaya_Emblem_Night.webp',
        subAreas: [
          { id: 'zapolyarny_palace', name: 'Zapolyarny Palace' },
          { id: 'fatui_encampment', name: 'Harbinger Battle Arenas' },
          { id: 'abyss', name: 'Spiral Abyss' }
        ]
      },
      {
        id: 'golden_apple_archipelago',
        name: 'Golden Apple Archipelago',
        subtitle: 'Version 1.6 & 2.8',
        logo: '/logo/Golden_Apple_Archipelago_Emblem_Night.webp',
        subAreas: [
          { id: 'minacious_isle', name: 'Minacious Isle' },
          { id: 'pudding_isle', name: 'Pudding Isle' },
          { id: 'twinning_isle', name: 'Twinning Isle' },
          { id: 'broken_isle', name: 'Broken Isle' },
          { id: 'central_isle', name: 'Central Isle & Waverider' }
        ]
      },
      {
        id: 'veluriyam_mirage',
        name: 'Veluriyam Mirage',
        subtitle: 'Version 3.8',
        logo: '/logo/Veluriyam_Mirage_Emblem_Night.webp',
        subAreas: [
          { id: 'silver_bottle_courtyard', name: 'Silver Bottle Courtyard' },
          { id: 'overgrown_valley', name: 'Overgrown Valley' },
          { id: 'pavilion_of_hermits', name: 'Pavilion of Hermits' },
          { id: 'thinkers_theater', name: "Thinkers' Theater" }
        ]
      },
      {
        id: 'simulanka',
        name: 'Simulanka',
        subtitle: 'Version 4.8',
        logo: '/logo/Simulanka_Emblem_Night.webp',
        subAreas: [
          { id: 'forest_of_blessings', name: 'Forest of Blessings' },
          { id: 'constellation_metropole', name: 'Constellation Metropole' },
          { id: 'broken_sea', name: 'Broken Sea' }
        ]
      },
      {
        id: 'enkanomiya',
        name: 'Enkanomiya',
        logo: '/logo/Enkanomiya_Emblem_Night.webp',
        subAreas: [
          { id: 'dainichi_mikoshi', name: 'The Dainichi Mikoshi' },
          { id: 'the_narrows', name: 'The Narrows' },
          { id: 'evernight_temple', name: 'Evernight Temple' },
          { id: 'serpents_heart', name: "The Serpent's Heart" },
          { id: 'yachimatahiko_locus', name: 'Yachimatahiko Locus' }
        ]
      },
    ]
  },
  hsr: {
    id: 'hsr',
    name: 'Honkai: Star Rail',
    tagline: 'Astral Express Journey',
    themeColor: '#bf84f2',
    regions: []
  },
  zzz: {
    id: 'zzz',
    name: 'Zenless Zone Zero',
    tagline: 'New Eridu Beats',
    themeColor: '#fbbf24',
    regions: []
  }
};
