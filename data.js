// Data definitions for HOYO-MiX OST Guesser

const TIME_CONTEXTS = [
  { id: 'day', name: 'Siang (Day)', icon: '☀️', desc: 'Suasana cerah, riang, damai' },
  { id: 'night', name: 'Malam (Night)', icon: '🌙', desc: 'Suasana syahdu, hening, tenang' },
  { id: 'battle', name: 'Pertarungan (Combat)', icon: '⚔️', desc: 'Intens, dinamis, boss/field battle' },
  { id: 'indoor', name: 'Indoor / Tavern', icon: '🏛️', desc: 'Kedai, istana, katedral, domain' }
];

const GAMES_DATA = {
  genshin: {
    id: 'genshin',
    name: 'Genshin Impact',
    tagline: 'Teyvat Soundtrack Journey',
    themeColor: '#e0a96d',
    regions: [
      {
        id: 'mondstadt',
        name: 'Mondstadt',
        icon: '🍃',
        element: 'Anemo',
        color: '#74c2a8',
        subAreas: [
          { id: 'city_of_mondstadt', name: 'City of Mondstadt' },
          { id: 'dawn_winery', name: 'Dawn Winery' },
          { id: 'springvale', name: 'Springvale & Windrise' },
          { id: 'dragonspine', name: 'Dragonspine Snowfield' },
          { id: 'stormterror_lair', name: "Stormterror's Lair" }
        ]
      },
      {
        id: 'liyue',
        name: 'Liyue',
        icon: '🪨',
        element: 'Geo',
        color: '#e5ab4c',
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
        icon: '⚡',
        element: 'Electro',
        color: '#ba79e8',
        subAreas: [
          { id: 'inazuma_city', name: 'Inazuma City & Tenshukaku' },
          { id: 'narukami_shrine', name: 'Grand Narukami Shrine' },
          { id: 'watatsumi_island', name: 'Watatsumi Island (Sangonomiya)' },
          { id: 'seirai_island', name: 'Seirai Island' },
          { id: 'tsurumi_island', name: 'Tsurumi Island' },
          { id: 'enkanomiya', name: 'Enkanomiya' }
        ]
      },
      {
        id: 'sumeru',
        name: 'Sumeru',
        icon: '🌿',
        element: 'Dendro',
        color: '#84c74f',
        subAreas: [
          { id: 'sumeru_city', name: 'Sumeru City & Academy' },
          { id: 'port_ormos', name: 'Port Ormos' },
          { id: 'vanarana', name: 'Vanarana (Dream Realm)' },
          { id: 'hypostyle_desert', name: 'Great Red Sand Desert' },
          { id: 'orchard_of_pairidaeza', name: 'Eternal Oasis (Orchard of Pairidaeza)' },
          { id: 'oasis_of_vourukasha', name: 'Vourukasha Oasis' }
        ]
      },
      {
        id: 'fontaine',
        name: 'Fontaine',
        icon: '💧',
        element: 'Hydro',
        color: '#4db7f2',
        subAreas: [
          { id: 'court_of_fontaine', name: 'Court of Fontaine' },
          { id: 'opera_epiclese', name: 'Opera Epiclese' },
          { id: 'meropide', name: 'Fortress of Meropide' },
          { id: 'romaritime_harbor', name: 'Romaritime Harbor' },
          { id: 'underwater_regions', name: 'Fontaine Underwater Domain' },
          { id: 'remuria', name: 'Sea of Bygone Eras (Remuria)' }
        ]
      },
      {
        id: 'natlan',
        name: 'Natlan',
        icon: '🔥',
        element: 'Pyro',
        color: '#f26838',
        subAreas: [
          { id: 'stadium_of_sacred_flame', name: 'Stadium of the Sacred Flame' },
          { id: 'scions_of_the_canopy', name: 'Scions of the Canopy' },
          { id: 'people_of_the_springs', name: 'People of the Springs' },
          { id: 'children_of_echoes', name: 'Children of Echoes' },
          { id: 'ochkanatlan', name: 'Ochkanatlan' }
        ]
      },
      {
        id: 'snezhnaya',
        name: 'Snezhnaya / Special',
        icon: '❄️',
        element: 'Cryo',
        color: '#8be5f5',
        subAreas: [
          { id: 'zapolyarny_palace', name: 'Zapolyarny Palace' },
          { id: 'fatui_encampment', name: 'Harbinger Battle Arenas' },
          { id: 'abyss', name: "Spiral Abyss & Khaenri'ah" }
        ]
      }
    ]
  },
  hsr: {
    id: 'hsr',
    name: 'Honkai: Star Rail',
    tagline: 'Galactic Melodies on the Astral Express',
    themeColor: '#bf84f2',
    regions: [
      {
        id: 'herta_station',
        name: 'Herta Space Station',
        icon: '🛰️',
        color: '#4fa1d8',
        subAreas: [
          { id: 'master_control', name: 'Master Control Zone' },
          { id: 'storage_zone', name: 'Storage Zone' }
        ]
      },
      {
        id: 'jarilo_vi',
        name: 'Jarilo-VI (Belobog)',
        icon: '❄️',
        color: '#65cbe6',
        subAreas: [
          { id: 'administrative_district', name: 'Administrative District (Overworld)' },
          { id: 'boulder_town', name: 'Boulder Town (Underworld)' }
        ]
      },
      {
        id: 'xianzhou_luofu',
        name: 'Xianzhou Luofu',
        icon: '🏮',
        color: '#e59a54',
        subAreas: [
          { id: 'starskiff_haven', name: 'Central Starskiff Haven' },
          { id: 'artisanship_commission', name: 'Artisanship Commission' },
          { id: 'scalegorge_waterscape', name: 'Scalegorge Waterscape' }
        ]
      },
      {
        id: 'penacony',
        name: 'Penacony',
        icon: '🥂',
        color: '#e160a2',
        subAreas: [
          { id: 'golden_hour', name: 'The Golden Hour' },
          { id: 'dream_hotel', name: 'Reverie Dreamscape Hotel' },
          { id: 'clock_studios', name: 'Clock Studios Theme Park' }
        ]
      }
    ]
  },
  zzz: {
    id: 'zzz',
    name: 'Zenless Zone Zero',
    tagline: 'New Eridu Urban Beats',
    themeColor: '#fbbf24',
    regions: [
      {
        id: 'new_eridu',
        name: 'New Eridu City',
        icon: '🏙️',
        color: '#fbbf24',
        subAreas: [
          { id: 'sixth_street', name: 'Sixth Street' },
          { id: 'lumina_square', name: 'Lumina Square' },
          { id: 'ballet_twins', name: 'Ballet Twins Road' },
          { id: 'hollow_zero', name: 'Hollow Zero Core' }
        ]
      }
    ]
  }
};

// Dataset lagu murni menggunakan file audio lokal milik user
const GENSHIN_TRACKS = [
  {
    id: 'track_dragonspine_01',
    title: 'Tales from the Snow Mountain',
    gameId: 'genshin',
    album: 'Vortex of Legends (Dragonspine OST)',
    composer: 'Yu-Peng Chen / HOYO-MiX',
    audioUrl: './songs/Tales from the Snow Mountain_spotdown.org.mp3',
    regionId: 'mondstadt',
    subAreaId: 'dragonspine',
    timeContext: 'day',
    description: 'Melodi dawai emosional dan melankolis yang mengiringi penjelajahan di pegunungan bersalju Dragonspine.',
    tags: ['Dragonspine', 'Snow', 'Emotional', 'Strings', 'Cello']
  },
  {
    id: 'track_sumeru_her_wishes',
    title: 'Her Wishes',
    gameId: 'genshin',
    album: 'The Unfathomable Sand Dunes (Sumeru Desert OST)',
    composer: 'HOYO-MiX',
    audioUrl: './songs/Her Wishes.mp3',
    regionId: 'sumeru',
    subAreaId: 'orchard_of_pairidaeza',
    timeContext: 'day',
    description: 'Melodi suci dan magis di Eternal Oasis (Orchard of Pairidaeza), tempat peristirahatan abadi Goddess of Flowers.',
    tags: ['Sumeru', 'Desert', 'Eternal Oasis', 'Goddess of Flowers', 'Mystic']
  },
  {
    id: 'track_sumeru_lucid_dreams',
    title: 'Those Lucid Dreams',
    gameId: 'genshin',
    album: 'Forest of Jnana and Vidya (Sumeru OST)',
    composer: 'Yu-Peng Chen / HOYO-MiX',
    audioUrl: './songs/Those Lucid Dreams.mp3',
    regionId: 'sumeru',
    subAreaId: 'sumeru_city',
    timeContext: 'night',
    description: 'Melodi malam yang syahdu dan menenangkan di Sumeru City di bawah naungan pohon suci Divine Tree.',
    tags: ['Sumeru', 'Night', 'Sitar', 'Peaceful', 'Sumeru City']
  }
];

// Attach to window for global access
window.HOYOMIX_DATA = {
  GAMES_DATA,
  GENSHIN_TRACKS,
  TIME_CONTEXTS
};
