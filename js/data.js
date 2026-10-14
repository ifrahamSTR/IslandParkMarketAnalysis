/**
 * Content/config layer for the Island Park, ID market & location page
 * (Sections 2-6; no buy boxes yet). Same template as the Galveston, Bend,
 * Gulf Shores and Boone sites, organised around bedroom size: every location
 * comparison is made within a size bucket ("vs. typical" = revenue / market
 * median for that size).
 *
 * Prose and config only. Every number shown is read from js/region_data.js
 * (generated from notebooks/islandpark_overview.ipynb); prose that quotes a
 * number computes it from that data, except the statewide comparison (Idaho
 * STR Revenue Discovery data, Sept 2026) and the researched market facts,
 * which carry their sources. The location question is kept deliberately
 * simple: straight-line distance to Yellowstone's West Entrance, plus five
 * reference areas along US-20.
 */
function photo(relPath, alt, caption) {
  return { file: "assets/" + relPath, alt: alt, caption: caption };
}
const MARKET_NAME = "Island Park, ID";
const _ls = (s, l) => LOCATION.locSize[s][l];
const _area = (name) => LOCATION.areas.find((a) => a.name === name);
const _lad = (s) => LOCATION.ladder.find((r) => r.size === s);
const _x = (c) => fmtX(c.idx);
const _am = (k, s) => LOCATION.amenBySize[k][s];
const _drv = (k) => LOCATION.drivers.find((d) => d.driver === k);
const NEAR = "Under 25 km", MID = "25–35 km", FAR = "35 km+";
const HENRYS = "Henrys Lake", NORTH = "North Island Park", MACKS = "Macks Inn & Big Springs", RES = "Island Park Reservoir", LAST = "Last Chance & Harriman";
const _top = () => Object.values(LOCATION.top10BySize).reduce((a, c) => a + c, 0);

// ---------------------------------------------------------------------------
// Overview (top of page)
// ---------------------------------------------------------------------------
const HERO = {
  title: "In Island Park, Henrys Lake and a fourth bedroom set the rate",
  sub: (() => {
    const h = _area(HENRYS), t = LOCATION.top10BySize;
    return "Of Idaho's ten high-earning STR regions, Island Park earns the most of any with more than a handful of listings: its typical listing makes about 1.8× the statewide median. Bedroom count sets the baseline here (" + (t["4BR"] + t["5BR+"]) + " of the " + _top() + " Top 10% listings have 4 bedrooms or more). " +
      "On top of that, the closer to Yellowstone the better: Henrys Lake, the closest of the five reference areas to the West Entrance, earns " + fmtX(h.idx) + " a typical home its size and holds " + h.top10N + " of the " + _top() + " Top 10% listings, while homes 35 km or more out earn below typical. " +
      "A hot tub is close to standard (" + LOCATION.top10Amen.hot_tub + " of the " + _top() + " Top 10% have one). This page covers the market, location by bedroom size, why guests choose each part of the corridor, who they are, and the STR rules (Idaho's 2026 law means no permit is needed).";
  })(),
};

const FOOTER_NOTE = () =>
  "Preliminary. No buy box has been set. Revenue figures are gross Revenue Potential benchmarks from the market dataset (" +
  MARKET_STATS.n + " entire-home listings in Island Park and Macks Inn, <span class=\"nowrap\">" + MARKET_STATS.snapshot + "</span> snapshot), not a full underwriting model; the underwritten targets are on the Underwriting page. Read any cell under 8 homes as directional.";

// ---------------------------------------------------------------------------
// Section 2 — Market context (MARKET_OVERVIEW is in the research section below)
// ---------------------------------------------------------------------------
const DISTRIBUTION_NOTE = () => {
  const t = LOCATION.top10BySize;
  return "Half the homes earn more than " + fmtK(MARKET_STATS.median) + "; the Top 10% starts at " + fmtCurrency(REVENUE_DISTRIBUTION.p90) + ". That tail is large homes: " +
    t["4BR"] + " of the " + _top() + " are 4BRs and " + t["5BR+"] + " are 5BR+. No studio, 1BR or 2BR reaches it.";
};

const LADDER_NOTE = () => {
  const s = _lad("Studio-1BR"), two = _lad("2BR"), three = _lad("3BR"), four = _lad("4BR"), five = _lad("5BR+");
  return "Revenue climbs with every bedroom: " + fmtK(s.median) + " for a studio or 1BR, " + fmtK(two.median) + " for a 2BR, " + fmtK(three.median) + " for a 3BR, " + fmtK(four.median) + " for a 4BR and " + fmtK(five.median) +
    " for 5BR+, where the nightly rate reaches " + fmtCurrency(five.adr) + " and occupancy dips to " + five.occ + "%. Because size moves revenue this much, every location comparison below is made within the same size.";
};

const DRIVERS_NOTE =
  "<strong>Screening signals, not proven uplift.</strong> Each row compares listings with and without a feature on two measures: how often they reach the top quarter <em>for their size</em>, and what they earn against a typical home their size (1.00× = typical). Rows with fewer than 15 homes on either side are marked \"few homes\". Waterfront and lake-access homes cluster around Henrys Lake, so those signals overlap with the area.";

const DRIVER_ROWS = [
  { key: "Henrys Lake area", label: "Henrys Lake area", group: "Location · area", note: "The clear leader, at every size (see Section 3), and the closest area to Yellowstone's West Entrance." },
  { key: NEAR, label: "Within 25 km of Yellowstone's West Entrance", group: "Location · distance", note: "Ahead of typical, strongest for 2BRs and 4BRs (see Section 3)." },
  { key: FAR, label: "35 km or more from the West Entrance", group: "Location · distance", note: "Behind typical: the Reservoir's far side, Last Chance and Harriman. 5BR+ homes are the exception and earn about typical anywhere." },
  { key: "waterfront", label: "Waterfront (host-listed)", group: "Amenity · water", note: "Only " + _drv("waterfront").nWith + " homes, but a signal at every size." },
  { key: "Lake access (listed)", label: "Lake access (host-listed)", group: "Amenity · water", note: _drv("Lake access (listed)").nWith + " homes; overlaps with Henrys Lake and the Reservoir shore." },
  { key: "sauna", label: "Sauna", group: "Amenity", note: _drv("sauna").nWith + " homes; the signal is at 3BR and 4BR." },
  { key: "hot_tub", label: "Hot tub", group: "Amenity", note: "Close to standard (" + _drv("hot_tub").nWith + " of " + MARKET_STATS.n + " homes). Large homes without one fall behind: 5BR+ without a hot tub earn " + fmtX(_am("hot_tub", "5BR+").idxWithout) + " typical." },
  { key: "game_room", label: "Game room", group: "Amenity", note: "A large-home feature; 5BR+ homes without one lag." },
  { key: "pool_table", label: "Pool table", group: "Amenity", note: "Few homes; overlaps with game rooms." },
  { key: "fire_pit", label: "Fire pit", group: "Amenity", note: "Most homes have one; little difference." },
  { key: "Superhost", label: "Superhost", group: "Operations", note: "Most hosts here are Superhosts, so it separates little." },
];

// ---------------------------------------------------------------------------
// Section 3 — Location by bedroom size
// ---------------------------------------------------------------------------
const MAP_CONFIG = {
  lede:
    "Bedroom count sets the baseline; location can nudge a home above or below it. Every comparison here is within the same size: <strong>1.00× = what a typical Island Park home that size earns</strong>. The location question is kept simple: <strong>straight-line distance to Yellowstone's West Entrance</strong> (at West Yellowstone, Montana), in three bands, plus <strong>five reference areas</strong> along US-20 from Henrys Lake south to Last Chance.",
  marketInterpretation:
    "In the bottom-left panel (tap “show” on a phone), <strong>untick all but one bedroom size</strong> to see where that size earns. Green = top quarter for its size, gold = middle half, grey = bottom quarter; bigger dots = more bedrooms. Click an area outline for its numbers by size. The five areas are clusters of listing coordinates, used as reference geography only, and Airbnb shows approximate locations.",
};

const LOC_READS = {
  "Studio-1BR": (() => "No premium for being close: the " + _ls("Studio-1BR", NEAR).n + " studios and 1BRs under 25 km earn " + _x(_ls("Studio-1BR", NEAR)) + " typical, against " + _x(_ls("Studio-1BR", MID)) + " at 25–35 km.")(),
  "2BR": (() => "Closer is clearly better: " + _x(_ls("2BR", NEAR)) + " typical under 25 km and " + _x(_ls("2BR", MID)) + " at 25–35 km (" + (_ls("2BR", NEAR).n + _ls("2BR", MID).n) + " homes together), against " + _x(_ls("2BR", FAR)) + " for the " + _ls("2BR", FAR).n + " 2BRs 35 km+ out, most of them around Last Chance.")(),
  "3BR": (() => "About typical within 35 km (" + _x(_ls("3BR", NEAR)) + " and " + _x(_ls("3BR", MID)) + "), behind it farther out (" + _x(_ls("3BR", FAR)) + ").")(),
  "4BR": (() => "The clearest distance effect at a size with plenty of homes: " + _x(_ls("4BR", NEAR)) + " typical under 25 km (" + _ls("4BR", NEAR).n + " homes, most of them around Henrys Lake), against " + _x(_ls("4BR", MID)) + " and " + _x(_ls("4BR", FAR)) + " farther out.")(),
  "5BR+": "No distance premium: large group homes earn about typical at any distance; for them the home matters more than the spot.",
  "All sizes": "The × figures are size-adjusted; the dollar figures are not, and partly reflect more large homes near Henrys Lake.",
};

const AREA_GRID_NOTE = () => {
  const h = _area(HENRYS), r = _area(RES), l = _area(LAST), m = _area(MACKS);
  return "<strong>Henrys Lake is the one area clearly ahead</strong> (" + fmtX(h.idx) + " typical for its sizes), and it leads at every size; its 4BRs (" + fmtX(h.bySize["4BR"].idx) + ", " + h.bySize["4BR"].n + " homes) are the only cell there with 8 homes or more. " +
    "Island Park Reservoir holds the most homes (" + r.n + ") and earns a little below typical (" + fmtX(r.idx) + "); Macks Inn & Big Springs is about typical (" + fmtX(m.idx) + "). Last Chance & Harriman is the weakest (" + fmtX(l.idx) + ") and is mostly 2BRs (" + l.bySize["2BR"].n + " of " + l.n + "). " +
    "Figures in grey, tagged \"few homes\", rest on fewer than 8 homes.";
};

const SIZE_GUIDE = {
  "Studio-1BR": {
    head: "A small market here; location matters little.",
    look: "Around the Reservoir or Macks Inn, where most of the small homes are and earn about typical. Studios and 1BRs never reach the Top 10%.",
    avoid: "Paying up for proximity: studios and 1BRs under 25 km of the West Entrance earn below typical.",
    proof: () => "25–35&nbsp;km " + fmtK(_ls("Studio-1BR", MID).median) + " (" + _x(_ls("Studio-1BR", MID)) + ") · under 25&nbsp;km " + fmtK(_ls("Studio-1BR", NEAR).median) + " (" + _ls("Studio-1BR", NEAR).n + " homes)",
  },
  "2BR": {
    head: "Within 35 km of the West Entrance.",
    look: "Macks Inn and north toward Henrys Lake, where 2BRs earn well above typical (few homes).",
    avoid: (() => "The Last Chance cabins, 35 km+ out: " + _area(LAST).bySize["2BR"].n + " of the market's " + _lad("2BR").n + " 2BRs, earning below typical.")(),
    proof: () => "Under 25&nbsp;km " + fmtK(_ls("2BR", NEAR).median) + " · 25–35&nbsp;km " + fmtK(_ls("2BR", MID).median) + " · 35&nbsp;km+ " + fmtK(_ls("2BR", FAR).median) + " (" + _ls("2BR", FAR).n + " homes)",
  },
  "3BR": {
    head: "Anywhere within 35 km; Henrys Lake if you can.",
    look: (() => "Macks Inn & Big Springs, the deepest pool of 3BRs that earn about typical (" + _area(MACKS).bySize["3BR"].n + " homes), or Henrys Lake. A sauna or waterfront is a strong signal at this size.")(),
    avoid: "3BRs 35 km+ out, which earn below typical.",
    proof: () => "Under 25&nbsp;km " + fmtK(_ls("3BR", NEAR).median) + " · 25–35&nbsp;km " + fmtK(_ls("3BR", MID).median) + " · 35&nbsp;km+ " + fmtK(_ls("3BR", FAR).median),
  },
  "4BR": {
    head: "Henrys Lake first, with a hot tub.",
    look: (() => "Henrys Lake, where 4BRs earn " + fmtX(_area(HENRYS).bySize["4BR"].idx) + " typical. Elsewhere, a hot tub (4BRs without one earn " + fmtX(_am("hot_tub", "4BR").idxWithout) + " typical), and ideally a sauna or game room.")(),
    avoid: "A 4BR 25 km or more from the West Entrance without a hot tub.",
    proof: () => "Under 25&nbsp;km " + fmtK(_ls("4BR", NEAR).median) + " (" + _ls("4BR", NEAR).n + " homes) · 25–35&nbsp;km " + fmtK(_ls("4BR", MID).median) + " · 35&nbsp;km+ " + fmtK(_ls("4BR", FAR).median) + " · Henrys Lake " + fmtK(areaCellOf(HENRYS, "4BR").median),
  },
  "5BR+": {
    head: "Any distance; the home sets the rate.",
    look: "A group home with a hot tub and a game room anywhere along the corridor. 5BR+ homes earn about typical at every distance, and Henrys Lake's few lead.",
    avoid: (() => "Large homes without a hot tub (" + fmtX(_am("hot_tub", "5BR+").idxWithout) + " typical) or a game room.")(),
    proof: () => "Under 25&nbsp;km " + fmtK(_ls("5BR+", NEAR).median) + " · 25–35&nbsp;km " + fmtK(_ls("5BR+", MID).median) + " · 35&nbsp;km+ " + fmtK(_ls("5BR+", FAR).median),
  },
};

// ---------------------------------------------------------------------------
// Section 5 — Demographics (area comparisons within the same size)
// ---------------------------------------------------------------------------
const DEMOGRAPHICS_NOTE = () => {
  const b = DEMOGRAPHICS.byBedroom, s = b.find((r) => r.label === "Studio-1BR"), big = b.find((r) => r.label === "5BR+");
  const r = (v) => Math.round(v), M = DEMOGRAPHICS.marketWide;
  return "These are review-derived signals, not verified demographics. On the average listing, " + r(M.kids) + "% of reviews come from stays with kids, " + r(M.group) + "% from group trips and " + r(M.pet) + "% from stays with a pet. " +
    "Small homes are couples' and friends' trips (" + r(s.other) + "% \"Other\" at studio–1BR); families and groups take over from 3BR, and at 5BR+ " + r(big.kids) + "% of reviews are from stays with kids and " + r(big.group) + "% from group trips: multi-family Yellowstone vacations.";
};

// ---------------------------------------------------------------------------
// Section 2 — Market context. Statewide comparison from the Idaho STR Revenue
// Discovery dataset (Snowflake, 2026-09-16: 5,736 Idaho listings; its Island
// Park region holds 322). Researched 2026-10-14: NPS (2025 visits, monthly
// shares), Visit Idaho (snowmobile trails), Idaho Parks & Recreation, IDFG,
// Idaho State Tax Commission. Regulations: the Idaho site's research, verified
// 2026-09-17.
// ---------------------------------------------------------------------------
const MARKET_OVERVIEW = {
  heroImage: photo(
    "overview/henrys-lake-autumn.jpg",
    "The Henrys Lake State Park sign, shaped like the state of Idaho, in golden autumn grass, with the lake and the Henrys Lake Mountains behind under a clear blue sky",
    'Henrys Lake State Park in autumn. "Henrys Lake State Park - Island Park - Idaho in Autumn" by Tony Webster, <a href="https://commons.wikimedia.org/wiki/File:Henrys_Lake_State_Park_-_Island_Park_-_Idaho_in_Autumn_(52932620630).jpg" target="_blank" rel="noopener">Wikimedia Commons</a>, <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener">CC BY 2.0</a>.'
  ),
  chips: [
    { label: "Yellowstone's West Entrance 16–46 km Away" },
    { label: "Idaho's Top-Earning Large STR Region" },
    { label: "950+ Miles of Groomed Snowmobile Trails" },
    { label: "No STR Permit Needed (Idaho HB 583)" },
  ],
  attractions: [
    "<strong>Yellowstone National Park</strong>: 4,762,988 recreation visits in 2025 (NPS). Every home in this dataset sits 16–46 km (straight line) from the West Entrance at West Yellowstone, Montana, along US-20.",
    "<strong>Henrys Lake State Park</strong>: a trout fishery on the north end of the corridor, and the area whose homes earn the most here.",
    "<strong>The Henry's Fork of the Snake</strong>: from Big Springs past Macks Inn and Coffee Pot Rapids down to Harriman State Park, where the river is fly-fishing only (barbless hooks, June 15 to November 30, IDFG rules).",
    "<strong>Winter snowmobiling</strong>: over 950 miles of groomed trails in the Island Park area (Visit Idaho), which keep homes booked after the park's summer season ends.",
  ],
  visitorStats: {
    headline: "Island Park against the rest of Idaho (Idaho STR Revenue Discovery data, September 2026) and Yellowstone (NPS); each tile says what it covers",
    breakdown: [
      { value: "$59.7k", label: "Median Actual Revenue, Island Park Region (Idaho: $32.3k)" },
      { value: "$390", label: "Median Nightly Rate, Island Park Region (Idaho: $184)" },
      { value: "56 of 235", label: "Idaho Listings Earning $90k+ That Sit in Island Park" },
      { value: "4.76M", label: "Yellowstone Recreation Visits (2025)" },
    ],
  },
  watchOuts: [
    "☀️ <strong>Summer carries the year.</strong> June to August averaged about 64% of Yellowstone's visits (NPS monthly averages, 2014–2018), and November to April about 4% combined. Winter here runs on snowmobiling, not the park.",
    "🏘️ <strong>Check the HOA before you buy.</strong> State law now stops the county and city from requiring STR permits, but a subdivision's rental ban can still apply: the Idaho Supreme Court upheld one in <em>North Henry's Lake HOA v. Norton</em> (January 2026). Read the CC&amp;Rs and their consent history.",
    "🚰 <strong>Septic and wells are sized by bedrooms.</strong> Idaho's septic standard sizes systems by bedroom count, not by the large groups some homes here market; budget for a septic and well inspection, separate from any STR rule.",
    "🏛️ <strong>Park access can be disrupted.</strong> NPS's 2025 count covers a year with a 43-day partial federal government shutdown.",
  ],
  sources: [
    { label: "NPS: Yellowstone 2025 visitation", url: "https://www.nps.gov/yell/learn/news/26004.htm" },
    { label: "NPS: Yellowstone visitation by month", url: "https://www.nps.gov/yell/planyourvisit/visitationstats.htm" },
    { label: "Visit Idaho: Island Park snowmobiling", url: "https://visitidaho.org/things-to-do/snowmobiling/island-park-area/" },
    { label: "Idaho Parks & Recreation: Henrys Lake State Park", url: "https://parksandrecreation.idaho.gov/state-park/henrys-lake-state-park/" },
    { label: "IDFG: Henry's Fork in Harriman State Park", url: "https://idfg.idaho.gov/ifwis/fishingplanner/water/1119497437574" },
    { label: "Idaho STR Revenue Discovery: Island Park region", url: "https://ifrahamstr.github.io/IdahoRevenueDiscovery/regions/island-park/" },
    { label: "North Henry's Lake HOA v. Norton (Idaho Supreme Court, 2026)", url: "https://law.justia.com/cases/idaho/supreme-court-civil/2026/51990.html" },
  ],
};

// ---------------------------------------------------------------------------
// Section 4 — Why location changes the rate (js/destination.js engine).
// "Why it matters here" lines compute from LOCATION. Colours match the area
// colours on the Section 3 map.
// ---------------------------------------------------------------------------
const DEST_LEDE = "Why guests choose each stretch of the US-20 corridor, and why the north end, closest to Yellowstone, earns the most. Click an area.";
const DEST_RESEARCHED = "2026-10-14";
const DEST_KIND = {
  lake: ["Lake, closest to Yellowstone", "#3C6E9E"],
  corridor: ["US-20 corridor", "#8B5FA7"],
  river: ["Henry's Fork & Big Springs", "#2E7D6B"],
  reservoir: ["Reservoir", "#D07A1F"],
  harriman: ["Harriman & the lower river", "#C0473F"],
};
function DEST_AREAS() {
  const h = _area(HENRYS), n = _area(NORTH), m = _area(MACKS), r = _area(RES), l = _area(LAST);
  return [
    {
      id: "henrys", name: HENRYS, kind: "lake", tags: ["The one area clearly ahead", "Closest to Yellowstone"],
      zones: [{ lat: 44.650, lng: -111.340, r: 3500, tip: "Henrys Lake", tipShort: "Henrys Lake", dir: "top" }],
      why: "Homes around Henrys Lake and its state park, at the north end of the corridor and the shortest drive to West Yellowstone and the park's West Entrance.",
      season: "Summer Yellowstone trips and lake fishing; snowmobiling in winter.",
      matters: "The clear leader (" + fmtX(h.idx) + " typical for its sizes, median " + fmtK(h.medianRev) + "), ahead at every size, with " + h.top10N + " of the market's " + _top() + " Top 10% listings and the highest nightly rates.",
    },
    {
      id: "north", name: NORTH, kind: "corridor", tags: ["About typical", "Small area"],
      zones: [{ lat: 44.587, lng: -111.355, r: 3000, tip: "North Island Park", tipShort: "North", dir: "right" }],
      why: "Homes along US-20 between Henrys Lake and Macks Inn.",
      season: "Summer, and snowmobiling in winter.",
      matters: "About typical for its sizes (" + fmtX(n.idx) + "), on " + n.n + " homes.",
    },
    {
      id: "macks", name: MACKS, kind: "river", tags: ["About typical", "Deepest pool of 3BR and 4BR"],
      zones: [{ lat: 44.500, lng: -111.320, r: 3500, tip: "Macks Inn & Big Springs", tipShort: "Macks Inn", dir: "right" }],
      why: "Macks Inn and Big Springs, where the Henry's Fork starts, in the middle of the corridor: river floating, the springs, and a central base for the park and the trails.",
      season: "Summer river and park trips; a hub for snowmobile trails in winter.",
      matters: "About typical for its sizes (" + fmtX(m.idx) + "), with the most 4BRs outside Henrys Lake (" + m.bySize["4BR"].n + ").",
    },
    {
      id: "reservoir", name: RES, kind: "reservoir", tags: ["Most homes", "A little below typical"],
      zones: [{ lat: 44.455, lng: -111.450, r: 4500, tip: "Island Park Reservoir", tipShort: "Reservoir", dir: "left" }],
      why: "Cabins around Island Park Reservoir, west of US-20: boating and fishing on the reservoir, a longer drive to Yellowstone.",
      season: "Summer lake trips and Yellowstone days; snowmobiling in winter.",
      matters: "The largest pool of homes (" + r.n + ", " + Math.round((r.n / MARKET_STATS.n) * 100) + "% of the market), earning a little below typical (" + fmtX(r.idx) + ") for their sizes.",
    },
    {
      id: "lastchance", name: LAST, kind: "harriman", tags: ["Weakest area", "Mostly 2BR cabins"],
      zones: [{ lat: 44.365, lng: -111.405, r: 3000, tip: "Last Chance & Harriman", tipShort: "Last Chance", dir: "bottom" }],
      why: "Last Chance on the Henry's Fork, next to Harriman State Park and its fly-fishing water, at the south end of the corridor and the farthest from Yellowstone.",
      season: "Fly-fishing season (Harriman opens June 15) and summer.",
      matters: "The weakest area (" + fmtX(l.idx) + " typical), and mostly smaller cabins: " + l.bySize["2BR"].n + " of its " + l.n + " homes are 2BRs, with no Top 10% listings.",
    },
  ];
}
// Context markers (lat, lng, label, color), from notebooks/landmarks.json.
const DEST_POINTS = [
  [44.65866, -111.09716, "Yellowstone West Entrance", "#C0473F"], [44.66321, -111.10121, "West Yellowstone, MT", "#C0473F"],
  [44.61933, -111.37283, "Henrys Lake State Park", "#3C6E9E"], [44.41872, -111.39624, "Island Park Reservoir (dam)", "#D07A1F"],
  [44.49753, -111.25448, "Big Springs", "#2E7D6B"], [44.49558, -111.39573, "Coffee Pot Rapids", "#2E7D6B"],
  [44.33498, -111.46864, "Harriman State Park", "#C0473F"], [44.49867, -111.33641, "Macks Inn", "#2E7D6B"], [44.36476, -111.40054, "Last Chance", "#C0473F"],
];
// Month bands: Yellowstone's average share of annual visits by month, 2014-2018
// (NPS): Jul 23.6%, Aug 20.9%, Jun 19.4%, Sep 16.5%, May 10.0%, Oct 5.6%, Apr
// 1.1%, Nov-Mar 0.4-0.8%; winter in Island Park is snowmobile season (Visit Idaho).
const DEST_SEASON = {
  months: ["ski", "ski", "ski", "low", "mid", "peak", "peak", "peak", "high", "mid", "low", "ski"],
  marks: ["", "", "", "", "Memorial Day", "Fishing opens", "July 4th", "", "Labor Day", "", "", "Christmas"],
  legend: [["peak", "Yellowstone summer: June–August"], ["high", "September"], ["mid", "May and October shoulders"], ["ski", "Snowmobile season"], ["low", "April and November: the quietest months"]],
  caption: "<strong>Two things to price in:</strong> Yellowstone's summer carries the year: June to August averaged about 64% of the park's visits, and November to April about 4% (NPS monthly averages, 2014–2018). Winter here runs on snowmobiling (over 950 miles of groomed trails), not on the park, so a winter-ready home (access, parking for trailers, a hot tub) matters. Harriman's fly-fishing water opens June 15.",
};
const DEST_BRIDGE = [
  ["Guests come for Yellowstone, and the north end of the corridor is the shortest drive to the West Entrance.", "Henrys Lake, closest to the park, carries the clearest location premium, at every size."],
  ["Farther south, guests come for the river, the reservoir and the trails, and pay less for the longer drive.", "For 5BR+ group homes, the home matters more than the spot: a hot tub and a game room do more than distance."],
];
const DEST_SOURCES = [
  { label: "NPS: Yellowstone visitation by month", url: "https://www.nps.gov/yell/planyourvisit/visitationstats.htm" },
  { label: "NPS: Yellowstone 2025 visitation", url: "https://www.nps.gov/yell/learn/news/26004.htm" },
  { label: "Visit Idaho: Island Park snowmobiling", url: "https://visitidaho.org/things-to-do/snowmobiling/island-park-area/" },
  { label: "Idaho Parks & Recreation: Henrys Lake State Park", url: "https://parksandrecreation.idaho.gov/state-park/henrys-lake-state-park/" },
  { label: "IDFG: Henry's Fork in Harriman State Park", url: "https://idfg.idaho.gov/ifwis/fishingplanner/water/1119497437574" },
];

// ---------------------------------------------------------------------------
// Section 6 — STR regulations. From the Idaho STR Revenue Discovery site's
// Island Park research (verified 2026-09-17), laid out like Galveston's.
// ---------------------------------------------------------------------------
const STR_REGULATIONS = {
  lede: "Island Park splits between the City of Island Park, a famously narrow strip (about 500 feet wide and 33 miles long) along US-20, and unincorporated Fremont County, which covers nearly all of the Henrys Lake and Island Park Reservoir subdivisions. Since July 1, 2026, Idaho's HB 583 gives both the same answer.",
  primary: {
    name: "City of Island Park & Fremont County",
    badge: "Whole market · Idaho HB 583",
    appliesTo: (() => "<strong>Applies to</strong> every home in this dataset (" + MARKET_STATS.n + " homes), inside the city strip or in the county. Confirm which side of the city line a parcel sits on: STR legality is the same, but zoning details can differ.")(),
    tier: "Investor-Friendly",
    tierKey: "friendly",
    tierNote: "Idaho HB 583 (effective July 1, 2026) bars counties and cities from requiring an STR-specific license, permit, fee or registration, from capping STRs, and from requiring owner occupancy. Fremont County's old lodging permit is no longer enforceable. The one real constraint is private: a subdivision's existing rental ban.",
    permitResidency: [
      "Permit or license required? No, since July 1, 2026. Fremont County's former Home Occupation Transient Rental Permit (Class 1: up to 15 guests, $200 a year; Class 2: 16–30 guests, $500 a year, with septic and well inspections every two years) can no longer be required. The county's application forms may still be posted online: treat them as stale and confirm with Fremont County Planning & Building.",
      "Primary residence required? No. Owner-occupancy rules are barred statewide, and none applied here before HB 583.",
      "No separate City of Island Park STR ordinance was found.",
    ],
    operatingLimits: [
      "No caps, quotas or limits on rental days: all barred by state law. Occupancy follows the general International Building Code limits that apply to any home.",
      "Septic and wells still matter: Idaho's septic standard sizes systems by bedroom count, not by the large groups some homes here host. This is separate from HB 583.",
      "Taxes: 8% in total, 6% Idaho sales tax + 2% state Travel & Convention Tax. No local-option or auditorium-district tax applies in Island Park or Fremont County.",
    ],
    investorNotes: [
      "Idaho Code §67-6539 (as amended by HB 583) does not touch general septic, well, zoning or building-code rules; those still apply.",
      "<strong>HOA rental bans can still apply.</strong> In <em>North Henry's Lake HOA v. Norton</em> (Idaho Supreme Court, January 2026), a Henrys Lake-area HOA's pre-2016 rental ban survived under Idaho Code §55-3211, though a later owner who never consented can still win the right to rent. Check the subdivision's CC&amp;Rs and their consent history.",
      "Airbnb and Vrbo collect and remit the state taxes on their bookings. For direct bookings, register with the Idaho State Tax Commission and file monthly (Form 1152).",
    ],
    sources: [
      { label: "Idaho Code §67-6539", url: "https://legislature.idaho.gov/statutesrules/idstat/title67/t67ch65/sect67-6539/" },
      { label: "North Henry's Lake HOA v. Norton (2026)", url: "https://law.justia.com/cases/idaho/supreme-court-civil/2026/51990.html" },
      { label: "Idaho Code §55-3211 (HOA rental restrictions)", url: "https://www.communitypay.us/laws/idaho/statute/idaho-code-55-3211/" },
      { label: "Idaho Travel and Convention Tax", url: "https://tax.idaho.gov/taxes/taxes-on-sales/travel-and-convention-tax/" },
      { label: "KIFI: Idaho curbs local STR control", url: "https://localnews8.com/news/2026/02/10/idaho-lawmakers-move-to-curb-local-control-over-short-term-rentals/" },
    ],
  },
  note: "From the Idaho STR Revenue Discovery site's Island Park research, verified September 17, 2026 against the statute, the Idaho Supreme Court decision and the State Tax Commission. Rules change, so confirm with Fremont County and the City of Island Park before you buy.",
};
