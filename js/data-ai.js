/* M5: scripted AI concepts. In production these would be live model calls grounded ONLY in Index content.
   Here: keyword scripts + answers composed from Index data. No network calls. */

/* Any of these triggers the fixed, vet-written emergency response, never a generated answer */
window.EMERGENCY_WORDS = ['vomit', 'vomiting', 'being sick', 'seizure', 'fitting', 'collapsed', 'collapse', 'poison', 'poisoned', 'shaking', 'trembling', 'bleeding', 'not breathing', 'unconscious', 'emergency'];
/* These only count as urgent when a toxic food is mentioned too ("ate a grape") */
window.ATE_WORDS = ['ate', 'eaten', 'eat some', 'swallowed', 'got into', 'stole', 'scoffed', 'licked', 'had some'];

window.ASK_SUGGESTIONS = [
  'Can my 12-week-old puppy have cheese as a training treat?',
  'What helps a dog with an upset tummy?',
  'Which fruits are safe for dogs?',
  'My dog ate a grape. What should I do?',
  'What can my dog have at Christmas dinner?',
  'Is peanut butter OK?'
];

/* match: every group must have at least one keyword present. {name} = dog's name or "your dog" */
window.ASK_SCRIPTS = [
  {
    id: 'puppy-cheese',
    match: [['puppy', 'puppies', 'week old', 'weeks old', 'month old', 'months old'], ['cheese', 'cheddar']],
    answer: [
      'In tiny amounts, yes. Cheese is a brilliant high-value reward for training, but puppy tums are still learning.',
      'How about pea-sized pieces, just a few per session, counted as part of {name}’s daily food? Cottage cheese is a gentler, lower-fat option.',
      'If there are loose stools afterwards, pause the cheese and try small pieces of plain cooked chicken instead.'
    ],
    sources: ['cheddar-cheese', 'chicken']
  },
  {
    id: 'tummy',
    match: [['upset', 'tummy', 'tum', 'diarrhoea', 'diarrhea', 'loose stool', 'runny', 'stomach', 'digestion', 'wind', 'gassy']],
    answer: [
      'For a mildly unsettled tum, plain and gentle is the way to go. Small amounts of cooked pumpkin or sweet potato add soluble fibre, and plain cooked chicken or white fish are easy to digest.',
      'Change one thing at a time, keep fresh water topped up, and if {name}’s symptoms last more than a day, or you spot blood, call your vet.'
    ],
    sources: ['pumpkin', 'sweet-potato', 'chicken', 'white-fish'],
    link: ['#/hub/digestion', 'See every ingredient for digestion']
  },
  {
    id: 'calm',
    match: [['anxious', 'anxiety', 'stress', 'stressed', 'calm', 'fireworks', 'nervous', 'zoomies', 'relax']],
    answer: [
      'Food can play a supporting role. Turkey is a natural source of tryptophan, an amino acid that helps support a calm mood, and sweet potato offers gentle, steady energy.',
      'Routine, a safe den and a lick mat (with a smear of plain peanut butter) can help {name} too. For ongoing anxiety, it’s worth a chat with your vet.'
    ],
    sources: ['turkey', 'sweet-potato', 'peanuts'],
    link: ['#/bowl/calm-relaxed', 'See what’s inside Calm & Relaxed']
  },
  {
    id: 'fruit',
    match: [['fruit', 'fruits', 'berries']],
    answer: [
      'Plenty! Apple (cored, no seeds), blueberries and plain cranberries are all great in small amounts.',
      'The big one to avoid is grapes and their dried forms (raisins, sultanas, currants), which can cause kidney failure even in small amounts.'
    ],
    sources: ['apple', 'blueberries', 'cranberries', 'grapes']
  },
  {
    id: 'christmas',
    match: [['christmas', 'xmas', 'roast dinner', 'sunday roast', 'festive']],
    answer: [
      'A little plain turkey breast (no skin or bones), plus some carrot or plain potato, makes a lovely festive plate for {name}.',
      'Skip the stuffing and gravy (onion and garlic), mince pies and Christmas pudding (raisins), and keep chocolate well out of reach.'
    ],
    sources: ['turkey', 'carrot', 'onion', 'grapes', 'chocolate']
  },
  {
    id: 'training',
    match: [['training', 'reward', 'rewards', 'treats']],
    answer: [
      'Small, tasty and low in calories is the sweet spot. Blueberries, carrot coins and tiny pieces of plain cooked chicken all work brilliantly.',
      'Save cheese for the really tricky stuff, and remember treats should stay under 10% of {name}’s daily calories.'
    ],
    sources: ['blueberries', 'carrot', 'chicken', 'cheddar-cheese']
  }
];

/* Snap a Label sample (a generic dog food label, not a real competitor product) */
window.SCAN_SAMPLE = {
  title: 'Sample label: Adult Complete Dry Food',
  text: 'Chicken (26%), Sweet Potato, Peas, Salmon Oil, Dried Apple Pulp, Carrot, Cranberries, Chicory Root, Brewer’s Yeast, Linseed, Pumpkin, Rosemary Extract, Glucosamine'
};

/* Behind the scenes: demand the Index doesn't cover yet. Volumes from the 2027 SEO proposal (monthly UK searches). */
window.INSIGHT_SEED = [
  ['strawberries', 25000], ['bananas', 21000], ['pineapple', 17000], ['tomatoes', 17000], ['watermelon', 16000], ['mushrooms', 14000]
];
