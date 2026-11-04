/* Products used in "Found in" modules. Only products whose name states the ingredient are linked.
   PROTOTYPE: links go to the live homepage; no prices shown. */
window.PRODUCTS = {
  'calm-relaxed-dry': { name: 'Calm & Relaxed Complete Dry Food', range: 'Wellbeing', rangeColor: 'var(--wellbeing)', labelColor: 'var(--b-calm)', img: 'packs/wellbeing-dry-food-calm-and-relaxed.png', line: 'With turkey, sweet potato & L-tryptophan', claims: ['Grain free', 'Supports calm behaviour', 'Healthy digestion'] },
  'calm-relaxed-wet': { name: 'Calm & Relaxed Wet Food', range: 'Wellbeing', rangeColor: 'var(--wellbeing)', labelColor: 'var(--b-calm)', img: 'packs/wellbeing-wet-food-calm-and-relaxed.png', line: 'For your stressed or zoomie roomie', claims: ['Supports calm behaviour'] },
  'health-digestion-dry': { name: 'Health & Digestion Complete Dry Food', range: 'Wellbeing', rangeColor: 'var(--wellbeing)', labelColor: 'var(--b-digestion)', img: 'packs/wellbeing-dry-food-health-and-digestion.png', line: 'Because their business is our business', claims: ['Healthy digestion'] },
  'fresh-salmon': { name: 'Fresh Salmon Complete Dry Food', range: 'Fresh', rangeColor: 'var(--fresh)', labelColor: 'var(--b-digestion)', img: 'packs/fresh-dry-food-salmon.png', line: 'Made with fresh salmon', claims: ['Rich in omega-3'] },
  'fresh-chicken': { name: 'Fresh Chicken Complete Dry Food', range: 'Fresh', rangeColor: 'var(--fresh)', labelColor: 'var(--b-energy)', img: 'packs/fresh-dry-food-chicken.png', line: 'Made with fresh chicken', claims: ['Digestible protein'] },
  'chicken-pumpkin-wet': { name: 'Chicken & Pumpkin Wet Food', range: 'Superfoods', rangeColor: 'var(--superfoods)', labelColor: '#F0E991', img: 'packs/superfoods-wet-food-chicken-and-pumpkin.png', line: 'Power up your pooch', claims: ['Natural superfoods'] },
  'turkey-chicken-wet': { name: 'Turkey & Chicken Wet Food', range: 'Superfoods', rangeColor: 'var(--superfoods)', labelColor: '#C7E995', img: 'packs/superfoods-wet-food-turkey-and-chicken.png', line: 'Power up your pooch', claims: ['Natural superfoods'] },
  'turkey-duck-wet': { name: 'Turkey & Duck Wet Food', range: 'Superfoods', rangeColor: 'var(--superfoods)', labelColor: '#79D97C', img: 'packs/superfoods-wet-food-turkey-and-duck.png', line: 'Power up your pooch', claims: ['Natural superfoods'] },
  'white-fish-potato-wet': { name: 'White Fish & Potato Wet Food', range: 'Superfoods', rangeColor: 'var(--superfoods)', labelColor: '#71C5E8', img: 'packs/superfoods-wet-food-white-fish-and-potato.png', line: 'Power up your pooch', claims: ['Natural superfoods'] },
  'superfoods-adult': { name: 'Superfoods Adult Complete Dry Food', range: 'Superfoods', rangeColor: 'var(--superfoods)', labelColor: '#F5812B', img: 'packs/superfoods-dry-food-adult.png', line: 'Power up your pooch', claims: ['Natural superfoods'] }
};
window.SHOP_URL = 'https://www.poochandmutt.co.uk/';

/* Inside the Bowl. Ingredients and roles from Brand Guidelines V5 (Calm & Relaxed product descriptor). */
window.BOWLS = {
  'calm-relaxed': {
    product: 'calm-relaxed-dry', alt: 'calm-relaxed-wet',
    eyebrow: 'Wellbeing range', title: 'Calm & Relaxed',
    headline: 'For your stressed or zoomie roomie',
    intro: 'Fireworks, vet visits, the doorbell. Some dogs feel everything. This recipe is packed with tasty L-tryptophan from turkey to help support relaxation and maintain emotional balance. Here’s what’s inside, and why.',
    claims: [['Grain free', 'leaf-greenery'], ['Supports calm behaviour', 'star-1'], ['Healthy digestion', 'circle-element-1']],
    ingredients: [
      { name: 'Turkey', pct: '45%', slug: 'turkey', img: 'ingredients/turkey.png', color: 'var(--wellbeing)', role: 'Lean, tasty protein and a natural source of tryptophan.' },
      { name: 'Sweet Potato', slug: 'sweet-potato', img: 'ingredients/sweet-potato.png', color: 'var(--b-calm)', role: 'Gentle fibre and slow-release energy for unsettled tums.' },
      { name: 'Chamomile', img: 'deco/leaf-greenery.png', color: 'var(--b-teeth)', role: 'A traditional calming botanical, used to help support relaxation.' },
      { name: 'L-Tryptophan', img: 'deco/dna.png', color: 'var(--b-calm)', role: 'Supports mood by regulating serotonin, the “feel good” messenger.' },
      { name: 'Hydrolysed Yeasts', img: 'deco/circle-element-2.png', color: 'var(--superfoods)', role: 'Broken down for easy digestion, and a source of natural goodness.' },
      { name: 'Prebiotics & Postbiotics', img: 'deco/circle-element-1.png', color: 'var(--b-digestion)', role: 'Support healthy digestion, because a calm mind starts with a happy gut.' }
    ]
  }
};

/* Benefit hubs. Brand key messages from Guidelines V5 §2.7. */
window.HUBS = {
  calm: {
    benefit: 'calm', title: 'Calm', headline: 'For your stressed or zoomie roomie',
    intro: 'From firework night to the postman’s daily visit, some dogs feel the world a little more. A few ingredients can help support a calmer mood, alongside routine, rest and plenty of reassurance.',
    tips: [['Keep a steady routine', 'Regular walks, meals and bedtimes help anxious dogs know what’s coming.'], ['Give them a job', 'Lick mats and puzzle feeders are naturally soothing. A smear of plain peanut butter works wonders.'], ['Make a safe den', 'A quiet corner with their bed and a blanket that smells of you.']],
    products: ['calm-relaxed-dry', 'calm-relaxed-wet'], bowl: 'calm-relaxed'
  },
  digestion: {
    benefit: 'digestion', title: 'Digestion', headline: 'Because their business is our business',
    intro: 'Wind, loose stools and the occasional dodgy tum. We’ve seen (and smelt) it all. Fibre-rich, gentle ingredients can help keep things moving nicely.',
    tips: [['Switch slowly', 'Change food gradually over about 7 days, mixing old and new.'], ['One new thing at a time', 'Then you’ll know exactly what agrees with them, and what doesn’t.'], ['Know when to call', 'If diarrhoea or vomiting lasts more than a day, or there’s blood, call your vet.']],
    products: ['health-digestion-dry', 'calm-relaxed-dry'], bowl: null
  }
};

/* Extra items for the Fridge List poster (well-established toxins without their own page yet) */
window.FRIDGE_EXTRAS = ['Macadamia nuts', 'Alcohol', 'Caffeine (coffee, tea, energy drinks)', 'Raw bread dough', 'Cooked bones', 'Mouldy food'];
