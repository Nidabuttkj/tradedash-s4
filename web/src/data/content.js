// Static text for the Homepage and Pricing pages.
export const features = [
  { cat: 'Quotes', name: 'Voice quotes', text: 'Record the job out loud and get a priced quote.', plan: 'All plans' },
  { cat: 'Quotes', name: 'Send on WhatsApp', text: 'Customers approve or decline with one tap.', plan: 'Pro' },
  { cat: 'Jobs', name: 'Jobs board', text: 'Move every job from New to Completed.', plan: 'All plans' },
  { cat: 'Jobs', name: 'Schedule and routes', text: 'Plan your day and the best route between jobs.', plan: 'All plans' },
  { cat: 'Payments', name: 'Invoicing', text: 'Turn a finished job into an invoice in seconds.', plan: 'All plans' },
  { cat: 'Payments', name: 'Payment chasing', text: 'Automatic WhatsApp reminders for late payers.', plan: 'Pro' },
  { cat: 'Certificates', name: 'CP12 and EICR', text: 'Create safety certificates in minutes.', plan: 'Pro' },
  { cat: 'Certificates', name: 'Expiry calendar', text: 'See every renewal date at a glance.', plan: 'Pro' },
]

export const steps = [
  { n: 1, title: 'Record', text: 'Describe the job out loud while you look at it.' },
  { n: 2, title: 'Send', text: 'Check the quote, then send the PDF and WhatsApp message.' },
  { n: 3, title: 'Get paid', text: 'Turn the job into an invoice and collect payment online.' },
]

export const quotes = [
  { name: 'Dave Collins', trade: 'Plumber, Leeds', text: 'I used to spend my Sunday nights writing quotes. Now I do them in the van between jobs.' },
  { name: 'Priya Shah', trade: 'Electrician, Birmingham', text: 'The certificate reminders alone are worth it. I have not missed a landlord renewal since.' },
  { name: 'Mark Ellis', trade: 'Gas engineer, Bristol', text: 'Customers love approving on WhatsApp. I get paid weeks sooner than before.' },
]

// Rows for the "Compare plans" table on the Pricing page
export const compare = [
  { feature: 'Users', starter: 'Up to 3', pro: 'Up to 10' },
  { feature: 'Voice quotes', starter: true, pro: true },
  { feature: 'Invoicing', starter: true, pro: true },
  { feature: 'WhatsApp sending', starter: false, pro: true },
  { feature: 'Certificates (CP12, EICR)', starter: false, pro: true },
]

export const faqs = [
  { q: 'Is there a free trial?', a: 'Yes. Every plan starts with a 14-day free trial. No card is needed to sign up.' },
  { q: 'Can I change plan later?', a: 'Any time. Upgrades apply straight away and downgrades start at your next billing date.' },
  { q: 'What does yearly billing save me?', a: 'Paying yearly takes about 20% off the monthly price.' },
  { q: 'Do my customers need an app?', a: 'No. Customers get quotes and invoices on WhatsApp and can approve or pay from a link.' },
  { q: 'Can I cancel whenever I want?', a: 'Yes. There are no contracts and you keep access until the end of the period you paid for.' },
]
