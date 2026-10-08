import { adminCrud, AdminStats } from '../crud/admin.crud';

export class AdminService {
  async getSystemStats(): Promise<AdminStats> {
    return adminCrud.getSystemStats();
  }
}

export const adminService = new AdminService();
