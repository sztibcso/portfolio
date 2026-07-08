const tecnomatixSlides = [
  {
    title: "Production Line Optimization",
    subtitle: "Siemens Tecnomatix Plant Simulation X",
    type: "heroVideo",
    video: "/videos/tecnomatix/base-simulation.mp4",
    bullets: [
      "DMAIC-based simulation case study",
      "Bottleneck detection and throughput improvement",
      "Final test downtime and late-stage scrap reduction",
    ],
    metrics: [
      { label: "Target", value: "850", suffix: "good units / shift" },
      { label: "Baseline", value: "736", suffix: "good units" },
      { label: "Final", value: "882", suffix: "good units" },
    ],
  },
  {
    title: "Project Context",
    type: "imageText",
    image: "/images/tecnomatix/01-base-model-layout.png",
    bullets: [
      "Fictional but realistic high-volume production line",
      "Machining, testing and assembly steps",
      "Final test station modeled as the main constraint",
      "8-hour shift with a target of 850 good units",
    ],
    caption: "Base Tecnomatix model layout.",
  },
  {
    title: "DMAIC Structure",
    type: "cards",
    cards: [
      { title: "Define", text: "Define the target, process scope and business problem." },
      { title: "Measure", text: "Set cycle times, downtime, scrap rate and shift target." },
      { title: "Analyze", text: "Run the baseline and identify the main constraint." },
      { title: "Improve", text: "Test targeted final test improvements." },
      { title: "Control", text: "Define KPIs to keep the improved state stable." },
    ],
  },
  {
    title: "Measure",
    type: "table",
    text: "The model started with fixed cycle times. Test 2 was configured as the slowest station to represent the final bottleneck.",
    table: {
      columns: ["Station", "Cycle time"],
      rows: [
        ["Machining 1", "18 sec"],
        ["Machining 2", "22 sec"],
        ["Test 1", "30 sec"],
        ["Assembly 1", "26 sec"],
        ["Assembly 2", "28 sec"],
        ["Test 2", "34 sec"],
      ],
    },
  },
  {
    title: "Ideal Baseline",
    type: "imageText",
    image: "/images/tecnomatix/02-base-output-statistics.png",
    bullets: [
      "The first run was executed without downtime and scrap.",
      "The model produced 843 units in an 8-hour shift.",
      "Average exit time was 34 seconds.",
      "This confirmed that Test 2 controlled the output rate.",
    ],
    metrics: [
      { label: "Output", value: "843", suffix: "units" },
      { label: "Target", value: "850", suffix: "units" },
      { label: "Gap", value: "-7", suffix: "units" },
    ],
  },
  {
    title: "Analyze: Realistic Baseline",
    type: "imageText",
    image: "/images/tecnomatix/09-baseline-output-split.png",
    bullets: [
      "After adding final test downtime and 2.5% scrap, good output dropped to 736 units.",
      "19 units were rejected as late-stage scrap.",
      "The target gap increased to 114 good units.",
      "The final test station created a combined capacity and quality loss.",
    ],
    metrics: [
      { label: "Good output", value: "736", suffix: "units" },
      { label: "Scrap", value: "19", suffix: "units" },
      { label: "Target gap", value: "-114", suffix: "units" },
    ],
  },
  {
    title: "Improve: Scenario Comparison",
    type: "comparison",
    cards: [
      {
        title: "Availability",
        before: "88.5%",
        after: "94%",
        result: "736 → 768 good units",
      },
      {
        title: "Cycle Time",
        before: "34 sec",
        after: "30 sec",
        result: "768 → 871 good units",
      },
      {
        title: "Scrap Rate",
        before: "2.5%",
        after: "1.2%",
        result: "871 → 882 good units",
      },
    ],
  },
  {
    title: "Final Improved State",
    type: "heroVideo",
    video: "/videos/tecnomatix/final-simulation.mp4",
    bullets: [
      "Good output increased from 736 to 882 units per shift.",
      "The 850-unit target was exceeded by 32 units.",
      "Late-stage scrap was reduced from 19 to 11 units.",
    ],
    metrics: [
      { label: "Good output", value: "882", suffix: "units" },
      { label: "Improvement", value: "+146", suffix: "good units" },
      { label: "Scrap", value: "11", suffix: "units" },
    ],
  },
  {
    title: "Final Results",
    type: "table",
    text: "The final scenario reached the production target and reduced late-stage scrap.",
    table: {
      columns: ["Scenario", "Good Output", "Scrap", "Total", "Status"],
      rows: [
        ["Ideal baseline", "843", "0", "843", "Almost reached"],
        ["Realistic baseline", "736", "19", "755", "Not reached"],
        ["Availability improved", "768", "20", "788", "Not reached"],
        ["Cycle time improved", "871", "22", "893", "Reached"],
        ["Final scenario", "882", "11", "893", "Reached"],
      ],
    },
  },
  {
    title: "What This Demonstrates",
    type: "cards",
    cards: [
      { title: "Production mindset", text: "Understanding of bottlenecks, WIP, downtime and scrap." },
      { title: "DMAIC thinking", text: "Structured problem solving from definition to control." },
      { title: "Simulation", text: "Building and interpreting a working Tecnomatix model." },
      { title: "Data storytelling", text: "Turning simulation results into clear business decisions." },
    ],
  },
];

export default tecnomatixSlides;