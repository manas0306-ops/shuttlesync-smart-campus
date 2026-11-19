export interface Persona {
  id: string;
  name: string;
  tagline: string;
  role: string;
  yearDepartment: string;
  avatarBg: string;
  goals: string[];
  painPoints: string[];
  quote: string;
  shuttleUsageFrequency: string;
  techSavviness: string;
}

export interface ObservationLog {
  id: string;
  location: string;
  timeSlot: string;
  date: string;
  crowdSizeRange: string;
  headwayMinutesObserved: number;
  bunchingObserved: boolean;
  passengerMoodNotes: string;
  isSample: boolean;
}

export interface InterviewTemplate {
  questionNumber: number;
  questionText: string;
  targetInsight: string;
  sampleStudentResponse: string;
  interviewerGuidance: string;
}

export interface IdeationIdea {
  id: string;
  title: string;
  category: 'Digital' | 'Infrastructure' | 'Policy' | 'Hardware';
  feasibility: number; // 1-10
  impact: number; // 1-10
  cost: 'Low' | 'Medium' | 'High';
  pros: string[];
  cons: string[];
  selected: boolean;
  selectionRationale: string;
}

export interface TestingChecklist {
  taskNumber: number;
  taskDescription: string;
  expectedOutcome: string;
  testedStatus: 'Passed' | 'Minor Friction' | 'Needs Improvement';
  userFeedbackSummary: string;
  improvementImplemented: string;
}

export interface TeamMember {
  name: string;
  rollNumber: string;
  role: string;
  responsibilities: string[];
  primaryDeliverables: string[];
  contributionPercent: number;
}

export const DESIGN_THINKING_DATA = {
  problemStatement: {
    title: 'P05 – Waiting for the Shuttle: Campus Mobility Bottleneck',
    statement:
      'University students, faculty, and campus residents waste an average of 35-50 minutes daily standing at unsheltered, unpredictable shuttle stops due to vehicle bunching, zero live visibility into passenger capacity, and arbitrary dispatch schedules, causing academic tardiness, safety vulnerabilities at night, and extreme commuter frustration.',
    rootCauses: [
      'Zero real-time telemetry or GPS visibility shared with waiting commuters',
      'Unbalanced passenger loading where initial stops fill shuttles to 100%, leaving downstream stops stranded',
      'No predictive ETAs accounting for inter-gate traffic peaks and lecture shift intervals',
      'Lack of coordinated communication between drivers, security, and campus transit management',
      'Absence of alternate walking-route guidance when a shuttle is delayed or packed',
    ],
    howMightWe:
      'How might we provide students with instant, trustworthy visibility into shuttle locations, crowd levels, and predictive ETAs so they never wait blindly and can make informed campus transit decisions?',
  },

  personas: [
    {
      id: 'persona-1',
      name: 'Ananya Sharma',
      tagline: 'The Punctual Day Commuter',
      role: 'Day Scholar Student',
      yearDepartment: '3rd Year B.Tech Computer Science',
      avatarBg: 'from-sky-500 to-blue-600',
      goals: [
        'Arrive at the 9:00 AM lab session on time without running across campus.',
        'Choose whether to wait 5 minutes or walk 8 minutes when late.',
        'Know if incoming shuttles have free seats or are already crammed.',
      ],
      painPoints: [
        'Waits 15 minutes at North Gate only to watch three full shuttles pass by without stopping.',
        'Zero notice if a shuttle has broken down or diverted route.',
        'Weather exposure during sudden monsoon rain with no sheltered app alerts.',
      ],
      quote: '"I would gladly walk 400 meters to the Library stop if I knew for sure the bus was 2 minutes away with empty seats."',
      shuttleUsageFrequency: 'Daily (4-6 rides/day)',
      techSavviness: 'High (Mobile native)',
    },
    {
      id: 'persona-2',
      name: 'Rohan Verma',
      tagline: 'The Night-Owl Hostelite',
      role: 'Hostel Resident',
      yearDepartment: '2nd Year Mechanical Engineering',
      avatarBg: 'from-purple-500 to-indigo-600',
      goals: [
        'Get safe, reliable transport between Hostel Block C and the Food Court/SAC at 9:30 PM.',
        'Avoid crowded shuttles with heavy gym and project gear.',
        'Check last shuttle operating hours easily.',
      ],
      painPoints: [
        'Shuttles become highly irregular after 8:00 PM without any published schedule updates.',
        'Driver shifts end unexpectedly without passenger notification.',
        'Safety concerns walking along unlit perimeter paths alone at night.',
      ],
      quote: '"Late at night, you stand at the dark stop hoping a shuttle turns up. If you give up and walk, it drives past you 30 seconds later."',
      shuttleUsageFrequency: 'Regular (Evenings & Weekends)',
      techSavviness: 'Moderate',
    },
    {
      id: 'persona-3',
      name: 'Dr. S. K. Nambiar',
      tagline: 'The Inter-Departmental Faculty',
      role: 'Associate Professor & Lab Director',
      yearDepartment: 'Biotechnology & Life Sciences',
      avatarBg: 'from-emerald-500 to-teal-600',
      goals: [
        'Move swiftly between administrative committee meetings and research lab complex.',
        'Have a clean, predictable departure window to schedule research student meetings.',
      ],
      painPoints: [
        'Unpredictable shuttle bunching means 2 shuttles arrive together, then none for 25 minutes.',
        'Difficult to plan transitions between back-to-back lectures.',
      ],
      quote: '"Campus transit should be like a Swiss watch — predictable, dependable, and respect everyone\'s academic schedule."',
      shuttleUsageFrequency: 'Frequent (3-4 times/day)',
      techSavviness: 'Moderate',
    },
  ] as Persona[],

  interviewQuestions: [
    {
      questionNumber: 1,
      questionText: 'How much time do you typically spend waiting for campus shuttles in an average day?',
      targetInsight: 'Quantify commuter time wastage and daily friction points.',
      sampleStudentResponse: '"Easily 35 to 45 minutes every day. Morning rush is the worst because 2 buses pass full before one opens its doors."',
      interviewerGuidance: 'Probe for specific times of day when waiting causes maximum academic stress (e.g., 8:45 AM, 1:15 PM).',
    },
    {
      questionNumber: 2,
      questionText: 'What is the biggest source of anxiety or frustration while waiting at the stop?',
      targetInsight: 'Identify psychological triggers beyond just waiting duration.',
      sampleStudentResponse: '"The total lack of information. You have no idea if the bus is 1 minute away or stuck in gate traffic. That makes you anxious."',
      interviewerGuidance: 'Ask if they have ever abandoned waiting to book a costly commercial auto or walk in the heat/rain.',
    },
    {
      questionNumber: 3,
      questionText: 'If you saw that the shuttle coming to your stop is 95% full, what would you do?',
      targetInsight: 'Test receptiveness to crowd-based alternative stop recommendations.',
      sampleStudentResponse: '"I would either walk to the nearby Library stop where people alight, or just start walking if it’s less than a 10-minute walk."',
      interviewerGuidance: 'Gauge user willingness to walk slightly further for a guaranteed seat or faster trip.',
    },
    {
      questionNumber: 4,
      questionText: 'How do you currently find out if a shuttle is delayed or running on a detour?',
      targetInsight: 'Analyze existing unofficial workarounds (WhatsApp groups, calling friends).',
      sampleStudentResponse: '"Informal WhatsApp batch groups or calling friends who might be standing at previous stops. It\'s completely haphazard."',
      interviewerGuidance: 'Document why current social/manual workarounds fail during critical exam periods.',
    },
  ] as InterviewTemplate[],

  observationLogs: [
    {
      id: 'obs-01',
      location: 'North Main Gate (Metro Feeder)',
      timeSlot: '08:45 AM - 09:30 AM (Peak Morning Rush)',
      date: 'Field Observation Day 1 (Demo Log)',
      crowdSizeRange: '45 - 75 students queued',
      headwayMinutesObserved: 11.5,
      bunchingObserved: true,
      passengerMoodNotes: 'Noticeable stress as students checked wristwatches; two shuttles arrived simultaneously within 40 seconds of each other after an 18-minute gap.',
      isSample: true,
    },
    {
      id: 'obs-02',
      location: 'Student Activity Center / Food Court',
      timeSlot: '01:15 PM - 02:00 PM (Lunch Surge)',
      date: 'Field Observation Day 2 (Demo Log)',
      crowdSizeRange: '35 - 50 students waiting',
      headwayMinutesObserved: 7.0,
      bunchingObserved: false,
      passengerMoodNotes: 'Moderate crowd, students confused about whether incoming shuttle was bound for Engineering or Hostel Loop. Lack of clear digital route signs on vehicles.',
      isSample: true,
    },
    {
      id: 'obs-03',
      location: 'Hostel Cluster A Stop',
      timeSlot: '07:45 PM - 08:30 PM (Evening Twilight)',
      date: 'Field Observation Day 3 (Demo Log)',
      crowdSizeRange: '20 - 30 students',
      headwayMinutesObserved: 14.0,
      bunchingObserved: true,
      passengerMoodNotes: 'Subdued lighting; students continuously peered down the road to spot approaching headlights. Female students expressed desire for live verified shuttle tracking.',
      isSample: true,
    },
  ] as ObservationLog[],

  ideationMatrix: [
    {
      id: 'idea-1',
      title: 'Real-Time Telemetry & Crowd App (ShuttleSync)',
      category: 'Digital',
      feasibility: 9,
      impact: 10,
      cost: 'Low',
      pros: ['Zero heavy physical infrastructure required', 'Accessible on any student phone or campus kiosk', 'Provides predictive ETAs, crowd gauges and smart stop alternative routing'],
      cons: ['Requires driver compliance or on-board GPS beacon integration'],
      selected: true,
      selectionRationale: 'Offers maximum commuter value, highest accessibility, immediate scalability, and solves both information asymmetry and crowd distribution.',
    },
    {
      id: 'idea-2',
      title: 'Physical Electronic LED Signboards at Every Stop',
      category: 'Hardware',
      feasibility: 6,
      impact: 7,
      cost: 'High',
      pros: ['Visible to non-smartphone users and visitors'],
      cons: ['Substantial hardware procurement, cabling, weatherproofing, and vandalism risk', 'Does not solve journey planning from hostel rooms'],
      selected: false,
      selectionRationale: 'Valuable as a supplementary display, but cost-prohibitive as primary solution and lacks personal route planning.',
    },
    {
      id: 'idea-3',
      title: 'Double the Shuttle Fleet Fleet Size',
      category: 'Policy',
      feasibility: 4,
      impact: 6,
      cost: 'High',
      pros: ['Increases gross campus seating capacity'],
      cons: ['Extremely high capital expense', 'Causes worse road congestion and bunching without intelligent scheduling'],
      selected: false,
      selectionRationale: 'More buses on uncoordinated routes simply worsens vehicle bunching and operating carbon footprint.',
    },
    {
      id: 'idea-4',
      title: 'Dedicated Fixed Rigid Timetable Printed on Posters',
      category: 'Policy',
      feasibility: 9,
      impact: 2,
      cost: 'Low',
      pros: ['Virtually free to print and paste'],
      cons: ['Fails on day one due to campus traffic fluctuations, rain, student boarding delays, and driver meal shifts'],
      selected: false,
      selectionRationale: 'Static paper schedules fail completely in real-world university environments where conditions are dynamic.',
    },
  ] as IdeationIdea[],

  testingChecklist: [
    {
      taskNumber: 1,
      taskDescription: 'Inspect live shuttle position and estimated arrival time to chosen stop.',
      expectedOutcome: 'Student can see vehicle moving on campus map with real-time countdown ETA.',
      testedStatus: 'Passed',
      userFeedbackSummary: 'Testers appreciated the visual road movement and clear ETA in minutes/seconds.',
      improvementImplemented: 'Added color-coded status badges (On Time, Delayed, Approaching) for quick scanning.',
    },
    {
      taskNumber: 2,
      taskDescription: 'Evaluate crowd capacity before walking to the stop.',
      expectedOutcome: 'Occupancy gauge clearly displays Low, Moderate, High, or Full with passenger count.',
      testedStatus: 'Passed',
      userFeedbackSummary: 'Testers loved the percentage bar and warning when bus capacity exceeded 90%.',
      improvementImplemented: 'Added automatic alternative stop recommendation when preferred stop shuttle is Full.',
    },
    {
      taskNumber: 3,
      taskDescription: 'Plan an inter-campus journey from Hostel Clusters to Engineering Labs.',
      expectedOutcome: 'System displays available routes, transit duration, walking connection, and carbon savings.',
      testedStatus: 'Passed',
      userFeedbackSummary: 'Route planner clarified which route to take without guessing which bus went where.',
      improvementImplemented: 'Included intermediate stop dropdown and comparative transit vs walking times.',
    },
    {
      taskNumber: 4,
      taskDescription: 'Switch to Driver Portal and simulate passenger boarding and delay updates.',
      expectedOutcome: 'Driver can tap +1/-1 passenger and trigger arrival at next stop.',
      testedStatus: 'Passed',
      userFeedbackSummary: 'Intuitive touch controls ideal for tablet mounted on driver dashboard.',
      improvementImplemented: 'Added quick one-tap status toggles and audio notification feedback.',
    },
  ] as TestingChecklist[],

  teamMembers: [
    {
      name: 'Maanas Pandey',
      rollNumber: 'Lead Engineer & Designer (manas0306-ops)',
      role: 'Project Architect & Full-Stack Developer',
      responsibilities: [
        'End-to-end web architecture & reactive simulation engine design',
        'Interactive SVG campus map coordinate mapping & shuttle path kinematics',
        'Custom animated shuttle-cart cursor and micro-interaction styling',
        'Deployment pipeline, GitHub Actions configuration & QA testing',
      ],
      primaryDeliverables: ['ShuttleSync Web Application', 'Live Tracking Engine', 'Design Thinking Viva Module'],
      contributionPercent: 100,
    },
  ] as TeamMember[],
};
