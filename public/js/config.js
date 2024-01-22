const images = {
  blocks: {
    barrier: '/blocks/barrier',
    strong: '/blocks/strong',
    weak: '/blocks/weak',
    spike: '/blocks/spike',
    floor: '/blocks/floor',
    void: '/blocks/void',
    gold: '/blocks/gold',
    fire: '/blocks/fire',
    friendlyfire: '/blocks/friendlyfire',
    airstrike: '/blocks/airstrike',
    friendlyairstrike: '/blocks/friendlyairstrike',
  },
  bullets: {
    //normal: '/bullets/normal', no image yet :(
    shotgun: '/bullets/shotgun',
    powermissle: '/bullets/powermissle',
    healmissle: '/bullets/healmissle',
    megamissle: '/bullets/megamissle',
    grapple: '/bullets/grapple',
    dynamite: '/bullets/dynamite',
    fire: '/bullets/fire',
    usb: '/bullets/usb',
  },
  tanks: {
    buff: '/tanks/buff',
    reflect: '/tanks/reflect',
    base: '/tanks/base',
    destroyed: '/tanks/destroyed',
    top: '/tanks/top',
    bottom: '/tanks/bottom',
    bottom2: '/tanks/bottom2',
  },
  cosmetics: {
    'DarkMemeGod': '/cosmetics/meme',
    'LostKing': '/cosmetics/Jonas',
    'hacker_hoodie': '/cosmetics/hacker_hoodie',
    'totem': '/cosmetics/totem',
    'venomeme': '/cosmetics/venomeme',
    'carnage': '/cosmetics/carnage',
    'Venominator': '/cosmetics/Venominator',
    'brain': '/cosmetics/brain',
    'hands': '/cosmetics/hands',
    'silver': '/cosmetics/silver',
    'UnionJack': '/cosmetics/UnionJack',
    'SKOTTISH': '/cosmetics/SKOTTISH',
    'Purple helment': '/cosmetics/purple_helment',
    'scoped': '/cosmetics/scoped',
    'Aaron': '/cosmetics/aaron',
    'Astronaut': '/cosmetics/astronaut',
    'Onfire': '/cosmetics/onfire',
    'Assassin': '/cosmetics/assassin',
    'Redsus': '/cosmetics/redsus',
    'Venom': '/cosmetics/venom',
    'Blue Tint': '/cosmetics/blue_tint',
    'Purple Flower': '/cosmetics/purple_flower',
    'Leaf': '/cosmetics/leaf',
    'Basketball': '/cosmetics/basketball',
    'Purple Top Hat': '/cosmetics/purple_top_hat',
    'Terminator': '/cosmetics/terminator',
    'Dizzy': '/cosmetics/dizzy',
    'Katana': '/cosmetics/katana',
    'Knife': '/cosmetics/knife',
    'oneeye': '/cosmetics/oneeye',
    'Scared': '/cosmetics/scared',
    'Laff': '/cosmetics/laff',
    'Hacker Hoodie': '/cosmetics/hacker_hoodie',
    'Error': '/cosmetics/error',
    'Purple Grad Hat': '/cosmetics/purple_grad_hat',
    'Bat Wings': '/cosmetics/bat_wings',
    'Back Button': '/cosmetics/back',
    'Fisher Hat': '/cosmetics/fisher_hat',
    'Kill = Ban': '/cosmetics/ban',
    'Blue Ghost': '/cosmetics/blue_ghost',
    'Pumpkin Face': '/cosmetics/pumpkin_face',
    'Pumpkin Hat': '/cosmetics/pumpkin_hat',
    'Red Ghost': '/cosmetics/red_ghost',
    'Candy Corn': '/cosmetics/candy_corn',
    'Yellow Pizza': '/cosmetics/yellow_pizza',
    'Orange Ghost': '/cosmetics/orange_ghost',
    'Pink Ghost': '/cosmetics/pink_ghost',
    'Paleontologist': '/cosmetics/paleontologist',
    'Yellow Hoodie': '/cosmetics/yellow_hoodie',
    'bluekatana': '/cosmetics/bluekatana',
    'X': '/cosmetics/x',
    'Sweat': '/cosmetics/sweat',
    'Gold Shield': '/cosmetics/gold_shield',
    'Spirals': '/cosmetics/spirals',
    'Spikes': '/cosmetics/spikes',
    'Rudolph': '/cosmetics/rudolph',
    'Reindeer Hat': '/cosmetics/reindeer_hat',
    'Red Hoodie': '/cosmetics/red_hoodie',
    'Question Mark': '/cosmetics/question_mark',
    'Purple-Pink Hoodie': '/cosmetics/purplepink_hoodie',
    'Purple Hoodie': '/cosmetics/purple_hoodie',
    'Pumpkin': '/cosmetics/pumpkin',
    'Pickle': '/cosmetics/pickle',
    'Orange Hoodie': '/cosmetics/orange_hoodie',
    'Helment': '/cosmetics/helment',
    'Green Hoodie': '/cosmetics/green_hoodie',
    'Exclaimation Point': '/cosmetics/exclaimation_point',
    'Eggplant': '/cosmetics/eggplant',
    'Devil Wings': '/cosmetics/devils_wings',
    'Christmas Tree': '/cosmetics/christmas_tree',
    'Christmas Lights': '/cosmetics/christmas_lights',
    'Checkmark': '/cosmetics/checkmark',
    'Cat Hat': '/cosmetics/cat_hat',
    'Blueberry': '/cosmetics/blueberry',
    'Blue Hoodie': '/cosmetics/blue_hoodie',
    'Blue Helment': '/cosmetics/blue_helment',
    'Banana': '/cosmetics/bannana',
    'Aqua Helment': '/cosmetics/aqua_helment',
    'Apple': '/cosmetics/apple',
    'Hoodie': '/cosmetics/hoodie',
    'Purple Helment': '/cosmetics/purple_helment',
    'Angel Wings': '/cosmetics/angel_wings',
    'Boost': '/cosmetics/boost',
    'Bunny Ears': '/cosmetics/bunny_ears',
    'Cake': '/cosmetics/cake',
    'Cancelled': '/cosmetics/cancelled',
    'Candy Cane': '/cosmetics/candy_cane',
    'Cat Ears': '/cosmetics/cat_ears',
    'Christmas Hat': '/cosmetics/christmas_hat',
    'Controller': '/cosmetics/controller',
    'Deep Scratch': '/cosmetics/deep_scratch',
    'Devil Horns': '/cosmetics/devil_horn',
    'Headphones': '/cosmetics/earmuffs',
    'Eyebrows': '/cosmetics/eyebrows',
    'First Aid': '/cosmetics/first_aid',
    'Flag': '/cosmetics/flag',
    'Halo': '/cosmetics/halo',
    'Hax': '/cosmetics/hax',
    'Low Battery': '/cosmetics/low_battery',
    'Mini Tank': '/cosmetics/mini_tank',
    'MLG Glasses': '/cosmetics/mlg_glasses',
    'Money Eyes': '/cosmetics/money_eyes',
    'No Mercy': '/cosmetics/no_mercy',
    'Peace': '/cosmetics/peace',
    'Police': '/cosmetics/police',
    'Question Mark': '/cosmetics/question_mark',
    'Rage': '/cosmetics/rage',
    'Small Scratch': '/cosmetics/small_scratch',
    'Speaker': '/cosmetics/speaker',
    'Swords': '/cosmetics/swords',
    'Tools': '/cosmetics/tools',
    'Top Hat': '/cosmetics/top_hat',
    'Uno Reverse': '/cosmetics/uno_reverse',
    'Mask': '/cosmetics/victim',
    'Present': '/cosmetics/present',
    'Blind': '/cosmetics/blind',
    'Gold': '/cosmetics/gold',
    'Box': '/cosmetics/box',
    'Straw Hat': '/cosmetics/strawhat',
    'Evil Eyes': '/cosmetics/evileye',
    'Black': '/cosmetics/black',
    'Lego': '/cosmetics/lego',
    'Dead': '/cosmetics/dead',
    "PWR-DMG'S HELM": '/cosmetics/pwr-dmg-helm',
    'Sun Roof': '/cosmetics/sunroof',
    'Army': '/cosmetics/army',
    'Peashooter': '/cosmetics/peashooter',
    'America': '/cosmetics/america',
    'Stamp': '/cosmetics/stamp',
    'Triple Gun': '/cosmetics/triplegun',
    'Hard Hat': '/cosmetics/hardhat',
    'Elf': '/cosmetics/elf',
    'Spooked': '/cosmetics/spooked',
    'Locked': '/cosmetics/locked',
    'Angry Eyes': '/cosmetics/angryeyes',
    'Cute Eyes': '/cosmetics/cuteeyes',
    'Stripes': '/cosmetics/stripe',
    'Hazard': '/cosmetics/hazard',
    'Anime Eyes': '/cosmetics/animeeyes',
  },
  menus: {
    ui: '/menus/ui',
    start: '/menus/start',
    main: '/menus/main',
    multiplayer: '/menus/multiplayer',
    singleplayer: '/menus/singleplayer',
    singleplayer2: '/menus/singleplayer2',
    victory: '/menus/victory',
    defeat: '/menus/defeat',
    crate: '/menus/crate',
    //settings: '/menus/settings',
    keybinds: '/menus/keybinds',
    inventory: '/menus/inventory',
    classTab: '/menus/classTab',
    itemTab: '/menus/itemTab',
    cosmeticTab: '/menus/cosmeticTab', // FIX DUPLICATE USELESS(deathEffecs and cosmetic tab referenceing same imagoge);
    deathEffectsTab: '/menus/cosmeticTab',
    shop: '/menus/shop',
    broke: '/menus/broke',
    htp1: '/menus/htp1',
    htp2: '/menus/htp2',
    htp3: '/menus/htp3',
    htp4: '/menus/htp4',
    pause: '/menus/pause',
    help: '/menus/help',
    helpinventory: '/menus/helpinventory',
    helpcosmetic: '/menus/helpcosmetic',
    helpclass: '/menus/helpclass',
    helpmode: '/menus/helpmode',
    helpvocab: '/menus/helpvocab',
    helpteam: '/menus/helpteam',
  },
  animations: {
    tape: '/animations/tape',
    tape_: { frames: 17, speed: 50 },
    toolkit: '/animations/toolkit',
    toolkit_: { frames: 16, speed: 50 },
    glu: '/animations/glu',
    glu_: { frames: 45, speed: 50 },
    heal: '/animations/heal',
    heal_: { frames: 16, speed: 25 },
    fire: '/animations/fire',
    fire_: { frames: 1, speed: 50 },
    text: '/animations/text',
    text_: { frames: 37, speed: 50 },
    explosion: '/animations/explosion',
    healexplosion: '/animations/healexplosion',
  },
  deathEffects: {
    explode: '/animations/explode',
    explode_: { frames: 17, speed: 75, kill: 8, type: 1 },
    clicked: '/animations/clicked',
    clicked_: { frames: 29, speed: 75, kill: 28, type: 2 },
    amogus: '/animations/amogus',
    amogus_: { frames: 47, speed: 75, kill: 21, type: 1 },
    nuke: '/animations/nuke',
    nuke_: { frames: 26, speed: 75, kill: 12, type: 1 },
    error: '/animations/error',
    error_: { frames: 10, speed: 250, kill: 10, type: 2 },
    magic: '/animations/magic',
    magic_: { frames: 69, speed: 50, kill: 51, type: 2 },
    /*securly: '/animations/securly',
    securly_: {frames: 1, speed: 9900, kill: 1, type: 3},*/
    anvil: '/animations/anvil',
    anvil_: { frames: 22, speed: 75, kill: 6, type: 1 },
    insta: '/animations/insta',
    insta_: { frames: 22, speed: 75, kill: 21, type: 1 },
    mechagodzilla: '/animations/mechagodzilla',
    mechagodzilla_: { frames: 23, speed: 75, kill: 12, type: 1 },
    fix: '/animations/fix',
    fix_: { frames: 4, speed: 250, kill: 4, type: 1 },
    plant: '/animations/plant',
    plant_: { frames: 4, speed: 250, kill: 4, type: 1 },
    knight: '/animations/knight',
    knight_: { frames: 4, speed: 100, kill: 4, type: 1 },
    cat: '/animations/cat',
    cat_: { frames: 2, speed: 500, kill: 2, type: 1 },
    crate: '/animations/crate',
    crate_: { frames: 31, speed: 75, kill: 21, type: 2 },
    battery: '/animations/battery',
    battery_: { frames: 55, speed: 75, kill: 54, type: 2 },
    evan: '/animations/evan',
    evan_: { frames: 8, speed: 500, kill: 7, type: 1 },
    minecraft: '/animations/minecraft',
    minecraft_: { frames: 22, speed: 100, kill: 15, type: 2 },
    enderman: '/animations/enderman',
    enderman_: { frames: 4, speed: 500, kill: 3, type: 2 },
    wakawaka: '/animations/wakawaka',
    wakawaka_: { frames: 27, speed: 75, kill: 13, type: 2 },
    erase: '/animations/erase',
    erase_: { frames: 28, speed: 75, kill: 18, type: 2 },
    gameover: '/animations/gameover',
    gameover_: { frames: 40, speed: 75, kill: 1, type: 2 },
    ghost: '/animations/ghost',
    ghost_: { frames: 13, speed: 75, kill: 1, type: 1 },
    pokeball: '/animations/pokeball',
    pokeball_: { frames: 85, speed: 50, kill: 18, type: 2 },
  },
  items: {
    airstrike: '/items/airstrike',
    duck_tape: '/items/duck-tape',
    super_glu: '/items/super-glu',
    shield: '/items/shield',
    flashbang: '/items/flashbang',
    bomb: '/items/bomb',
    dynamite: '/items/dynamite',
    weak: '/items/weak',
    strong: '/items/strong',
    spike: '/items/spike',
    reflector: '/items/reflector',
    usb: '/items/usb',
    toolkitui: '/items/toolkitui',
    boostui: '/items/boostui',
    powermissleui: '/items/powermissleui',
    tacticalui: '/items/tacticalui',
    stealthui: '/items/stealthui',
    builderui: '/items/builderui',
    warriorui: '/items/warriorui',
    medicui: '/items/medicui',
    fireui: '/items/fireui',
  }
};
