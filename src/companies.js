const companies = [
  {
    name: "OpenAI",
    type: "AI Research & Development",
    analysts: [
      {
        name: "Brenda Duverce",
        title: "Private Company Research",
        email: "brenda.duverce@jpmorgan.com",
        phone: "(1-212) 622-5106"
      },
      {
        name: "Lula Sheena, CFA",
        title: "Private Company Research",
        email: "lula.sheena@jpmorgan.com",
        phone: "(44-20) 7742-1452"
      },
      {
        name: "Aaron Steiker",
        title: "Private Company Research",
        email: "aaron.steiker@jpmorgan.com",
        phone: "(1-212) 270-3679"
      }
    ],
    rating: "Overweight", 
    targetPrice: "$740",
    partnerships: [
      {
        partner: "NVIDIA",
        details: "Strategic partnership for 10GW computing systems deployment",
        value: "$100bn"
      },
      {
        partner: "Oracle",
        details: "Five-year partnership",
        value: "$300bn"
      },
      {
        partner: "CoreWeave",
        details: "Expanded agreement for infrastructure",
        value: "$22.4bn"
      },
      {
        partner: "Databricks",
        details: "Multi-year partnership for enterprise AI",
        value: "$100mn"
      }
    ],
    projections: {
      revenue2025: "$13bn",
      revenue2030: "$200bn",
      cagr: "73%"
    }
  },
  {
    name: "Anthropic",
    type: "AI Research & Safety",
    analysts: [
      {
        name: "Brenda Duverce",
        title: "Private Company Research",
        email: "brenda.duverce@jpmorgan.com",
        phone: "(1-212) 622-5106"
      },
      {
        name: "Lula Sheena, CFA",
        title: "Private Company Research",
        email: "lula.sheena@jpmorgan.com",
        phone: "(44-20) 7742-1452"
      },
      {
        name: "Aaron Steiker",
        title: "Private Company Research",
        email: "aaron.steiker@jpmorgan.com",
        phone: "(1-212) 270-3679"
      }
    ],
    rating: "Underweight", // Private company
    targetPrice: "$1020",
    keyProducts: ["Claude Opus 4.1"],
    partnerships: [
      {
        partner: "Microsoft",
        details: "Models available on Microsoft 365 Copilot"
      },
      {
        partner: "Databricks",
        details: "Five-year strategic partnership"
      }
    ],
    performance: {
      modelAccuracy: "47.6% win/tie rate vs human experts"
    }
  },
  {
    name: "NVIDIA",
    type: "Hardware & Computing",
    analysts: [
      {
        name: "Brenda Duverce",
        title: "Private Company Research",
        email: "brenda.duverce@jpmorgan.com",
        phone: "(1-212) 622-5106"
      },
      {
        name: "Lula Sheena, CFA",
        title: "Private Company Research",
        email: "lula.sheena@jpmorgan.com",
        phone: "(44-20) 7742-1452"
      },
      {
        name: "Aaron Steiker",
        title: "Private Company Research",
        email: "aaron.steiker@jpmorgan.com",
        phone: "(1-212) 270-3679"
      }
    ],
    rating: "Overweight", // Market leader in AI hardware
    targetPrice: "$980", // AI compute demand and market dominance
    partnerships: [
      {
        partner: "OpenAI",
        details: "Strategic computing systems partnership",
        value: "$100bn"
      }
    ]
  },
  {
    name: "Databricks",
    type: "Data & AI Platform",
    analysts: [
      {
        name: "Brenda Duverce",
        title: "Private Company Research",
        email: "brenda.duverce@jpmorgan.com",
        phone: "(1-212) 622-5106"
      },
      {
        name: "Lula Sheena, CFA",
        title: "Private Company Research",
        email: "lula.sheena@jpmorgan.com",
        phone: "(44-20) 7742-1452"
      },
      {
        name: "Aaron Steiker",
        title: "Private Company Research",
        email: "aaron.steiker@jpmorgan.com",
        phone: "(1-212) 270-3679"
      }
    ],
    rating: "Underweight", // Private company
    targetPrice: "$452",
    partnerships: [
      {
        partner: "OpenAI",
        value: "$100mn",
        details: "Multi-year partnership for enterprise AI"
      },
      {
        partner: "Anthropic",
        details: "Five-year strategic partnership"
      }
    ]
  },
  {
    name: "Oracle",
    type: "Cloud & Infrastructure",
    analysts: [
      {
        name: "Brenda Duverce",
        title: "Private Company Research",
        email: "brenda.duverce@jpmorgan.com",
        phone: "(1-212) 622-5106"
      },
      {
        name: "Lula Sheena, CFA",
        title: "Private Company Research",
        email: "lula.sheena@jpmorgan.com",
        phone: "(44-20) 7742-1452"
      },
      {
        name: "Aaron Steiker",
        title: "Private Company Research",
        email: "aaron.steiker@jpmorgan.com",
        phone: "(1-212) 270-3679"
      }
    ],
    rating: "Underweight", // Facing strong cloud competition
    targetPrice: "$115", // Cloud market share challenges
    partnerships: [
      {
        partner: "OpenAI",
        value: "$300bn",
        details: "Five-year partnership"
      }
    ]
  },
  {
    name: "CoreWeave",
    type: "Cloud Infrastructure",
    analysts: [
      {
        name: "Brenda Duverce",
        title: "Private Company Research",
        email: "brenda.duverce@jpmorgan.com",
        phone: "(1-212) 622-5106"
      },
      {
        name: "Lula Sheena, CFA",
        title: "Private Company Research",
        email: "lula.sheena@jpmorgan.com",
        phone: "(44-20) 7742-1452"
      },
      {
        name: "Aaron Steiker",
        title: "Private Company Research",
        email: "aaron.steiker@jpmorgan.com",
        phone: "(1-212) 270-3679"
      }
    ],
    rating: "Overweight", // Private company
    targetPrice: "$289",
    partnerships: [
      {
        partner: "OpenAI",
        value: "$22.4bn",
        details: "Expanded infrastructure agreement"
      }
    ]
  }
];

export default companies;