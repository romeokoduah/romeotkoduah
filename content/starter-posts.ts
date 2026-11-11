export interface StarterPost {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  bodyMd: string
  /** Served from public/, pre-cropped to the 21:9 cover frame. */
  coverUrl?: string
  /** Slugs this post was published under before; the seed renames them. */
  previousSlugs?: string[]
  /** Publication date shown on the site, ISO; normally the event date. */
  publishedAt?: string
}

/**
 * Long-form blog posts written in Romeo's own voice — first person, in contrast
 * to the third-person register used across the rest of the site. Every figure,
 * partner, date and output is drawn from the CV or, for event stories, from the
 * correspondence and activity report behind them; nothing is invented.
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
  {
    slug: 'ysb-ghana-eu-knowledge-policy-training',
    publishedAt: '2026-05-08T12:00:00Z',
    previousSlugs: ['the-front-door-to-brussels'],
    title: 'Facilitating EU Knowledge and Policy Frameworks Training for the Youth Sounding Board Ghana',
    excerpt:
      'On 8 May 2026 I facilitated Module 1 of the Youth Sounding Board Ghana capacity-building programme in Accra, covering EU institutions, EU decision-making and consultation entry points, and Global Gateway and NDICI-Global Europe.',
    tags: ['youth', 'eu', 'training', 'facilitation', 'policy dialogue', 'ghana'],
    coverUrl: '/images/blog/ysb-ghana-eu-training/cover.jpg',
    bodyMd: `On 8 May 2026 I facilitated a one-day training for members of the Youth Sounding Board (YSB) Ghana at the San Marino Hotel, Osu, Accra. The session was Module 1, EU Knowledge and Policy Frameworks, of the YSB Ghana capacity-building programme. It was delivered under the EU-funded project Support to Youth Sounding Board and Youth Participation in Policy Dialogue in Ghana, implemented by Eurecna Srl for the Delegation of the European Union to Ghana.

## Background

The YSB Ghana advises the EU Delegation on youth perspectives in its work in Ghana. Members had served on the board for about a year and had taken part in EU Delegation events, but had not yet received structured training together.

The content of the module was set by a training needs assessment carried out among the members, supported by focus group discussions and key informant interviews. It identified one priority gap: limited operational understanding of EU institutional structures and decision-making processes. The objective of Module 1 was to close that gap and show members where, and how, YSB input can realistically influence EU processes.

I was engaged by Eurecna as the facilitator for Module 1. My co-facilitator, Noah Bugre, delivered Module 2 on advocacy and policy product development.

## Training content

The day was organised in three modules.

**Module 1.A: EU Institutional Architecture.** An overview of the European Union and the roles of its seven main institutions, followed by the bodies most relevant to the YSB: the European External Action Service, the EU Delegation to Ghana, and the European Economic and Social Committee and Committee of the Regions as formal channels for civil society.

**Module 1.B: Decision-Making Cycles and Consultation Entry Points.** The distinction between the EU legislative cycle, which makes laws, and the programming cycle, which allocates funding, and why the YSB's main leverage lies in the programming cycle. The session traced the programming chain from the Multiannual Financial Framework to NDICI-Global Europe, the Multi-annual Indicative Programme (MIP) for Ghana and the Annual Action Plans. It identified the pre-proposal stage as the point at which external stakeholders can contribute most effectively, and introduced the European Commission's Have Your Say portal, including how to set keyword alerts.

**Module 1.C: Global Gateway and NDICI-Global Europe.** Global Gateway as the EU's external investment strategy and its five priority sectors (digital, climate and energy, transport, health, and education and research); NDICI-Global Europe as the financing instrument behind it; Ghana's MIP priorities; and the Team Europe approach to delivery. The EU-Ghana cooperation framework, originally planned as a separate session by an EU Delegation officer, was incorporated into this module.

## Methodology

The training used a participatory approach. Each module opened with learning objectives and a short poll on prior knowledge, moved through content supported by EU-Ghana examples, and closed with a group exercise and a knowledge check (Match-the-Institution, Sequence-the-Steps, and a True-or-False round).

Participants worked in groups organised by YSB thematic areas. Each group exercise ended with a two-minute presentation to plenary, framed as a briefing to the Head of the EU Delegation.

## Group outputs

Each group produced three working documents:

- **Institutional map:** one priority youth issue, the three EU institutions most relevant to it, and an entry point for each.
- **Engagement calendar:** three EU consultation windows in 2026, with a YSB action and expected output for each.
- **Global Gateway project pitch:** a youth-focused project for Ghana in one Global Gateway sector, with objective, target group, partners and alignment to MIP Ghana priorities.

![Climate group presenting its Global Gateway project pitch](/images/blog/ysb-ghana-eu-training/climate-pitch.jpg)

Issues addressed by the groups included education access, climate and renewable energy transitions, and youth economic inclusion. The education group, for example, presented a project on youth unemployment linked to technical and vocational education and training (TVET), identifying Ghana's TVET service, GIZ and the EU Delegation as partners and aligning it with the green jobs priority. Several pitches included Team Europe partners such as the EIB, GIZ and AFD.

![Education group presenting its TVET and youth employment project](/images/blog/ysb-ghana-eu-training/education-pitch.jpg)

## Results

Eight YSB members completed the training and the post-training assessment.

- All eight participants answered all seven knowledge-check questions correctly (100%).
- Mean self-rated confidence, on a five-point scale, was 4.62 on Global Gateway and what it means for Ghana, 4.57 on the EU decision-making process, 4.50 on identifying entry points for youth engagement, 4.50 on EU-Ghana cooperation, and 4.00 on familiarity with EU-funded programmes in Ghana.

The lowest score, on programme-level familiarity, identifies the area for reinforcement in later modules. In written feedback, participants most often cited the EU decision-making cycle, the role of the EU Delegation as the entry point to EU institutions, and the distinction between Global Gateway and NDICI-Global Europe. Eurecna reported positive feedback on the training from both the EU Delegation and YSB members.

## Recommendations

In the activity report I recommended:

1. Retaining the participatory methodology for subsequent modules.
2. Setting up a shared Have Your Say alert for the YSB covering Ghana, Africa, youth and NDICI.
3. Complementary training in communication skills, project management, and monitoring and evaluation.
4. A short orientation, led jointly by the EU Delegation and the YSB coordination team, to reconfirm the YSB's advisory role, representation protocols and the formal channels for submitting its positions.

## Acknowledgements

I thank Eurecna Srl and the Delegation of the European Union to Ghana for the opportunity, Noah Bugre for the collaboration, and the members of the YSB Ghana for their participation.`,
  },
  {
    slug: 'ghana-zev-supply-side-regulation-validation-workshop',
    publishedAt: '2026-03-05T12:00:00Z',
    title: 'Validating Ghana\'s Zero-Emission Vehicle Supply-Side Regulation',
    excerpt:
      'On 5 March 2026, government, industry and development partners met at the Ministry of Transport in Accra to validate Ghana\'s draft Zero-Emission Vehicle Sales Standard, the country\'s first supply-side regulation for electric mobility.',
    tags: ['e-mobility', 'policy', 'regulation', 'validation workshop', 'ghana'],
    coverUrl: '/images/blog/ssr-validation-workshop/cover.jpg',
    bodyMd: `On 5 March 2026, the Regional Centre for Energy and Environmental Sustainability (RCEES) at the University of Energy and Natural Resources, the United Nations Environment Programme (UNEP) and the Ministry of Transport convened a stakeholder validation workshop on Ghana's draft Supply-Side Regulation (SSR) for electric vehicles. The workshop was held in the New Conference Room of the Ministry of Transport in Accra.

I coordinated the workshop and presented Ghana's electric vehicle policy context and the objectives of the regulation, together with its implementation protocol and institutional arrangements.

## Background

Ghana's transport sector accounts for about 48% of the country's energy-related carbon dioxide emissions. Most vehicles entering the market are used imports, so the composition of the national fleet is largely decided before vehicles reach Ghanaian buyers. Demand-side measures such as tax waivers and charging infrastructure are necessary, but they cannot by themselves change which vehicles are supplied to the market.

A supply-side regulation addresses that directly. It places obligations on the entities that bring vehicles into the country: importers, assemblers and manufacturers. Since 2025, RCEES has been developing Ghana's SSR with review and coordination by UNEP and funding from the ClimateWorks Foundation. The process included a baseline study, a government-industry consultative workshop on sales targets, technical reports on the mechanism, institutional arrangements and penalties, a financial assessment, and expert review by UNEP, the ClimateWorks Foundation and the International Council on Clean Transportation (ICCT). The 5 March workshop was the formal validation step for that body of work.

## The workshop

The objective was to present the draft regulation and hold a structured dialogue to validate its regulatory framework, penalty framework and implementation roadmap. Participants received the concept note and the draft regulation documents in advance.

The programme opened with remarks from the Ministry of Transport, UNEP and the RCEES project lead, Rev. Prof. Ing. Eric Ofosu Antwi. I then set out the national policy context and the objectives of the regulation, and Dr. Felix Amankwah Diawuo presented the SSR development process. My presentation also covered how the regulation would be implemented: which institutions hold which responsibilities, how compliance data would flow between agencies, and which legal entities fall under each compliance category.

![Presenting the institutional framework for the ZEV Sales Standard](/images/blog/ssr-validation-workshop/institutional-framework.jpg)

An open plenary session followed for questions, clarifications and stakeholder inputs on the draft.

Invited participants came from government ministries and agencies, vehicle importers and assemblers, electric mobility companies, charging operators, financial institutions, transport operators, academia and development partners.

![The validation workshop in the New Conference Room of the Ministry of Transport](/images/blog/ssr-validation-workshop/plenary.jpg)

## What was presented for validation

The draft establishes a Zero-Emission Vehicle (ZEV) Sales Standard as Ghana's principal supply-side instrument. Its main elements are:

- **Sales targets by vehicle category.** Regulated entities must ensure that a minimum share of their annual sales are zero-emission vehicles, with targets set separately for each category and rising from 2027 to 100% by 2040. For private cars, the draft proposes 5% in 2027, 25% by 2032, 50% by 2035, 70% by 2037 and 100% by 2040. Two- and three-wheelers start at 15% and 12% respectively, buses at 10%, and freight trucks at 5%, rising to 30% by 2030 in line with the Global MOU on Zero-Emission Medium- and Heavy-Duty Vehicles.
- **Coverage.** The standard applies to new and used vehicles, imported or locally assembled, and to commercial importers, assemblers and government institutions that import vehicles. Compliance is assessed on each entity's annual portfolio, not on individual consumers.
- **Credit trading.** Entities that exceed their targets generate tradeable credits (one per ZEV, half per plug-in hybrid), restricted by vehicle segment and valid for five years. Credit prices are capped below the penalty rate, so buying credits is always cheaper than paying fines.
- **Penalties.** The draft proposes per-vehicle shortfall penalties that vary by vehicle category, additional charges for repeat non-compliance, and escalating measures for persistent violators, including suspension of import licences.
- **Green Transport Development Fund.** Penalty and levy revenues would go to a ring-fenced fund under the Ministry of Transport, with 40% allocated to charging infrastructure and the remainder to consumer incentives, fleet transition financing, emissions monitoring and research.
- **Phased enforcement.** 2027 is a reporting-only grace year, penalties start at 50% in 2028, and full enforcement begins in 2029.
- **Institutional roles.** The draft assigns responsibilities to the Ministry of Transport, DVLA, the Ministry of Finance and GRA Customs, the Ghana Standards Authority, the EPA, the Ghana Automotive Development Centre, the Ministry of Trade, Agribusiness and Industry, and the Electric Mobility Policy Working Group.

![Explaining how compliance data would flow between agencies](/images/blog/ssr-validation-workshop/data-flows.jpg)

## Participatory scenario development session

The second session was led by Delft University of Technology (TU Delft) and the Kwame Nkrumah University of Science and Technology (KNUST) under their joint research collaboration on electric mobility. The research team presented interview results and policy packages, and participants worked in groups to agree a shared vision for electric mobility in Ghana and to develop pathways towards it.

## Outcomes and next steps

The workshop completed the validation stage of the national policy formulation process. Stakeholder inputs from the session were incorporated into the final policy document, which was prepared to the format of the National Development Planning Commission (NDPC) so that it can move through government's own adoption process.

Later in March, the process and its lessons were shared with neighbouring countries through a sub-regional ECOWAS webinar on supply-side regulation for electric mobility.

The remaining steps towards formal adoption are:

1. A consultation with the Electric Mobility Policy Working Group and wider stakeholder engagement across the regions.
2. Finalisation of the communications strategy and the implementation matrix.
3. A Strategic Environmental Assessment, as required for new policies.
4. Submission to the NDPC for technical clearance.
5. Legal review by the Attorney-General.
6. A Cabinet memorandum and Cabinet approval.
7. Drafting of a Legislative Instrument to give the standard legal effect.

## Acknowledgements

I thank the Ministry of Transport, UNEP and the ClimateWorks Foundation for their support, my colleagues at RCEES, the TU Delft and KNUST research team, and all participants for their contributions to the validation of the regulation.`,
  },
  {
    slug: 'atec-ghana-ecook-local-stakeholder-consultation',
    publishedAt: '2026-09-15T12:00:00Z',
    title: 'Local Stakeholder Consultation for the ATEC Ghana eCook Clean Cooking Programme',
    excerpt:
      'On 15 September 2026, Eco-Lution Consults convened a hybrid Local Stakeholder Consultation in Accra, Kumasi, Cape Coast and Tamale for ATEC\'s smart electric cooking programme, prepared under the Ghana-Switzerland cooperative approach under Article 6.2 of the Paris Agreement.',
    tags: ['clean cooking', 'carbon markets', 'article 6', 'stakeholder engagement', 'ghana'],
    coverUrl: '/images/blog/atec-lsc-ghana/cover.jpg',
    bodyMd: `On 15 September 2026, Eco-Lution Consults convened the Local Stakeholder Consultation (LSC) for ATEC's proposed clean cooking programme in Ghana. The Accra session was held at Dr. Frempong Hall, Council for Scientific and Industrial Research (CSIR), and was linked by live video to regional centres in Kumasi, Cape Coast (Elmina) and Tamale.

I was part of the Eco-Lution Consults coordination team for the consultation and opened the Accra session, welcoming participants and introducing the firm's role before handing over to the ATEC team.

![Opening the Local Stakeholder Consultation at CSIR, Accra](/images/blog/atec-lsc-ghana/opening.jpg)

## The programme

The programme, "100% Data-Auditable Smart Electric Stove with Verified Household Carbon Payments" (the Ghana eCook programme), is being developed by ATEC to help urban and peri-urban households move from charcoal to electric induction cooking. It plans to distribute up to 100,000 induction cookstoves, subject to funding and regulatory clearance, with a crediting period running to December 2035.

The programme is being prepared for authorisation under Article 6.2 of the Paris Agreement, as a cooperative approach between Ghana and Switzerland. Once authorised by the Government of Ghana, the mitigation outcomes it generates are expected to be transferred to Switzerland as internationally transferred mitigation outcomes (ITMOs).

Its distinguishing feature is measurement. Each stove carries an IoT module that reports its electricity use to ATEC's digital monitoring (dMRV) platform around 20 to 24 times a day, so emission reductions are calculated from the measured use of every stove rather than estimated from a small field sample.

## Why a consultation

The Gold Standard for the Global Goals requires project developers to consult local stakeholders before a project is implemented. The LSC was designed to inform stakeholders about the programme and its expected benefits, gather feedback from communities, local authorities, government, civil society and charcoal value-chain actors, identify risks and questions, explain how carbon revenues would work, and set up a grievance and feedback channel that continues beyond the meeting.

Ahead of the consultation, the team also held preparatory meetings with the Ministry of Energy and the Energy Commission.

## Format and participation

The consultation used a hybrid hub-and-spoke format on a single day, so that regional stakeholders could take part without travelling to Accra. ATEC's presentations were streamed from Accra to the three regional centres, where regional coordinators explained them in the local language and led discussions.

A total of 80 stakeholders took part, excluding facilitators, consultants and the ATEC team: 28 in Accra, 18 in Kumasi, 16 in Cape Coast and 18 in Tamale. Women made up 61 of the 80 participants and were the majority at every hub. This matters for the programme, since women are the main decision-makers on household cooking fuel and the main users the programme intends to reach.

The Accra hub brought together government ministries and agencies, national and international NGOs, civil society organisations and household representatives. The regional centres focused on household women, women leaders of community groups, traditional leaders, including the head of the fishermen's association at Elmina, and NGOs active in each region.

![ATEC presenting the programme design in Accra](/images/blog/atec-lsc-ghana/programme-presentation.jpg)

## What participants raised

ATEC presented the Ghanaian cooking-energy context, the eCook induction stove, the digital monitoring system, the Cook to Earn incentive scheme, the distribution model and the carbon revenue pathway. Participants then raised 37 questions and comments in plenary, and each regional centre held a breakout discussion on the programme's contribution to six Sustainable Development Goals (SDGs 1, 3, 5, 7, 8 and 13).

![A participant raising a question during the plenary session](/images/blog/atec-lsc-ghana/question-from-the-floor.jpg)

The main themes across the hubs were:

- data privacy and the scope of usage tracking;
- the conditions under which a stove could be repossessed for non-use;
- whether flat induction plates work with local cookware and dishes such as banku, kenkey and smoked fish;
- affordability, subsidies and payment terms, including shared electricity meters in compound housing;
- the reliability of the electricity supply;
- end-of-life disposal and electronic waste; and
- the quality of jobs for local technicians and distributors.

The regional breakouts added location-specific issues that the plenary alone would not have surfaced, such as coastal corrosion and incompatible cookware at Cape Coast, and power supply and cost conditions in Kumasi and Tamale.

![Demonstrating the eCook induction cooker](/images/blog/atec-lsc-ghana/ecook-stove.jpg)

## Outcomes

No stakeholder identified a Gold Standard safeguarding principle that the programme would breach. The concerns raised were practical design and disclosure matters, and they were recorded in full, including critical and dissenting views, in the consultation report prepared by Eco-Lution Consults.

The report found the programme's objectives broadly supported by the communities and institutions consulted, and consolidated all open items into a follow-up table for ATEC's response during the 15-day stakeholder feedback period. Its evidence will inform the programme's Mitigation Activity Design Document.

![Speaking during the plenary session in Accra](/images/blog/atec-lsc-ghana/plenary-remarks.jpg)

## Acknowledgements

I thank ATEC for the opportunity, my colleagues at Eco-Lution Consults, the regional coordination teams in Kumasi, Cape Coast and Tamale, CSIR for hosting the Accra session, and all participants for their time and contributions.`,
  },
  {
    slug: 'unicef-startup-lab-pitch-day-guardian',
    publishedAt: '2026-06-09T12:00:00Z',
    title: 'Pitching GUARDIAN at the UNICEF StartUp Lab Pitch Day',
    excerpt:
      'On 9 June 2026 I pitched GUARDIAN, a child-protection referral platform built by UNIYIA, at the UNICEF StartUp Lab Pitch Day for the Reducing Child Labour and Trafficking Challenge at the UNICEF Ghana office in Accra.',
    tags: ['child protection', 'civic tech', 'unicef', 'pitch', 'ghana'],
    coverUrl: '/images/blog/unicef-startup-lab-guardian/cover.jpg',
    bodyMd: `On 9 June 2026 I represented the United Youth Initiative for Africa (UNIYIA) at Pitch Day for the UNICEF StartUp Lab Reducing Child Labour and Trafficking Challenge, held at the UNICEF Ghana office in Accra. I pitched GUARDIAN, the child-protection platform I designed and built for UNIYIA.

## The challenge

The challenge invited innovations that could help reduce child labour and trafficking in Ghana. More than 60 applications were received, and 11 teams were selected to pitch. Each team had ten minutes before the judges: a five-minute pitch, a two-minute demonstration of the solution and three minutes of questions. Teams based in Accra pitched in person, while teams outside Accra joined online.

## What GUARDIAN does

GUARDIAN (Ghana Unified Referral and Digital Intelligence for Action on Neglect) is built around one observation: child protection in Ghana rarely fails because no institution is responsible. It fails at the handoff between institutions. A single case can involve the Commission on Human Rights and Administrative Justice, the Department of Children, the Department of Gender, the Department of Social Welfare, the Labour Department and the Ghana Police Service, and the referral between them is often a phone call or a letter that no one follows up.

![Pitching GUARDIAN to the judges](/images/blog/unicef-startup-lab-guardian/pitching-guardian.jpg)

The platform addresses that gap with:

- **Multi-channel reporting** through USSD, WhatsApp and the web, so that a case can be reported from a basic feature phone without a data bundle;
- **an offline-first design**, because the districts with the weakest connectivity are often the districts with the widest protection gap;
- **geospatial routing** that sends each case to the nearest institution with the mandate to act on that category of case;
- **severity-based escalation**, so that a case nobody has claimed becomes visible before it is too late; and
- **an inter-agency dashboard** that gives the six institutions a shared referral trail without replacing their own systems of record.

## The pitch

I presented the problem, the platform and a demonstration of the solution, and set out a proposal for a district-level validation pilot to test GUARDIAN with the institutions that would use it before any wider roll-out.

![Setting out the proposed validation pilot](/images/blog/unicef-startup-lab-guardian/pilot-budget-slide.jpg)

GUARDIAN is a design and prototype, not yet a deployed national system. Before deployment it would need formal agreement among the agencies on routing rules, a lawful basis for handling sensitive data about children, and training for the officers who would use it.

## Outcome

GUARDIAN was one of the 11 finalists. The winner of the challenge was SWIMS-Connect. Finalists received certificates of participation from the UNICEF StartUp Lab team.

![Receiving the certificate of participation](/images/blog/unicef-startup-lab-guardian/certificate.jpg)

Pitch Day brought GUARDIAN before UNICEF and child-protection practitioners, alongside ten other teams working on the same problem from different angles.

![Finalists and the UNICEF StartUp Lab team at UNICEF House, Accra](/images/blog/unicef-startup-lab-guardian/group-photo.jpg)

## Acknowledgements

I thank the UNICEF StartUp Lab team for organising the challenge, the judges for their questions, my colleagues at UNIYIA, and the other finalists for an inspiring day.

*Photographs: UNICEF StartUp Lab Pitch Day, 9 June 2026.*`,
  },
  {
    slug: 'african-youth-conference-2025-green-entrepreneurship-side-event',
    publishedAt: '2025-09-12T12:00:00Z',
    title: 'Speaking on Green Entrepreneurship and Skills at the African Youth Conference 2025',
    excerpt:
      'On 12 September 2025 I spoke at a UNIYIA side event on green entrepreneurship and skills for a youth-driven just transition, held at the African Youth Conference on Natural Resources and Environmental Governance in Accra.',
    tags: ['youth', 'green jobs', 'just transition', 'conference', 'ghana'],
    coverUrl: '/images/blog/ayc-2025-green-entrepreneurship/cover.jpg',
    bodyMd: `On 12 September 2025 I joined the panel of the side event "Advancing Green Entrepreneurship and Skills for Africa's Youth-Driven Just Transition", organised by the United Youth Initiative for Africa (UNIYIA) at the African Youth Conference on Natural Resources and Environmental Governance in Accra.

## The conference

The African Youth Conference (AYC 2025) was hosted by the Strategic Youth Network for Development (SYND Ghana) from 11 to 13 September 2025 at La Palm Royal Beach Hotel, Accra, under the theme "Transforming Africa's Natural Resource Governance through Youth-Led Solutions". It brought together more than 2,000 young leaders, policymakers, innovators and development partners for plenary panels, side events and breakout sessions on climate finance, energy transition, green entrepreneurship and accountability in natural resource management.

## The side event

The UNIYIA side event took place on the second day of the conference. It focused on the role of young Africans in the just transition as entrepreneurs and skilled workers, and on the skills and enterprise support that role requires.

The panel brought together practitioners from different parts of the green economy:

- Cordie Aziz Nash, Executive Director and Founder, Environment360;
- Monica B. Tampuri, Managing Director, BANYANI;
- Ignatius Awutey, Lead Strategist, Hillbiz Consulting;
- Noah Bugre, General Manager, UNIYIA;
- Sandra Tommy Wasara, Lead Communications and Fashion Facilitator, Urban Stitches;
- Aishetu Abdul-Razak, Co-founder, KaneaTech; and
- myself.

![On the panel at the UNIYIA side event, AYC 2025](/images/blog/ayc-2025-green-entrepreneurship/on-the-panel.jpg)

## My submission

My central point was that Africa's transition must be youth-focused, youth-created and youth-owned. A just transition cannot be achieved if young people remain passive recipients of programmes designed without their active leadership.

I also spoke about a growing disappointment among young people. Many have been engaged repeatedly on the promise of green jobs, yet still face barriers to accessing those opportunities. Awareness and dialogue are no longer enough. What is needed are clear pathways that turn policies and pilot projects into real livelihoods and enterprises that young people can build and sustain.

Africa's youth have the creativity, urgency and capacity for innovation needed to redefine our energy, transport and circular economy systems. What they need now is trust, investment and structural inclusion that allows them not only to participate, but to lead.

![The side event panel on the main stage](/images/blog/ayc-2025-green-entrepreneurship/side-event-stage.jpg)

## Acknowledgements

I thank UNIYIA for hosting this conversation, SYND Ghana for convening the conference, and my fellow panellists for their practical insights on driving an inclusive, youth-led transition.

![The panellists after the session](/images/blog/ayc-2025-green-entrepreneurship/panel-group-photo.jpg)

*Photographs: African Youth Conference 2025 official photography.*`,
  },
  {
    slug: 'undp-ghana-sdg-acceleration-dialogue-2026',
    publishedAt: '2026-03-17T12:00:00Z',
    title: 'Taking Part in the UN Multi-Stakeholder Dialogue on Accelerating Ghana\'s SDG Progress',
    excerpt:
      'In March 2026 I took part in a high-level multi-stakeholder dialogue on accelerating Ghana\'s progress on the Sustainable Development Goals for 2027-2030, convened by UNDP and the UN Resident Coordinator\'s Office in Ghana.',
    tags: ['sdgs', 'undp', 'youth', 'policy dialogue', 'ghana'],
    coverUrl: '/images/blog/undp-sdg-dialogue-2026/cover.jpg',
    bodyMd: `In March 2026 I took part in a high-level multi-stakeholder dialogue on accelerating Ghana's progress on the Sustainable Development Goals (SDGs) for the period 2027-2030. The dialogue was convened by the United Nations Development Programme (UNDP) and the UN Resident Coordinator's Office in Ghana, and held at the UN offices in Accra.

## The dialogue

With the 2030 deadline for the SDGs approaching, the dialogue brought together government, development partners, civil society and young people to discuss where Ghana stands, what is holding progress back and where the opportunities for acceleration lie in the final years of the 2030 Agenda. The session formed part of the UN Country Analysis consultations, through which the UN system gathers views on Ghana's development priorities.

![The UN Country Analysis Consultation session](/images/blog/undp-sdg-dialogue-2026/consultation-session.jpg)

Participants worked in panel sessions and reported back to the plenary. Presenting for the youth panel, youth delegate James Amankwaa Yeboah Korang highlighted three propositions:

- addressing institutional bottlenecks that slow implementation;
- bridging the gap between industry and education, so that training matches the skills the economy needs; and
- promoting youth-led innovation as a driver of progress across the goals.

![Participants during the consultation](/images/blog/undp-sdg-dialogue-2026/consultation-room.jpg)

## My participation

I took part in the dialogue as a participant, contributing to the discussions on how to speed up progress in the remaining years to 2030. My own work sits across several of the goals the dialogue addressed, including clean energy (SDG 7), sustainable cities and transport (SDG 11), water (SDG 6) and climate action (SDG 13), and dialogues of this kind are where the evidence from that work can inform national priorities.

The message I share with the youth panel is simple: young people should have a seat in policy development, not only in consultation but in shaping and delivering the priorities that follow.

![With youth delegate James Amankwaa Yeboah Korang at the UN offices in Accra](/images/blog/undp-sdg-dialogue-2026/with-james-amankwaa.jpg)

## Acknowledgements

I thank UNDP Ghana and the UN Resident Coordinator's Office for convening the dialogue and for including young people in it, and James Amankwaa Yeboah Korang for sharing the photographs.

*Photographs: James Amankwaa Yeboah Korang.*`,
  },
  {
    slug: 'academia-industry-partnership-petroleum-career-fair-uenr',
    publishedAt: '2024-11-20T12:00:00Z',
    title: 'Moderating the Academia-Industry Partnership Panel at UENR\'s Petroleum Engineering Career Fair',
    excerpt:
      'In November 2024 I moderated Day 1 of the panel discussion at the Career Fair of UENR\'s Department of Petroleum and Natural Gas Engineering, on the theme \'The Need for Academia-Industry Partnership\'.',
    tags: ['career', 'academia industry', 'petroleum engineering', 'uenr', 'moderation'],
    coverUrl: '/images/blog/academia-industry-partnership-petroleum-career-fair-uenr/cover.jpg',
    bodyMd: `In November 2024, the Department of Petroleum and Natural Gas Engineering at the University of Energy and Natural Resources (UENR) held a Career Fair for its students. I moderated Day 1 of the panel discussion, which was held on the theme "The Need for Academia-Industry Partnership".

The panel brought together:

- Dr. Yaw Akyampon B., Head of the Department of Petroleum and Natural Gas Engineering;
- Ing. Enoch Asare Ayesu, Ghana National Gas Company Limited;
- Ing. Muhammed Muftawu Alhassan, Ghana National Gas Company Limited.

![On stage at the Career Fair of the Department of Petroleum and Natural Gas Engineering, UENR](/images/blog/academia-industry-partnership-petroleum-career-fair-uenr/photo-01.jpg)

## The discussion

The panel focused on the role of collaboration between universities and industry in preparing graduates for work. A consistent message was that students need more than theoretical knowledge: they need practical skills, sound values and adaptability, which the panellists described as the keys to thriving in a competitive job market.

As moderator, my aim was to ask the right questions, press for clarity and keep the discussion focused on equipping students with the mindset, tools and values they need. One of the most engaging moments came when the panellists reflected on what they would do differently if they were back in their final year of university. Their answers were candid and resonated with the audience.

![Students attending the panel discussion](/images/blog/academia-industry-partnership-petroleum-career-fair-uenr/photo-04.jpg)

## Six recommendations for students

Six recommendations emerged from the discussion:

1. **Build connections early.** Develop relationships with peers, lecturers, alumni and professionals in your field. Do not wait until graduation to start engaging with industry.
2. **Find mentors.** Seek out lecturers, industry professionals or senior colleagues who can offer insight, feedback and direction for your career.
3. **Think critically and solve problems.** Employers value people who can think critically and provide solutions. Treat challenges as opportunities to innovate and learn.
4. **Manage your time.** Learn to balance academic, personal and professional commitments. Being time-conscious is a skill that will serve you throughout your career.
5. **Develop soft skills.** Technical expertise is essential, but humility, teamwork, communication and adaptability often determine how far you go.
6. **Acquire practical skills and certifications.** Employers want graduates who add value to their organisations. Be proactive in gaining competencies that set you apart.

![On stage before the panel session](/images/blog/academia-industry-partnership-petroleum-career-fair-uenr/photo-02.jpg)

## Acknowledgements

I thank the panellists, Dr. Yaw Akyampon B., Ing. Enoch Asare Ayesu and Ing. Muhammed Muftawu Alhassan, for their candid contributions, and Dr. Yaw Akyampon B. and the Department of Petroleum and Natural Gas Engineering for creating this platform.`,
  },
  {
    slug: 'maiden-epic-talks-integrated-clews-research-africa',
    publishedAt: '2024-12-09T12:00:00Z',
    title: 'The Maiden EPIC Talks: Integrated CLEWs Research for Sustainable Development in Africa',
    excerpt:
      'On 9 December 2024 I moderated the maiden EPIC Talks webinar of the EPIC Africa Research Network, on how integrated Climate, Land, Energy and Water systems (CLEWs) research can address Africa\'s development challenges.',
    tags: ['clews', 'water energy food nexus', 'epic africa', 'research', 'webinar'],
    coverUrl: '/images/blog/maiden-epic-talks-integrated-clews-research-africa/cover.jpg',
    bodyMd: `On 9 December 2024, the EPIC Africa Research Network (EARN) held the maiden edition of EPIC Talks, its flagship series created to connect research with real-world impact across Africa. I moderated the session, which took place online on Zoom.

## The session

The first webinar was held under the theme "Fostering Collaborative Solutions for Sustainable Development: Driving Impact through Integrated CLEWs Research in Africa". It examined how integrated research on Climate, Land, Energy and Water systems (CLEWs) can help address Africa's development challenges, covering policy, modelling tools and case studies from Ghana and Kenya.

The session was hosted by Prof. Ing. Eric Ofosu Antwi, with three guest speakers:

- Dr. Alunda Bernard Ouma;
- Prof. Ing. David Ato Quansah; and
- Shreyas Gopal Savanur.

As moderator, my role was to guide the conversation between the speakers and the audience and to keep the discussion focused on how integrated, cross-sector evidence can move from research into planning and policy.

## Why CLEWs matters to my work

Much of my work sits at the intersection of water, energy and food. These systems are closely linked: decisions on hydropower affect irrigation and water supply, land use shapes energy demand and water availability, and climate change acts on all of them at once. Planning each sector in isolation risks policies that work against one another.

The CLEWs approach, in which I trained through the EPIC Africa Summer School on CLEWs-based Water-Energy-Food Modelling, offers a structured way to model these interactions and to test policy options across sectors before they are implemented. A regular forum such as EPIC Talks, where researchers and practitioners share tools and country experience, helps bring that kind of integrated analysis to the people who make decisions.

## Acknowledgements

I thank the EPIC Africa Research Network for launching EPIC Talks, Prof. Ing. Eric Ofosu Antwi for hosting, and Dr. Alunda Bernard Ouma, Prof. Ing. David Ato Quansah and Shreyas Gopal Savanur for their contributions to the maiden session.

*Image: EPIC Africa Research Network.*`,
  },
  {
    slug: 'ten-career-lessons-young-engineers-waimm-uenr',
    publishedAt: '2025-02-25T12:00:00Z',
    title: 'Ten Career Lessons for Young Engineers: My Talk at the WAIMM Event at UENR',
    excerpt:
      'At a WAIMM career guidance seminar at the University of Energy and Natural Resources in February 2025, I spoke to engineering students about ten career lessons centred on execution, adaptability, visibility and ownership.',
    tags: ['career', 'engineering education', 'mentorship', 'uenr', 'waimm'],
    coverUrl: '/images/blog/ten-career-lessons-young-engineers-waimm-uenr/cover.jpg',
    bodyMd: `In late February 2025, I delivered a talk at a career guidance seminar organised by the West African Institute of Mining, Metallurgy and Petroleum (WAIMM) at the University of Energy and Natural Resources (UENR). The audience was made up mainly of engineering students preparing to enter the profession.

I spoke alongside Isaac Duffour and Evelyn Ofori Atta, senior professionals in the industry, who shared their own career breakthroughs and the passion and discipline that have carried them forward.

[Watch the full speech](https://lnkd.in/dYYYHH8R)

![Students at the WAIMM career guidance seminar at UENR](/images/blog/ten-career-lessons-young-engineers-waimm-uenr/photo-04.jpg)

## The ten lessons

My talk was built around ten lessons that are rarely stated plainly to students, but that I believe every ambitious young engineer should take seriously.

1. **Talent is overrated; leverage adaptability.** Natural ability helps, but the ability to adjust to new tools, roles and circumstances is what keeps a career moving.
2. **Knowledge alone will not save you; execution will.** What you know matters only when you apply it and deliver results.
3. **Your network is not your net worth; your value to the network is.** Connections are useful only when you bring something of value to the people in them.
4. **No one cares about your struggles; they care about your solutions.** Employers and partners respond to the problems you can solve, not to the difficulties you describe.
5. **Obsession is a superpower; mastery requires extremes.** Real mastery of a field demands sustained, focused and deliberate effort.
6. **Visibility trumps ability.** If no one knows you exist, your ability creates no opportunities, so make your work known.
7. **Comfort is the enemy; seek controlled chaos.** Growth comes from deliberately taking on challenges that stretch you, while keeping the risk managed.
8. **Mentorship is overrated; build value and mentors will seek you.** Rather than waiting for a mentor, focus on becoming someone experienced people want to invest in.
9. **Resilience is more important than intelligence.** Setbacks are certain, and the ability to recover and keep going matters more than raw intellect.
10. **Money follows ownership; own something.** Long-term financial progress comes from owning something, whether assets, ideas or ventures, not only from earning a salary.

![A speaker addressing students at the seminar](/images/blog/ten-career-lessons-young-engineers-waimm-uenr/photo-03.jpg)

## The common thread

The message that tied these lessons together was that breakthroughs rarely come from hard work alone or from waiting for opportunities to appear. They come from relentless execution, strategic positioning and taking ownership.

![Students following the talks](/images/blog/ten-career-lessons-young-engineers-waimm-uenr/photo-05.jpg)

## Acknowledgements

I thank WAIMM and UENR for the invitation, and my co-speakers Isaac Duffour and Evelyn Ofori Atta, whose accounts of their own careers were an inspiration to me as well as to the students.`,
  },
  {
    slug: 'ghana-electric-mobility-stakeholder-dialogue-policy-working-group',
    publishedAt: '2025-04-10T12:00:00Z',
    title: 'Shaping Ghana\'s E-Mobility Policy: Presenting the Policy Working Group Framework at the UNEP Stakeholder Dialogue',
    excerpt:
      'At the Ghana Electric Mobility Stakeholder Dialogue in Accra on 10 April 2025, I presented, on behalf of RCEES, the operational framework for the inter-ministerial E-Mobility Policy Working Group, which stakeholders validated and helped refine.',
    tags: ['e mobility', 'electric vehicles', 'transport policy', 'unep', 'ghana', 'rcees'],
    coverUrl: '/images/blog/ghana-electric-mobility-stakeholder-dialogue-policy-working-group/cover.jpg',
    bodyMd: `On 10 April 2025, the UN Environment Programme's (UNEP) Sustainable Mobility Unit and its NDC Action project convened the Ghana Electric Mobility Stakeholder Dialogue at the Mensvic Grand Hotel in Accra. The dialogue brought stakeholders together to discuss the next steps in Ghana's transition to electric mobility.

I presented on behalf of the Regional Centre for Energy and Environmental Sustainability (RCEES), an Africa Centre of Excellence at the University of Energy and Natural Resources (UENR). My task was to present, for validation, the operational framework for the E-Mobility Policy Working Group (PWG).

![Presenting the operational framework for the E-Mobility Policy Working Group](/images/blog/ghana-electric-mobility-stakeholder-dialogue-policy-working-group/photo-01.jpg)

## Background

The PWG is an inter-ministerial committee tasked with advancing Ghana's National Electric Vehicle Policy. To do that effectively it needs a clear operating structure: defined areas of responsibility, and a way for stakeholders outside government to feed into its work. The framework I presented was designed to provide that structure.

## Why e-mobility matters for Ghana

I opened by setting out the case for action with two figures from the presentation:

- **Emissions:** the transport sector accounts for 80% of Ghana's CO2 emissions.
- **Health and economic cost:** air pollution costs Ghana an estimated USD 1.6 billion every year.

Together these point to the urgent need to accelerate the adoption of electric vehicles.

## The PWG operational framework

The core of the framework is a set of four Special Interest Groups (SIGs), each responsible for one pillar of a comprehensive e-mobility strategy:

1. **Regulations and Guidelines** - the standards, rules and guidance needed to govern electric vehicles and their supporting systems.
2. **Finance and Logistics** - financing mechanisms and the logistical requirements of the transition.
3. **Awareness and Capacity Building** - public understanding and the technical skills needed across the sector.
4. **Infrastructure Development** - the charging and related infrastructure that wider EV adoption requires.

Participants reviewed the framework and provided feedback, which was incorporated to refine it. The stakeholders validated the framework as the basis for the PWG's operations.

![Responding to stakeholder questions and feedback on the framework](/images/blog/ghana-electric-mobility-stakeholder-dialogue-policy-working-group/photo-05.jpg)

## Supply-side regulation for e-mobility

The main presentation of the day was delivered by Annika Berlin of UNEP, on supply-side regulation (SSR) for electric mobility. She outlined UNEP's global support for e-mobility and the role SSR can play in accelerating EV adoption. She also addressed the particular challenges of Ghana's import-driven vehicle market and the need for alignment with ECOWAS standards. Her presentation provided a strong foundation for the discussions and for future work.

![The UNEP presentation on supply-side regulation for electric mobility](/images/blog/ghana-electric-mobility-stakeholder-dialogue-policy-working-group/photo-03.jpg)

## Proceedings

The dialogue was chaired by Prof. Eric Ofosu Antwi. The welcome address was delivered by Mr. Thomas Kankam Adjei, National Coordinator of UNEP's NDC Action Project in Ghana, who set the tone for the day's discussions.

![Presenting at the Mensvic Grand Hotel, Accra](/images/blog/ghana-electric-mobility-stakeholder-dialogue-policy-working-group/photo-04.jpg)

## What came next

The dialogue fed into later work. Over 2025-2026, RCEES worked with UNEP to develop Ghana's supply-side regulation for electric mobility, the Zero Emission Vehicle (ZEV) Sales Standard. The April 2025 discussions on SSR, Ghana's import-driven market and ECOWAS alignment, together with the PWG framework validated at the dialogue, formed part of the groundwork for that standard.

## Acknowledgements

I thank UNEP's Sustainable Mobility Unit and the NDC Action project for organising the dialogue, Annika Berlin for her presentation, Prof. Eric Ofosu Antwi for chairing the proceedings, and Mr. Thomas Kankam Adjei for his welcome address. I am also grateful to all participants for their contributions, and it was good to reconnect with Noah Bugre and Andrew Boamah Asare.`,
  },
  {
    slug: 'traditional-knowledge-clean-energy-future-of-energy-conference-2025',
    publishedAt: '2025-08-26T12:00:00Z',
    title: 'Traditional Knowledge and Africa\'s Clean Energy Transition: Panel at the Future of Energy Conference 2025',
    excerpt:
      'I spoke on a side-event panel at the Future of Energy Conference 2025 in Accra on how traditional ecological knowledge can strengthen clean energy innovation, and why the intellectual property of indigenous technologies needs protecting.',
    tags: ['energy transition', 'indigenous knowledge', 'clean cooking', 'youth', 'ghana', 'conferences'],
    coverUrl: '/images/blog/traditional-knowledge-clean-energy-future-of-energy-conference-2025/cover.jpg',
    bodyMd: `The Future of Energy Conference 2025 was convened by the Africa Centre for Energy Policy (ACEP) and the Enzi Ijayo Africa Initiative at the Labadi Beach Hotel, Accra, on 26-27 August 2025. I took part as a speaker on the panel of one of the conference side events, representing the Regional Centre for Energy and Environmental Sustainability (RCEES).

The side event, "Building Africa's Resilient Energy Future: The Role of Traditional Knowledge in Clean Energy Innovation and Transitions", was organised jointly by the Green Africa Youth Organization (GAYO) and the Strategic Youth Network for Development (SYND Ghana). I shared the panel with Gloria Kafui Kuzo (SYND) and Efua Nyamekye Appiah (GAYO).

![Speaking during the side-event panel on traditional knowledge in clean energy transitions](/images/blog/traditional-knowledge-clean-energy-future-of-energy-conference-2025/photo-01.jpg)

## The session

The 60-minute session examined how Traditional Ecological Knowledge (TEK) can strengthen modern clean energy solutions, support youth-led innovation and contribute to equitable energy transitions across Africa. The panel addressed three main questions:

- How indigenous communities have historically adapted to environmental challenges.
- What untapped potential traditional technologies hold for today's energy transitions, including clean cooking and indigenous green buildings.
- How modern technology and TEK can complement each other to build climate resilience.

![Participants at the Future of Energy Conference 2025, Labadi Beach Hotel, Accra](/images/blog/traditional-knowledge-clean-energy-future-of-energy-conference-2025/photo-05.jpg)

## Breakout discussions

Interactive breakout sessions followed the panel. Participants discussed how indigenous practices could be adapted for:

- bioenergy;
- clean cooking;
- energy-efficient building based on indigenous design;
- solar energy and battery storage.

The discussions also considered the risks of leaving TEK out of energy policy, in particular the gradual erosion of knowledge that communities have built up over generations.

![A participant contributing from the floor during the discussion](/images/blog/traditional-knowledge-clean-energy-future-of-energy-conference-2025/photo-03.jpg)

## My key point: protecting indigenous technologies

In my closing contribution I argued that indigenous technologies need to be systematically documented and their intellectual property (IP) protected. Without this, the knowledge holders lose recognition and benefit, and promising traditional solutions cannot be preserved or scaled responsibly. Collating this knowledge is the first step towards building it into clean energy research, product development and policy.

## Outcomes

The session closed with practical recommendations for policymakers, innovators and young people on integrating TEK into Africa's green agenda. As cited during the session, the green economy is projected to create over 3.3 million jobs by 2030, and some 400,000 jobs in Ghana alone by 2070, which underlines the value of making sure local knowledge and local people are part of that transition.

## Acknowledgements

I thank Efua Nyamekye Appiah and the Green Africa Youth Organization (GAYO), together with SYND Ghana, for the invitation to contribute, and Gloria Kafui Kuzo for a productive exchange on the panel. My thanks also go to ACEP and the Enzi Ijayo Africa Initiative for convening the conference.

*Photographs: Future of Energy Conference.*`,
  },
  {
    slug: 'strategic-communication-environmental-advocacy-training',
    publishedAt: '2025-09-04T12:00:00Z',
    title: 'Training on Strategic and Innovative Communication for Environmental Advocacy',
    excerpt:
      'In early September 2025 I co-led a two-day virtual training by UNIYIA on Strategic and Innovative Communication for Environmental Advocacy and Policy Impact, covering message design on day one and digital tools such as Flourish, Google Earth, Mentimeter, Kahoot and Canva on day two.',
    tags: ['climate communication', 'environmental advocacy', 'training', 'digital tools', 'uniyia'],
    coverUrl: '/images/blog/strategic-communication-environmental-advocacy-training/cover.jpg',
    bodyMd: `In early September 2025 I co-led a two-day virtual training organised by the United Youth Initiative for Africa (UNIYIA) on Strategic and Innovative Communication for Environmental Advocacy and Policy Impact. The training brought together a cohort of environmental advocates and moved from communication strategy on the first day to practical digital tools on the second. I facilitated alongside Lyzianah Emakoua, Esther Ehindero and Worship Joshua Frimpong.

The premise of the training was simple. The climate crisis does not lack data; what is often missing is the ability to communicate that data in a way that people understand, accept and act on.

## Day 1: Building a powerful message

The first day dealt with how an effective advocacy message is built. Communicating on climate is not a matter of releasing facts and hoping they land. It requires a deliberate structure, which we worked through in four parts.

**1. Know your audience.** Every message starts with the people it is meant for. A community group, a district assembly, a ministry official and a social media audience have different concerns, vocabulary and decision-making power. We discussed how to identify the audience, what they already know and value, and what would make them listen, so that messages are tailored rather than one-size-fits-all.

**2. Use plain language.** Scientific and policy language is precise, but often inaccessible. We worked on translating technical terms into clear, relatable language without losing accuracy: replacing jargon with everyday words, using concrete examples instead of abstractions, and explaining figures in terms people can picture, such as costs to a household or impacts on a familiar place.

**3. Frame it as a narrative.** People remember stories more readily than statistics. We looked at how to frame an issue with a clear structure: the situation, the problem and who it affects, and what can change. A narrative makes an abstract issue such as emissions or water stress tangible, and gives the audience a reason to care.

**4. End with a clear call to action.** A message that raises concern without saying what to do leaves the audience with nowhere to go. We emphasised closing every message with a specific, achievable action suited to the audience, whether that is signing a petition, adopting a practice, attending a meeting or changing a policy.

## Day 2: Digital tools for advocacy

The second day moved from strategy to practice, introducing digital tools that help advocates present evidence and engage audiences. For each tool we looked at what it does and where it fits in an advocacy workflow.

**Flourish** is a data visualisation platform for building interactive charts, maps and animated stories from spreadsheet data, without coding. For environmental advocacy it is useful for turning datasets, such as rainfall trends, emissions or energy access figures, into visuals that can be embedded in reports, websites and presentations.

**Google Earth** allows users to explore satellite imagery, compare locations over time and build guided map-based stories. In advocacy it can show change on the ground, such as deforestation, coastal erosion, mining or urban expansion, in a way that is difficult to dispute and easy to follow.

**Mentimeter** is an interactive presentation tool for live polls, word clouds and questions. It turns a presentation into a two-way exchange, lets facilitators gauge what an audience thinks in real time, and gives quieter participants a way to contribute.

**Kahoot** is a quiz-based learning platform. It is well suited to workshops, school sessions and community trainings, where a short competitive quiz can test understanding of key concepts and make learning more engaging.

**Canva** is a design platform with templates for infographics, posters, presentations and social media graphics. It allows advocates without design training to produce consistent, professional material that communicates a key message at a glance.

Participants applied these tools in practice during the session, beginning to sketch audience-focused campaign ideas that combined the messaging principles from day one with the tools introduced on day two.

## Key point

The training reinforced a view I hold firmly: strategic communication is not a supplementary soft skill but a core competency for environmental advocacy. It is what turns awareness into action and evidence into policy impact.

## Acknowledgements

Thanks to Noah Bugre for the opportunity to speak and for putting the training together, and to my co-facilitators Lyzianah Emakoua, Esther Ehindero and Worship Joshua Frimpong for their contributions. Thanks also to all the participants for their engagement.`,
  },
  {
    slug: 'lcoy-ghana-2025-conference-manager',
    publishedAt: '2025-09-19T12:00:00Z',
    title: 'LCOY Ghana 2025: Managing Ghana\'s Official Youth Climate Conference',
    excerpt:
      'On 19 September 2025 I served as Conference Manager for the Local Conference of Youth (LCOY) Ghana 2025 at the University of Ghana, convening over 500 registered young leaders, civil society groups and policymakers under YOUNGO.',
    tags: ['lcoy', 'youngo', 'unfccc', 'youth climate', 'conference management'],
    coverUrl: '/images/blog/lcoy-ghana-2025-conference-manager/cover.jpg',
    bodyMd: `On 19 September 2025 the Local Conference of Youth (LCOY) Ghana 2025 took place at the R. S. Amegashie Auditorium, University of Ghana. LCOY Ghana is the country's official youth climate conference under YOUNGO, the official youth constituency of the UNFCCC. This edition was organised by the United Youth Initiative for Africa (UNIYIA) and Gen Green, under the theme "Review, Reset: Empowering Youth for Ghana's Climate Future". I served on the steering committee as Conference Manager.

Over 500 young leaders, civil society groups and policymakers registered for the conference.

## Background

LCOYs are national youth climate conferences held under the YOUNGO framework. Their outputs feed formally into the UNFCCC process, which means the conference is expected to produce a credible national youth position rather than only a day of discussion. That places weight on how the conference is planned, who it reaches, and how its results are recorded.

## The steering committee

The conference was delivered by a steering committee with defined roles:

- **Noah Bugre** - Convener
- **Romeo Tweneboah Koduah** - Conference Manager
- **Monalisa Kayper-Tackie** - Lead, Monitoring, Evaluation and Learning
- **Elisha M.** - Programs Lead
- **Ishmael Barfi** - Communications Lead

![A panel session on the LCOY Ghana 2025 stage under the theme "Review, Reset: Empowering Youth for Ghana's Climate Future"](/images/blog/lcoy-ghana-2025-conference-manager/photo-02.jpg)

## My role as Conference Manager

As Conference Manager I was responsible for the planning and delivery of the conference, coordinating the work of the steering committee and volunteers so that a convening of over 500 registrants ran as one event. For a national youth conference the scale matters, because a youth position carries weight in proportion to the number of young people who helped shape it.

The conference also connects to the wider policy record, including the Ghana Youth Climate Action Roadmap (GYCAR) 2025-2030 and the National Youth Climate Statement.

## Monitoring, evaluation and learning

This edition was built with a monitoring and evaluation framework from the start. In the weeks before the event, Monalisa Kayper-Tackie designed and implemented the M&E framework together with Noah Bugre and me. The framework set out how success would be measured, how feedback loops would be structured, and how lessons from this year could inform future editions.

Monalisa trained and supervised a volunteer monitoring team, which tracked each phase of the event, from participation and session quality to post-event reflections.

![Monalisa Kayper-Tackie, Lead for Monitoring, Evaluation and Learning](/images/blog/lcoy-ghana-2025-conference-manager/photo-01.jpg)

## What the evaluation found

The evaluation found that LCOY continues to act as a catalyst for youth empowerment, linking climate action, innovation and opportunity. It also identified some dissemination challenges, which are a clear point for improvement in the next edition. Having the evaluation in place means those lessons are documented rather than left to memory.

It was also good to see delegates from the previous year's edition return, which says something about the continuity the conference is building.

![Steering committee and team members at LCOY Ghana 2025](/images/blog/lcoy-ghana-2025-conference-manager/photo-03.jpg)

## Acknowledgements

Thanks to my fellow steering committee members, Noah Bugre, Monalisa Kayper-Tackie, Elisha M. and Ishmael Barfi, for their leadership and teamwork; to the volunteer team; to UNIYIA and Gen Green for organising the conference; to YOUNGO; and to every delegate who registered and took part.

*Photographs: LCOY Ghana 2025 / Monalisa Kayper-Tackie.*`,
  },
  {
    slug: 'africa-e-mobility-week-2025-addis-ababa',
    publishedAt: '2025-10-14T12:00:00Z',
    title: 'Africa E-Mobility Week 2025 in Addis Ababa',
    excerpt:
      'In October 2025 I took part in Africa E-Mobility Week 2025 at the UN Economic Commission for Africa in Addis Ababa. My takeaways on finance, infrastructure, technical capacity and the case for supply-side regulation and regional harmonisation.',
    tags: ['electric mobility', 'aew2025', 'supply side regulation', 'regional harmonisation', 'ethiopia'],
    coverUrl: '/images/blog/africa-e-mobility-week-2025-addis-ababa/cover.jpg',
    bodyMd: `From 14 to 16 October 2025 I took part in Africa E-Mobility Week 2025 (AEW2025) in Addis Ababa, Ethiopia. The event was hosted by the Africa E-Mobility Alliance in collaboration with the UN Environment Programme at the United Nations Economic Commission for Africa, and brought together over 350 delegates from at least 35 countries to discuss how to accelerate the continent's transition to electric mobility. It was also my first visit to Addis Ababa.

![Speakers at Africa E-Mobility Week 2025](/images/blog/africa-e-mobility-week-2025-addis-ababa/photo-03.jpg)

## Key takeaways

The discussions across the week returned to three themes that will determine how quickly electric mobility scales in Africa:

- **Finance** - access to grants and credit for vehicles, infrastructure and local enterprises.
- **Infrastructure** - both energy supply for charging and the logistics needed to move and service vehicles.
- **Technical capacity** - in technology and in human resources.

These are not only climate questions. Handled well, electric mobility gives African economies a route to build regional value chains in the EV ecosystem, and to leapfrog conventional paths to industrialisation.

## Industry tours

A valuable part of the week was the industry tours, which showed Ethiopia's developing EV manufacturing, battery assembly and charging infrastructure. Seeing these operations in practice made the discussions on value chains concrete: they are evidence that local production and deployment is already under way on the continent.

![At the entrance to Africa E-Mobility Week 2025, Addis Ababa](/images/blog/africa-e-mobility-week-2025-addis-ababa/photo-04.jpg)

## Engagement

During the week I held discussions with a range of organisations working on e-mobility, including CPCS, the UN Environment Programme, the African Union, The Carbon Trust, KOTRA, Atlantic Meridian EV, Chogori Technology Co., Ltd, GGGI Africa, EV24.africa, the ECOWAS Centre for Renewable Energy and Energy Efficiency (ECREEE), the ECOWAS Commission, Coexlion and AUTO24.africa. I also had useful exchanges with Anabelle DiCarlo, Diana E. Paez, Eng. Eric Ntagengerwa, Valerie Labi, Albina Minja, Edna M. and Alexandre Allanic, several of which may lead to further collaboration.

![In front of the AEW2025 partners wall](/images/blog/africa-e-mobility-week-2025-addis-ababa/photo-01.jpg)

## What should come next

The momentum from the conference needs to turn into policy action. Two priorities stand out to me:

- **Supply-side regulation.** African countries need stronger supply-side regulation to shape what enters their vehicle markets and to catalyse EV market growth, rather than relying on demand-side measures alone.
- **Regional harmonisation.** Vehicle markets are connected across borders, so policies should be harmonised within West, East, Central, North and Southern Africa.

I would like to see a future Africa E-Mobility Week hosted in Ghana or elsewhere in West Africa, or at least a key stakeholder round table in the region to work towards harmonisation. On a personal note, the Road to Addis team's work has also made me consider a drive from East Africa to Accra in the future.

## Acknowledgements

Thanks to Annika Berlin and Sherlyne Omangi for the invitation and for their work from planning through to execution, and to the Africa E-Mobility Alliance, the UN Environment Programme and the UN Economic Commission for Africa for hosting the event.`,
  },
  {
    slug: 'iea-africa-energy-efficiency-training-week-transport-stream',
    publishedAt: '2025-10-20T12:00:00Z',
    title: 'IEA Africa Energy Efficiency Training Week: The Transport Stream',
    excerpt:
      'From 20 to 23 October 2025 I took part in the transport stream of the IEA Africa Energy Efficiency Policy in Emerging Economies Training Week in Accra, focused on policy approaches for vehicle efficiency and electrification.',
    tags: ['iea', 'energy efficiency', 'electric mobility', 'transport policy', 'capacity building'],
    coverUrl: '/images/blog/iea-africa-energy-efficiency-training-week-transport-stream/cover.jpg',
    bodyMd: `From 20 to 23 October 2025 I took part in the International Energy Agency (IEA) Africa Energy Efficiency Policy in Emerging Economies Training Week in Accra. The training week was co-hosted by the IEA and Ghana's Ministry of Energy and Green Transition, in partnership with the African Energy Commission (AFREC) of the African Union and the African Development Bank.

The week was organised in thematic streams. I participated in the transport stream, which dealt with vehicle efficiency and electrification policy and was co-led by Alison Pridmore and Shane McDonagh of the IEA.

## Background

Ambitious implementation of energy efficiency policy depends on trained practitioners, exchange of best practice and sustained capacity building. The training week brought together policy practitioners from across the region to build that capacity in a structured way, with each stream working through the policy questions specific to its sector.

## The transport stream

The aim of the transport stream was to build capacity for developing policy approaches for vehicle efficiency and electrification in the region. Transport is a large and growing share of energy demand in African economies, and the policy choices made now on vehicle standards, imports and electrification will shape that demand for decades.

The stream drew on a group of transport speakers with experience across government, research and practice in the region:

- Doris Edem Agbevivi
- George Kwadwo Appiah
- Benedicta Agbo-Dan
- Dr. G.K. Ayetor
- Tibebu Assefa
- Peter Egyin-Mensah
- Engr. Kaisan Muhammad Usman

## Relevance to my work

The stream connected directly with my own work on e-mobility policy in Ghana. I work on supply-side regulation for electric vehicles in Ghana, which addresses what enters the vehicle market rather than relying only on demand-side incentives, and on the framework for the E-Mobility Policy Working Group. Working through vehicle efficiency and electrification policy alongside practitioners from other countries in the region was useful for testing how these instruments sit within a wider regional picture, where vehicle markets are closely linked across borders.

## Acknowledgements

Thanks to Alison Pridmore and Shane McDonagh for leading the transport stream, to the transport speakers for their contributions, and to the IEA, Ghana's Ministry of Energy and Green Transition, the African Energy Commission and the African Development Bank for organising and supporting the training week. Thanks also to my fellow participants in the transport stream.

*Photograph: Alison Pridmore / IEA.*`,
  },
  {
    slug: 'open-africa-power-2025-reflections',
    publishedAt: '2025-11-17T12:00:00Z',
    title: 'Open Africa Power 2025: What I Took From the Programme',
    excerpt:
      'My account of the Open Africa Power 2025 Italian Module, where I was selected among the Top 10 Performers: the facilities we visited, the closing ceremony at the UNDP Rome Centre, and what I brought home.',
    tags: ['open africa power', 'energy transition', 'italy', 'leadership', 'enel foundation'],
    coverUrl: '/images/blog/open-africa-power-2025-reflections/cover.jpg',
    bodyMd: `In November 2025, I spent five days in Italy as one of the Top 10 Performers of Open Africa Power 2025, the capacity-building programme for young African energy professionals run by the Enel Foundation with Sustainable Energy for All (SEforALL). The Italian Module combined technical visits to energy facilities with sessions on policy and leadership, and ended with an award and closing ceremony at the UNDP Rome Centre.

This is my account of what the programme involved and what I took from it.

![The Open Africa Power 2025 cohort at Gridspertise in Milan](/images/blog/open-africa-power-2025-reflections/photo-04.jpg)

## Being selected

Being selected among the Top 10 Performers is one of the most meaningful recognitions of my professional life so far. Its value for me is less the title than what it implies: an obligation to share what I learned, to translate it into action, and to build connections across Africa's energy sector. The programme connected me with nine other professionals from across the continent and gave us tools, networks and a shared sense of purpose for the energy transition.

## The programme

The module started in Milan and moved through several regions, with each visit focused on a different part of the energy system:

- **Milan:** the wind tunnel at the Politecnico di Milano, and the smart grid laboratories at Gridspertise.
- **Tuscany:** the geothermal plant and museum at Larderello, and Rondine Cittadella della Pace in Arezzo.
- **Lazio:** the thermal power plant at Civitavecchia and the historic Acquoria hydroelectric plant in Tivoli, both operated by the Enel Group.
- **Abruzzo:** the E-Distribuzione Training Center in L'Aquila, where we learned about operational practice in electricity distribution.

Seeing generation, grids and distribution training in one week made the connections between them concrete. A geothermal plant, a thermal plant and a hydroelectric plant each pose different engineering and policy questions, and seeing them side by side is a useful reference point for energy planning in Ghana and the wider region.

![At a geothermal plant in Tuscany](/images/blog/open-africa-power-2025-reflections/photo-05.jpg)

## The closing ceremony

The award and closing ceremony took place at the UNDP Rome Centre. Agostino Inguscio, Giulia Genuardi and Stefano Marguccio gave the welcoming remarks. Each expressed appreciation for the work of the participants and a clear hope that young people will take an active role in shaping Africa's energy transformation. Keynote contributions from Dr. Francis Dennig, Wikus Kruger, Giovanni Maria Mazzacani and Sokoyebom A. broadened our view of what is achievable in the sector.

![At the UNDP Rome Centre for the award and closing ceremony](/images/blog/open-africa-power-2025-reflections/photo-01.jpg)

## What I took from it

I returned home with sharper technical knowledge, a stronger professional voice and a clear conviction that the next phase of energy leadership in Africa is already being built by people of my generation, working together. The friendships formed with the other nine participants in a single week are also part of what I brought back, and I expect them to become working relationships.

![During one of the programme sessions](/images/blog/open-africa-power-2025-reflections/photo-03.jpg)

## Acknowledgements

The programme was possible because of the Enel Foundation and Sustainable Energy for All (SEforALL), and their commitment to developing the next generation of African energy leaders. I am grateful to Luca Spinosa, Rosemary Idem and Valentina Dominic, whose coordination kept the group moving smoothly throughout the week. My thanks also go to the speakers named above, and to the people I shared the week with: Immanuel N. Jiya, Kehinde Adeyeye, Amal Nasr, Murendeni Makhado, Halarou Hamza Abarchi, Eng. Valentino Michira, Sheila Sergon, Primrose Vurayai and Ibrahim Sa'id.`,
  },
  {
    slug: 'open-africa-power-2025-italian-module-top-10',
    publishedAt: '2025-11-21T12:00:00Z',
    title: 'Open Africa Power 2025: The Italian Module and the Top 10 Cohort',
    excerpt:
      'In November 2025, I joined nine other Top Performers of Open Africa Power 2025 for the Italian Module, a week across Lombardy, Tuscany, Abruzzo and Lazio run by the Enel Foundation and SEforALL.',
    tags: ['open africa power', 'energy transition', 'enel foundation', 'seforall', 'capacity building'],
    coverUrl: '/images/blog/open-africa-power-2025-italian-module-top-10/cover.jpg',
    bodyMd: `In November 2025, I was one of the ten Top Performers of Open Africa Power (OAP) 2025 selected for the programme's Italian Module. Open Africa Power is run by the Enel Foundation in collaboration with Sustainable Energy for All (SEforALL), and the module closed with an award and closing ceremony at the UNDP Rome Centre. The Enel Foundation produced the short film below about the module and our cohort.

![Open Africa Power 2025: the Italian Module for the Top 10 Performers (Enel Foundation)](/images/blog/open-africa-power-2025-italian-module-top-10/video-1.mp4)

## The cohort

The ten Top Performers of Open Africa Power 2025 were:

- Murendeni Makhado
- Immanuel N. Jiya
- Eng. Valentino Michira
- Romeo Tweneboah Koduah
- Sheila Sergon
- Primrose Vurayai
- Ibrahim Sa'id
- Kehinde Adeyeye
- Amal Nasr
- Halarou Hamza Abarchi

We came from different countries and professional backgrounds across the African energy sector, and the module was designed for us to learn as a group: the site visits, discussions and travel were shared, and much of the value came from comparing what we saw in Italy with conditions in our own countries.

## The Italian Module

Over one week the module took us across four Italian regions: Lombardy, Tuscany, Abruzzo and Lazio. The programme combined technical visits to energy research and generation sites, including geothermal and conventional power plants, with discussions on how technology, regulation and policy together shape the energy transition. The aim, as the Enel Foundation put it, was for participants to see first-hand how innovation and policy can shape a just and sustainable energy future.

The module concluded at the UNDP Rome Centre with the award and closing ceremony for the cohort.

## What the cohort took from it

The film records the cohort's reflections at the end of the week. A common thread was confidence: the discussions and site visits gave each of us a clearer sense of the role we can play when we return home. The cohort's message to future participants was also simple: opportunities exist, and the task is to be prepared to recognise them and act on them.

For my own part, I have written a separate account of the programme, covering the facilities we visited and what I took from the week.

## Acknowledgements

I thank the Enel Foundation and Sustainable Energy for All (SEforALL) for running Open Africa Power, the UNDP Rome Centre for hosting the award and closing ceremony, and my nine fellow Top Performers for a week of shared learning.

*Video: Enel Foundation.*`,
  },
  {
    slug: 'open-africa-power-7th-edition-give-back-module',
    publishedAt: '2025-11-21T12:00:00Z',
    title: 'Open Africa Power 7th Edition and the Give Back Module',
    excerpt:
      'The 7th edition of Open Africa Power concluded in November 2025 within the framework of Italy\'s Mattei Plan. Highlights from the final day of the Italian Module, and the Give Back Module I intend to deliver in Ghana.',
    tags: ['open africa power', 'mattei plan', 'enel foundation', 'energy transition', 'ghana'],
    coverUrl: '/images/blog/open-africa-power-7th-edition-give-back-module/cover.jpg',
    bodyMd: `In November 2025, the 7th edition of Open Africa Power concluded. The programme is run by the Enel Foundation in collaboration with Sustainable Energy for All (SEforALL), and the Enel Foundation presents it within the framework of Italy's Mattei Plan, with its attention on Africa's emerging leaders in the energy transition. I took part as one of the programme's Top 10 Performers.

## The Italian Module

The Top 10 Performers completed the Italian Module, an intensive training experience in Milan and Rome that ended on Friday 21 November 2025. It included engagements with institutions, research centres and key players in the energy sector. The Enel Foundation shared the highlights from the final day in the video below.

![Highlights from the final day of the Open Africa Power 2025 Italian Module (Enel Foundation)](/images/blog/open-africa-power-7th-edition-give-back-module/video-1.mp4)

## The Give Back Module

Open Africa Power does not end with the training in Italy. The Give Back Module asks each participant to turn the knowledge gained into tangible value for their own country. It is the part of the programme that carries its impact beyond the ten people who travelled.

I intend to deliver my Give Back Module in Ghana, sharing what I learned with young professionals and institutions working on energy and climate, and connecting it to my ongoing work in the sector. I will report on it as it develops.

## Acknowledgements

I thank the Enel Foundation and Sustainable Energy for All (SEforALL) for their continued commitment to Open Africa Power and to young African energy professionals.

*Video and photograph: Enel Foundation.*`,
  },
  {
    slug: 'green-youth-club-richhagar-academy-sdg1',
    publishedAt: '2025-12-05T12:00:00Z',
    title: 'Green Youth Club at Richhagar Academy: Children on SDG 1, No Poverty',
    excerpt:
      'I joined the United Youth Initiative for Africa\'s Green Youth Club at Richhagar Academy, where pupils used music, poetry, rap, art and storytelling to show how they can contribute to SDG 1: No Poverty.',
    tags: ['sdg1', 'climate education', 'youth engagement', 'uniyia', 'schools'],
    coverUrl: '/images/blog/green-youth-club-richhagar-academy-sdg1/cover.jpg',
    bodyMd: `In early December 2025 I joined a Green Youth Club session at Richhagar Academy, part of the school engagement programme run by the United Youth Initiative for Africa (UNIYIA). The session was led by Noah Bugre, General Manager of UNIYIA, and focused on Sustainable Development Goal 1: No Poverty.

The Green Youth Club takes conversations about sustainability into classrooms. Rather than delivering a lecture, the session asked the children to work out for themselves what their contribution to ending poverty by 2030 could look like, and to present it in a form of their choosing.

## The session

Classes prepared and performed their ideas through music, poetry, rap, art and storytelling. The presentations were practical and grounded in the children's own experience. Among the themes they raised:

- **Cleanliness and hygiene** as a way of reducing household health costs, which frees money for other needs.
- **Recycling** and supporting recycling activities in the community.
- **Sharing resources** with those who have less.
- **Helping their peers**, both in school and outside it.

Taken together, the presentations showed a clear understanding that poverty is not only a matter of income, and that small, everyday actions contribute to stronger and more resilient communities.

![Presenting prizes to pupils during the Green Youth Club session](/images/blog/green-youth-club-richhagar-academy-sdg1/photo-01.jpg)

## Recognition

At the close of the session, the first three classes were awarded prizes for the creativity and commitment shown in their presentations.

![A pupil receives her class prize](/images/blog/green-youth-club-richhagar-academy-sdg1/photo-03.jpg)

![Prize presentation to one of the winning classes](/images/blog/green-youth-club-richhagar-academy-sdg1/photo-02.jpg)

## Why this work matters

Sessions like this one are a reminder that children are not too young to take part in development conversations. Introducing the SDGs early, and letting children express them in their own language and through their own talents, helps build a generation that sees a fair and sustainable future as something it has a hand in shaping. It was a useful session to be part of, and I hope to support more of the club's school engagements.

## Acknowledgements

Thanks to Noah Bugre and the UNIYIA team for leading the Green Youth Club programme, and to the management, teachers and pupils of Richhagar Academy for hosting the session and for the work they put into their presentations.

*Photographs: UNIYIA.*`,
  },
  {
    slug: 'green-business-and-jobs-tracker-undp-ghana-brown-bag',
    publishedAt: '2026-03-10T12:00:00Z',
    title: 'Presenting the Green Business and Jobs Tracker to UNDP Ghana',
    excerpt:
      'With Noah Bugre of UNIYIA, I presented the proposed Green Business and Jobs Tracker to UNDP Ghana in March 2026. This post covers the concept, the issues raised and the agreed next steps.',
    tags: ['green jobs', 'undp', 'ndc', 'climate policy', 'ghana', 'data'],
    coverUrl: '/images/blog/green-business-and-jobs-tracker-undp-ghana-brown-bag/cover.jpg',
    bodyMd: `In March 2026, Noah Bugre, General Manager of the United Youth Initiative for Africa (UNIYIA), and I presented the proposed Green Business and Jobs Tracker to UNDP Ghana at a Brown Bag session convened by UNDP Ghana with UNIYIA. UNDP circulated the session flyer on 3 March 2026 and shared an account of the session on 13 March 2026.

The tracker is a proposed digital system to make green employment visible and measurable in Ghana, and to link it directly to climate action. The session was an open exchange with UNDP staff and partners on how such a system could support government, the private sector and youth-led initiatives working at the intersection of climate action, innovation and employment.

![Presenting the NDC accountability mechanism of the proposed tracker at the Brown Bag session](/images/blog/green-business-and-jobs-tracker-undp-ghana-brown-bag/photo-02.jpg)

## Background

Green jobs are counted poorly almost everywhere, because the enterprises that create them do not fit the categories that official statistics already use. As Ghana moves into the implementation period of its NDC 3.0 commitments, there is a practical question about how the country will show the real economic effect of its climate action, including the jobs it creates.

## What we presented

The Green Business and Jobs Tracker is designed to make green enterprise activity and green employment visible inside Ghana's official data systems, rather than alongside them. The main ideas we presented were:

- **An NDC accountability mechanism.** The tracker is built as an accountability tool for the NDC 3.0 implementation period, covering baseline establishment, continuous progress monitoring and enhanced transparency.
- **Reporting-led design.** The data model is designed backwards from a reporting obligation: its output is structured to feed Ghana's Biennial Transparency Reports to the UNFCCC.
- **Evidence for policy and investment.** By connecting green investments with the jobs they create, the tracker can strengthen evidence-based policymaking and help government and partners see where climate finance is producing employment.

![A participant responding during the discussion](/images/blog/green-business-and-jobs-tracker-undp-ghana-brown-bag/photo-03.jpg)

## Key issues raised

UNDP's follow-up in June 2026 recorded the main issues from the discussion:

- The need for clear institutional leadership and governance, including co-leadership by the relevant ministries and technical oversight.
- Capturing informal and rural green jobs will require both digital and field-based data collection.
- Data credibility and verification are essential to prevent greenwashing.
- The tracker has potential as a market facilitation and financing tool, including links to carbon credit opportunities.

![Questions and comments from participants](/images/blog/green-business-and-jobs-tracker-undp-ghana-brown-bag/photo-05.jpg)

## Agreed actions and follow-ups

The key actions identified were:

- National consultations to arrive at a country-owned definition of green jobs and green businesses.
- A Technical Working Group bringing together UN agencies and national stakeholders.
- Formal data partnerships, including with the Registrar General's Department and the Municipal Assemblies.
- Incentives for uptake, such as linking registration on the tracker to eligibility for funding.
- Moving the platform from prototype to a nationally embedded system.
- Resources for field validation and rural outreach.

The follow-ups include stakeholder engagement on the definition and on governance, early collaboration with the National Development Planning Commission (NDPC), work with the ILO to integrate the tracker into the labour market information system, engagement with donor partners, and a clear distinction between NDC-related and non-NDC-related green jobs.

## Outcome

Following the session, UNDP Ghana shared a draft Memorandum of Understanding with UNIYIA to formalise collaboration on the tracker. The feedback from the session has given the concept a clearer path: the next stage depends less on the software and more on governance, a national definition and data partnerships, which is where the work now sits.

## Acknowledgements

I thank UNDP Ghana for convening the Brown Bag session and for the detailed follow-up, the participants for their questions and contributions, and Noah Bugre and the UNIYIA team for co-leading the work.

*Photographs: UNDP Ghana.*`,
  },
  {
    slug: 'tsinghua-global-youth-dialogue-embassy-of-benin-beijing',
    publishedAt: '2026-07-08T12:00:00Z',
    title: 'Meeting the Ambassador of Benin to China with the Tsinghua Global Youth Dialogue',
    excerpt:
      'On 8 July 2026, H.E. Mr. Franck Adjagba received a cohort of Tsinghua Global Youth Dialogue delegates, including me, at the Embassy of Benin in Beijing for a conversation on innovation, technology and African youth.',
    tags: ['tsinghua', 'china africa', 'youth leadership', 'innovation', 'diplomacy'],
    coverUrl: '/images/blog/tsinghua-global-youth-dialogue-embassy-of-benin-beijing/cover.jpg',
    bodyMd: `On Wednesday 8 July 2026, H.E. Mr. Franck Adjagba, Ambassador of the Republic of Benin to the People's Republic of China, received a cohort of delegates of the Fourth Tsinghua Global Youth Dialogue (TGYD) at the Embassy of Benin in Beijing. I was part of that cohort.

TGYD is organised by Tsinghua University's Global Competence Development Center together with the Asian Universities Alliance. The 2026 edition ran from 27 June to 10 July 2026 across Hangzhou, Shanghai and Beijing under the theme "Bridging the Divides". I was one of 120 delegates selected from 5,162 applicants. The programme brings young leaders from different countries together for two weeks of field visits, institutional meetings and dialogue on major global issues, and the visit to the Embassy of Benin was one of those institutional meetings.

![H.E. Mr. Franck Adjagba with TGYD delegates at the Embassy of Benin in Beijing](/images/blog/tsinghua-global-youth-dialogue-embassy-of-benin-beijing/photo-01.jpg)

## What we discussed

The conversation with the Ambassador was open and wide-ranging. As summarised by the Embassy, it covered three main themes:

- **China's place in global innovation**, and the opportunities to build stronger bridges between China and Africa in research, technology and enterprise.
- **New technologies as a way for Africa to leapfrog** some stages of its development, rather than repeating every step that other economies went through.
- **Mobilising, training and valuing African youth**, so that the continent's young population is equipped and given room to contribute to these transitions.

The meeting also opened a discussion on possible areas of collaboration with members of the delegation. Our backgrounds covered fields as varied as food, medicine, data science and security cooperation. From my side, as someone working on water, energy and climate policy in Ghana, the point about technology and leapfrogging is directly relevant: much of what limits service delivery and climate accountability on the continent is a question of data, infrastructure and institutions, and these are areas where partnerships with Chinese institutions can add real value if they are designed around African priorities.

## Why the meeting mattered to me

TGYD was built around the idea of bridging divides, and this meeting put that idea into practice. It was a diplomatic reception, but it was also a genuine exchange in which the Ambassador engaged with the delegates' different fields and with the question of how young professionals can turn programmes like TGYD into lasting cooperation. Hearing an African diplomat posted in Beijing speak about China-Africa innovation links, and about the role of African youth in them, gave useful context to everything we had seen in Hangzhou, Shanghai and Beijing over the preceding days.

## A word of appreciation

I wish to express my deepest appreciation to H.E. Mr. Franck Adjagba and to the staff of the Embassy of Benin in China for the warm reception they extended to our delegation. The Ambassador gave us his time generously and engaged openly with our perspectives on China-Africa cooperation. The conversation was open, thoughtful and encouraging, and it treated the delegates as partners in that work rather than as visitors. I left the Embassy with a clearer view of how my own work in Ghana can connect to these wider efforts, and with real gratitude for the hospitality shown to us.

## Acknowledgements

My thanks go to H.E. Mr. Franck Adjagba and the Embassy of Benin in China for hosting us, to Tsinghua University's Global Competence Development Center and the Asian Universities Alliance for organising the Fourth Tsinghua Global Youth Dialogue, and to my fellow delegates for the exchanges throughout the programme.

*Photographs: Embassy of Benin in China.*`,
  },
]
