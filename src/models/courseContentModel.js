const db = require('../config/database');

class CourseContent {
    static SUPPORTED_LANGUAGES = ['Arabic', 'English', 'Russian', 'Turkish', 'Ukrainian', 'German'];

    static async getAllContent(language = null) {
        const connection = await db.getConnection();
        try {
            // Validate language if provided
            if (language && !CourseContent.SUPPORTED_LANGUAGES.includes(language)) {
                throw new Error('Unsupported language');
            }

            // Get courses based on language
            const [courses] = await connection.execute(
                'SELECT * FROM courses WHERE language = IFNULL(?, language)',
                [language]
            );

            if (courses.length === 0) {
                throw new Error('No courses found');
            }

            // Get all topics and videos for the courses
            const courseIds = courses.map(c => c.id).join(',');
            const [topics] = await connection.execute(
                'SELECT * FROM topics WHERE course_id IN (?) ORDER BY course_id, topic_number',
                [courseIds]
            );

            // Get all videos
            const [videos] = await connection.execute(
                'SELECT v.*, t.course_id FROM videos v JOIN topics t ON v.topic_id = t.id WHERE t.course_id IN (?)',
                [courseIds]
            );

            // Group topics by course
            const courseMap = new Map();
            courses.forEach(course => {
                courseMap.set(course.id, {
                    title: course.title,
                    subtitle: course.subtitle,
                    description: course.description,
                    language: course.language,
                    topics: []
                });
            });

            // Map topics to their courses
            topics.forEach(topic => {
                const course = courseMap.get(topic.course_id);
                if (course) {
                    const topicVideos = videos.filter(v => v.topic_id === topic.id);
                    course.topics.push({
                        id: topic.id,
                        topic_number: topic.topic_number,
                        title: topic.title,
                        description: topic.description,
                        videos: topicVideos.map(video => ({
                            title: video.title,
                            url: video.url,
                            type: video.type
                        }))
                    });
                }
            });

            return {
                success: true,
                data: Array.from(courseMap.values())
            };
        } catch (error) {
            console.error('Error in getAllContent:', error);
            return {
                success: false,
                error: error.message || 'Failed to fetch course content'
            };
        } finally {
            connection.release();
        }
    }
}

module.exports = CourseContent;
