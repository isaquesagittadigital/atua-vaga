import { supabase } from '../lib/supabase';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    read: boolean;
    created_at: string;
    link?: string;
}

export const NotificationService = {
    async fetchNotifications(userId: string) {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
        return data as Notification[];
    },

    async markAsRead(notificationId: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', notificationId);

        if (error) {
            console.error('Error marking notification as read:', error);
        }
    },

    async markAllAsRead(userId: string) {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId);

        if (error) throw error;
    },

    async getAlertSettings(userId: string) {
        const { data, error } = await supabase
            .from('job_alerts')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore not found
        return data;
    },

    async toggleAlerts(userId: string, isActive: boolean) {
        // Upsert to ensure record exists
        const { error } = await supabase
            .from('job_alerts')
            .upsert({
                user_id: userId,
                is_active: isActive,
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' });

        if (error) throw error;
    },

    /**
     * Notifies all users who saved or applied to a specific job about an action taken by the company.
     */
    async notifyUsersOfJobAction(jobId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
        try {
            // 1. Get all candidates
            const { data: candidates } = await supabase
                .from('job_applications')
                .select('user_id')
                .eq('job_id', jobId);

            // 2. Get all users who saved the job
            const { data: observers } = await supabase
                .from('saved_jobs')
                .select('user_id')
                .eq('job_id', jobId);

            // 3. Combine into unique set of user IDs
            const userIds = new Set([
                ...(candidates?.map(c => c.user_id) || []),
                ...(observers?.map(o => o.user_id) || [])
            ]);

            if (userIds.size === 0) return;

            // 4. Create notifications in bulk
            const notifications = Array.from(userIds).map(userId => ({
                user_id: userId,
                title,
                message,
                type,
                read: false,
                created_at: new Date().toISOString(),
                link: `/app/jobs?id=${jobId}`
            }));

            const { error: notifyError } = await supabase
                .from('notifications')
                .insert(notifications);

            if (notifyError) throw notifyError;

            console.log(`Notified ${userIds.size} users about job ${jobId}`);
        } catch (err) {
            console.error('Error sending mass notifications:', err);
        }
    }
};

