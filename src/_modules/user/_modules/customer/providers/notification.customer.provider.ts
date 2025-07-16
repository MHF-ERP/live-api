import { Method } from '@prisma/client';

export const CustomerNotification = [
  {
    id: 1,
    title: { en: 'Welcome to Bookspa', ar: 'مرحبا بكم في بوك سبا' },
    body: {
      en: 'Thank you for joining Bookspa. We are excited to have you on board!',
      ar: 'شكرا لانضمامك إلى بوك سبا. نحن متحمسون لوجودك معنا!',
    },
    event: 'customer_post',
    receiverId: 'Customer',
    methods: [Method.EMAIL, Method.SMS, Method.NOTIFICATION],
    group: false,
  },
  {
    id: 2,
    title: { en: 'New Customer', ar: 'عميل جديد' },
    body: {
      en: 'New customer has joined Bookspa.',
      ar: 'عميل جديد انضم إلى بوك سبا.',
    },
    event: 'customer_post',
    receiverId: 'Admin',
    methods: [Method.EMAIL, Method.SMS, Method.NOTIFICATION],
    group: true,
  },
];
