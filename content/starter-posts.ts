export interface StarterPost {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  bodyMd: string
}

/**
 * Long-form blog posts written in Romeo's own voice — first person, in contrast
 * to the third-person register used across the rest of the site. Every figure,
 * partner, date and output is drawn from the CV; nothing is invented.
 */
export const STARTER_POSTS: StarterPost[] = [
  {
    slug: 'regulating-the-port-not-the-showroom',
    title:
      'Regulating the Port, Not the Showroom: Ghana’s First Zero-Emission Vehicle Supply-Side Regulation',
    excerpt:
      'Ghana’s vehicle fleet is assembled at the port, not chosen in a showroom — which is why a year of electric mobility work ended in a document about import conditions rather than consumer incentives. Here is what it takes to carry a technical model through a national validation workshop into a policy instrument a government can actually adopt.',
    tags: ['e-mobility', 'policy', 'regulation', 'ecowas', 'ghana'],
    bodyMd: `Almost every vehicle that joins Ghana’s fleet arrives already built, already used, and already someone else’s decision. It is landed at a port, cleared, registered and sold. By the time a Ghanaian buyer stands in front of it, the vehicle’s efficiency, its emissions profile, its drivetrain and its remaining service life were all settled years earlier, on another continent, by a first owner who has never heard of Ghana’s Nationally Determined Contribution.

That single fact reorganises the entire electric mobility policy problem. Between April 2025 and April 2026 I coordinated Ghana’s first zero-emission vehicle supply-side regulatory framework for the UN Environment Programme and the ClimateWorks Foundation. This is an account of why the instrument had to target the border rather than the buyer, and what it actually takes to move something like that from a model file to a document formatted for government adoption.

## The ceiling on demand-side policy

I came to this from the demand side. From July 2024 to April 2025 I coordinated Ghana’s NDC Action E-Mobility Policy Working Group for UNEP with Base Foundation, running the national stakeholder process and holding the group’s outputs against the country’s NDC commitments. That work covered the familiar instruments: adoption incentives, charging infrastructure, capacity building, public awareness.

Demand-side instruments are not wrong. They are simply bounded by what is on the lot. You can zero-rate the duty on an electric vehicle, publish a charging roadmap and run a national awareness campaign, and still find that the fleet composition barely moves — because the constraint was never Ghanaian preference. It was the shipping decision made by an exporter matching surplus stock to a market with permissive entry conditions.

> A demand incentive in a used-import market is an offer to choose more enthusiastically from a menu that someone else already wrote.

Supply-side regulation writes the menu. It governs what may be brought in at all: minimum performance and emissions thresholds, vehicle age conditions, safety and homologation requirements, conformity assessment at entry, and — critically — the regulatory definitions that determine what counts as a zero-emission vehicle in the first place. Change the entry conditions and you change the fleet that exists to be chosen from.

## Modelling before drafting

A supply-side regulation is, in its operative parts, a set of numbers. Thresholds, dates, categories, phase-in steps. And a threshold with nothing behind it is a number that will be negotiated downward by whoever is most affected by it, because there is no principled reason to defend any particular value.

So the sequence mattered. The programme ran technical modelling first, then drafting. That order is what allows a coordinator to answer the only question that matters in a stakeholder room — *why that number and not a looser one* — with an analysis rather than an assertion. It also makes the phase-in defensible: if you can show what a threshold does to import volumes, to fleet turnover and to the emissions trajectory, then a request to relax it becomes a request to accept a specific, quantified cost rather than a general appeal to commercial hardship.

## The room

Getting a single instrument out of that analysis meant convening the Ministry of Transport, the Energy Commission, the Environmental Protection Agency, the Driver and Vehicle Licensing Authority, the Ghana Standards Authority, vehicle importers and dealers, and development partners.

These parties do not naturally agree, and it is worth being precise about why. Each holds a different piece of the border. The Standards Authority owns conformity assessment. The DVLA owns registration — the moment at which a vehicle becomes legally real. The EPA owns the emissions mandate. The Energy Commission owns the electricity side, without which a zero-emission vehicle is a stranded asset. The Ministry of Transport owns the policy lead. And the importers and dealers own the actual trade the instrument is about to constrain, with a business model built on precisely the vehicles a supply-side threshold is designed to screen.

Convening them around one instrument, rather than allowing five parallel and mutually inconsistent positions to form, was most of the work. The alternative is well known in this region: an instrument drafted by technical assistance, launched at a hotel, and then unenforced because the agency that had to operationalise it at the point of registration was never in the room when the thresholds were set.

## The validation workshop is not a presentation

The national validation workshop is the step people outside this work tend to misread as ceremonial. It is not. It is the moment at which authorship transfers — where a draft stops being the consultants’ document and becomes the stakeholders’ document, on the record, with objections registered and resolved rather than deferred.

It also produces an artefact with real downstream weight. The validation workshop report is what a ministry cites when it needs to demonstrate that an instrument has an evidenced constituency behind it. I co-authored that report alongside the policy brief, the ECOWAS dissemination report and the final policy document.

## Formatting for adoption, which is where this work usually dies

The least glamorous decision in the whole programme was also the most consequential: the final policy document was formatted to National Development Planning Commission standards.

That sentence is easy to skim past. It means the output was built to enter the Government of Ghana’s own planning and adoption route — its structure, its conventions, its expectations for how a policy proposition is presented — rather than arriving as a well-argued PDF in a format the receiving institution has no established process for.

> A great many technically excellent instruments never become policy because they were written for the funder’s reporting cycle rather than the government’s adoption pipeline.

If the receiving institution has to reformat, restructure and re-argue your work before it can be tabled, you have not handed over an instrument. You have handed over homework.

## When a national instrument becomes a regional conversation

Then the geography asserted itself. West African vehicle import markets are interconnected. Tighten entry conditions in one country and the vessels do not stop sailing — they redirect to the neighbour with the more permissive regime, and the vehicles arrive by road soon after. A national supply-side standard, taken alone, is at least partly a redirection instrument.

So dissemination was not an afterthought bolted on at the end of the budget. I designed and led a sub-regional ECOWAS webinar series on supply-side regulation for electric mobility, reaching 51 stakeholders across 9 countries. The purpose was to put the analysis in front of the officials in neighbouring administrations who would otherwise only encounter Ghana’s standard as a sudden change in their own import mix.

That is the turn I find most interesting about the whole programme. The instrument was designed for one country and, on contact with the region, immediately posed a regional question: whether West Africa converges on entry conditions or competes to be the softest port of entry. Fifty-one people across nine countries is not a treaty. It is the beginning of the conversation in which one becomes conceivable.

## What I take from it

I presented on the supply-side determinants of Africa’s electric vehicle transition at the Fourth Tsinghua Global Youth Dialogue, and the argument I made there is the one this work taught me. The continent’s transport transition will not be decided primarily by what African consumers want. It will be decided by what the rest of the world decides to stop driving, and by whether African regulators set the conditions under which those vehicles are allowed to land.

That is a less romantic story than the one usually told about electric mobility. It is also, I think, the accurate one — and it is considerably more actionable, because import conditions are a lever that a national regulator genuinely holds.`,
  },
  {
    slug: 'watching-a-river-basin-from-orbit',
    title: 'Watching a River Basin from Orbit',
    excerpt:
      'A river gauge tells you what one point on one river did yesterday. A water budget asks where every drop in the basin went — and in the White Volta, the ground network cannot answer that. Here is how earth observation, VegET and mizuRoute close the gap, and what changes for management once you can see a whole basin at once.',
    tags: ['hydrology', 'earth observation', 'water budgets', 'modelling'],
    bodyMd: `A river gauge is a superb instrument with a narrow question. It tells you how much water passed one cross-section of one channel, at one moment. Multiply that by the handful of functioning gauges in a large West African basin and you have a few dozen numbers a day describing a landscape of tens of thousands of square kilometres, most of which contains no river at all.

My MSc research at the University of Energy and Natural Resources, completed in December 2022 under a World Bank Africa Centre of Excellence scholarship, asked whether earth observation could carry water budget monitoring in exactly that situation. The basin was the White Volta. The question has followed me into every hydrological project since.

## What a water budget actually is

Strip away the software and a water budget is an accounting identity. Over some area and some period, precipitation comes in; evapotranspiration, discharge and change in storage account for where it went. Everything else — every model, every satellite product, every calibration argument — exists to put defensible numbers on those terms.

The identity is trivially true, which is precisely what makes it useful. If you can measure three terms well, the fourth is constrained. If you measure all four independently, the extent to which they fail to balance is a direct, quantitative statement about how much you do not know. That residual is not an embarrassment to be hidden. It is the most honest diagnostic in the discipline.

## Why gauges alone cannot close it here

In a basin like the White Volta, the ground network struggles with the budget for reasons that are structural rather than fixable by maintenance.

Gauges measure discharge, and discharge is usually not the dominant outgoing term. In a semi-arid, agriculturally intensive basin, evapotranspiration is where most of the rainfall goes — and no gauge measures it. Point discharge tells you almost nothing about the term that dominates the balance.

The stations that do exist are sparse and unevenly distributed, and the records have gaps. Rating curves drift as channels scour and deposit, so the relationship between measured stage and reported discharge quietly decays between calibrations. The many small reservoirs and dugouts that hold and evaporate water across the landscape are largely unmetered, as is a great deal of abstraction.

And the basin is transboundary. Substantial upstream area lies outside the jurisdiction of any Ghanaian agency, which means that even a perfect Ghanaian gauge network would be measuring the downstream consequences of an unobserved upstream.

> Every error in every term ends up in the closure residual. With enough unmeasured terms, the residual stops being a diagnostic and becomes a shrug.

## What earth observation changes, and what it does not

Satellite observation replaces points with fields. Instead of a value at a station, you get a spatially complete grid: precipitation estimates, land surface temperature, vegetation indices, soil moisture, land cover, surface water extent — everywhere in the basin, on a repeating cycle, on both sides of an international border.

But an observation is not a flux. A vegetation index is not evapotranspiration; a rainfall estimate is not runoff. Earth observation gives you spatially complete *state*, and the water budget needs *fluxes*. Bridging that is what the model chain is for.

## VegET: a water balance in every pixel

VegET is a satellite-driven daily soil-water-balance model. For each grid cell it takes precipitation, a reference evapotranspiration field and a vegetation-index-derived coefficient that scales reference ET to what the actual vegetation there is plausibly transpiring, together with the soil’s water-holding capacity. It then does the bookkeeping day by day: water in, water held, water lost to the atmosphere, water shed as runoff.

The output is the thing that has always been missing from the gauge-only picture — a spatially distributed estimate of actual evapotranspiration and runoff generation across the whole basin, including the parts nobody visits. It is also computationally light enough to run over very large domains, which turns out to matter enormously.

## mizuRoute: turning a map into a hydrograph

VegET tells you how much water each cell shed. It does not tell you when that water arrives somewhere downstream, and it has no concept of a river network at all.

mizuRoute supplies both. It maps gridded runoff onto the catchments of an explicit river network, then routes that water downstream through the network topology, applying the delay and attenuation that a real channel imposes. Given a hydrography dataset defining the reaches and their connectivity, it converts a map of runoff generation into a simulated hydrograph at any reach you care to ask about.

That conversion is what makes the whole chain testable. You cannot validate a continental evapotranspiration field directly. But you *can* route it to the few locations where a real gauge exists and compare simulated discharge against measured discharge — and because that number is the integrated consequence of everything upstream in the chain, agreement is a meaningful test of the whole thing.

> The scarce gauges become more valuable once you have a model to test against them, not less. They stop being the entire monitoring system and become its calibration and evidence base.

## Doing it at continental scale

Since May 2025 I have worked as a research consultant with the International Water Management Institute’s West Africa office, and the basin-scale method has scaled up considerably.

On DIWASA V2, the World Bank-funded continental hydrology and discharge modelling programme, I supported MERIT-based VegET and mizuRoute baseline runs covering 1992 to 2024 — a record long enough that a trend statement carries weight rather than reflecting one wet decade. On top of that baseline sit validation and future-scenario discharge simulations to 2050, run through the same modelling chain so that historical and projected behaviour are produced by one consistent method rather than stitched together from two incompatible ones. My analytical contribution was the discharge trend analysis and visualisation, and the basin-scale summaries and figures that make a continental simulation legible to a basin authority.

The companion workstream, the Google-funded Lerma–Santiago study in Mexico, adds the piece that heavily managed basins demand. There I ran mizuRoute for naturalised discharge and mizuLake for reservoir-regulated discharge, so that the gap between what the river would do and what the river is permitted to do becomes an explicit, quantified object rather than an assumption buried in the calibration. The results were reduced to environmental-flow indicators for an e-flow dashboard.

## What changes for management

Ungauged sub-basins acquire numbers. Allocation arguments that previously ran on competing anecdote now run against a shared budget with a stated uncertainty.

Change becomes attributable. When flows fall, a distributed budget can begin to separate declining rainfall from rising upstream consumption — a distinction that determines whether the appropriate response is adaptation or negotiation.

Transboundary discussion gains a neutral dataset. Satellite observation does not stop at a border and is not owned by either party, which makes it unusually well suited to conversations where each side distrusts the other’s figures.

And monitoring becomes continuous rather than campaign-based. A basin authority can maintain a budget without first funding a dense observation network it has no prospect of sustaining.

## The honest limits

Products disagree. Different precipitation and evapotranspiration datasets will give you materially different budgets for the same basin, which is why multi-product comparison and deviation analysis are part of the method rather than a caveat at the end — the spread between products belongs in the result.

None of this removes the need for ground data. It changes what ground data is *for*: from the sole source of truth to the validation anchor for something far more spatially complete than it could ever be alone.

The White Volta work is now a manuscript under review with colleagues at UENR and IWMI. I have since facilitated Water Accounting Plus and VegET workshops in Ghana and Ethiopia, because the constraint on this method in most African basins is no longer the satellites. It is the number of people trained to run the chain and defend its numbers in a room full of stakeholders.`,
  },
  {
    slug: 'why-guardian-is-offline-first',
    title: 'Why GUARDIAN Is Offline-First',
    excerpt:
      'Child protection in Ghana does not fail for lack of agencies — it fails at the handoff between them, in the districts where the network is worst. GUARDIAN is my attempt to design for that: USSD, WhatsApp and web reporting, geospatial routing and severity-based escalation, built to work when the connection does not.',
    tags: ['child protection', 'offline-first', 'civic tech', 'ghana', 'design'],
    bodyMd: `Count the institutions a single child-protection case in Ghana can legitimately touch: the Commission on Human Rights and Administrative Justice, the Department of Children, the Department of Gender, the Department of Social Welfare, the Labour Department, the Ghana Police Service. Six bodies, six mandates, six sets of records.

That list is not evidence of neglect. It is evidence of a country that has built protection institutions. The problem is not that no one is responsible; it is that responsibility is distributed and the connective tissue between the parts is a phone call, a letter and, in the worst case, the memory of whichever officer happened to take the report.

GUARDIAN — Ghana Unified Referral and Digital Intelligence for Action on Neglect — is the platform I designed and built against that specific failure. It was submitted by UNIYIA under the Last-Mile Protection Gap challenge and was a finalist in the UNICEF StartUp Lab Pitch. I want to explain the architectural decisions honestly, and I want to be equally clear at the outset about what it is not, which I will come back to at the end.

## The gap is the handoff

If you model child protection as a pipeline, the losses do not concentrate where you would expect. They concentrate at the joints.

A case reported to one agency has to reach the agency with the mandate and capability to act on it. Between those two points sit a series of transfers, each of which can silently fail. Nobody refuses. The referral is simply made verbally, or made in writing to a person who has moved on, or made correctly and then never followed up because no one holds a clock on it. Each agency’s record shows its own part of the case discharged. No record shows the child.

> Systems rarely fail by saying no. They fail by leaving a case in a queue that belongs to no one.

Every design decision below follows from taking that diagnosis seriously.

## Three channels, one case record

Reporting is multi-channel: USSD, WhatsApp and web.

USSD is the one that matters most and is least fashionable. It runs over the GSM signalling channel as a session-based menu, which means it works on a basic feature phone, with no smartphone, no app installation, no data bundle and no app store. In the districts where the protection gap is widest, that is not a fallback — it is the primary realistic channel. Anything that requires a data plan has quietly excluded the people the platform exists for.

WhatsApp meets people where a great deal of Ghanaian communication already happens, and carries what USSD cannot: images, location, longer narrative.

Web serves officers, organisations and anyone reporting from a desk.

The design consequence is that intake surface and case record must be separated. A case is not a WhatsApp thread or a USSD session; it is a record that three very different surfaces can create and enrich. Otherwise you build three parallel systems and reproduce the coordination problem inside your own database.

## Offline-first is a claim about geography, not a feature

Here is the thing that decided the architecture. The districts with the weakest connectivity and the districts with the widest protection gap are substantially the same districts.

That correlation is fatal for any design that assumes a live connection. If recording a case requires the network to be up at the moment of recording, the system will be used most reliably in the places that need it least, and will be abandoned in exactly the places it was built for. An officer with no signal does not wait for the system. They write on paper, and the paper does not route, does not escalate and does not appear on anyone else’s dashboard.

So the platform is offline-first by construction, on Next.js 15 with PostgreSQL and PostGIS: capture works locally against a device-side store, work queues durably, and synchronisation happens when connectivity returns rather than being a precondition for doing the work at all.

This is harder than it sounds, and the difficulty is not the caching. It is that offline-first forces you to think properly about identity, ordering and conflict — what happens when two officers touch the same case from two disconnected devices, and which version of the truth wins when they meet. Getting that wrong in a case-management system is worse than being online-only, because a silently lost update looks exactly like a case nobody reported.

## Routing to the nearest *qualified* agency

Cases are routed geospatially, which is what PostGIS is doing in the stack. But the operative word is not *nearest* — it is *qualified*.

Proximity alone produces confident, fast, wrong referrals: a trafficking case routed to the closest office that has no mandate over trafficking, which then has to make its own onward referral, reintroducing precisely the manual handoff the platform was built to remove. Routing therefore has to run against geography and mandate together — which body can act on this category of case, at this severity, in this location.

Encoding that is as much an institutional question as a technical one. It requires agreeing, explicitly and in advance, who handles what. A good deal of what looks like software design here is really the documentation of an inter-agency agreement that has previously only existed as professional custom.

## Escalation, because silence is the failure mode

Severity-based service-level escalation is the answer to the queue problem. Each case carries a severity, each severity carries a response expectation, and when that expectation is not met the case does not sit quietly — it escalates.

The purpose is not to punish officers, most of whom are carrying more cases than any reasonable load. It is to make inaction visible at the moment it becomes consequential, rather than at an audit two years later. A case that no one has claimed should be loud.

## The dashboard is a spine, not a replacement

The inter-agency dashboard links CHRAJ, the Department of Children, the Department of Gender, Social Welfare, the Labour Department and the Ghana Police Service, putting the referral trail in one place across bodies that currently keep separate records.

It deliberately does not try to be each agency’s system of record. Attempting that is how coordination platforms die: they demand that six institutions abandon working internal processes for a newcomer’s, and six institutions decline. What GUARDIAN offers instead is the connective layer — the shared trail showing where a case came from, who holds it now, and how long they have held it.

## What GUARDIAN is, and what it is not

It is a submitted platform and a competition finalist. It is not a deployed national system. It has no operational caseload, no live agency users and no field evidence behind it. Every claim above is a design claim, argued from the failure mode, not a result.

I think that distinction is worth stating plainly, because civic technology has a habit of blurring it, and the blurring does real harm — it crowds out attention from systems that have actually been run in anger.

What would have to be true before deployment is a longer list than the build was: a lawful basis and custody arrangement for sensitive data about children, formal agreement among six agencies on routing rules and record ownership, a short code and aggregator arrangement for the USSD channel, and training for the officers who would carry it.

None of that is software. All of it is the reason software like this succeeds or fails — which is, in the end, the same argument the platform itself makes about child protection: the hard part was never the individual capability. It was the handoff.`,
  },
]
