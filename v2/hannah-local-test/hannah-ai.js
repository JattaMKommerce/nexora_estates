/**
 * Hannah AI Engine & Nexora Verified Knowledge Base
 * Powered by Jatta M Kommerce
 * 
 * Strict Ground-Truth Principles:
 * 1. Nexora is a real estate digital twin & construction tracking SaaS platform.
 * 2. 6 Verified Stages:
 *    - Stage 1: Site Evaluation
 *    - Stage 2: Master Planning
 *    - Stage 3: Construction
 *    - Stage 4: Fit-Out & Handover
 *    - Stage 5: Ready to Move In
 *    - Stage 6: Virtual Tour
 * 3. Never invent real project names, locations, prices, unit availability, or floor plans.
 * 4. Multi-language responses (English, Hindi, Kannada, Tamil).
 * 5. Modular Ollama API hook with automatic offline / zero-latency knowledge-base fallback.
 */

export const NEXORA_KNOWLEDGE = {
  name: 'Nexora',
  parentCompany: 'Jatta M Kommerce',
  description: 'Nexora is a next-generation real estate digital twin and construction tracking SaaS platform powered by Jatta M Kommerce. It empowers builders, developers, and home buyers to visualize, manage, and pre-sell luxury villas and gated society developments before and while they are built.',
  digitalTwin: 'A digital twin is a photorealistic 3D virtual replica of a development created directly from architectural and engineering drawings, enabling buyers and project teams to explore and monitor progress in real time before physical completion.',
  contactEmail: 'contact@jattamkommerce.com',
  stages: [
    {
      number: 1,
      id: 'site-evaluation',
      title: 'Site Evaluation',
      tagline: 'Strategic Plot Feasibility & Pre-Construction Analysis',
      details: 'Checking a plot before breaking ground: comprehensive road access assessment, boundary and topography surveys, water and electrical utility verification, municipal sanction reviews, zoning and setbacks, soil compaction testing, solar path & cross-ventilation analysis, environmental clearances, and rainwater recharge planning.'
    },
    {
      number: 2,
      id: 'master-planning',
      title: 'Master Planning',
      tagline: 'Architectural Blueprints & Interactive 3D Digital Twin',
      details: 'Crafting villa layouts, sanction plans, RERA registration compliance, early material planning, and green-building benchmarks. This stage launches Nexora’s interactive 3D digital twin with an integrated villa customizer for finishes, live inventory & booking, and a homeowner milestone portal.'
    },
    {
      number: 3,
      id: 'construction',
      title: 'Construction',
      tagline: 'Precision Engineering & Society Infrastructure Rising',
      details: 'Watching the society, residential towers, and clubhouse rise: site mobilization, automated gatehouses, structural raft foundations, residential tower frameworks, clubhouse facilities, swimming pools and leisure decks, sports courts, children’s play areas, and underground utilities.'
    },
    {
      number: 4,
      id: 'fit-out-handover',
      title: 'Fit-Out & Handover',
      tagline: 'Interior Craftsmanship, 200+ Point Snag Audit & Commissioning',
      details: 'Delivering premium bespoke interior finishes, modular designer kitchens, and wardrobes. Supported by a rigorous 200+ point digital snag audit inside the Nexora app, contractor snag resolution workflows, official homeowner walkthroughs, key handover, and society facility commissioning.'
    },
    {
      number: 5,
      id: 'ready-to-move-in',
      title: 'Ready to Move In',
      tagline: 'Fully Commissioned Society Living & Smart Resident Management',
      details: 'Welcoming residents to active society amenities: operational clubhouse and pool, 24/7 smart gated security, and seamless estate facility management delivered via the Nexora resident mobile application.'
    },
    {
      number: 6,
      id: 'virtual-tour',
      title: 'Virtual Tour',
      tagline: 'Photorealistic Interactive 3D Villa Experience',
      details: 'Experience interactive points on our illustrative luxury villa: architectural facade and driveway, private courtyard gardens, society clubhouse and infinity pool, double-height living & dining pavilion, master bedroom suite, and integrated smart security with solar roof.'
    }
  ],
  modules: [
    'Land and Feasibility Suite',
    '3D Virtual Sales Gallery & Customizer',
    'Construction Milestone Tracker with IoT telemetry',
    'Digital Quality & 200+ Point Snagging Engine',
    'Buyer Handover & Resident Facility Portal'
  ]
};

export class HannahAIEngine {
  constructor(options = {}) {
    this.language = options.language || 'en'; // 'en' | 'hi' | 'kn' | 'ta'
    this.ollamaUrl = options.ollamaUrl || 'http://localhost:11434';
    this.ollamaModel = options.ollamaModel || 'llama3.2';
    this.useOllamaIfAvailable = true;
  }

  setLanguage(lang) {
    this.language = lang;
  }

  getGreeting() {
    switch (this.language) {
      case 'hi':
        return 'नमस्ते! नेक्सोरा में आपका स्वागत है। मैं हन्ना हूँ, आपकी वर्चुअल रिसेप्शनिस्ट। मैं हमारे प्लेटफ़ॉर्म और निर्माण चरणों की जानकारी में आपकी मदद करूँगी। आप आज क्या जानना चाहेंगे?';
      case 'kn':
        return 'ನಮಸ್ಕಾರ! ನೆಕ್ಸೋರಾಗೆ ಸುಸ್ವಾಗತ. ನಾನು ಹನ್ನಾ, ನಿಮ್ಮ ವರ್ಚುವಲ್ ರಿಸೆಪ್ಷನಿಸ್ಟ್. ನಮ್ಮ ರಿಯಲ್ ಎಸ್ಟೇಟ್ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಅನ್ನು ಅನ್ವೇಷಿಸಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ. ನೀವು ಇಂದು ಏನನ್ನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?';
      case 'ta':
        return 'வணக்கம்! நெக்சோராவிற்கு வரவேற்கிறோம். நான் ஹன்னா, உங்கள் வரவேற்பாளர். எங்கள் தளத்தை ஆராய உங்களுக்கு உதவ நான் தயாராக உள்ளேன். நீங்கள் எதைப் பற்றி தெரிந்து கொள்ள விரும்புகிறீர்கள்?';
      case 'en':
      default:
        return "Welcome to Nexora! I'm Hannah, your virtual receptionist. I'm here to guide you through our 3D real estate platform and development stages. What would you like to explore today?";
    }
  }

  async generateResponse(userInput, sessionContext = {}) {
    const cleanInput = (userInput || '').trim().toLowerCase();

    // Check if Ollama is accessible
    if (this.useOllamaIfAvailable) {
      try {
        const ollamaRes = await this.queryOllama(userInput, sessionContext);
        if (ollamaRes) return ollamaRes;
      } catch (e) {
        // Fallback transparently to deterministic knowledge engine
      }
    }

    return this.knowledgeBaseMatch(cleanInput, sessionContext);
  }

  knowledgeBaseMatch(input, context) {
    // 1. Language request handling
    if (input.includes('hindi') || input.includes('हिंदी')) {
      this.setLanguage('hi');
      return {
        text: 'जरूर! मैं अब हिंदी में बात कर सकती हूँ। आप नेक्सोरा के 6 चरणों या हमारे डिजिटल ट्विन प्लेटफ़ॉर्म के बारे में कुछ भी पूछ सकते हैं।',
        stage: null
      };
    }
    if (input.includes('kannada') || input.includes('ಕನ್ನಡ')) {
      this.setLanguage('kn');
      return {
        text: 'ಖಂಡಿತ! ನಾನು ಈಗ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಬಲ್ಲೆ. ನೆಕ್ಸೋರಾ ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ ಅಥವಾ ನಮ್ಮ 6 ಹಂತಗಳ ಬಗ್ಗೆ ನೀವು ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಬಹುದು.',
        stage: null
      };
    }
    if (input.includes('tamil') || input.includes('தமிழ்')) {
      this.setLanguage('ta');
      return {
        text: 'நிச்சயமாக! நான் இப்போது தமிழில் பேச முடியும். நெக்சோராவின் மேம்பாட்டு நிலைகள் பற்றி நீங்கள் என்ன தெரிந்து கொள்ள விரும்புகிறீர்கள்?',
        stage: null
      };
    }

    // 2. Greetings
    if (/^(hi|hello|hey|good morning|good afternoon|good evening|namaste|vanakkam|namaskara)\b/i.test(input)) {
      if (this.language === 'hi') {
        return {
          text: 'नमस्ते! मैं आपकी क्या सहायता कर सकती हूँ? आप हमारी साइट मूल्यांकन, निर्माण, या वर्चुअल टूर के बारे में पूछ सकते हैं।',
          stage: null
        };
      }
      return {
        text: "Hello! It's a pleasure to meet you. I can introduce you to our six development stages, explain how our 3D digital twins work, or help you enter the interactive tour.",
        stage: null
      };
    }

    // 3. Stage 1: Site Evaluation
    if (input.includes('site evaluation') || input.includes('stage 1') || input.includes('phase 1') || input.includes('plot') || input.includes('soil') || input.includes('topography')) {
      const s = NEXORA_KNOWLEDGE.stages[0];
      return {
        text: `Stage 1 is ${s.title}: ${s.details} Would you like to proceed to Stage 2: Master Planning, or explore the construction timeline?`,
        stage: 1
      };
    }

    // 4. Stage 2: Master Planning
    if (input.includes('master planning') || input.includes('stage 2') || input.includes('phase 2') || input.includes('blueprint') || input.includes('rera') || input.includes('layout')) {
      const s = NEXORA_KNOWLEDGE.stages[1];
      return {
        text: `Stage 2 is ${s.title}: ${s.details} Next is Stage 3: Construction. Shall we look at that?`,
        stage: 2
      };
    }

    // 5. Stage 3: Construction
    if (input.includes('construction') || input.includes('stage 3') || input.includes('phase 3') || input.includes('structure') || input.includes('clubhouse') || input.includes('foundation') || input.includes('towers')) {
      const s = NEXORA_KNOWLEDGE.stages[2];
      return {
        text: `Stage 3 is ${s.title}: ${s.details} You can see our interactive 3D model of this stage by clicking 'Enter Nexora'. Would you like to inspect Fit-Out & Handover next?`,
        stage: 3
      };
    }

    // 6. Stage 4: Fit-Out & Handover
    if (input.includes('fit-out') || input.includes('fitout') || input.includes('handover') || input.includes('stage 4') || input.includes('phase 4') || input.includes('snag') || input.includes('interiors')) {
      const s = NEXORA_KNOWLEDGE.stages[3];
      return {
        text: `Stage 4 is ${s.title}: ${s.details} After this, the residences are Ready to Move In. Would you like to see Stage 5?`,
        stage: 4
      };
    }

    // 7. Stage 5: Ready to Move In
    if (input.includes('ready to move') || input.includes('stage 5') || input.includes('phase 5') || input.includes('amenities') || input.includes('security') || input.includes('resident')) {
      const s = NEXORA_KNOWLEDGE.stages[4];
      return {
        text: `Stage 5 is ${s.title}: ${s.details} Would you like to step inside the interactive Virtual Tour next?`,
        stage: 5
      };
    }

    // 8. Stage 6: Virtual Tour
    if (input.includes('virtual tour') || input.includes('stage 6') || input.includes('phase 6') || input.includes('explore villa') || input.includes('3d tour')) {
      const s = NEXORA_KNOWLEDGE.stages[5];
      return {
        text: `Stage 6 is ${s.title}: ${s.details} You can click 'ENTER NEXORA' anytime to explore the full interactive experience!`,
        stage: 6
      };
    }

    // 9. Pricing, Property Prices, Availability Guardrail
    if (input.includes('price') || input.includes('cost') || input.includes('how much') || input.includes('available') || input.includes('buy villa') || input.includes('discount')) {
      return {
        text: 'Nexora is a technology platform for developers, and the society shown is an illustrative project demonstration. We do not publish individual unit prices or availability here. To discuss pricing or subscription plans for your development, please book a demo or email contact@jattamkommerce.com.',
        stage: null
      };
    }

    // 10. What is Nexora / Digital Twin
    if (input.includes('what is nexora') || input.includes('about nexora') || input.includes('digital twin') || input.includes('who are you') || input.includes('jatta m kommerce')) {
      return {
        text: `${NEXORA_KNOWLEDGE.description} ${NEXORA_KNOWLEDGE.digitalTwin} Which stage would you like to explore first?`,
        stage: null
      };
    }

    // 11. Enter / Skip / Walkthrough
    if (input.includes('enter') || input.includes('skip') || input.includes('start') || input.includes('let\'s go') || input.includes('tour')) {
      return {
        text: "You can click the yellow 'ENTER NEXORA' button right beside the transcript to launch the full 3D platform, or use the stage buttons below to jump directly to any milestone.",
        stage: null,
        suggestEnter: true
      };
    }

    // 12. Book a Demo / Contact
    if (input.includes('demo') || input.includes('contact') || input.includes('email') || input.includes('sales')) {
      return {
        text: `You can book a personal demo through the 'Book a Demo' button inside the top menu, or reach our executive team directly at ${NEXORA_KNOWLEDGE.contactEmail}. What else can I help explain?`,
        stage: null
      };
    }

    // 13. Polite Fallback with Contextual Direction
    return {
      text: "I want to be completely accurate with you: I don't have that specific detail in our verified records, as our live demonstration focuses on Nexora's core platform and 6 development stages. Would you like me to walk you through Site Evaluation, Master Planning, or Construction?",
      stage: null
    };
  }

  async queryOllama(userInput, context) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000); // 2 second max timeout

    try {
      const systemPrompt = `You are Hannah, the virtual receptionist of Nexora, a real estate software platform powered by Jatta M Kommerce.
Facts:
- Nexora is a real estate digital twin and construction tracking SaaS platform.
- 6 Stages: 1. Site Evaluation, 2. Master Planning, 3. Construction, 4. Fit-Out & Handover, 5. Ready to Move In, 6. Virtual Tour.
- NEVER invent property prices, locations, or availability.
- Be warm, professional, concise (2-3 sentences), and always polite.`;

      const res = await fetch(`${this.ollamaUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.ollamaModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userInput }
          ],
          stream: false
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);
      if (!res.ok) return null;
      const data = await res.json();
      if (data && data.message && data.message.content) {
        return {
          text: data.message.content.trim(),
          stage: null
        };
      }
    } catch (e) {
      clearTimeout(timeout);
      return null;
    }
    return null;
  }
}

