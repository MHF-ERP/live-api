export const permissions = [
  {
    name: { en: 'Languages', ar: 'اللغات' },
    prefix: 'languages',
    default: false,
    methods: ['post', 'get', 'delete', 'patch'],
  },
  {
    name: { en: 'Users', ar: 'المستخدمين' },
    prefix: 'users',
    default: false,
    methods: ['get', 'delete', 'patch'],
  },
  {
    name: { en: 'Roles', ar: 'الادوار' },
    prefix: 'roles',
    default: false,
    methods: ['post', 'get', 'delete', 'patch'],
  },
  {
    name: { en: 'Profile', ar: 'الحساب الشخصي' },
    prefix: 'profile',
    default: true,
    methods: ['get', 'patch'],
  },
  {
    name: { en: 'Permissions', ar: 'الصلاحيات' },
    prefix: 'permissions',
    default: false,
    methods: ['get', 'patch'],
  },
  {
    name: { en: 'Situation', ar: 'المواقف' },
    prefix: 'situation',
    default: false,
    methods: ['post', 'get', 'delete', 'patch'],
  },

  {
    name: { en: 'Day', ar: 'اليوم' },
    prefix: 'day',
    default: false,
    methods: ['post', 'get', 'delete', 'patch'],
  },
];

type Permission = (typeof permissions)[number];

export type PermissionMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';

export type PermissionMap = Record<Permission['prefix'], PermissionMethod[]>;
