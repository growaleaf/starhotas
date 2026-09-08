// StarHOTAS data — every number below traces to a source_url a pilot can open and check.
// buttons/axes/hats = physical input slots on the controller (or matched pair, for a HOSAS entry).
// core_functions = bindable actions in that category, hand-counted from the cited default-keybind
// list, limited to the categories a given ship role's pilot seat actually uses (see each role's
// sources — a ship-fact page confirms which systems that role's pilot controls; the keybind mirror
// gives the per-category action count).

const CONTROLLERS = [
  {
    id: "t16000m-fcs-hotas",
    name: "Thrustmaster T.16000M FCS HOTAS",
    note: "joystick + TWCS Throttle bundle",
    layout: "HOTAS",
    buttons: 30,
    axes: 5,
    hats: 2,
    sources: [
      { label: "Thrustmaster — T.16000M FCS HOTAS product page", url: "https://www.thrustmaster.com/en-us/products/t-16000m-fcs-hotas/" }
    ]
  },
  {
    id: "hotas-warthog",
    name: "Thrustmaster HOTAS Warthog",
    note: "flight stick + dual throttle",
    layout: "HOTAS",
    buttons: 36,
    axes: 6,
    hats: 5,
    sources: [
      { label: "Thrustmaster — HOTAS Warthog Flight Stick product page", url: "https://www.thrustmaster.com/en-us/products/hotas-warthog-flight-stick/" },
      { label: "Thrustmaster — HOTAS Warthog Dual Throttle product page", url: "https://www.thrustmaster.com/en-us/products/hotas-warthog-dual-throttle/" }
    ]
  },
  {
    id: "t-flight-hotas-4",
    name: "Thrustmaster T-Flight HOTAS 4",
    note: "joystick + throttle, entry-level",
    layout: "HOTAS",
    buttons: 12,
    axes: 5,
    hats: 0,
    sources: [
      { label: "Thrustmaster — T-Flight HOTAS 4 product page (via Wayback Machine, captured 2022-01-23; thrustmaster.com under maintenance 2026-09-08): \"HOTAS with 12 action buttons and 5 axes\", no hat switch mentioned. Corrected 2026-09-08 from a prior 15/5/1 figure — the WA-4 ViperFit worker re-verified this product against the archived page and found the button/hat counts wrong.", url: "https://web.archive.org/web/20220123153655/https://www.thrustmaster.com/en-us/products/t-flight-hotas-4/" }
    ]
  },
  {
    id: "logitech-x56",
    name: "Logitech G X56 HOTAS",
    note: "joystick + dual-lever throttle, twin analog mini-sticks",
    layout: "HOTAS",
    buttons: 31,
    axes: 13,
    hats: 5,
    sources: [
      { label: "AVADirect — Logitech G X56 product page (manufacturer spec: \"13 axes, 5 HATS and 31 programmable buttons over three modes\")", url: "https://www.avadirect.com/X56-H-O-T-A-S-RGB-Throttle-and-Stick-Simulation-Controller-for-VR-Gaming/Product/12570552" }
    ]
  },
  {
    id: "hosas-2x-t16000m-fcs",
    name: "2x Thrustmaster T.16000M FCS (matched pair)",
    note: "two identical joysticks bought separately, one per hand — a common budget HOSAS setup, not a factory bundle",
    layout: "HOSAS",
    buttons: 32,
    axes: 8,
    hats: 2,
    sources: [
      { label: "Thrustmaster — T.16000M FCS product page (single unit: 16 buttons, 4 axes, 1 hat — doubled for a matched pair)", url: "https://www.thrustmaster.com/en-us/products/t-16000m-fcs/" }
    ]
  }
];

const CATEGORY_PRIORITY = ["Flight/Maneuvering", "Weapons", "Shields", "Power", "Countermeasures", "Targeting", "Scanning", "Systems (docking/egress/quantum)"];

// Category action-counts hand-counted from the cited keybind mirror (Star Citizen Alpha 4.10,
// captured 2026-09-07): Flight/Maneuvering=Thrust & Movement(9), Weapons=Weapons & Missiles(7),
// Shields=Shield Facing(4), Power=System Toggles+Distribution(8), Countermeasures(3),
// Targeting=Target Lock & Pins(7), Scanning=Scanning Controls(4),
// Systems=Ship Systems(15: power/lights/gear/doors/quantum/egress).
const KEYBIND_SOURCE = {
  label: "Citizen Starter Guide — Star Citizen Keybinds 2026: Full Controls List (Alpha 4.10), captured 2026-09-07",
  url: "https://citizen-starter-guide.com/star-citizen-keybinds/"
};

const ROLES = [
  {
    id: "light-fighter",
    role_name: "Light Fighter",
    example_ships: ["Anvil Arrow", "Aegis Gladius"],
    core_functions: [
      { category: "Flight/Maneuvering", count: 9 },
      { category: "Weapons", count: 7 },
      { category: "Shields", count: 4 },
      { category: "Power", count: 8 },
      { category: "Countermeasures", count: 3 },
      { category: "Targeting", count: 7 }
    ],
    total_core_functions: 38,
    sources: [
      { label: "Star Citizen Wiki — Arrow (Role: Light Fighter; weapons: pair of size 3 wing hardpoints + pilot-controlled top turret + missile racks; Shield 3,168 HP)", url: "https://starcitizen.tools/Arrow" },
      KEYBIND_SOURCE
    ]
  },
  {
    id: "cargo-hauler",
    role_name: "Cargo Hauler",
    example_ships: ["MISC Freelancer MAX", "Drake Caterpillar"],
    core_functions: [
      { category: "Flight/Maneuvering", count: 9 },
      { category: "Weapons", count: 7 },
      { category: "Power", count: 8 },
      { category: "Countermeasures", count: 3 }
    ],
    total_core_functions: 27,
    sources: [
      { label: "Star Citizen Wiki — Freelancer MAX (Role: Medium Freight; pilot directly controls the two side turrets, pair of Size 3 guns each — the rear turret and its Size 2 guns are a separately manned station, not the pilot's)", url: "https://starcitizen.tools/Freelancer_MAX" },
      KEYBIND_SOURCE
    ]
  },
  {
    id: "gunship-pilot",
    role_name: "Multi-crew Gunship — Pilot Seat",
    example_ships: ["RSI Constellation Andromeda"],
    core_functions: [
      { category: "Flight/Maneuvering", count: 9 },
      { category: "Weapons", count: 7 },
      { category: "Shields", count: 4 },
      { category: "Power", count: 8 },
      { category: "Countermeasures", count: 3 }
    ],
    total_core_functions: 31,
    sources: [
      { label: "Star Citizen Wiki — Constellation Andromeda (official Role: \"Gunship / Light Freight\"; pilot fires the four size 5 forward gun hardpoints — the two size 6 manned turrets are separate gunner stations, not the pilot's)", url: "https://starcitizen.tools/Constellation_Andromeda" },
      KEYBIND_SOURCE
    ]
  },
  {
    id: "explorer-scanner",
    role_name: "Explorer / Scanner",
    example_ships: ["Anvil Carrack"],
    core_functions: [
      { category: "Flight/Maneuvering", count: 9 },
      { category: "Scanning", count: 4 },
      { category: "Targeting", count: 7 },
      { category: "Power", count: 8 },
      { category: "Systems (docking/egress/quantum)", count: 15 }
    ],
    total_core_functions: 43,
    sources: [
      { label: "Star Citizen Wiki — Carrack (Role: Expedition; bridge built around \"extensive scanning, mapping, charting sensor suites\"; the pilot seat is the center of 3 lower-bridge seats — the ship's remote top turret is controlled from a separate starboard station, not the pilot's)", url: "https://starcitizen.tools/Carrack" },
      KEYBIND_SOURCE
    ]
  }
];
