import defaults from './defaultContent.json';

export const pageRegistry = [
  ['home', 'Home', '/'], ['about', 'About', '/about'], ['gallery', 'Gallery', '/gallery'],
  ['assetmanagement', 'Asset Management', '/assetmanagement'], ['projectmanagement', 'Project Management', '/projectmanagement'],
  ['energymanagement', 'Energy Management', '/energymanagement'], ['value', 'Value Engineering', '/value'],
  ['energyaudit', 'Energy Audit', '/energyaudit'], ['valuation', 'Valuation', '/valuation'], ['techadv', 'Technical Advisory', '/techadv'],
  ['manufacturing', 'Manufacturing', '/manufacturing'], ['services', 'Terms of Service', '/services'], ['privacy', 'Privacy Policy', '/privacy'], ['disclaimer', 'Disclaimer', '/disclaimer']
].map(([id, label, path]) => ({ id, label, path, sections: Object.keys(defaults[id].sections).map((sectionId) => ({ id: sectionId, label: sectionId.replace(/([A-Z])/g, ' $1').replace(/^./, (value) => value.toUpperCase()) })) }));

export const defaultPages = defaults;
export const getPageDefinition = (pageId) => pageRegistry.find((page) => page.id === pageId);
export const makePageDocument = (pageId) => ({
  schemaVersion: 1,
  revision: 0,
  sections: Object.fromEntries(Object.entries(defaultPages[pageId].sections).map(([id, section]) => [id, { html: section.html, revision: 0 }]))
});
