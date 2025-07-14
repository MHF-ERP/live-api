// // prisma/seeds/notificationSettings.ts
// import { PrismaClient } from '@prisma/client';

// export async function seedSettings(prisma: PrismaClient) {
//   await prisma.setting.upsert({
//     where: {
//       id: 1,
//     },
//     create: {
//       id: 1,
//       privacyPolicyAr: '',
//       privacyPolicyEn: '',
//       termsAndConditionsAr: '',
//       termsAndConditionsEn: '',
//       customerCharterAr: '',
//       customerCharterEn: '',
//       siteToolsAr: '',
//       siteToolsEn: '',
//       aboutAr: '',
//       aboutEn: '',
//       serviceAr: '',
//       contactAr: '',
//       contactEn: '',
//       serviceEn: '',
//     },
//     update: {
//       id: 1,
//       privacyPolicyAr: '',
//       privacyPolicyEn: '',
//       termsAndConditionsAr: '',
//       termsAndConditionsEn: '',
//       customerCharterAr: '',
//       customerCharterEn: '',
//       siteToolsAr: '',
//       siteToolsEn: '',
//       aboutAr: '',
//       aboutEn: '',
//       serviceAr: '',
//       serviceEn: '',
//     },
//   });
//   // eslint-disable-next-line no-console
//   console.log('✅ Settings seeded');
// }
