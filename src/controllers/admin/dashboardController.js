const DashboardModel = require('../../models/dashboardModel');

class DashboardController {
    static async getDashboardStats(req, res) {
        try {
            // Get all dashboard statistics in parallel
            const [totalCounts, studentsByGender] = await Promise.all([
                DashboardModel.getTotalCounts(),
                DashboardModel.getStudentsByGender()
            ]);

            res.json({
                success: true,
                data: {
                    counts: totalCounts,
                    studentsByGender
                }
            });
        } catch (error) {
            console.error('Error getting dashboard stats:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching dashboard statistics'
            });
        }
    }
}

module.exports = DashboardController;
