/**
 * Animal Heat Vulnerability & NGO Care Protocol Engine
 * Calculates physiological thermal strain for domestic pets and stray animals.
 * Animals cannot sweat efficiently like humans and exhibit accelerated heat exhaustion.
 */

export type AnimalType = 'Dog' | 'Cat' | 'Cow' | 'Bird';

export type AnimalRiskCategory = 'SAFE' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface AnimalRiskAssessment {
  animalType: AnimalType;
  isOutside: boolean;
  ambientTempC: number;
  humidity: number;
  asphaltTempC: number;
  pawBurnRisk: 'NONE' | 'MODERATE' | 'SEVERE_BURN_UNDER_60s';
  riskCategory: AnimalRiskCategory;
  riskScore: number; // 0 - 100
  pantingRatePerMin: number;
  coolingCapacityLossPercent: number;
  immediateSymptoms: string[];
  firstAidSteps: string[];
  ngoActionPlan: string[];
  waterRequirementPerDay: string;
}

export function estimateAsphaltTemp(ambientC: number, isSunny: boolean = true): number {
  // Direct solar irradiance warms dark asphalt 20°C - 25°C above ambient air temperature
  if (!isSunny || ambientC < 25) return ambientC + 5;
  const factor = ambientC >= 38 ? 22 : 18;
  return Math.round((ambientC + factor) * 10) / 10;
}

export function calculateAnimalRisk(
  animalType: AnimalType,
  isOutside: boolean,
  ambientTempC: number,
  humidity: number
): AnimalRiskAssessment {
  const asphaltTemp = estimateAsphaltTemp(ambientTempC, true);

  // Paw burn rating
  let pawBurnRisk: 'NONE' | 'MODERATE' | 'SEVERE_BURN_UNDER_60s' = 'NONE';
  if (asphaltTemp >= 52) {
    pawBurnRisk = 'SEVERE_BURN_UNDER_60s';
  } else if (asphaltTemp >= 42) {
    pawBurnRisk = 'MODERATE';
  }

  // Base thermal strain calculation
  let baseScore = (ambientTempC - 24) * 3.8 + (humidity - 40) * 0.45;
  if (isOutside) {
    baseScore += 26; // Direct sun and ambient radiant heat
  }

  // Species-specific adjustment
  let pantingBaseline = 30;
  let waterReq = '';
  let immediateSymptoms: string[] = [];
  let firstAidSteps: string[] = [];
  let ngoPlan: string[] = [];

  switch (animalType) {
    case 'Dog':
      baseScore += 5; // Dogs rely solely on panting and paw pads
      pantingBaseline = ambientTempC > 35 ? Math.min(380, Math.round(70 + (ambientTempC - 30) * 20)) : 45;
      waterReq = '50 - 90 ml per kg body weight (1.5 - 3.0 Liters/day)';
      immediateSymptoms = [
        'Excessive heavy panting with thick sticky saliva',
        'Bright red or pale gums and tongue',
        'Lethargy, unsteadiness, or collapse on forelegs',
        'Vomiting, glazed eyes, high rectal temp >40°C (104°F)',
      ];
      firstAidSteps = [
        'Move dog immediately into shaded, well-ventilated or air-cooled area.',
        'Apply room-temperature or cool tap water over neck, armpits, and groin. (NEVER use ice water; it causes vasoconstriction!).',
        'Offer small sips of cool water; do not force drink if vomiting.',
        'Place paws on damp cotton cloth or fan the wet body.',
      ];
      ngoPlan = [
        'Deploy mobile rescue volunteer team with ORS/electrolyte hydration syringes.',
        'Coordinate street hydration drive: install 5L cement/clay basins along street markets.',
        'Check chained guard dogs; legally instruct owners against outdoor tethering.',
      ];
      break;

    case 'Cat':
      baseScore += 3;
      pantingBaseline = ambientTempC > 36 ? Math.min(180, Math.round(30 + (ambientTempC - 30) * 15)) : 25;
      waterReq = '150 - 250 ml/day (cats naturally drink less, highly prone to renal failure)';
      immediateSymptoms = [
        'Open-mouth panting (CRITICAL in cats — indicates severe distress)',
        'Drooling, restlessness, and grooming with hot saliva',
        'Rapid heart rate, feverish paw pads, trembling',
      ];
      firstAidSteps = [
        'Wrap cat gently in a cool, damp towel in a dark, quiet room.',
        'Dampen paw pads and ear tips with cool water.',
        'Leave shallow bowls of fresh cool water nearby; avoid stress or loud handling.',
      ];
      ngoPlan = [
        'Inspect residential tin sheds, parking basements, and engine cavities where stray cats hide.',
        'Broadcast community alert for residents to leave basement water bowls.',
      ];
      break;

    case 'Cow':
      baseScore += 8; // Large body mass, high rumen fermentation heat production
      pantingBaseline = ambientTempC > 34 ? Math.min(110, Math.round(35 + (ambientTempC - 28) * 6)) : 28;
      waterReq = '80 - 130 Liters/day during peak heatwave';
      immediateSymptoms = [
        'Open mouth with protruding tongue and excessive drooling',
        'Rapid thoracic breathing, neck extension',
        'Sharp 30-50% drop in milk production and rumination cessation',
        'Inability to stand up (downer cow state)',
      ];
      firstAidSteps = [
        'Douse cow with continuous hose water over head, back, and rump.',
        'Provide shade cover (burlap/gunny bags soaked in water over stall roof).',
        'Ensure ad-libitum cool clean water with mineral electrolytes and green fodder.',
      ];
      ngoPlan = [
        'Mobilize water tanker runs to local Gaushalas and dairy clusters.',
        'Distribute roof-soaking sprinkler attachments to low-income farmers.',
        'Emergency veterinary triage for recumbent heat-exhausted cattle.',
      ];
      break;

    case 'Bird':
      baseScore += 12; // Birds have high basal temp (41°C) and tiny fluid reservoirs
      pantingBaseline = ambientTempC > 35 ? Math.min(220, Math.round(60 + (ambientTempC - 30) * 18)) : 40;
      waterReq = '50 - 100 ml/day; rapid dehydration occurs within 3 hours in direct sun';
      immediateSymptoms = [
        'Beak breathing (gular fluttering) with wings held away from body',
        'Falling from trees or rooftop perches onto sidewalks',
        'Dull eyes, fluffed feathers, unresponsive to touch',
      ];
      firstAidSteps = [
        'Place bird inside a ventilated cardboard box lined with paper towel in a cool dark room.',
        'Administer 2-3 drops of glucose/electrolyte solution on side of beak with clean dropper (never down the throat).',
        'Mist very gently with fine room-temperature water spray.',
      ];
      ngoPlan = [
        'Distribute 1000+ clay bird baths ("Pots of Life") to apartments, parks, and balconies.',
        'Maintain emergency transit cages for fallen pigeons, kites, and sparrows.',
      ];
      break;
  }

  const score = Math.max(5, Math.min(100, Math.round(baseScore)));

  let riskCategory: AnimalRiskCategory = 'SAFE';
  if (score >= 78 || ambientTempC >= 42 || (isOutside && ambientTempC >= 38)) {
    riskCategory = 'CRITICAL';
  } else if (score >= 55 || ambientTempC >= 36 || (isOutside && ambientTempC >= 33)) {
    riskCategory = 'HIGH';
  } else if (score >= 35 || ambientTempC >= 30) {
    riskCategory = 'MODERATE';
  }

  const coolingCapacityLoss =
    riskCategory === 'CRITICAL' ? 85 : riskCategory === 'HIGH' ? 60 : riskCategory === 'MODERATE' ? 30 : 5;

  return {
    animalType,
    isOutside,
    ambientTempC,
    humidity,
    asphaltTempC: asphaltTemp,
    pawBurnRisk,
    riskCategory,
    riskScore: score,
    pantingRatePerMin: pantingBaseline,
    coolingCapacityLossPercent: coolingCapacityLoss,
    immediateSymptoms,
    firstAidSteps,
    ngoActionPlan: ngoPlan,
    waterRequirementPerDay: waterReq,
  };
}

export interface NGOContact {
  id: string;
  name: string;
  location: string;
  phone: string;
  phoneRaw: string;
  type: 'Helpline' | 'Hospital' | 'Ambulance' | 'Volunteer Group';
  availableHours: string;
  description: string;
}

export const ODISHA_ANIMAL_NGOS: NGOContact[] = [
  {
    id: 'pfa-bbsr',
    name: 'People For Animals (PFA) Bhubaneswar',
    location: 'Bhubaneswar, Odisha',
    phone: '+91 94370 23145',
    phoneRaw: '+919437023145',
    type: 'Helpline',
    availableHours: '24x7 Emergency Heatwave Squad',
    description: 'Premier animal welfare organization in Odisha operating critical care shelter and rescue vans.',
  },
  {
    id: 'govt-1962',
    name: 'Govt Animal Emergency Ambulance (Odisha)',
    location: 'All Odisha Districts',
    phone: '1962 (Toll Free)',
    phoneRaw: '1962',
    type: 'Ambulance',
    availableHours: '24x7 Government Helpline',
    description: 'Free veterinary emergency response vehicle dispatched by Animal Resources Development Dept.',
  },
  {
    id: 'sfa-odisha',
    name: 'Speak For Animals (SFA)',
    location: 'Cuttack & Bhubaneswar',
    phone: '+91 99370 04445',
    phoneRaw: '+919937004445',
    type: 'Volunteer Group',
    availableHours: '7:00 AM - 10:00 PM',
    description: 'Volunteer network organizing street water bowl drives and stray first-aid rescues.',
  },
  {
    id: 'bmc-animal',
    name: 'BMC Animal Control Squad',
    location: 'Bhubaneswar Municipal Area',
    phone: '1800 345 0061',
    phoneRaw: '18003450061',
    type: 'Helpline',
    availableHours: '8:00 AM - 8:00 PM',
    description: 'Municipal rescue helpline for livestock, cows, and injured stray animals in public corridors.',
  },
  {
    id: 'blue-cross-odisha',
    name: 'Blue Cross Animal Hospital',
    location: 'Saheed Nagar, Bhubaneswar',
    phone: '+91 94370 55112',
    phoneRaw: '+919437055112',
    type: 'Hospital',
    availableHours: '24 Hours Emergency Casualty',
    description: 'Equipped with cold IV fluid therapy and cooling tubs for extreme heatstroke stabilization.',
  },
];

export interface DistressReport {
  id: string;
  animalType: AnimalType | 'Other';
  location: string;
  condition: string;
  urgency: 'HIGH' | 'CRITICAL';
  photoPreview?: string;
  description: string;
  reporterPhone: string;
  status: 'DISPATCHED' | 'CARE_ASSIGNED' | 'RESOLVED';
  timestamp: string;
}

export const INITIAL_DISTRESS_FEED: DistressReport[] = [
  {
    id: 'OD-HEAT-8921',
    animalType: 'Dog',
    location: 'Master Canteen Square, Bhubaneswar',
    condition: 'Collapsed near traffic light with heavy panting',
    urgency: 'CRITICAL',
    description: 'Community dog unconscious near divider. Locals provided water, awaiting ambulance.',
    reporterPhone: '+91 98610 *****',
    status: 'DISPATCHED',
    timestamp: '12 mins ago',
  },
  {
    id: 'OD-HEAT-8919',
    animalType: 'Cow',
    location: 'Badambadi Bus Terminal, Cuttack',
    condition: 'Blistered hooves from hot tar, unable to move',
    urgency: 'HIGH',
    description: 'Cow resting under tree shade, BMC cattle team notified.',
    reporterPhone: '+91 94372 *****',
    status: 'CARE_ASSIGNED',
    timestamp: '34 mins ago',
  },
  {
    id: 'OD-HEAT-8912',
    animalType: 'Bird',
    location: 'Khandagiri Enclave, Bhubaneswar',
    condition: 'Sparrow dropped on balcony, dehydrated',
    urgency: 'HIGH',
    description: 'Administered ORS drops via syringe. Bird revived and rested in box.',
    reporterPhone: '+91 97781 *****',
    status: 'RESOLVED',
    timestamp: '1 hour ago',
  },
];
