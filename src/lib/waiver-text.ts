export const SHOP_NAME = "The Bluff Garage";

export const WAIVER_TITLE = "Garage Visitor Liability Waiver";

export const WAIVER_SECTIONS = [
  {
    title: "Assumption of Risk",
    paragraphs: [
      `By entering or visiting the property, garage, workshop, or premises operated by ${SHOP_NAME}, you acknowledge that a working garage involves inherent risks, including but not limited to: moving vehicles; power tools and machinery; automotive equipment; chemicals and fumes; sharp objects; lifting equipment; electrical equipment; fire hazards; and slipping or tripping hazards.`,
      "You voluntarily assume all risks associated with entering the premises.",
    ],
  },
  {
    title: "Release of Liability",
    paragraphs: [
      `To the fullest extent permitted by law, you release and hold harmless ${SHOP_NAME}, its owners, employees, contractors, and affiliates from any and all claims, injuries, damages, losses, or liabilities arising from personal injury, death, property damage, vehicle damage, theft, or accidents occurring on the premises.`,
    ],
  },
  {
    title: "Personal Responsibility",
    paragraphs: [
      "You agree to behave responsibly and follow all instructions, safety rules, and restricted access areas while on the property. You acknowledge that you are responsible for your own actions and safety.",
    ],
  },
  {
    title: "No Supervision",
    paragraphs: [
      "You understand that you may not be actively supervised while on the premises and that you enter at your own risk.",
    ],
  },
  {
    title: "Personal Property",
    paragraphs: [
      `${SHOP_NAME} is not responsible for lost, stolen, or damaged personal property, vehicles, tools, or equipment brought onto the premises.`,
    ],
  },
  {
    title: "Media Release (Optional)",
    paragraphs: [
      `You acknowledge that photos or videos may be recorded on the premises for social media, promotional, or business purposes. You consent to the reasonable use of your likeness unless you notify ${SHOP_NAME} in writing that you do not wish to be photographed or recorded.`,
    ],
  },
  {
    title: "Severability",
    paragraphs: [
      "If any portion of this waiver is found unenforceable, the remaining provisions shall remain in full force and effect.",
    ],
  },
  {
    title: "Agreement",
    paragraphs: [
      "By entering the premises, signing below, or submitting this form electronically, you confirm that you have read, understood, and voluntarily agreed to this waiver and release of liability.",
    ],
  },
] as const;

export const WAIVER_INTRO = `By entering or visiting the property, garage, workshop, or premises operated by ${SHOP_NAME}, all visitors acknowledge and agree to the following:`;
