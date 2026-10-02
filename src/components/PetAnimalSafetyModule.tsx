import React, { useState } from 'react';
import {
  Heart,
  Dog,
  Cat,
  Bird,
  AlertTriangle,
  Flame,
  Droplets,
  Sun,
  ShieldAlert,
  PhoneCall,
  Copy,
  Check,
  Send,
  Camera,
  Upload,
  Sparkles,
  MapPin,
  Clock,
  Info,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import {
  AnimalType,
  calculateAnimalRisk,
  ODISHA_ANIMAL_NGOS,
  INITIAL_DISTRESS_FEED,
  DistressReport,
} from '../services/animalRiskCalculator';
import { TemperatureUnit } from '../types';

interface PetAnimalSafetyModuleProps {
  currentTempC: number;
  currentHumidity: number;
  currentLocationName: string;
  unit: TemperatureUnit;
  onBackToHumanRisk?: () => void;
}

export const PetAnimalSafetyModule: React.FC<PetAnimalSafetyModuleProps> = ({
  currentTempC,
  currentHumidity,
  currentLocationName,
  unit,
  onBackToHumanRisk,
}) => {
  // Input states
  const [selectedAnimal, setSelectedAnimal] = useState<AnimalType>('Dog');
  const [isOutside, setIsOutside] = useState<boolean>(true);
  const [simTempC, setSimTempC] = useState<number>(currentTempC);
  const [simHumidity, setSimHumidity] = useState<number>(currentHumidity);

  // Sync when currentTempC updates externally if not manually modified
  React.useEffect(() => {
    setSimTempC(currentTempC);
    setSimHumidity(currentHumidity);
  }, [currentTempC, currentHumidity]);

  // Copy feedback state for NGO phone numbers
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Distress report form states
  const [reportAnimal, setReportAnimal] = useState<AnimalType | 'Other'>('Dog');
  const [reportLocation, setReportLocation] = useState<string>(currentLocationName);
  const [reportCondition, setReportCondition] = useState<string>('Severe heat panting, unable to walk');
  const [reportDescription, setReportDescription] = useState<string>('');
  const [reportPhone, setReportPhone] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);
  const [distressFeed, setDistressFeed] = useState<DistressReport[]>(INITIAL_DISTRESS_FEED);

  // Compute live animal risk
  const animalAssessment = calculateAnimalRisk(selectedAnimal, isOutside, simTempC, simHumidity);

  const handleCopyPhone = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitDistressReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ticketNumber = `OD-HEAT-${Math.floor(1000 + Math.random() * 9000)}`;

    setTimeout(() => {
      const newReport: DistressReport = {
        id: ticketNumber,
        animalType: reportAnimal,
        location: reportLocation || 'Bhubaneswar Corridor',
        condition: reportCondition,
        urgency: 'CRITICAL',
        photoPreview: photoPreview || undefined,
        description: reportDescription || 'Stray animal in distress, reported via emergency web alert.',
        reporterPhone: reportPhone ? `${reportPhone.substring(0, 4)}*****` : '+91 94370 *****',
        status: 'DISPATCHED',
        timestamp: 'Just now',
      };

      setDistressFeed([newReport, ...distressFeed]);
      setSubmittedTicket(ticketNumber);
      setIsSubmitting(false);

      // Reset form
      setReportDescription('');
      setPhotoPreview(null);
    }, 700);
  };

  const riskBadgeStyle = {
    SAFE: 'text-emerald-400 border-emerald-800 bg-emerald-950/60',
    MODERATE: 'text-amber-400 border-amber-800 bg-amber-950/60',
    HIGH: 'text-orange-400 border-orange-800 bg-orange-950/60',
    CRITICAL: 'text-rose-400 border-rose-800 bg-rose-950/70 animate-pulse',
  }[animalAssessment.riskCategory];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner for Animal Care Hub */}
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="max-w-3xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>NGO &amp; Community Stray Protection Mission · Odisha Chapter</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Pet &amp; Stray Animal Heat Safety Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Dogs, cats, cows, and urban birds have limited thermoregulatory sweat glands. Dark asphalt can heat up to <strong>65°C</strong>, burning paws in 60 seconds. Calculate species-specific heat risks, discover actionable NGO protocols, and report strays in distress.
          </p>

          {onBackToHumanRisk && (
            <div className="pt-2">
              <button
                onClick={onBackToHumanRisk}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 underline inline-flex items-center gap-1"
              >
                ← Back to Human Heat Risk Assessment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 1. Animal Heat Risk Meter Engine */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Animal Heat Risk Meter
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Select animal type and environment to calculate physiological thermal strain
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-black border ${riskBadgeStyle}`}>
              ANIMAL RISK: {animalAssessment.riskCategory} ({animalAssessment.riskScore}/100)
            </span>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Select Animal Type */}
          <div className="space-y-2 lg:col-span-2">
            <label className="text-xs font-semibold text-slate-300 block">
              1. Select Animal Species
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { type: 'Dog' as AnimalType, label: 'Dog / श्वान', icon: Dog },
                { type: 'Cat' as AnimalType, label: 'Cat / मार्जार', icon: Cat },
                { type: 'Cow' as AnimalType, label: 'Cow / गोवंश', icon: Heart },
                { type: 'Bird' as AnimalType, label: 'Bird / पक्षी', icon: Bird },
              ].map(({ type, label, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedAnimal(type)}
                  className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                    selectedAnimal === type
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-semibold">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Is it outside? */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              2. Is the Animal Outside?
            </label>
            <div className="grid grid-cols-2 gap-2 h-[52px]">
              <button
                type="button"
                onClick={() => setIsOutside(true)}
                className={`rounded-2xl border px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isOutside
                    ? 'bg-rose-950/80 border-rose-500 text-rose-300 ring-1 ring-rose-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sun className="w-4 h-4 text-rose-400" />
                <span>Yes, Street / Outside</span>
              </button>
              <button
                type="button"
                onClick={() => setIsOutside(false)}
                className={`rounded-2xl border px-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  !isOutside
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Check className="w-4 h-4 text-emerald-400" />
                <span>No, Shaded / Indoor</span>
              </button>
            </div>
          </div>

          {/* Ambient Temperature inherit / test */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>3. Temperature</span>
              <span className="font-mono text-amber-400">{simTempC}°C</span>
            </div>
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-2xl">
              <input
                type="range"
                min="24"
                max="50"
                step="1"
                value={simTempC}
                onChange={(e) => setSimTempC(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>24°C</span>
                <span className="text-slate-300">{simTempC}°C</span>
                <span>50°C</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Calculation Output Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Output 1: Paw Burn & Asphalt Heat */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Asphalt Surface Temp
              </span>
              <div className="text-2xl font-black font-mono text-rose-400 mt-0.5">
                {animalAssessment.asphaltTempC}°C
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Air is {simTempC}°C, but dark road absorbs solar radiation.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80">
              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  animalAssessment.pawBurnRisk === 'SEVERE_BURN_UNDER_60s'
                    ? 'bg-rose-950 text-rose-300 border border-rose-700 animate-pulse'
                    : animalAssessment.pawBurnRisk === 'MODERATE'
                    ? 'bg-amber-950 text-amber-300 border border-amber-700'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}
              >
                {animalAssessment.pawBurnRisk === 'SEVERE_BURN_UNDER_60s'
                  ? 'PAW BURN IN 60 SECONDS!'
                  : animalAssessment.pawBurnRisk === 'MODERATE'
                  ? 'Moderate Paw Discomfort'
                  : 'Paw Temp Safe'}
              </span>
            </div>
          </div>

          {/* Output 2: Panting Rate */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Estimated Panting Rate
              </span>
              <div className="text-2xl font-black font-mono text-amber-300 mt-0.5">
                ~{animalAssessment.pantingRatePerMin} /min
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Normal: 20-35 breaths/min. Excessive panting triggers respiratory alkalosis.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
              Cooling Capacity: <strong className="text-rose-400">-{animalAssessment.coolingCapacityLossPercent}%</strong>
            </div>
          </div>

          {/* Output 3: Hydration Need */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Daily Water Requirement
              </span>
              <div className="text-sm font-bold text-sky-300 mt-1 leading-snug">
                {animalAssessment.waterRequirementPerDay}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Double replenishment required in dry heat &gt;38°C.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-sky-400 font-mono">
              Provide clay bowls under shade
            </div>
          </div>

          {/* Output 4: First-Aid Action */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                First Aid Action
              </span>
              <p className="text-xs text-slate-200 mt-1 line-clamp-3">
                {animalAssessment.firstAidSteps[0]}
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-amber-300 font-mono">
              Avoid ice water shock · Use room temp water
            </div>
          </div>
        </div>

        {/* Species-Specific NGO Action Plan */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Targeted NGO Action Plan for {selectedAnimal}s:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {animalAssessment.ngoActionPlan.map((step, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Actionable Cards: Water Bowls, Don't Tie Pets, Contact NGOs */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Community Heat Protection Directives
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Keep water bowl outside for strays */}
          <div className="bg-slate-900 border border-sky-800/60 rounded-3xl p-5 sm:p-6 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Keep Water Bowl Outside for Strays
              </h3>
              <p className="text-xs text-sky-400 font-semibold">
                मिट्टी का बर्तन छाया में रखें (Pots of Life)
              </p>
              <ul className="text-xs text-slate-300 space-y-2 leading-relaxed list-disc list-inside">
                <li>Use broad, heavy earthen clay bowls (mitti ka kunda) so they cannot be tipped over.</li>
                <li>Place them under tree shade or building verandas away from direct midday sun.</li>
                <li>Clean and refill twice daily with cool water to prevent mosquito breeding.</li>
                <li>Leave a shallow saucer on rooftops or balconies for dehydrated birds.</li>
              </ul>
            </div>
            <div className="p-3 bg-sky-950/40 rounded-xl border border-sky-800/60 text-[11px] text-sky-200">
              One water bowl outside your shop or house can save 5+ stray lives every single day!
            </div>
          </div>

          {/* Card 2: Don't tie pets in direct sunlight */}
          <div className="bg-slate-900 border border-rose-800/60 rounded-3xl p-5 sm:p-6 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Don&apos;t Tie Pets in Direct Sunlight
              </h3>
              <p className="text-xs text-rose-400 font-semibold">
                पालतू जानवरों को धूप या टिन शेड में न बांधें
              </p>
              <ul className="text-xs text-slate-300 space-y-2 leading-relaxed list-disc list-inside">
                <li>Tethering dogs in open verandas or under tin roofs causes fatal heatstroke in under 25 minutes.</li>
                <li>Walking dogs on hot asphalt between 10 AM and 6 PM will blister their paw pads severely. Test road with back of your hand for 7 seconds.</li>
                <li>Provide wet cotton towels on the floor for them to rest their belly on.</li>
                <li>Never, under any circumstances, leave a pet inside a stationary car.</li>
              </ul>
            </div>
            <div className="p-3 bg-rose-950/40 rounded-xl border border-rose-800/60 text-[11px] text-rose-200">
              Walking Rule: Walk dogs only before 6:30 AM or after 7:30 PM during heatwave alerts.
            </div>
          </div>

          {/* Card 3: Contact Nearest NGO (Odisha Emergency Helplines) */}
          <div className="bg-slate-900 border border-amber-800/60 rounded-3xl p-5 sm:p-6 shadow-md flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                Contact Nearest Animal NGO
              </h3>
              <p className="text-xs text-amber-400 font-semibold">
                ओडिशा आपातकालीन पशु बचाव हेल्पलाइन
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect directly with certified animal welfare squads, rescue ambulances, and critical trauma centers.
              </p>

              {/* Helplines Quick List */}
              <div className="space-y-2 pt-1">
                {ODISHA_ANIMAL_NGOS.slice(0, 3).map((ngo) => (
                  <div
                    key={ngo.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div className="truncate">
                      <div className="text-xs font-bold text-slate-100 truncate">
                        {ngo.name}
                      </div>
                      <div className="text-[10px] text-amber-400 font-mono">
                        {ngo.phone}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={`tel:${ngo.phoneRaw}`}
                        className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950"
                        title={`Call ${ngo.name}`}
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleCopyPhone(ngo.id, ngo.phoneRaw)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        title="Copy number"
                      >
                        {copiedId === ngo.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400">
              Government 1962 is toll-free for all 30 districts of Odisha.
            </div>
          </div>
        </div>
      </section>

      {/* 3. Comprehensive Odisha NGO Contacts Directory */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">
              Official Odisha Animal NGO &amp; Rescue Squad Directory
            </h3>
            <p className="text-xs text-slate-400">
              Verified emergency responders for heat-collapsed cows, dogs, cats, and birds
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/80 px-2.5 py-1 rounded-full">
            24x7 Hotlines Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {ODISHA_ANIMAL_NGOS.map((ngo) => (
            <div
              key={ngo.id}
              className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900">
                    {ngo.type}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {ngo.location}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {ngo.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {ngo.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {ngo.phone}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyPhone(ngo.id, ngo.phoneRaw)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                    title="Copy phone"
                  >
                    {copiedId === ngo.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <a
                    href={`tel:${ngo.phoneRaw}`}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. "Report Stray in Distress" Module */}
      <section
        id="report-stray-section"
        className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Report Stray in Distress (Live Rescue Dispatch)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Notice a heat-exhausted stray animal on the road? Submit emergency coordinates for rescue.
            </p>
          </div>

          {submittedTicket && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs font-mono font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>Ticket #{submittedTicket} Dispatched!</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Submission Form */}
          <form
            onSubmit={handleSubmitDistressReport}
            className="lg:col-span-7 bg-slate-950 border border-slate-800/90 rounded-2xl p-5 space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field: Animal Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Animal Type
                </label>
                <select
                  value={reportAnimal}
                  onChange={(e) => setReportAnimal(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="Dog">Stray Dog (कुत्ता)</option>
                  <option value="Cat">Stray Cat (बिल्ली)</option>
                  <option value="Cow">Stray Cow / Cattle (गोवंश)</option>
                  <option value="Bird">Dehydrated Bird (पक्षी)</option>
                  <option value="Other">Other Wildlife / Animal</option>
                </select>
              </div>

              {/* Field: Location */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" /> Location
                  </span>
                  <button
                    type="button"
                    onClick={() => setReportLocation(currentLocationName)}
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline"
                  >
                    Auto-fill GPS
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={reportLocation}
                  onChange={(e) => setReportLocation(e.target.value)}
                  placeholder="e.g. Master Canteen Sq, near Auto Stand"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Field: Condition / Symptoms */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Condition / Heat Stroke Symptoms
              </label>
              <input
                type="text"
                required
                value={reportCondition}
                onChange={(e) => setReportCondition(e.target.value)}
                placeholder="e.g. Collapsed, heavy frothing saliva, hot tar burns, cannot stand"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Field: Photo Upload (UI Preview) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Photo Upload (Optional UI Proof)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 hover:border-amber-400 bg-slate-900/60 hover:bg-slate-900 transition-colors text-xs text-slate-400 hover:text-slate-200">
                  <Camera className="w-4 h-4 text-amber-400" />
                  <span>{photoPreview ? 'Change Photo' : 'Upload or Snap Picture'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
                {photoPreview && (
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                    <img
                      src={photoPreview}
                      alt="Uploaded stray preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPhotoPreview(null)}
                      className="absolute inset-0 bg-slate-950/70 text-rose-400 flex items-center justify-center text-[10px] opacity-0 hover:opacity-100 transition-opacity"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Field: Description & Reporter Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Additional Notes / Landmark
                </label>
                <input
                  type="text"
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="e.g. Under the banyan tree shade"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Reporter Contact (For Rescue Driver)
                </label>
                <input
                  type="tel"
                  value={reportPhone}
                  onChange={(e) => setReportPhone(e.target.value)}
                  placeholder="+91 94370 00000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-orange-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>{isSubmitting ? 'Transmitting Distress Ticket...' : 'Dispatch Emergency Rescue Ticket'}</span>
            </button>
          </form>

          {/* Right Column: Live Community Rescue Feed */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Live Community Rescue Feed
              </span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Dispatch
              </span>
            </div>

            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {distressFeed.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-amber-400 text-[11px]">
                      #{item.id} · {item.animalType}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                        item.status === 'DISPATCHED'
                          ? 'bg-rose-950 text-rose-300 border-rose-800 animate-pulse'
                          : item.status === 'CARE_ASSIGNED'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-slate-200 font-medium leading-snug">
                    {item.condition}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                    <span className="flex items-center gap-1 truncate max-w-[180px]">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      {item.location}
                    </span>
                    <span className="font-mono text-slate-500 shrink-0">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
