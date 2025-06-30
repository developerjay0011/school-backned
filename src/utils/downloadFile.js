const axios = require('axios');
const FileSaver = require('file-saver');

export const downloadFile = async (value) => {
    try {
        if (!value) {
            toast.error("Invalid file URL");
            return;
        }
        const response = await axios.get(value, { 
            responseType: 'blob',
            withCredentials: true,  // Enable credentials
            headers: {
                'Accept': 'application/pdf'  // Explicitly request PDF
            }
        });

        // Get filename from content-disposition header if available
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'download';
        if (contentDisposition) {
            const filenameRegex = /filename[^;=\n]=((['"]).?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
            }
        }

        // If no filename from header, try to get from URL
        if (filename === 'download') {
            const url = new URL(value);
            const urlFilename = url.pathname.split('/').pop();
            if (urlFilename) {
                filename = urlFilename;
            }
        }

        // Get content type
        const contentType = response.headers['content-type'] || 'application/pdf';
        const blob = new Blob([response.data], { type: contentType });

        // Save the file
        FileSaver.saveAs(blob, filename);

    } catch (error) {
        console.error('Download error:', error);
        if (error?.response?.status === 404) {
            toast.error("File not found");
        } else if (error?.response?.status === 403) {
            toast.error("Access denied");
        } else {
            toast.error("Error downloading file");
        }
    }
};
