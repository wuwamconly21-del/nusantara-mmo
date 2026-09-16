export interface UserSession {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'citizen';
  }
  
  export const ADMIN_EMAILS = [
    'evildantdm47@gmail.com',
    'luqman@admin.mmo',
  ];
  
  export function checkIsAdmin(email: string): boolean {
    return ADMIN_EMAILS.includes(email.toLowerCase().trim());
  }
  
  export const CURRENT_USER: UserSession = {
    id: 'monarch-001',
    username: 'Duli Yang Maha Mulia Pemilik Daulat',
    email: 'evildantdm47@gmail.com',
    role: 'admin',
  };