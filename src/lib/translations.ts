/**
 * @fileOverview Central dictionary for Bangla and English translations.
 */

export type Language = 'bn' | 'en';

export const translations = {
  bn: {
    nav: {
      home: 'হোম',
      donors: 'দাতা খুঁজুন',
      requests: 'রক্তের অনুরোধ',
      faq: 'সাধারণ জিজ্ঞাসা',
      eligibility: 'যোগ্যতা যাচাই',
      team: 'আমাদের টিম',
      about: 'আমাদের সম্পর্কে',
      contact: 'যোগাযোগ',
      login: 'লগইন',
      register: 'রেজিস্ট্রেশন',
      dashboard: 'আমার ড্যাশবোর্ড',
      logout: 'লগআউট',
      admin: 'অ্যাডমিন'
    },
    common: {
      phone: 'ফোন করুন',
      email: 'ইমেইল করুন',
      address: 'ঠিকানা',
      bloodGroup: 'রক্তের গ্রুপ',
      district: 'জেলা',
      search: 'অনুসন্ধান',
      viewAll: 'সব দেখুন',
      urgent: 'জরুরি',
      call: 'কল করুন',
      profile: 'প্রোফাইল',
      loading: 'লোড হচ্ছে...',
      back: 'ফিরে যান'
    },
    home: {
      heroBadge: 'স্বেচ্ছায় রক্তদান করুন, জীবন বাঁচান',
      heroTitlePrefix: 'আপনার নিকটবর্তী',
      heroTitleSuffix: 'রক্তদাতা খুঁজুন',
      heroDesc: 'বাংলাদেশে জরুরি মুহূর্তে রক্তদাতা খুঁজে পেতে বা অনলাইনে রক্তদাতা রেজিস্ট্রেশন করতে আমাদের প্ল্যাটফর্মে যোগ দিন।',
      statsDonors: 'নিবন্ধিত দাতা',
      statsRequests: 'রক্তের অনুরোধ',
      statsSuccess: 'সফল রক্তদান',
      statsDistricts: 'জেলায় কার্যক্রম',
      donorsTitle: 'আমাদের রক্তযোদ্ধারা',
      requestsTitle: 'জরুরী অনুরোধসমূহ',
      processTitle: 'রক্তদান প্রক্রিয়া',
      processStep1: 'নিবন্ধন',
      processStep1Desc: 'আপনার সঠিক তথ্য দিয়ে আমাদের জীবন রক্ষাকারী দেশব্যাপী ডেটাবেজে যুক্ত হোন।',
      processStep2: 'অনুরোধ বা অনুসন্ধান',
      processStep2Desc: 'জরুরি প্রয়োজনে পোস্ট দিন অথবা সরাসরি দাতার সাথে যোগাযোগ করুন।',
      processStep3: 'জীবন বাঁচান',
      processStep3Desc: 'হাসপাতালে গিয়ে নিরাপদ রক্তদানের মাধ্যমে একজন মুম্মুর্ষু রোগীর প্রাণ বাঁচান।',
      whyDonateTitle: 'রক্তদানের উপকারিতা',
      eligibilityTitle: 'আপনি কি আজ রক্তদান করতে পারবেন?',
      eligibilityDesc: 'আমাদের AI ভিত্তিক কুইজের মাধ্যমে মাত্র ১ মিনিটে আপনার শারীরিক যোগ্যতা যাচাই করুন।'
    },
    footer: {
      desc: 'বাংলাদেশের অন্যতম নির্ভরযোগ্য রক্তদাতা প্ল্যাটফর্ম। ঢাকা, চট্টগ্রামসহ সব জেলায় জরুরি প্রয়োজনে রক্তদাতা খুঁজে পেতে আমরা আপনার পাশে আছি।',
      emergencyLinks: 'জরুরি লিংক',
      serviceAreas: 'সেবা এলাকা',
      bloodGroups: 'রক্তের গ্রুপ',
      rights: 'সর্বস্বত্ব সংরক্ষিত।'
    }
  },
  en: {
    nav: {
      home: 'Home',
      donors: 'Find Donors',
      requests: 'Requests',
      faq: 'FAQ',
      eligibility: 'Eligibility',
      team: 'Our Team',
      about: 'About Us',
      contact: 'Contact',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      logout: 'Logout',
      admin: 'Admin'
    },
    common: {
      phone: 'Call Us',
      email: 'Email Us',
      address: 'Address',
      bloodGroup: 'Blood Group',
      district: 'District',
      search: 'Search',
      viewAll: 'View All',
      urgent: 'Urgent',
      call: 'Call',
      profile: 'Profile',
      loading: 'Loading...',
      back: 'Back'
    },
    home: {
      heroBadge: 'Donate Blood, Save Lives',
      heroTitlePrefix: 'Find Near You',
      heroTitleSuffix: 'Blood Donors',
      heroDesc: 'Join our platform to find blood donors in emergency moments or to register as a donor online in Bangladesh.',
      statsDonors: 'Registered Donors',
      statsRequests: 'Blood Requests',
      statsSuccess: 'Successful Donations',
      statsDistricts: 'Working Districts',
      donorsTitle: 'Our Blood Warriors',
      requestsTitle: 'Emergency Requests',
      processTitle: 'Donation Process',
      processStep1: 'Registration',
      processStep1Desc: 'Join our nationwide life-saving database with your correct information.',
      processStep2: 'Request or Search',
      processStep2Desc: 'Post an urgent request or contact a donor directly.',
      processStep3: 'Save a Life',
      processStep3Desc: 'Save the life of a critical patient through safe blood donation at the hospital.',
      whyDonateTitle: 'Benefits of Donating',
      eligibilityTitle: 'Can You Donate Blood Today?',
      eligibilityDesc: 'Check your physical eligibility in just 1 minute through our AI-based quiz.'
    },
    footer: {
      desc: 'One of the most reliable blood donor platforms in Bangladesh. We are by your side to find donors in Dhaka, Chattogram and all 64 districts.',
      emergencyLinks: 'Important Links',
      serviceAreas: 'Service Areas',
      bloodGroups: 'Blood Groups',
      rights: 'All rights reserved.'
    }
  }
};
