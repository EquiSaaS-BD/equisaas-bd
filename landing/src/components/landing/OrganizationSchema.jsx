import { useEffect } from 'react';

export default function OrganizationSchema() {
  useEffect(() => {
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': ['Organization', 'LocalBusiness'],
        name: 'EquiSaaS BD',
        alternateName: 'Bangladesh Open Tech Cooperative',
        url: 'https://equisaas-bd.com',
        logo: 'https://equisaas-bd.com/logo.png',
        description: "Bangladesh's first Open Tech Cooperative democratizing software access for SMEs and building a sweat equity ecosystem for young engineers and designers.",
        founder: {
          '@type': 'Person',
          name: 'Kholipha Ahmmad Al-Amin',
          url: 'https://kholipha-ahmmad-al-amin.equisaas-bd.com/',
          jobTitle: 'Managing Director & CEO',
          alumniOf: 'Atish Dipankar University of Science & Technology'
        },
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'BD',
          addressRegion: 'Dhaka'
        },
        areaServed: {
          '@type': 'Country',
          name: 'Bangladesh'
        },
        sameAs: [
          'https://www.facebook.com/EquiSaaSBD',
          'https://www.facebook.com/groups/1253385930100939/',
          'https://www.youtube.com/@equisaas',
          'https://www.linkedin.com/company/equisaas-bd/',
          'https://github.com/orgs/EquiSaaS-BD/'
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'EquiSaaS BD Services',
          itemListElement: [
            {
              '@type': 'Service',
              name: 'ERP & POS Software for Bangladesh SMEs',
              description: 'Offline-first EquiPulse AI ERP and POS system for retail, pharmacy, and small business management.',
              url: 'https://equisaas-bd.com/bd-erp-pos/',
              areaServed: 'Bangladesh'
            },
            {
              '@type': 'Service',
              name: 'React Landing Page Development',
              description: 'Professional responsive React.js landing page development for businesses.',
              url: 'https://equisaas-bd.com/services/'
            },
            {
              '@type': 'Service',
              name: 'SME Software Solutions Bangladesh',
              description: 'Affordable tailored software solutions for small and medium enterprises in Bangladesh.',
              url: 'https://equisaas-bd.com/sme-software-bangladesh/'
            }
          ]
        }
      },
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'EquiSaaS BD Ecosystem Partners',
        description: 'Strategic partners of EquiSaaS BD Open Tech Cooperative',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Ghashful Learning Center', url: 'https://ghashful-learning-center.netlify.app/' },
          { '@type': 'ListItem', position: 2, name: 'Motionly Media', url: 'https://motionly.media/' },
          { '@type': 'ListItem', position: 3, name: 'BK Digital Agency', url: 'https://www.linkedin.com/company/bkdigitalagency/' },
          { '@type': 'ListItem', position: 4, name: 'Rialto Shopping', url: 'https://www.rialtoshopping.com/' },
          { '@type': 'ListItem', position: 5, name: 'ARIT Consultancy', url: 'https://aritconsultancy.com/' },
          { '@type': 'ListItem', position: 6, name: 'Samner Bangladesh', url: 'https://samnerbangladesh.askyourrightsbd.com/' }
        ]
      }
    ];

    const scripts = schemas.map(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
      return script;
    });

    return () => {
      scripts.forEach(script => {
        if (document.head.contains(script)) document.head.removeChild(script);
      });
    };
  }, []);

  return null;
}

