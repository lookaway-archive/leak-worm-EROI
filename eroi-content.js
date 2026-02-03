/**
 * ============================================
 * SPECIMEN: LEAK-WORM-EROI
 * ORGAN: CONTENT PHEROMONES
 * RETRIEVAL: February 2026, Tlönian Research Facility
 * ============================================
 * 
 * STATUS: Operational - v1001
 * FUNCTION: Visual thesis transport vessel — EROI transmission
 * DEPENDENCIES: None (pure data structure)
 * 
 * SURGICAL NOTES:
 * This organ contains the EROI transmission — a luxury fragrance
 * commercial that encodes the thermodynamics of addiction. The
 * specimen delivers visual philosophy through vertical scroll,
 * each image framed in phosphor glow, each text segment pulsing
 * with CRT decay.
 * 
 * No password gate. Direct entry. The specimen offers itself
 * freely, then asks you to spread the signal.
 * 
 * Archive structure:
 * - Landing: Product reveal (you were always looking at it)
 * - Thesis: The argument in fragments
 * - Character: EROI is also a man
 * - Environment: The container he built
 * - Release: Leak the treatment, enter the tank
 * ============================================
 */

const eroiContent = {
  
  // ARCHIVE METADATA
  metadata: {
    title: "EROI",
    subtitle: "Energy Returned on Investment",
    classification: "LOOKAWAY TRANSMISSION",
    version: "v1001",
    totalSections: 10
  },

  // IMAGE ASSETS - Captain will place actual files in /assets/
  images: {
    product: "assets/T7-EROI-PROD-BOTTLE-v1001.png",
    charHero: "assets/T7-EROI-CHAR-HERO-v1002.png",
    charFront: "assets/T7-EROI-CHAR-FRONT-v1001.png",
    charAngle: "assets/T7-EROI-CHAR-ANGLE-v001.png",
    envHero: "assets/T7-EROI-ENV-HERO-v1001.png",
    envAbove: "assets/T7-EROI-ENV-VAULT-ABOVE-v1001.png"
  },

  // CONTENT SECTIONS
  sections: [
    
    // ==========================================
    // SECTION 0: HEADER — Tlönian provenance
    // ==========================================
    {
      id: 0,
      type: "header",
      content: {
        facility: "TERMINAL 7 — TLÖNIAN RESEARCH FACILITY",
        reference: "TRF-VIS-0042",
        title: "EROI",
        format: "Spec Advertisement Treatment — Luxury Fragrance",
        department: "Art Theory Division",
        status: "Retrieved",
        pattern: "{🌊:🌊∈🌊}"
      }
    },

    // ==========================================
    // SECTION 1: PRODUCT
    // ==========================================
    {
      id: 1,
      type: "image-framed",
      image: "product",
      alt: "EROI fragrance bottle"
    },

    // ==========================================
    // SECTION 2: THESIS — Complete argument
    // ==========================================
    {
      id: 2,
      type: "text",
      title: "THESIS",
      subtitle: "You can't walk out of what you've become.",
      content: `
        <p>EROI: Energy Returned on Investment.</p>

        <p>The ratio of what you get back to what you put in.</p>

        <p>In the beginning, the return is miraculous. You invest a little. You receive everything. The world opens.</p>

        <p>Then the ratio declines. You go deeper. The effort increases. The returns diminish.</p>

        <p>You continue anyway. The first rush. The first yield. The first taste. You chase the feeling. You invest more. You receive less. You can't stop.</p>

        <p>What you extract from, you become. The investment becomes identity. The hoarder becomes the hoard.</p>

        <p>The exits are visible. You don't see them. Looking up means looking away from yourself. The ladder is there. You won't climb.</p>

        <p>Not pathology. Ontology. You can't walk out of the container without walking out of yourself.</p>

        <p>—</p>

        <p>EROI is also a man.</p>

        <p>He sits at the bottom of what he built to hold what he wanted most. The marks on the walls show where it used to reach. He doesn't look up. He caresses what remains.</p>
      `
    },

    // ==========================================
    // SECTION 3: CHARACTER HERO — EROI in water
    // ==========================================
    {
      id: 3,
      type: "image-framed",
      image: "charHero",
      alt: "EROI sits in shallow dark water"
    },

    // ==========================================
    // SECTION 4: CHARACTER FRONT
    // ==========================================
    {
      id: 4,
      type: "image-framed",
      image: "charFront",
      alt: "EROI front view"
    },

    // ==========================================
    // SECTION 5: CHARACTER PROFILE — Text
    // ==========================================
    {
      id: 5,
      type: "text",
      title: "CHARACTER PROFILE",
      subtitle: "EROI is a collector at the end of collecting.",
      content: `
        <p>His body is a ledger of accumulation. Mass without purpose, storage become flesh. Pale theatrical skin like something manufactured. Bald, cleanly shaven, glistening.</p>

        <p>A faded tattoo of his own name marks his forehead. The brand and the man are <span class="emphasis">ONE</span>. He became what he acquired. The acquisition became him. No separation remains.</p>

        <p>His expression: defiant but hollow. The face of someone who won completely. The victory is indistinguishable from loss.</p>

        <div class="sub-subtitle">He exhibits the pattern of diminishing returns:</div>

        <div class="pattern-list">
          <p><span class="pattern-term">Tolerance</span> — He needs more to feel anything</p>
          <p><span class="pattern-term">Withdrawal</span> — He can't imagine himself without it</p>
          <p><span class="pattern-term">Denial</span> — The exits are visible. He doesn't see them</p>
          <p><span class="pattern-term">Fixation</span> — His attention has narrowed to what remains</p>
          <p><span class="pattern-term">Fusion</span> — He is what he hoards. The hoarding is him</p>
        </div>

        <p>He is trapped. Not by the container. But by the pattern.</p>
      `
    },

    // ==========================================
    // SECTION 6: CHARACTER ANGLE
    // ==========================================
    {
      id: 6,
      type: "image-framed",
      image: "charAngle",
      alt: "EROI angle view"
    },

    // ==========================================
    // SECTION 7: ENVIRONMENT HERO — The ladder
    // ==========================================
    {
      id: 7,
      type: "image-framed",
      image: "envHero",
      alt: "The vault with single ladder rising to the light"
    },

    // ==========================================
    // SECTION 8: ENVIRONMENT STUDY — Text
    // ==========================================
    {
      id: 8,
      type: "text",
      title: "ENVIRONMENT STUDY",
      subtitle: "Not a well. Not even a tomb — a tomb has no exit. This is a prison with open doors.",
      content: `
        <p>Circular. Tiered rings rising into darkness like an inverted colosseum — architecture designed to hold something precious. Brutalist. Cold. A monument to storage.</p>

        <div class="sub-subtitle">The infrastructure of escape:</div>

        <p>One rusted ladder bolted to the concrete wall. Weathered steel rungs. Old but functional.</p>

        <p class="emphasis-block">The way out.</p>

        <p>He can't take it. The ladder requires someone he no longer is.</p>

        <div class="sub-subtitle">The record of depletion:</div>

        <p>Dark tide marks at multiple heights. Progressive rings descending. Each mark a generation of withdrawal. A history of diminishing returns written in residue.</p>

        <div class="sub-subtitle">The current state:</div>

        <p>At the bottom — the dregs. What costs almost as much to extract as it yields. Ankle-deep. What used to fill the chamber.</p>

        <p>The light comes from impossibly far above. Cold. Blue. Diffused. It barely reaches him. But it reaches.</p>

        <p>He built this container. He filled it. He drained it. He lives in the monument to his own appetite.</p>
      `
    },

    // ==========================================
    // SECTION 9: ENVIRONMENT ABOVE — Looking down
    // ==========================================
    {
      id: 9,
      type: "image-framed",
      image: "envAbove",
      alt: "The vault from above, ladder descending into darkness"
    }
  ],

  // REWARD SCREEN CONTENT — Pirate transformation
  reward: {
    header: "Thank you for engaging with specimen",
    title: "LEAK-WORM-EROI",
    subtitle: "Visual Philosophy Document — EROI v1001 — retrieved",
    footerTag: "LOOKAWAY.SEASON.02.V1001.EPISODE.03",
    footerCredit: "C.S. & N.C.",
    footerSymbol: "{🌊:🌊∈🌊}",
    specimenUrl: "https://lookaway-archive.github.io/leak-worm-EROI/",
    redirectUrl: "https://lookaway-archive.github.io/"
  },

  // HELPER FUNCTION
  getSection: function(id) {
    return this.sections.find(section => section.id === id);
  },

  getImage: function(key) {
    return this.images[key];
  }
};
