"""
2026-11-18: Hannah says a little at a time.

Every answer becomes one short sentence. More detail comes only when the visitor says yes to
"Would you like to hear more?" (topic["more"]). Lines that carry {name} put it first ("{name}, lovely
to meet you!"), so her video can say the name (its own short clip) and then the sentence.

Run once:  python3 short_answers.py   (rewrites v2/public/nexora/hannah-knowledge.json in place;
phrases and keywords are untouched)
"""
import json, os

KB = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'public', 'nexora', 'hannah-knowledge.json')
kb = json.load(open(KB))

kb['greeting']['first'] = "Hello, and welcome to Nexora! I'm Hannah, your virtual receptionist. May I know your name?"
kb['greeting']['returning'] = "Welcome back! It's lovely to see you again. How can I help you today?"

TOPICS = {
    'what-is-nexora': ("Nexora is real estate software, powered by Jatta M Kommerce.",
        ["It helps developers show their projects in 3D, before they're even built.",
         "It also tracks construction and hands homes over to buyers, all in one place."],
        "Would you like to know what a 3D digital twin is?"),
    'digital-twin': ("A digital twin is a photorealistic 3D copy of a project.",
        ["It's made from the architect's drawings, so buyers can explore every villa in the browser.",
         "Nexora can turn Revit, ArchiCAD or BIM models into a twin in under 72 hours."],
        "Would you like to see the virtual tour of our example villa?"),
    'modules': ("Nexora has five main modules, from the empty plot to residents moving in.",
        ["The first three are land and feasibility, a 3D sales gallery, and a construction tracker.",
         "Then come quality and snagging, and finally a buyer handover and resident portal."],
        "Shall I walk you through them one at a time?"),
    'who-for': ("Nexora is built for real estate developers and builders.",
        ["From boutique villa builders to large township developers.",
         "Their buyers and residents use it too, to explore homes and follow construction."],
        "Are you a developer, or are you looking for a home yourself?"),
    'phase-1': ("Phase 1 is Site Evaluation, where a developer checks the plot before building.",
        ["Nexora tracks road access, surveys, water, power, approvals, zoning and soil tests."],
        "Would you like me to open Site Evaluation for you?"),
    'phase-2': ("Phase 2 is Master Planning, where the villa layouts are finalised.",
        ["RERA registration is secured, and the 3D twin goes live for buyers, with live inventory and booking."],
        "Shall I open Master Planning so you can see it?"),
    'phase-3': ("Phase 3 is Construction, where the towers and clubhouse rise from the ground.",
        ["Nexora tracks every milestone with drone images, bill checks and photo records."],
        "Would you like me to take you to the Construction phase?"),
    'phase-4': ("Phase 4 is Fit-Out and Handover, when the interiors are finished.",
        ["Every home is checked against more than 200 quality points, and the keys are handed over after a walkthrough."],
        "Shall I open Fit-Out and Handover for you?"),
    'phase-5': ("Phase 5 is Ready to Move In, when residents settle in.",
        ["The resident app handles amenity bookings, visitors, security and maintenance."],
        "Would you like to see Ready to Move In?"),
    'phase-6': ("The Virtual Tour lets you explore our example luxury villa in 3D.",
        ["You can walk through the garden, the clubhouse and pool, the living pavilion and the master suite."],
        "Shall I start the virtual tour for you?"),
    'phases-overview': ("The website tells Nexora's story in five phases, plus a virtual tour.",
        ["Site Evaluation, Master Planning, Construction, Fit-Out and Handover, and Ready to Move In."],
        "Would you like to start at the beginning, with Site Evaluation?"),
    'pricing': ("Nexora has subscription plans for builders of every size.",
        ["Prices aren't published, so the team shares pricing for your project on a demo."],
        "Would you like me to open the demo booking form?"),
    'property-prices': ("I'm sorry, the villa here is an example, not a home for sale.",
        ["So there are no prices or locations to share, but the virtual tour shows how buyers explore a project."],
        "Would you like to see the virtual tour?"),
    'demo': ("I'd be happy to help you book a free demo.",
        ["You share a little about your project, and the team contacts you for a personal walkthrough."],
        "Shall I open the demo form for you now?"),
    'contact': ("You can email the team at contact@jattamkommerce.com.",
        ["Or use the Book a Demo form, and they'll get back to you."],
        "Would you like me to open the Book a Demo form?"),
    'jatta': ("Nexora is powered by Jatta M Kommerce.",
        ["The team can tell you more at contact@jattamkommerce.com."],
        "Would you like to know what Nexora does?"),
    'integrations': ("Nexora connects with tools like Salesforce, HubSpot and builder ERPs.",
        ["There are also webhooks, REST APIs, and connectors for SAP and RERA portals."],
        "Shall I open the demo form, so the team can confirm what fits your setup?"),
    'sustainability': ("Sustainability runs all through the example project.",
        ["Rooftop solar, rainwater harvesting, greywater recycling, EV charging and green-building tracking."],
        "Would you like to start with Site Evaluation, where this planning begins?"),
    'account': ("Nexora accounts are still being set up, so log in isn't connected yet.",
        [],
        "Shall I open the demo form, so the team can give you access?"),
    'website-help': ("It's simple: just scroll to move through the phases.",
        ["The Menu at the top right lists every phase, and Book a Demo is at the top of the page."],
        "Shall I take you into the website now?"),
    'security-data': ("This website doesn't save our conversation.",
        ["When you speak, your browser turns your voice into text, so please don't share sensitive details here."],
        "Is there anything about Nexora I can help with?"),
}
for t in kb['topics']:
    a, more, ask = TOPICS[t['id']]
    t['answer'] = a
    t['more'] = more
    t['followUp']['ask'] = ask

R = kb['roles']
R['developer']['answer'] = "Lovely, then Nexora is made for you."
R['buyer']['answer'] = "Wonderful! Nexora lets you explore homes in 3D, before they're built."
R['explorer']['answer'] = "That's perfectly fine, take your time."

ST = {
    'hello': ["Hi there! Are you a developer or builder, looking for a home, or just exploring?",
              "Hello! Great to have you here. Are you a developer, a home buyer, or just looking around?"],
    'how-are-you': ["I'm doing very well, thank you! How can I help you today?",
                    "I'm great, thanks for asking! What would you like to know about Nexora?"],
    'who-are-you': ["I'm Hannah, Nexora's virtual receptionist, and I'm here to guide you. What would you like to know?"],
    'purpose': ["I'm here to welcome you, answer your questions, and guide you around Nexora. What would you like to know?"],
    'are-you-ai': ["I'm an AI receptionist, but I'm here to help just the same. What would you like to know?"],
    'bye': ["Thank you for visiting Nexora! I'm always in the menu if you need me. Have a lovely day!"],
    'capabilities': ["I can explain Nexora, guide you around the website, and help you book a demo. Where shall we start?"],
}
for s in kb['smallTalk']:
    if s['id'] in ST: s['answers'] = ST[s['id']]

rep = kb['replies']
rep['offTopic'] = [
    "That's a little outside what I can help with, but I'd love to show you Nexora. Shall I give you a quick tour?",
    "I'm sorry, I can't help with that one. But I can show you around Nexora. Shall we take a quick tour?",
    "Ha, I wish I could help with that! I'm best at showing you Nexora. Would you like a quick tour?",
]
rep['confused'] = [
    "No problem, let me keep it simple. Nexora helps builders show homes in 3D, before they're built. Shall I show you around?",
    "That's completely fine. The easiest way to understand Nexora is a quick tour. Shall I show you around?",
]
rep['unknownNexora'] = [
    "I'm sorry, I don't have that detail here. Our team can answer it on a demo. Shall I open the demo form?",
    "Good question! I don't have the answer here, but the team will on a demo. Shall I open the demo form?",
]
rep['notUnderstood'] = [
    "Sorry, I didn't quite catch that. Could you say it another way?",
    "Sorry, I didn't follow. You can ask me what Nexora is, or ask me for a tour.",
]
rep['moreAsk'] = "Would you like to hear more?"
rep['yesNothing'] = "Great! I can explain Nexora, show you around, or help you book a demo. Which would you like?"
rep['languageUnknown'] = "Sorry, I can't understand your language. Please choose one of my languages, so we can talk."
rep['navigate'] = {
    'phase': "Of course, taking you to {label} now.",
    'panel': "Of course, opening {label} for you.",
    'enter': "Of course, taking you into the website now. I'm in the menu if you need me.",
}

ob = kb['onboarding']
ob['_note'] = ("The first steps of every visit: name, then what brings them here, then (developers) their company and "
               "role, then the guided tour offer. A line starting with {name} is said as two clips: her clip of that "
               "name (when one exists), then the line without it.")
ob['askNameAgain'] = "Sorry, I didn't catch your name. Could you type just your first name?"
ob['nameSkipped'] = "No problem at all! Are you a developer or builder, looking for a home, or just exploring?"
ob['niceToMeet'] = "{name}, lovely to meet you! Are you a developer or builder, looking for a home, or just exploring?"
ob['askCompany'] = "Wonderful! Which company are you with, and what's your role there?"
ob['companyThanks'] = "{name}, thank you! Shall I give you a quick guided tour of Nexora?"
ob['buyerTour'] = "Wonderful! Nexora lets you explore homes in 3D, before they're built. Shall I give you a quick guided tour?"
ob['explorerTour'] = "That's perfectly fine, take your time. Shall I give you a quick guided tour?"
ob['tourDeclined'] = "No problem. You can ask me anything, or explore at your own pace."

tour = kb['tour']
SAY = [
    "Let's begin! This is Site Evaluation, where a developer checks the plot before building. Shall we move on?",
    "This is Master Planning. The villa layouts are finalised, and the 3D twin goes live for buyers. Shall we move on?",
    "Here is Construction. Nexora tracks every milestone with drone images and photo records. Shall we move on?",
    "This is Fit-Out and Handover. Every home is quality checked before the keys are handed over. Shall we move on?",
    "Welcome to Ready to Move In. The resident app handles bookings, visitors and maintenance. Shall we see the villa?",
    "This is the virtual tour of our demo villa. Take your time, and look around.",
]
for st, s in zip(tour['steps'], SAY):
    st['say'] = s
tour['finish'] = "{name}, that's the tour! Would you like a personal demo for your own project?"
tour['stopped'] = "No problem, we'll stop here. I'm always in the menu if you need me."
tour['howTo'] = "Just scroll to move between the phases. The Menu at the top right lists them all."

ld = kb['lead']
ld['start'] = "I'd be happy to arrange a free demo! What's the best phone number to reach you?"
ld['startNoName'] = "I'd be happy to arrange a free demo! May I have your name first?"
ld['askPhone'] = "Thank you! What's the best phone number to reach you?"
ld['badPhone'] = "Hmm, that number doesn't look right. Could you type it again, with ten digits?"
ld['askEmail'] = "Thank you. And your email address?"
ld['badEmail'] = "That email doesn't look quite right. Could you type it again?"
ld['done'] = "{name}, thank you! Our team will contact you soon. I'm opening the demo form, so you can pick a date."
ld['declined'] = "No problem at all. The Book a Demo button is at the top, whenever you're ready."

json.dump(kb, open(KB, 'w'), indent=2, ensure_ascii=False)
open(KB, 'a').write('\n')
print('short answers written to', os.path.normpath(KB))
