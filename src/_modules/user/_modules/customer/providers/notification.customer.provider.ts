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
    senderId: 'Customer',
    email: true,
    sms: true,
    notification: true,
    group: false,
  },
  {
    id: 2,
    title: { en: 'New Customer', ar: 'عميل جديد' },
    body: {
      en: 'New customer has joined Bookspa.',
      ar: 'عميل جديد انضم إلى بوك سبا.',
    },
    senderId: 'Customer',
    email: true,
    sms: true,
    notification: true,
    event: 'customer_post',
    receiverId: 'Admin',
    group: true,
  },
];
