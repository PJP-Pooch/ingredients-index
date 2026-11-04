/* Page-level detail per ingredient (M2), merged onto window.INGREDIENTS by slug.
   PROTOTYPE CONTENT: drafted from general veterinary guidance for demonstration; NOT yet vet-reviewed.
   portion.amounts = daily treat guide for [Toy <5kg, Small 5–10kg, Medium 10–25kg, Large 25–40kg, Giant 40kg+],
   based on treats making up no more than ~10% of daily calories. */
window.DOG_SIZES = [
  { key: 'toy', label: 'Toy', range: 'under 5kg', dog: 'chihuahua' },
  { key: 'small', label: 'Small', range: '5–10kg', dog: 'jack-russell' },
  { key: 'medium', label: 'Medium', range: '10–25kg', dog: 'cockapoo' },
  { key: 'large', label: 'Large', range: '25–40kg', dog: 'labrador' },
  { key: 'giant', label: 'Giant', range: '40kg+', dog: 'bernese' }
];

window.TOXIC_STEPS = [
  ['Call your vet now', 'Even if your dog seems completely fine. Many signs take hours to show, and early treatment matters most.'],
  ['Note what, how much and when', 'Keep any wrapper or packaging. It helps your vet work out the risk quickly.'],
  ['Don’t make them sick yourself', 'Only a vet should decide whether to induce vomiting. Home remedies like salt water can cause harm.'],
  ['Out of hours?', 'Contact your nearest emergency vet. Your vet can also call the Animal PoisonLine for specialist advice.']
];

window.DETAILS = {
  apple: {
    qa: 'Yes, in small amounts. Apple is a crunchy, fibre-rich snack most dogs love. Just remove the core and seeds, slice it thinly and keep it to a few pieces as a treat.',
    good: [['Fibre for digestion', 'Apple’s natural fibre helps keep things moving.'], ['Vitamin C & antioxidants', 'Helps support a healthy immune system.'], ['Crunchy & low in fat', 'A lighter swap for shop-bought biscuits.']],
    portion: { unit: 'thin slices', amounts: ['1', '2', '3–4', '4–5', '5–6'] },
    prep: ['Wash it, then remove the core, stalk and every seed.', 'Slice thinly or dice, especially for small dogs.', 'Skip apple pie, toffee apples and anything sweetened.'],
    risks: ['Seeds contain compounds that release cyanide, so always deseed.', 'The core is a choking hazard.', 'Too much can mean loose stools.'],
    recipe: 'Dried apple pulp features in some of our recipes as a gentle source of fibre.',
    products: [],
    faqs: [['Can puppies eat apple?', 'Yes, once weaned. Offer tiny, soft pieces and introduce slowly.'], ['Is apple peel OK?', 'Yes, washed peel is fine and adds extra fibre.']],
    related: ['blueberries', 'carrot', 'cranberries']
  },
  blueberries: {
    qa: 'Yes! Blueberries are one of the best fruits you can share. They’re small, low in calories and packed with antioxidants, which makes them a brilliant training treat.',
    good: [['Antioxidant-rich', 'Helps protect cells from everyday wear and tear.'], ['Low calorie', 'Perfect for training without piling on the pounds.'], ['Bite-sized', 'No prep needed. Just wash and serve.']],
    portion: { unit: 'blueberries', amounts: ['3–4', '5–8', '8–12', '12–15', '15–20'] },
    prep: ['Wash them first.', 'Fresh or frozen both work. Frozen ones make a cooling summer treat.', 'Avoid blueberry muffins, jams and anything sweetened.'],
    risks: ['Whole berries can be a choking risk for very small dogs, so halve them.', 'Too many can upset tums.'],
    products: [],
    faqs: [['Can dogs eat frozen blueberries?', 'Yes, a lovely cooling treat. Halve them for toy breeds.'], ['Are blueberries good for older dogs?', 'Their antioxidants can be a nice addition to a senior dog’s diet, in moderation.']],
    related: ['cranberries', 'apple', 'carrot']
  },
  bones: {
    qa: 'Only with care. Never give cooked bones of any kind, as they splinter and can cause serious internal damage. Raw bones carry risks too, so if you do offer one, supervise closely and talk to your vet first.',
    good: [['Natural chewing', 'Chewing can help keep teeth cleaner and minds busy.']],
    portion: null,
    prep: ['Never cooked: no roast leftovers, chicken bones or rib bones.', 'Raw only, bigger than your dog’s mouth, and always supervised.', 'Take it away once it’s small enough to swallow.'],
    risks: ['Cooked bones splinter and can cause choking, tears or blockages.', 'Bones can crack teeth.', 'Raw bones can carry bacteria.'],
    products: [],
    faqs: [['My dog ate a cooked chicken bone. What now?', 'Call your vet for advice. Don’t try to make them sick. Watch for vomiting, straining or lethargy.'], ['Are dental chews a safer option?', 'For many dogs, yes. Dental chews are designed to be digested.']],
    related: ['raw-chicken', 'chicken', 'carrot']
  },
  broccoli: {
    qa: 'Yes, in small amounts. Plain broccoli is a healthy extra, but its natural compounds can irritate tums in larger quantities. Keep it to a few small florets.',
    good: [['Vitamins C & K', 'Supports the immune system and healthy bones.'], ['Fibre', 'Helps keep digestion ticking over.']],
    portion: { unit: 'small florets', amounts: ['1', '1–2', '2–3', '3–4', '4–5'] },
    prep: ['Steam or serve raw, plain and chopped small.', 'No butter, cheese sauce or seasoning.'],
    risks: ['Large amounts can cause gas and stomach upset.', 'Stalks can be a choking hazard, so chop them.'],
    products: [],
    faqs: [['Raw or cooked broccoli?', 'Both are fine. Lightly steamed is gentler on digestion.']],
    related: ['kale', 'carrot', 'peas']
  },
  carrot: {
    qa: 'Yes! Carrots are low in calories, high in fibre and satisfyingly crunchy. They’re a great everyday treat, raw or cooked.',
    good: [['Crunchy chew', 'Gnawing on raw carrot can help clean teeth.'], ['Low calorie', 'A brilliant swap for weight-watching dogs.'], ['Beta-carotene', 'Supports healthy eyes and skin.']],
    portion: { unit: 'baby carrots', amounts: ['1', '1–2', '2–3', '3–4', '4–5'] },
    prep: ['Wash and chop into sticks or coins.', 'Frozen carrot sticks can soothe teething puppies.'],
    risks: ['Whole carrots can be a choking risk for gulpers.', 'Lots of fibre at once can mean loose stools.'],
    recipe: 'Carrots feature in our recipes for natural fibre and beta-carotene.',
    products: [],
    faqs: [['Can puppies eat carrots?', 'Yes, chopped small. Frozen sticks are a teething favourite.']],
    related: ['sweet-potato', 'peas', 'apple']
  },
  'cheddar-cheese': {
    qa: 'Yes, in small amounts. Cheese is a high-value reward most dogs go wild for, but it’s rich in fat and some dogs are lactose-sensitive. Tiny cubes, occasionally.',
    good: [['High-value reward', 'Great for training tricky behaviours.'], ['Protein & calcium', 'A little goes a long way.']],
    portion: { unit: 'pea-sized cubes', amounts: ['1–2', '2–3', '3–5', '5–6', '6–8'] },
    prep: ['Plain cheddar or mozzarella are best.', 'Avoid blue cheese, and anything with garlic, onion or herbs.'],
    risks: ['High fat, so not for dogs prone to pancreatitis.', 'Lactose can upset sensitive tums.', 'Salty, so keep portions tiny.'],
    recipe: 'Real cheddar features in our Superfoods cheese treats.',
    products: [],
    faqs: [['Can dogs eat cheese every day?', 'Best as an occasional reward rather than a daily habit.'], ['Is cottage cheese better?', 'It’s lower in fat and salt, so it can be a gentler option.']],
    related: ['peanuts', 'chicken', 'blueberries']
  },
  chicken: {
    qa: 'Yes! Plain, boneless, cooked chicken is a lean, gentle protein. It’s a vet favourite for upset tums and a dependable high-value treat.',
    good: [['Lean protein', 'Supports muscle and energy.'], ['Easy to digest', 'Often recommended with rice for upset tums.']],
    portion: { unit: 'thumbnail-sized pieces', amounts: ['2–3', '4–5', '6–8', '8–10', '10–12'] },
    prep: ['Boil or bake plain, with no seasoning, oil or skin.', 'Remove every bone.', 'Cool and shred or dice.'],
    risks: ['Cooked bones splinter, so never include them.', 'Seasonings like garlic and onion are toxic.'],
    recipe: 'Chicken is a core protein across our Fresh and Superfoods recipes.',
    products: ['fresh-chicken', 'turkey-chicken-wet', 'chicken-pumpkin-wet'],
    faqs: [['Can I feed chicken and rice?', 'Plain chicken and rice is a classic short-term bland diet. Ask your vet if tummy troubles last.']],
    related: ['turkey', 'white-fish', 'raw-chicken']
  },
  chickpeas: {
    qa: 'Yes, in small amounts. Plain, cooked chickpeas offer fibre and plant protein. Avoid hummus, which usually contains garlic and lemon.',
    good: [['Fibre', 'Supports healthy digestion.'], ['Plant protein', 'Adds slow-release energy.']],
    portion: { unit: 'chickpeas', amounts: ['2–3', '4–6', '8–10', '10–15', '15–20'] },
    prep: ['Cook well, or rinse tinned chickpeas thoroughly (no salt).', 'Mash for small dogs.'],
    risks: ['Too many can mean wind.', 'Hummus contains garlic, which is toxic.'],
    recipe: 'Chickpeas appear in some of our grain-free recipes as a source of fibre and plant protein.',
    products: [],
    faqs: [['Can dogs eat hummus?', 'Best not. Most hummus contains garlic, which is toxic to dogs.']],
    related: ['red-lentils', 'peas', 'sweet-potato']
  },
  chocolate: {
    qa: 'No. Chocolate contains theobromine, which dogs can’t break down. Dark chocolate, cocoa powder and baking chocolate are the most dangerous, but even milk chocolate can make dogs ill.',
    symptoms: ['Vomiting or diarrhoea', 'Restlessness or hyperactivity', 'Racing heart or panting', 'Trembling, wobbliness or seizures'],
    onset: 'Signs usually appear within 2–12 hours and can last for days.',
    prep: [], risks: ['The darker the chocolate, the higher the risk.', 'Smaller dogs are affected by smaller amounts.'],
    swaps: ['carrot', 'blueberries', 'peanuts'],
    faqs: [['How much chocolate is dangerous?', 'It depends on the type of chocolate and your dog’s weight. Your vet can calculate the risk, so call them with the details.'], ['Is white chocolate safe?', 'It contains very little theobromine but lots of fat and sugar, so it’s still best avoided.']],
    related: ['xylitol', 'grapes', 'peanuts']
  },
  cranberries: {
    qa: 'Yes, in small amounts. Plain cranberries are tart little antioxidant boosters. Skip the sauce, juice and sugary dried versions.',
    good: [['Antioxidants', 'Help support everyday health.'], ['Low calorie', 'A light, tangy extra.']],
    portion: { unit: 'cranberries', amounts: ['1–2', '2–3', '4–5', '5–7', '8–10'] },
    prep: ['Fresh or frozen, washed and halved.', 'Unsweetened dried only, in very small amounts.'],
    risks: ['Cranberry sauce and juice are high in sugar.', 'Dried mixes may contain raisins, which are toxic.'],
    recipe: 'Cranberries feature in some of our supplements and recipes as a natural antioxidant.',
    products: [],
    faqs: [['Can dogs have cranberry sauce?', 'Best not. It’s very high in sugar, and some contain alcohol or raisins.']],
    related: ['blueberries', 'apple', 'spirulina']
  },
  grapes: {
    qa: 'No. Grapes, raisins, sultanas and currants can cause sudden kidney failure in dogs, and even small amounts can be dangerous. There’s no known safe amount.',
    symptoms: ['Vomiting or diarrhoea', 'Lethargy or weakness', 'Loss of appetite', 'Drinking or weeing less than usual'],
    onset: 'Vomiting often starts within 24 hours. Kidney damage can follow over 1–3 days.',
    prep: [], risks: ['Watch out for hot cross buns, fruit cake, mince pies and trail mix.', 'Cooked or dried forms are just as risky.'],
    swaps: ['blueberries', 'apple', 'cranberries'],
    faqs: [['My dog ate one grape. Is that OK?', 'Call your vet. Sensitivity varies hugely between dogs, so even one is worth a call.'], ['Are seedless grapes safe?', 'No. All grapes and their dried forms are a risk.']],
    related: ['chocolate', 'onion', 'xylitol']
  },
  kale: {
    qa: 'Yes, in small amounts. Kale is nutrient-dense, but it contains compounds that can upset tums in large quantities. A little, cooked and chopped, is plenty.',
    good: [['Vitamins A, C & K', 'Helps support immunity and healthy skin.'], ['Antioxidants', 'Leafy-green goodness.']],
    portion: { unit: 'teaspoons, chopped & cooked', amounts: ['½', '1', '1–2', '2–3', '3'] },
    prep: ['Steam lightly and chop finely.', 'Plain, with no oil or garlic.'],
    risks: ['Large amounts may cause gas or upset.', 'Not ideal for dogs with a history of bladder stones. Ask your vet.'],
    recipe: 'Kale appears in some of our Superfoods recipes as a leafy green boost.',
    products: ['superfoods-adult'],
    faqs: [['Raw kale or cooked?', 'Lightly cooked is easier to digest.']],
    related: ['broccoli', 'spirulina', 'peas']
  },
  mint: {
    qa: 'Yes, in small amounts. A little fresh peppermint or spearmint can help freshen breath. Avoid mint sweets and chewing gum, which may contain xylitol.',
    good: [['Fresher breath', 'Can help mask doggy breath.'], ['Settling', 'Traditionally used to soothe digestion.']],
    portion: { unit: 'fresh leaves, chopped', amounts: ['1', '1–2', '2–3', '3–4', '4–5'] },
    prep: ['Chop finely and sprinkle over food.', 'Fresh garden mint only.'],
    risks: ['Pennyroyal (a mint relative) is toxic.', 'Mint gum and sweets may contain xylitol.'],
    recipe: 'Mint teams up with spirulina in our dental sticks for fresher breath.',
    products: [],
    faqs: [['Is peppermint oil safe for dogs?', 'No. Concentrated essential oils can be harmful. Stick to a few fresh leaves.']],
    related: ['spirulina', 'xylitol', 'carrot']
  },
  onion: {
    qa: 'No. Onions, garlic, leeks, chives and shallots all damage dogs’ red blood cells, whether raw, cooked, powdered or in gravy. Effects can build up over several days.',
    symptoms: ['Weakness or tiredness', 'Pale gums', 'Red or brown wee', 'Vomiting, diarrhoea or drooling'],
    onset: 'Tummy upset can be quick, but anaemia may not show for 1–5 days.',
    prep: [], risks: ['Hidden in gravy, stock cubes, stuffing, pizza and baby food.', 'Garlic is even stronger than onion.'],
    swaps: ['carrot', 'pumpkin', 'peas'],
    faqs: [['Is a little garlic good for dogs?', 'No. Garlic is in the same toxic family, and there’s no proven benefit worth the risk.'], ['What about onion powder?', 'Powdered forms are concentrated and especially risky.']],
    related: ['grapes', 'chocolate', 'xylitol']
  },
  peanuts: {
    qa: 'Yes, in small amounts. Plain, unsalted peanuts and peanut butter make a tasty treat. Always check the label for xylitol, which is very dangerous to dogs.',
    good: [['Healthy fats & protein', 'An energy-dense reward.'], ['Enrichment hero', 'Brilliant smeared in a lick mat or toy.']],
    portion: { unit: 'teaspoons of peanut butter', amounts: ['¼', '½', '1', '1½', '2'] },
    prep: ['Choose 100% peanut, with no salt, sugar or palm oil.', 'Check the label for xylitol or "birch sugar".'],
    risks: ['Xylitol in some brands can be deadly.', 'High in fat and calories.', 'Whole nuts are a choking risk.'],
    recipe: 'Peanut butter is a favourite flavour in our Superfoods treats.',
    products: [],
    faqs: [['Which peanut butter is safe?', 'One with a single ingredient: peanuts. Always check for xylitol.'], ['Can dogs eat other nuts?', 'Macadamias are toxic, and many nuts are too fatty. Plain peanuts are the safest choice.']],
    related: ['xylitol', 'cheddar-cheese', 'chickpeas']
  },
  peas: {
    qa: 'Yes! Garden peas, sugar snaps and frozen peas are sweet little sources of fibre, vitamins and plant protein. Plain is perfect.',
    good: [['Fibre & plant protein', 'Supports digestion and energy.'], ['Vitamins & minerals', 'Including vitamin K and B vitamins.']],
    portion: { unit: 'teaspoons', amounts: ['½', '1', '1–2', '2–3', '3–4'] },
    prep: ['Fresh or frozen, plain.', 'Avoid tinned peas with added salt.'],
    risks: ['Too many can mean wind.', 'Dogs with kidney issues may need to limit them. Ask your vet.'],
    recipe: 'Peas and pea protein appear in our grain-free recipes as gentle, plant-based protein.',
    products: [],
    faqs: [['Can dogs eat pea pods?', 'Sugar snap and mangetout pods are fine chopped. Avoid tough pods.']],
    related: ['carrot', 'chickpeas', 'broccoli']
  },
  potato: {
    qa: 'Yes, in small amounts, but only cooked and plain. Raw or green potatoes contain solanine, which is harmful. Skip the chips, butter and salt.',
    good: [['Energy', 'Easily digestible carbohydrate when cooked.'], ['Gentle', 'Plain boiled potato is easy on most tums.']],
    portion: { unit: 'tablespoons, mashed', amounts: ['½', '1', '1–2', '2', '2–3'] },
    prep: ['Peel, boil or bake, and serve plain.', 'Never raw, and never green or sprouting.'],
    risks: ['Raw or green potatoes contain solanine.', 'Chips and roasties are too fatty and salty.'],
    recipe: 'Potato pairs with white fish in our gentle Superfoods wet recipe.',
    products: ['white-fish-potato-wet'],
    faqs: [['Can dogs eat mashed potato?', 'Plain mash, yes. No butter, milk, salt or garlic.']],
    related: ['sweet-potato', 'white-fish', 'pumpkin']
  },
  pumpkin: {
    qa: 'Yes! Plain cooked pumpkin is a classic for settling tums. Its soluble fibre can help with both loose stools and constipation.',
    good: [['Soluble fibre', 'Helps firm up or get things moving.'], ['Beta-carotene', 'Supports healthy eyes and skin.'], ['Low calorie', 'Bulks out meals for weight watchers.']],
    portion: { unit: 'teaspoons, puréed', amounts: ['½', '1', '1–2', '2–3', '3–4'] },
    prep: ['Steam or roast plain, then mash.', 'Tinned 100% pumpkin purée works. Not pie filling.'],
    risks: ['Pumpkin pie filling contains sugar and spices.', 'Too much fibre can upset tums.'],
    recipe: 'Pumpkin brings gentle fibre to our Chicken & Pumpkin recipe.',
    products: ['chicken-pumpkin-wet'],
    faqs: [['Can pumpkin help with diarrhoea?', 'It can help some dogs. Call your vet if it lasts more than a day or two.'], ['Can dogs eat pumpkin seeds?', 'Plain, roasted and ground seeds in small amounts are fine.']],
    related: ['sweet-potato', 'carrot', 'potato']
  },
  'raw-chicken': {
    qa: 'Only with care. Raw chicken can carry bacteria like Salmonella and Campylobacter, a risk to dogs and the humans who handle them. Cooked, boneless chicken is the easy, safer option.',
    good: [['Protein', 'The same great protein as cooked chicken.']],
    portion: null,
    prep: ['If you raw feed, use complete, commercially prepared raw food.', 'Strict kitchen hygiene: wash hands, bowls and surfaces.'],
    risks: ['Bacteria risk for the whole household, especially children.', 'Raw bones can splinter or cause blockages.', 'Homemade raw diets can be nutritionally unbalanced.'],
    products: [],
    faqs: [['Is raw feeding better?', 'Opinions differ. Talk to your vet about what suits your dog and household.']],
    related: ['chicken', 'bones', 'turkey']
  },
  'red-lentils': {
    qa: 'Yes, in small amounts. Well-cooked, plain red lentils are a fibre-rich plant protein. Introduce slowly, as they can cause wind.',
    good: [['Fibre', 'Supports healthy digestion.'], ['Plant protein & iron', 'A nutritious extra.']],
    portion: { unit: 'teaspoons, cooked', amounts: ['½', '1', '1–2', '2–3', '3'] },
    prep: ['Rinse and cook thoroughly in plain water.', 'No dhal spices, onion or garlic.'],
    risks: ['Undercooked lentils are hard to digest.', 'Wind!'],
    products: [],
    faqs: [['Can dogs eat dhal?', 'Usually not, as dhal is cooked with onion and garlic.']],
    related: ['chickpeas', 'peas', 'sweet-potato']
  },
  salmon: {
    qa: 'Yes! Cooked, boneless salmon is rich in omega-3 fatty acids for a glossy coat and supple joints. Never feed it raw or smoked.',
    good: [['Omega-3', 'Supports healthy skin and a shiny coat.'], ['Joint support', 'Omega-3 helps support supple joints.'], ['Quality protein', 'Easily digestible.']],
    portion: { unit: 'teaspoons, flaked', amounts: ['1', '2', '3–4', '4–5', '5–6'] },
    prep: ['Bake or poach plain, then flake and check for bones.', 'No oil, butter, lemon or seasoning.'],
    risks: ['Raw salmon can carry parasites.', 'Smoked salmon is very salty.', 'Small bones are a choking hazard.'],
    recipe: 'Fresh salmon is the hero of our Fresh recipe, and salmon oil adds omega-3 across our range.',
    products: ['fresh-salmon'],
    faqs: [['Can dogs eat salmon skin?', 'Cooked, plain skin in small amounts is fine. It’s fatty, so go easy.'], ['Is salmon oil good for dogs?', 'It’s a popular omega-3 supplement. Follow the pack dose.']],
    related: ['white-fish', 'chicken', 'spirulina']
  },
  spirulina: {
    qa: 'Yes, in small amounts. Spirulina is a nutrient-dense blue-green algae used to help support immunity and skin. Choose a pet-safe, quality-tested supplement.',
    good: [['Antioxidants', 'Helps support a healthy immune system.'], ['Skin & coat', 'Rich in nutrients that support skin health.']],
    portion: null,
    prep: ['Best given via a food or supplement formulated for dogs.', 'Follow the pack dose.'],
    risks: ['Wild or untested algae can contain toxins. Never let dogs drink from algae-covered water.'],
    recipe: 'Spirulina joins mint in our dental sticks for a green superfood boost.',
    products: [],
    faqs: [['Is blue-green algae in ponds safe?', 'No! Algal blooms in lakes can be deadly. Keep dogs out of green, scummy water.']],
    related: ['kale', 'mint', 'salmon']
  },
  'sweet-potato': {
    qa: 'Yes! Plain cooked sweet potato is a gentle source of fibre and slow-release energy. It’s one of the stars of our Calm & Relaxed recipe.',
    good: [['Gentle fibre', 'Helps settle unsettled tums.'], ['Slow-release energy', 'A steady, complex carbohydrate.'], ['Beta-carotene', 'Supports healthy skin and eyes.']],
    portion: { unit: 'teaspoons, mashed', amounts: ['1', '1–2', '2–3', '3–4', '4–5'] },
    prep: ['Bake or steam, peel and mash. Always cooked.', 'Plain, with no butter, sugar or marshmallows.'],
    risks: ['Raw sweet potato is hard to digest.', 'High in natural sugar, so keep to treat-sized amounts.'],
    recipe: 'We use sweet potato because it’s rich in fibre for unsettled tums, which is why it’s a hero in Calm & Relaxed.',
    products: ['calm-relaxed-dry', 'calm-relaxed-wet'],
    faqs: [['Sweet potato or regular potato?', 'Both are fine cooked and plain. Sweet potato brings more fibre and beta-carotene.'], ['Can dogs eat sweet potato skin?', 'Cooked skin is OK in small amounts, but peeled is gentler.']],
    related: ['pumpkin', 'turkey', 'potato']
  },
  turkey: {
    qa: 'Yes! Plain, skinless, boneless turkey is a lean protein and a natural source of tryptophan. That’s why it makes up 45% of our Calm & Relaxed recipe.',
    good: [['Lean protein', 'Supports muscle and steady energy.'], ['Natural tryptophan', 'An amino acid that helps support a calm mood.']],
    portion: { unit: 'thumbnail-sized pieces', amounts: ['2–3', '4–5', '6–8', '8–10', '10–12'] },
    prep: ['Plain roast or boiled meat only.', 'No skin, bones, stuffing or gravy.'],
    risks: ['Christmas leftovers often hide onion, garlic and fat.', 'Cooked bones splinter.'],
    recipe: 'Turkey makes up 45% of Calm & Relaxed, chosen as a lean protein and a natural source of tryptophan.',
    products: ['calm-relaxed-dry', 'turkey-chicken-wet', 'turkey-duck-wet'],
    faqs: [['Can dogs have Christmas turkey?', 'A little plain breast meat, yes. Skip the skin, stuffing and gravy.']],
    related: ['sweet-potato', 'chicken', 'pumpkin']
  },
  'white-fish': {
    qa: 'Yes! Cod, haddock and pollock are lean, gentle proteins that suit sensitive tums. Serve cooked, plain and boneless.',
    good: [['Lean protein', 'Low in fat and easy to digest.'], ['Gentle', 'Often suits dogs with food sensitivities.']],
    portion: { unit: 'teaspoons, flaked', amounts: ['1', '2', '3–4', '4–5', '5–6'] },
    prep: ['Poach or bake plain, then flake and check for bones.', 'No batter, butter or seasoning.'],
    risks: ['Fish bones are a choking hazard.', 'Battered fish is far too fatty.'],
    recipe: 'White fish pairs with potato in our gentle Superfoods wet recipe.',
    products: ['white-fish-potato-wet'],
    faqs: [['Can dogs eat fish and chips?', 'Best not. The batter and chips are too fatty and salty.']],
    related: ['salmon', 'potato', 'chicken']
  },
  xylitol: {
    qa: 'No. Xylitol is a sweetener found in sugar-free gum, sweets, some peanut butters and baked goods. In dogs it triggers a dangerous drop in blood sugar and can cause liver failure, even in tiny amounts.',
    symptoms: ['Vomiting', 'Weakness or wobbliness', 'Collapse', 'Trembling or seizures'],
    onset: 'Signs can start within 30–60 minutes. Treat this as an emergency.',
    prep: [], risks: ['Check labels for xylitol, birch sugar or E967.', 'Found in gum, mints, some peanut butters and sugar-free bakes.'],
    swaps: ['peanuts', 'blueberries', 'carrot'],
    faqs: [['Which peanut butters contain xylitol?', 'Few UK brands do, but always check. Choose 100% peanut butter.'], ['Is xylitol toothpaste dangerous?', 'Yes, human toothpaste can contain xylitol. Use dog toothpaste.']],
    related: ['chocolate', 'peanuts', 'grapes']
  }
};

// Merge details onto index items so views can use one object
window.INGREDIENTS.forEach((it) => Object.assign(it, window.DETAILS[it.slug] || {}));
