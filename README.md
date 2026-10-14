# Island Park, ID — STR Market & Location Analysis

Static site (no build step), the same template as the Galveston, Bend, Gulf Shores and Boone sites. It covers **Sections 2–6**:
- Market
- Location Analysis by Bedroom Size
- Why Location Changes the Rate
- Traveller Demographics
- STR Regulations

It also has the **Underwritten Properties** page (`underwritten.html`), linked from an Underwriting strip under the hero. No buy boxes yet.

Live: https://ifrahamstr.github.io/IslandParkMarketAnalysis/ (repo `ifrahamSTR/IslandParkMarketAnalysis`).

## Where the content comes from

- **Listings:** `../IslandPark - ID - Iqbal.xlsx` (snapshot 2026-10-12) → `Cleaned_Data`, entire homes only: 237 of 238. The one private room (abnb_13124539) is left out.
- **The Idaho STR Revenue Discovery site, reused rather than re-researched** (`Tools/STRClusterDiscovery/Idaho/webpage`):
  - the Section 6 regulations (its Island Park research, verified 2026-09-17: Idaho HB 583, Fremont County's old permit, the 8% tax, *North Henry's Lake HOA v. Norton*);
  - the statewide comparison on the market card. Its data are 5,736 Idaho listings from Snowflake, 2026-09-16, and its Island Park region holds 322 of them: median actual revenue $59.7k vs $32.3k statewide, ADR $390 vs $184, and 56 of Idaho's 235 $90k+ listings.
- **New research (2026-10-14), with sources on the page:**
  - NPS: Yellowstone's 2025 visits, and its monthly shares, which give the season strip;
  - Visit Idaho: 950+ miles of groomed snowmobile trails;
  - Idaho Parks & Recreation (Henrys Lake);
  - IDFG (the Henry's Fork in Harriman).
- **Hero photo:** Henrys Lake State Park, by Tony Webster, CC BY 2.0 (Wikimedia Commons).

## Location model (kept simple on purpose)

`../notebooks/market_common.py`:
- **Distance to Yellowstone:** straight-line km to the West Entrance, in three bands: under 25 km (75 homes), 25–35 km (81) and 35 km+ (81).
- **Five Ward areas** along US-20, north to south:
  - Henrys Lake (25);
  - North Island Park (20);
  - Macks Inn & Big Springs (64);
  - Island Park Reservoir (101);
  - Last Chance & Harriman (27).
- **Screening flags:** lake access and waterfront come from the host's amenity flags and are signals only.

Findings: size sets the rate (20 of the 24 Top 10% are 4BR+). Henrys Lake is 1.63× typical for its sizes and holds 10 of the 24 Top 10%. Under 25 km is 1.14×, 35 km+ 0.91×, and the 4BR gap is the clearest. 5BR+ earn about typical at any distance. A hot tub is close to standard: 23 of the 24 Top 10% have one.

## Pipeline

1. `python ../notebooks/build_overview_notebook.py`, then run `jupyter nbconvert --to notebook --execute --inplace --ExecutePreprocessor.kernel_name=str ../notebooks/islandpark_overview.ipynb`. The builder is shared and identical across markets.
2. `python scripts/generate_webpage_data.py` writes `js/region_data.js`, the Section 3 map and `data/listings.json`.
3. Underwriting: put the "UW'ing - NN.csv" exports in `underwriting/source_csv/` (now 109–112), then run `python scripts/build_underwritten.py`. It geocodes with the US Census geocoder, audits the comps, and runs `node tests/test_underwritten.mjs` (60 checks).
4. Browser test: `NODE_PATH=<playwright-core node_modules> node tests/test_underwritten_browser.mjs`.

## Underwriting page: what is specific to Island Park

- **Location match:** keeps to the target's **area** (a toggle), with bedrooms ±1, revenue $90k+ and nearest first. The map shows dashed rings at 25 and 35 km round the West Entrance.
- **The comp table follows each sheet's own header.** Sheet 109 uses the standard columns (HAS_pool, HAS_pickleball, HAS_mini_golf). Sheets 110–112 put Firepit, Outdoor Dining and Pack and Play in those places. Tables, copied rows and the CSV download all follow the target's own sheet. New listings start from the newest sheet (112), so they get its columns, OPEX and setup items.
- **Number formats:** some comp cells are typed in European format (`$183.628,00`, `79,18%`). They are read correctly and reported under Data checks. Download UW CSV writes them back in the sheet's US format.
- **Lot sizes:** a lot entered in acres ("0.56 acre") is converted to square feet.
- **Sheet checks:**
  - Every sheet's amortization block runs a few dollars ahead in its Total Paydown column, as Galveston's do. It is reported, not changed.
  - Files 110, 111 and 112 all have a $269,000 purchase price, though they are different houses. Check that this wasn't copied over.

**Standard setup lines (2026-10-14):** every new underwriting sheet made on the page carries the five lines every "UW'ing" sheet has, in their usual rows: Furniture / Decor / Essentials (row 5), Misc, CoHost Essentials, Design/Project Management and Install/Staging/Warehousing (rows 16–19). A line that is missing or has no amount gets Galveston file 101's amount ($50,000 / $25,000 / $3,500 / $25,000 / $18,250); a line the starting sheet already prices keeps its own amount. Rule: `UWRules.withStandardSetup` in `js/underwritten/uw-rules.js`, applied when a listing is created and whenever a new-listing sheet is shown or downloaded.
