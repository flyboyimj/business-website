/**
 * ============================================================================
 *  SURVEIL TECHNOLOGIES — SITE CONTENT
 * ============================================================================
 *  This is the ONE file to edit for business details, contact information,
 *  services, and page SEO. Every page reads from here.
 *
 *  Anything set to `null` is treated as "not provided yet":
 *    - it shows as a clearly marked [placeholder] where it would appear, OR
 *    - the element is left out entirely (for optional items like photos).
 *  `npm run check` lists everything still missing before launch.
 * ============================================================================
 */

export const business = {
  name: 'Surveil Technologies',

  // Public website address, no trailing slash. Used for canonical URLs,
  // the sitemap, and social sharing tags.
  siteUrl: 'https://surveiltechnologies.com',

  // `display` is what visitors see; `tel` is the dialable number for tap-to-call.
  phone: { display: '(832) 699-3540', tel: '+18326993540' },

  email: 'info@surveiltechnologies.com',

  // Where the business is based and whom it serves. No street address is
  // published anywhere on the site.
  baseCity: 'League City',
  baseRegion: 'Texas',
  serviceArea: 'the Houston metropolitan area',

  owner: {
    name: 'Jeremiah Matthews',
    title: 'Owner',
  },

  // Logo images (horizontal lockup made from the original square logo in brand/).
  // `light` is the version used on the dark footer. Set logo to null to fall back
  // to the built-in text wordmark.
  logo: {
    src: 'images/logo-horizontal.webp',
    light: 'images/logo-horizontal-light.webp',
    width: 571,
    height: 104,
  },
};

/**
 * Optional photos. Each slot shows a clean illustration until you add a real
 * photo. To add one: export it as .webp or .jpg about 1600px wide (under ~250 KB),
 * put it in src/assets/images/, then set `src`, `width`, and `height`.
 *
 * Use your own installation photos, or licensed stock photos that are not
 * presented as your company's projects.
 */
export const photos = {
  hero: { src: null, width: null, height: null, alt: 'Network rack with neatly bundled, labeled patch cables' },
  cabling: { src: null, width: null, height: null, alt: 'Labeled Ethernet cables terminated on a patch panel' },
  racks: { src: null, width: null, height: null, alt: 'Organized network rack with patch panels and switches' },
  cameras: { src: null, width: null, height: null, alt: 'Commercial security camera mounted on a building exterior' },
  wireless: { src: null, width: null, height: null, alt: 'Wireless access point mounted on an office ceiling' },
  av: { src: null, width: null, height: null, alt: 'Conference room display with a cable wall plate below it' },
  buildouts: { src: null, width: null, height: null, alt: 'Commercial tenant space during construction with cabling in the ceiling' },
  support: { src: null, width: null, height: null, alt: 'Technician checking connections at a network rack' },
  owner: { src: null, width: null, height: null, alt: 'Jeremiah Matthews, owner of Surveil Technologies' },
};

/** Main navigation (order shown in the header and footer). */
export const nav = [
  { label: 'Home', href: '' },
  { label: 'Services', href: 'services' },
  { label: 'Builders & Commercial', href: 'builders' },
  { label: 'About', href: 'about' },
  { label: 'Contact', href: 'contact' },
];

/**
 * Services. `id` is used for page anchors (services/#cabling) and in the
 * contact form's "Service needed" list. Edit wording freely; keep ids stable.
 */
export const services = [
  {
    id: 'cabling',
    illustration: 'cabling',
    photo: 'cabling',
    title: 'Structured Network Cabling',
    short: 'Ethernet cable runs, termination, labeling, and testing for offices and commercial spaces.',
    intro:
      'Every computer, phone, camera, and access point in your building depends on the cable behind it. We plan and install Ethernet runs so each connection goes where it should, is terminated cleanly, and can be identified later without guesswork.',
    includes: [
      'Planning drop locations with you before any cable is pulled',
      'Ethernet cable runs to desks, workstations, printers, cameras, and access points',
      'Termination at wall plates and patch panels',
      'Labeling at both ends so every port can be traced to its location',
      'Testing each run before handoff',
    ],
    outcome:
      'A cable plant that is easy to understand and easy to add to, so the next move, new hire, or equipment change does not start with tracing unmarked wires.',
    cta: 'Request a site walk for cabling',
  },
  {
    id: 'racks',
    illustration: 'rack',
    photo: 'racks',
    title: 'Network Racks & Cable Organization',
    short: 'Racks, patch panels, and cable management that keep your network closet orderly.',
    intro:
      'A crowded network closet slows down every troubleshooting call. We install racks and patch panels and route cables so the space is organized, labeled, and workable for whoever needs to service it.',
    includes: [
      'Wall-mount and floor-standing rack installation',
      'Patch panel installation and termination',
      'Horizontal and vertical cable management',
      'Patch cords sized and routed to keep the front of the rack clear',
      'Cleanup and reorganization of existing network closets',
    ],
    outcome:
      'A closet where equipment is easy to reach, ports are easy to identify, and changes can be made without disturbing everything around them.',
    cta: 'Discuss a rack or closet cleanup',
  },
  {
    id: 'cameras',
    illustration: 'camera',
    photo: 'cameras',
    title: 'Commercial Security Cameras',
    short: 'Camera installation and configuration for offices, retail spaces, and commercial properties.',
    intro:
      'Cameras are only useful if they cover the right areas and the recordings are there when you need them. We walk the property with you, plan camera placement around what you need to see, and install and configure the system.',
    includes: [
      'Walkthrough to plan camera locations and coverage',
      'Camera mounting and cabling, interior and exterior',
      'Recorder setup and recording settings',
      'Configuring viewing access on the computers and phones you choose',
      'A walkthrough of how to find and export footage',
    ],
    outcome:
      'A camera system that covers entrances, registers, parking, and other areas you care about, set up so your team knows how to use it.',
    note: 'We install and configure camera systems. We do not provide monitoring services.',
    cta: 'Request a site walk for cameras',
  },
  {
    id: 'wireless',
    illustration: 'wireless',
    photo: 'wireless',
    title: 'Network Equipment & Wireless Access Points',
    short: 'Switches, network hardware, and wireless access points installed and set up for your space.',
    intro:
      'Weak Wi-Fi in the back office or a switch that nobody can find causes daily friction. We install network equipment and access points and configure them to fit how your business actually works.',
    includes: [
      'Network switch and equipment installation',
      'Wireless access point placement, mounting, and cabling',
      'Wireless network configuration',
      'Separate guest Wi-Fi where you need it, kept apart from business systems',
      'Replacing or relocating existing equipment',
    ],
    outcome:
      'Reliable wired and wireless connections in the areas your staff and customers use, with equipment installed where it can be maintained.',
    cta: 'Discuss your network setup',
  },
  {
    id: 'av',
    illustration: 'av',
    photo: 'av',
    title: 'Audio-Visual Cabling',
    short: 'Cabling for displays, projectors, and speakers in conference rooms, offices, and retail spaces.',
    intro:
      'A conference room display that only works with the right adapter, or loose cables running across the table, makes every meeting harder. We plan and run the cabling behind displays, projectors, and speakers so connections are where people need them and the cables stay out of sight.',
    includes: [
      'Planning connection points with you for displays, projectors, and speakers',
      'Video and audio cable runs to wall plates, tables, and equipment locations',
      'Speaker wire runs for ceiling and wall speakers',
      'Cables routed in walls and ceilings or neatly concealed where walls stay closed',
      'Labeling and testing each run before handoff',
    ],
    outcome:
      'Meeting rooms, offices, and customer-facing spaces where screens and sound connect cleanly, without visible cable clutter.',
    cta: 'Discuss your audio-visual cabling',
  },
  {
    id: 'buildouts',
    illustration: 'floorplan',
    photo: 'buildouts',
    title: 'New Construction, Build-Outs & Relocations',
    short: 'Technology installation coordinated with construction schedules, tenant improvements, and office moves.',
    intro:
      'Cabling and technology are easiest to get right before the walls close. We work with owners, tenants, and contractors to plan and install network cabling, racks, cameras, and access points as part of new construction, tenant build-outs, and business relocations.',
    includes: [
      'Reviewing plans and scope with you or your contractor',
      'Rough-in cabling timed to the construction schedule',
      'Trim-out, termination, labeling, and testing',
      'Equipment, rack, camera, and access point installation',
      'Relocation planning so your technology is ready when you open',
    ],
    outcome:
      'Technology that is in place and working when the space is ready to occupy, without late changes that open up finished walls and ceilings.',
    cta: 'Discuss your project schedule',
  },
  {
    id: 'support',
    illustration: 'support',
    photo: 'support',
    title: 'Ongoing Support & Maintenance',
    short: 'Technical support and maintenance scoped to what your business needs after installation.',
    intro:
      'Needs change after installation: new staff, new equipment, a camera that needs to be moved. We offer ongoing support arrangements built around your systems and how you want to work with us.',
    includes: [
      'Adding, moving, and changing network drops',
      'Troubleshooting cabling, network, and camera issues',
      'Camera system checks and adjustments',
      'Planned maintenance visits, if that fits your needs',
      'Support scope agreed on with you up front',
    ],
    outcome:
      'A clear arrangement for getting help, with a clear understanding of what is covered before work begins.',
    cta: 'Ask about ongoing support',
  },
];

/** Customer types shown on the home page. */
export const customerTypes = [
  {
    title: 'General contractors & builders',
    text: 'A technology installer who works to your schedule, communicates with your superintendent, and closes out cleanly.',
  },
  {
    title: 'Property managers',
    text: 'Help preparing suites for new tenants and keeping shared infrastructure organized across your properties.',
  },
  {
    title: 'Offices & small businesses',
    text: 'Cabling, Wi-Fi, and cameras for offices that need their technology to work every day without fuss.',
  },
  {
    title: 'Retail & strip centers',
    text: 'Camera coverage, network connections, and wireless for storefronts and multi-tenant centers.',
  },
];

/** The four-step process shown on the home page (and reused elsewhere). */
export const processSteps = [
  {
    title: 'Discuss Your Needs',
    text: 'Tell us about your space, what you need installed, and your timeline. A short call or message is enough to start.',
  },
  {
    title: 'Site Walk',
    text: 'We walk the space with you to see conditions firsthand, confirm locations, and ask the questions that affect scope.',
  },
  {
    title: 'Proposal',
    text: 'You receive a written proposal based on your scope, so you know what will be installed before work begins.',
  },
  {
    title: 'Installation & Handoff',
    text: 'We install, label, and test the work, then walk you through what was installed and how it is organized.',
  },
];

/** Contact form choices. Service choices come from `services` above. */
export const form = {
  timelineOptions: [
    'As soon as possible',
    'Within the next month',
    '1 to 3 months',
    'More than 3 months out',
    'Planning or budgeting only',
  ],
  extraServiceOptions: ['Multiple services', 'Not sure yet'],
};

/** Per-page SEO. Titles ~60 characters, descriptions ~155 characters. */
export const seo = {
  home: {
    title: 'Commercial Cabling & Security Cameras in Houston | Surveil Technologies',
    description:
      'Disabled veteran-owned commercial network cabling, network racks, security cameras, and Wi-Fi installation for Houston-area businesses and contractors. Based in League City, TX.',
  },
  services: {
    title: 'Network Cabling, Camera, Wi-Fi & AV Cabling Services | Surveil Technologies',
    description:
      'Structured cabling, network racks, security cameras, wireless access points, audio-visual cabling, build-outs, and ongoing support for Houston-area businesses.',
  },
  builders: {
    title: 'Technology Installation for Houston Contractors & Builders | Surveil Technologies',
    description:
      'Network cabling, cameras, and access point installation for general contractors, builders, and property managers on Houston-area new construction and tenant build-outs.',
  },
  about: {
    title: 'About Surveil Technologies | Disabled Veteran-Owned, League City, TX',
    description:
      'Surveil Technologies is a disabled veteran-owned commercial cabling and security technology company in League City, Texas, led by U.S. Navy veteran Jeremiah Matthews.',
  },
  contact: {
    title: 'Request a Site Walk | Surveil Technologies, Houston Area',
    description:
      'Request a site walk or discuss your commercial cabling, camera, or network project with Surveil Technologies, serving League City and the Houston metro area.',
  },
  notFound: {
    title: 'Page Not Found | Surveil Technologies',
    description: 'The page you were looking for could not be found.',
  },
};
